import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/* Google Drive → gallery.
 *
 * Jeremiah shares ONE folder ("Anyone with the link can view") and pastes its
 * link in the dashboard. Every subfolder inside it becomes a category on the
 * site, named after the folder — "Flyers", "Logos", "Brand Identity"… Images
 * sitting loose in the top folder go under the top folder's own name. Deeper
 * subfolders roll up into their top-level category.
 *
 * Sync copies each image's id, name, folder and size into `gallery_items`.
 * What he's chosen in the dashboard (hidden, featured, order) survives every
 * sync; files deleted from Drive disappear from the site.
 *
 * The images themselves are never copied — /api/drive/[id] fetches a sized
 * rendition from Drive and the CDN caches it.
 */

const API = "https://www.googleapis.com/drive/v3/files";
const FOLDER = "application/vnd.google-apps.folder";

export interface SyncResult {
  ok: boolean;
  error?: string;
  added: number;
  updated: number;
  removed: number;
  folders: { name: string; count: number }[];
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  imageMediaMetadata?: { width?: number; height?: number };
}

export function folderIdFromUrl(url: string): string | null {
  const s = url.trim();
  const m = s.match(/folders\/([\w-]{10,})/) || s.match(/[?&]id=([\w-]{10,})/);
  if (m) return m[1];
  return /^[\w-]{10,}$/.test(s) ? s : null;
}

function key() {
  const k = process.env.GOOGLE_API_KEY;
  if (!k) throw new Error("GOOGLE_API_KEY is missing from the environment variables.");
  return k;
}

async function drive<T>(path: string, params: Record<string, string>): Promise<T> {
  const q = new URLSearchParams({ ...params, key: key(), supportsAllDrives: "true" });
  const res = await fetch(`${API}${path}?${q}`, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 404) throw new Error("Drive can't see that folder. Check it's shared as \"Anyone with the link can view\".");
    if (res.status === 403) throw new Error(`Drive refused the request — is the Drive API enabled for this API key? (${body.slice(0, 160)})`);
    throw new Error(`Drive error ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

async function children(folderId: string): Promise<DriveFile[]> {
  const out: DriveFile[] = [];
  let pageToken: string | undefined;
  do {
    const r = await drive<{ files: DriveFile[]; nextPageToken?: string }>("", {
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, createdTime, imageMediaMetadata(width, height))",
      pageSize: "1000",
      includeItemsFromAllDrives: "true",
      ...(pageToken ? { pageToken } : {}),
    });
    out.push(...r.files);
    pageToken = r.nextPageToken;
  } while (pageToken);
  return out;
}

const isImage = (f: DriveFile) => f.mimeType.startsWith("image/") && !f.mimeType.includes("photoshop");

/** Every image under a folder, however deep, capped so a mistaken "My Drive" link can't run forever. */
async function imagesUnder(folderId: string, depth = 0, seen = { n: 0 }): Promise<DriveFile[]> {
  if (depth > 4 || seen.n > 5000) return [];
  const list = await children(folderId);
  const imgs = list.filter(isImage);
  seen.n += imgs.length;
  const sub = list.filter((f) => f.mimeType === FOLDER);
  for (const f of sub) imgs.push(...(await imagesUnder(f.id, depth + 1, seen)));
  return imgs;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncDrive(db: SupabaseClient<any>): Promise<SyncResult> {
  const { data: s } = await db.from("settings").select("data").eq("id", 1).maybeSingle();
  const url = (s?.data as { drive_folder_url?: string } | null)?.drive_folder_url ?? "";
  const rootId = folderIdFromUrl(url);
  if (!rootId) return { ok: false, error: "Paste the Google Drive folder link first.", added: 0, updated: 0, removed: 0, folders: [] };

  const root = await drive<{ name: string }>(`/${rootId}`, { fields: "name" });
  const top = await children(rootId);

  const rows: Record<string, unknown>[] = [];
  const counts = new Map<string, number>();
  const add = (f: DriveFile, folderId: string, folderName: string) => {
    rows.push({
      id: f.id,
      name: f.name,
      folder_id: folderId,
      folder_name: folderName,
      mime_type: f.mimeType,
      width: f.imageMediaMetadata?.width ?? null,
      height: f.imageMediaMetadata?.height ?? null,
      created_time: f.createdTime ?? null,
      synced_at: new Date().toISOString(),
    });
    counts.set(folderName, (counts.get(folderName) ?? 0) + 1);
  };

  for (const f of top.filter(isImage)) add(f, rootId, root.name);
  for (const folder of top.filter((f) => f.mimeType === FOLDER)) {
    for (const img of await imagesUnder(folder.id)) add(img, folder.id, folder.name.trim());
  }

  const { data: existing, error: exErr } = await db.from("gallery_items").select("id");
  if (exErr) throw exErr;
  const before = new Set((existing ?? []).map((r) => r.id as string));
  const now = new Set(rows.map((r) => r.id as string));

  /* Upsert only the Drive-owned columns, so visible/featured/position are kept. */
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db.from("gallery_items").upsert(rows.slice(i, i + 500), { onConflict: "id" });
    if (error) throw error;
  }
  const gone = [...before].filter((id) => !now.has(id));
  for (let i = 0; i < gone.length; i += 200) {
    const { error } = await db.from("gallery_items").delete().in("id", gone.slice(i, i + 200));
    if (error) throw error;
  }

  return {
    ok: true,
    added: rows.filter((r) => !before.has(r.id as string)).length,
    updated: rows.filter((r) => before.has(r.id as string)).length,
    removed: gone.length,
    folders: [...counts].map(([name, count]) => ({ name, count })),
  };
}

/** A sized rendition of a Drive image (Drive's own thumbnailer), falling back to the original file. */
export async function fetchDriveImage(id: string, width: number): Promise<Response> {
  const meta = await drive<{ thumbnailLink?: string; mimeType?: string }>(`/${id}`, { fields: "thumbnailLink, mimeType" });
  if (meta.thumbnailLink) {
    const sized = meta.thumbnailLink.replace(/=s\d+(-[a-z])?$/i, `=s${width}`);
    const r = await fetch(sized, { cache: "no-store" });
    if (r.ok) return r;
  }
  const q = new URLSearchParams({ alt: "media", key: key(), supportsAllDrives: "true" });
  return fetch(`${API}/${id}?${q}`, { cache: "no-store" });
}
