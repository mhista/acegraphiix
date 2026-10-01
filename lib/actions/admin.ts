"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/server";
import { collection } from "@/lib/cms/collections";
import { DEFAULT_SETTINGS } from "@/lib/content/defaults";
import { syncDrive, type SyncResult } from "@/lib/drive";

/* Every write goes through the signed-in user's session, so the database's
   row-level security is the real gate — these checks exist to give a clear
   error instead of a silent no-op. */

export interface Result {
  ok: boolean;
  error?: string;
  id?: string;
}

async function admin() {
  const db = await sessionClient();
  if (!db) throw new Error("Supabase isn't connected yet.");
  const { data: u } = await db.auth.getUser();
  if (!u.user) redirect("/login");
  const { data: ok } = await db.rpc("is_admin");
  if (!ok) throw new Error(`${u.user.email} isn't on the admin list. Add it to the "admins" table in Supabase.`);
  return db;
}

const refresh = () => revalidatePath("/", "layout");
const fail = (e: unknown): Result => ({ ok: false, error: (e as Error)?.message ?? String(e) });

export async function saveRow(key: string, id: string | null, data: Record<string, unknown>): Promise<Result> {
  try {
    const c = collection(key);
    if (!c) throw new Error("Unknown collection");
    const db = await admin();

    /* Only columns this collection declares are written — nothing else from the form gets through. */
    const row: Record<string, unknown> = {};
    for (const f of c.fields) if (f.key in data) row[f.key] = data[f.key];
    for (const f of c.fields) {
      if (f.required && !String(row[f.key] ?? "").trim()) throw new Error(`${f.label} is required.`);
      if (f.type === "slug") {
        const src = String(row[f.key] || row[f.from ?? "title"] || "");
        row[f.key] = slugify(src) || `item-${Date.now()}`;
      }
      if (f.type === "number" && row[f.key] !== undefined) row[f.key] = Number(row[f.key]) || 0;
      if (f.type === "date" && !row[f.key]) row[f.key] = null;
    }

    if (id) {
      const { error } = await db.from(c.table).update(row).eq("id", id);
      if (error) throw error;
      refresh();
      return { ok: true, id };
    }
    if (c.order === "position") {
      const { data: last } = await db.from(c.table).select("position").order("position", { ascending: false }).limit(1);
      row.position = ((last?.[0]?.position as number) ?? 0) + 1;
    }
    const { data: ins, error } = await db.from(c.table).insert(row).select("id").single();
    if (error) throw error;
    refresh();
    return { ok: true, id: ins.id as string };
  } catch (e) {
    const msg = (e as { code?: string; message?: string })?.code === "23505" ? "That web address is already used — change the slug." : undefined;
    return msg ? { ok: false, error: msg } : fail(e);
  }
}

export async function deleteRow(key: string, id: string): Promise<Result> {
  try {
    const c = collection(key);
    if (!c) throw new Error("Unknown collection");
    const db = await admin();
    const { error } = await db.from(c.table).delete().eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Persist a new order: ids in display order. */
export async function reorder(key: string, ids: string[]): Promise<Result> {
  try {
    const c = collection(key);
    if (!c) throw new Error("Unknown collection");
    const db = await admin();
    await Promise.all(ids.map((id, i) => db.from(c.table).update({ position: i + 1 }).eq("id", id)));
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function togglePublished(key: string, id: string, value: boolean): Promise<Result> {
  try {
    const c = collection(key);
    if (!c?.publishedField) throw new Error("Nothing to toggle");
    const db = await admin();
    const { error } = await db.from(c.table).update({ [c.publishedField]: value }).eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveSettings(data: Record<string, unknown>): Promise<Result> {
  try {
    const db = await admin();
    const clean: Record<string, unknown> = {};
    for (const k of Object.keys(DEFAULT_SETTINGS)) if (k in data) clean[k] = data[k];
    const { data: cur } = await db.from("settings").select("data").eq("id", 1).maybeSingle();
    const merged = { ...(cur?.data ?? {}), ...clean };
    const { error } = await db.from("settings").upsert({ id: 1, data: merged, updated_at: new Date().toISOString() });
    if (error) throw error;
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ── Enquiries (CRM) ───────────────────────────────────────────────── */

const STATUSES = ["new", "contacted", "in_progress", "won", "lost", "archived"];

export async function updateEnquiry(id: string, patch: { status?: string; notes?: string; value?: string }): Promise<Result> {
  try {
    const db = await admin();
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.status !== undefined) {
      if (!STATUSES.includes(patch.status)) throw new Error("Unknown status");
      row.status = patch.status;
    }
    if (patch.notes !== undefined) row.notes = patch.notes.slice(0, 5000);
    if (patch.value !== undefined) row.value = patch.value.slice(0, 60);
    const { error } = await db.from("enquiries").update(row).eq("id", id);
    if (error) throw error;
    revalidatePath("/dashboard", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteEnquiry(id: string): Promise<Result> {
  try {
    const db = await admin();
    const { error } = await db.from("enquiries").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/dashboard", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ── Google Drive gallery ──────────────────────────────────────────── */

export async function runDriveSync(folderUrl?: string): Promise<SyncResult> {
  try {
    const db = await admin();
    if (folderUrl !== undefined) await saveSettings({ drive_folder_url: folderUrl });
    const res = await syncDrive(db);
    refresh();
    return res;
  } catch (e) {
    return { ok: false, error: (e as Error).message, added: 0, updated: 0, removed: 0, folders: [] };
  }
}

export async function updateDesign(id: string, patch: { visible?: boolean; featured?: boolean; folder_name?: string }): Promise<Result> {
  try {
    const db = await admin();
    const { error } = await db.from("gallery_items").update(patch).eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateDesigns(ids: string[], patch: { visible?: boolean; featured?: boolean }): Promise<Result> {
  try {
    const db = await admin();
    for (let i = 0; i < ids.length; i += 200) {
      const { error } = await db.from("gallery_items").update(patch).in("id", ids.slice(i, i + 200));
      if (error) throw error;
    }
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

const SECTIONS = ["hero", "projects", "archive"] as const;

/** Put a design into (or take it out of) one of the hand-picked home-page sections. */
export async function setDesignSection(id: string, section: string, on: boolean): Promise<Result & { sections?: string[] }> {
  try {
    if (!SECTIONS.includes(section as (typeof SECTIONS)[number])) throw new Error("Unknown section");
    const db = await admin();
    const { data, error: readErr } = await db.from("gallery_items").select("sections").eq("id", id).single();
    if (readErr) throw readErr;
    const now = new Set<string>((data?.sections as string[] | null) ?? []);
    if (on) now.add(section);
    else now.delete(section);
    const sections = [...now];
    const patch: Record<string, unknown> = { sections };
    /* Newly picked designs go to the end of the section. */
    if (on) patch.section_order = Date.now();
    const { error } = await db.from("gallery_items").update(patch).eq("id", id);
    if (error) throw error;
    refresh();
    return { ok: true, sections };
  } catch (e) {
    return fail(e);
  }
}

/** Empty a section, so it goes back to choosing designs automatically. */
export async function clearSection(section: string): Promise<Result> {
  try {
    if (!SECTIONS.includes(section as (typeof SECTIONS)[number])) throw new Error("Unknown section");
    const db = await admin();
    const { data, error } = await db.from("gallery_items").select("id, sections").contains("sections", [section]);
    if (error) throw error;
    for (const row of data ?? []) {
      const sections = ((row.sections as string[]) ?? []).filter((s) => s !== section);
      const { error: e2 } = await db.from("gallery_items").update({ sections }).eq("id", row.id);
      if (e2) throw e2;
    }
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Forget the Drive folder: removes every synced design from the site and clears the link.
    Nothing in Google Drive itself is touched. */
export async function disconnectDrive(): Promise<Result> {
  try {
    const db = await admin();
    const { error } = await db.from("gallery_items").delete().neq("id", "");
    if (error) throw error;
    await saveSettings({ drive_folder_url: "" });
    refresh();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function signOut() {
  const db = await sessionClient();
  await db?.auth.signOut();
  redirect("/login");
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
