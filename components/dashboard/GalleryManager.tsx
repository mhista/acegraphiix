"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { clearSection, disconnectDrive, runDriveSync, setDesignSection, updateDesign, updateDesigns } from "@/lib/actions/admin";
import type { SyncResult } from "@/lib/drive";
import { SECTION_LABELS, SECTION_LIMITS, type HomeSection } from "@/lib/content/works";
import { inputCls } from "./fields";
import { useToast } from "./Toast";

interface Item {
  id: string;
  name: string;
  folder_name: string;
  visible: boolean;
  featured: boolean;
  synced_at: string;
  sections: string[] | null;
  section_order: number | null;
}

const PAGE_SIZES = [24, 48, 96];
const SECTION_KEYS = Object.keys(SECTION_LABELS) as HomeSection[];
const SHORT: Record<HomeSection, string> = { hero: "Hero", projects: "Projects", archive: "Archive" };

type View = "all" | "hidden" | "featured" | HomeSection;

export function GalleryManager({ items: initial, folderUrl, hasKey }: { items: Item[]; folderUrl: string; hasKey: boolean }) {
  const [items, setItems] = useState(initial);
  const [url, setUrl] = useState(folderUrl);
  const [folder, setFolder] = useState("All");
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(48);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => setItems(initial), [initial]);
  useEffect(() => setPage(1), [folder, view, query, size]);

  const folders = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of items) m.set(i.folder_name, (m.get(i.folder_name) ?? 0) + 1);
    return [...m].sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const count = (s: HomeSection) => items.filter((i) => i.sections?.includes(s)).length;

  const filtered = useMemo(() => {
    let list = folder === "All" ? items : items.filter((i) => i.folder_name === folder);
    if (view === "hidden") list = list.filter((i) => !i.visible);
    else if (view === "featured") list = list.filter((i) => i.featured);
    else if (view !== "all")
      list = list.filter((i) => i.sections?.includes(view)).sort((a, b) => (a.section_order ?? 0) - (b.section_order ?? 0));
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((i) => i.name.toLowerCase().includes(q));
    return list;
  }, [items, folder, view, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const shown = filtered.slice((page - 1) * size, page * size);
  const last = items.reduce((a, i) => (i.synced_at > a ? i.synced_at : a), "");

  const sync = () =>
    start(async () => {
      const r = await runDriveSync(url);
      setResult(r);
      if (!r.ok) return toast(r.error ?? "Sync failed", "error");
      toast(`Synced — ${r.added} new, ${r.removed} removed`);
      router.refresh();
    });

  const disconnect = () => {
    if (!confirm("Remove every synced design from the website and forget this Drive folder?\n\nNothing in Google Drive is deleted. You can sync again any time.")) return;
    start(async () => {
      const r = await disconnectDrive();
      if (!r.ok) return toast(r.error ?? "Couldn't disconnect", "error");
      setItems([]);
      setUrl("");
      setResult(null);
      toast("Drive disconnected — all synced designs removed from the site");
      router.refresh();
    });
  };

  const flip = (it: Item, key: "visible" | "featured") => {
    const v = !it[key];
    setItems((all) => all.map((x) => (x.id === it.id ? { ...x, [key]: v } : x)));
    start(async () => {
      const r = await updateDesign(it.id, { [key]: v });
      if (!r.ok) toast(r.error ?? "Couldn't update", "error");
    });
  };

  const toggleSection = (it: Item, s: HomeSection) => {
    const on = !it.sections?.includes(s);
    if (on && count(s) >= SECTION_LIMITS[s])
      return toast(`${SECTION_LABELS[s]} holds ${SECTION_LIMITS[s]} designs. Remove one first.`, "error");
    const prev = it.sections ?? [];
    const next = on ? [...prev, s] : prev.filter((x) => x !== s);
    setItems((all) => all.map((x) => (x.id === it.id ? { ...x, sections: next, section_order: on ? Date.now() : x.section_order } : x)));
    start(async () => {
      const r = await setDesignSection(it.id, s, on);
      if (!r.ok) {
        setItems((all) => all.map((x) => (x.id === it.id ? { ...x, sections: prev } : x)));
        return toast(r.error ?? "Couldn't update", "error");
      }
      if (on && !it.visible) toast("Added — but this design is hidden. Show it so it appears on the site.", "error");
    });
  };

  const emptySection = (s: HomeSection) =>
    start(async () => {
      const r = await clearSection(s);
      if (!r.ok) return toast(r.error ?? "Couldn't clear", "error");
      setItems((all) => all.map((x) => ({ ...x, sections: (x.sections ?? []).filter((y) => y !== s) })));
      toast(`${SECTION_LABELS[s]} cleared — it'll choose designs automatically again`);
    });

  const bulk = (visible: boolean) =>
    start(async () => {
      const ids = filtered.map((i) => i.id);
      const r = await updateDesigns(ids, { visible });
      if (!r.ok) return toast(r.error ?? "Couldn't update", "error");
      setItems((all) => all.map((x) => (ids.includes(x.id) ? { ...x, visible } : x)));
      toast(visible ? `Showing ${ids.length}` : `Hid ${ids.length}`);
    });

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-[13px] font-medium transition ${active ? "bg-ink text-white" : "bg-white text-body ring-1 ring-line hover:text-ink"}`;

  return (
    <div className="space-y-5">
      {/* ── Connection ─────────────────────────────── */}
      <section className="rounded-3xl border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-medium tracking-snug">Google Drive folder</h2>
            <p className="mt-1 max-w-[640px] text-[13px] leading-[1.5] text-body">
              Share the folder as <b>Anyone with the link → Viewer</b>, paste the link, press Sync. Subfolders become categories on the site
              (<i>Flyers</i>, <i>Logos</i>, <i>Brand Identity</i>…). New designs show up once a day on their own, or right away with Sync.
            </p>
          </div>
          {(items.length > 0 || folderUrl) && (
            <button onClick={disconnect} disabled={pending} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-50">
              <Icon name="trash" size={14} /> Disconnect
            </button>
          )}
        </div>
        {!hasKey && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-900">GOOGLE_API_KEY isn&apos;t set on the server yet — see the README.</p>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input className={inputCls} placeholder="https://drive.google.com/drive/folders/…" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button onClick={sync} disabled={pending || !url} className="btn-dark shrink-0 disabled:opacity-50">
            <Icon name="refresh" size={16} className={pending ? "animate-spin" : ""} /> {pending ? "Working…" : "Save & sync"}
          </button>
        </div>
        {result?.ok && (
          <p className="mt-3 text-[13px] text-body">
            {result.added} new · {result.updated} updated · {result.removed} removed —{" "}
            {result.folders.map((f) => `${f.name} (${f.count})`).join(", ") || "no images found"}
          </p>
        )}
        {last && <p className="mt-2 text-[12px] text-faint">Last synced {new Date(last).toLocaleString("en-GB")} · {items.length} designs</p>}
      </section>

      {/* ── Home-page sections ─────────────────────── */}
      {items.length > 0 && (
        <section className="rounded-3xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[18px] font-medium tracking-snug">Home page sections</h2>
          <p className="mt-1 max-w-[640px] text-[13px] leading-[1.5] text-body">
            Choose exactly which designs each section shows: tap <b>Hero</b>, <b>Projects</b> or <b>Archive</b> under any design below. They appear in the order you pick
            them. A section with nothing picked chooses designs automatically.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {SECTION_KEYS.map((s) => {
              const n = count(s);
              return (
                <div key={s} className={`rounded-2xl p-3.5 ${view === s ? "bg-ink text-white" : "bg-wash"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium">{SECTION_LABELS[s]}</p>
                    <span className={`text-[12px] ${view === s ? "text-white/70" : "text-muted"}`}>
                      {n}/{SECTION_LIMITS[s]}
                    </span>
                  </div>
                  <p className={`mt-0.5 text-[12px] ${view === s ? "text-white/70" : "text-muted"}`}>{n ? "Your picks" : "Automatic"}</p>
                  <div className="mt-3 flex gap-1.5">
                    <button onClick={() => setView(view === s ? "all" : s)} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${view === s ? "bg-white text-ink" : "bg-white text-body ring-1 ring-line"}`}>
                      {view === s ? "Show all designs" : "View picks"}
                    </button>
                    {n > 0 && (
                      <button onClick={() => emptySection(s)} disabled={pending} className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${view === s ? "text-white/80 hover:text-white" : "text-muted hover:text-ink"}`}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Library ────────────────────────────────── */}
      {items.length > 0 && (
        <section>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {[["All", items.length] as [string, number], ...folders].map(([name, n]) => (
              <button key={name} onClick={() => setFolder(name)} className={chip(folder === name)}>
                {name} <span className="opacity-60">{n}</span>
              </button>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint">
                <Icon name="search" size={15} />
              </span>
              <input className={`${inputCls} pl-9`} placeholder="Search by file name" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <select className={`${inputCls} w-auto`} value={view} onChange={(e) => setView(e.target.value as View)} aria-label="Filter">
              <option value="all">All designs</option>
              <option value="featured">Featured</option>
              <option value="hidden">Hidden</option>
              {SECTION_KEYS.map((s) => (
                <option key={s} value={s}>
                  In {SECTION_LABELS[s]}
                </option>
              ))}
            </select>
            <button onClick={() => bulk(true)} disabled={pending} className="rounded-lg px-2.5 py-2 text-[12px] font-medium text-body hover:bg-white">
              Show these
            </button>
            <button onClick={() => bulk(false)} disabled={pending} className="rounded-lg px-2.5 py-2 text-[12px] font-medium text-body hover:bg-white">
              Hide these
            </button>
          </div>

          <p className="mb-3 text-[12px] text-muted">
            {filtered.length} design{filtered.length === 1 ? "" : "s"} · <Icon name="star" size={11} stroke={0} className="inline" /> featured designs lead the
            Works page · hidden ones stay in Drive but not on the site. “Show/Hide these” applies to all {filtered.length}, across every page.
          </p>

          {shown.length === 0 ? (
            <p className="rounded-2xl bg-white p-8 text-center text-[13px] text-muted ring-1 ring-line">Nothing matches.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
              {shown.map((it) => (
                <div key={it.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                  <div className={`group relative aspect-square bg-wash ${it.visible ? "" : "opacity-40"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/drive/${it.id}?w=400`} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
                    <div className="absolute inset-x-1.5 top-1.5 flex justify-between">
                      <button
                        onClick={() => flip(it, "featured")}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur ${it.featured ? "bg-amber-400 text-white" : "bg-white/80 text-muted"}`}
                        aria-label={it.featured ? "Unfeature" : "Feature"}
                        title={it.featured ? "Featured" : "Feature"}
                      >
                        <Icon name="star" size={13} stroke={0} />
                      </button>
                      <button
                        onClick={() => flip(it, "visible")}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/80 text-ink backdrop-blur"
                        aria-label={it.visible ? "Hide" : "Show"}
                        title={it.visible ? "Visible — click to hide" : "Hidden — click to show"}
                      >
                        <Icon name={it.visible ? "eye" : "eyeOff"} size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <p className="truncate px-1 pb-1 text-[11px] text-muted" title={it.name}>
                      {it.name}
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {SECTION_KEYS.map((s) => {
                        const on = !!it.sections?.includes(s);
                        return (
                          <button
                            key={s}
                            onClick={() => toggleSection(it, s)}
                            aria-pressed={on}
                            title={`${on ? "Remove from" : "Add to"} ${SECTION_LABELS[s]}`}
                            className={`rounded-md py-1 text-[10.5px] font-medium transition ${on ? "bg-ink text-white" : "bg-wash text-muted hover:text-ink"}`}
                          >
                            {SHORT[s]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[13px]">
            <div className="flex items-center gap-2 text-muted">
              Per page
              <select className={`${inputCls} w-auto py-1.5`} value={size} onChange={(e) => setSize(Number(e.target.value))}>
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            {pages > 1 && (
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(1)} disabled={page === 1} className="rounded-lg px-2 py-1.5 font-medium text-body hover:bg-white disabled:opacity-30">
                  First
                </button>
                <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white disabled:opacity-30" aria-label="Previous page">
                  <Icon name="left" size={15} />
                </button>
                {pageList(page, pages).map((p, i) =>
                  p === 0 ? (
                    <span key={`gap${i}`} className="px-1 text-faint">
                      …
                    </span>
                  ) : (
                    <button key={p} onClick={() => setPage(p)} className={`h-8 min-w-8 rounded-lg px-2 font-medium ${p === page ? "bg-ink text-white" : "text-body hover:bg-white"}`}>
                      {p}
                    </button>
                  ),
                )}
                <button onClick={() => setPage((p) => p + 1)} disabled={page === pages} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white disabled:opacity-30" aria-label="Next page">
                  <Icon name="right" size={15} />
                </button>
                <button onClick={() => setPage(pages)} disabled={page === pages} className="rounded-lg px-2 py-1.5 font-medium text-body hover:bg-white disabled:opacity-30">
                  Last
                </button>
              </div>
            )}
            <p className="text-muted">
              {filtered.length ? `${(page - 1) * size + 1}–${Math.min(page * size, filtered.length)} of ${filtered.length}` : ""}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

/** 1 … 4 5 [6] 7 8 … 20 — 0 marks a gap. */
function pageList(page: number, pages: number): number[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out = new Set([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => out.add(p));
  if (page >= pages - 2) [pages - 3, pages - 2, pages - 1].forEach((p) => out.add(p));
  const sorted = [...out].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const withGaps: number[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) withGaps.push(0);
    withGaps.push(p);
  });
  return withGaps;
}
