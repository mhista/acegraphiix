"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import type { WorkItem } from "@/lib/content/works";
import { Tile } from "./Tile";

/* Works and Archive share this grid: category pills, a masonry of work, and a
   lightbox for Drive designs (case studies link to their own page instead).
   The selected category and open design live in the URL, so both can be shared. */

export function Gallery({ items, cats, masonry = false, demo = false }: { items: WorkItem[]; cats: string[]; masonry?: boolean; demo?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const cat = params.get("c") ?? "All";
  const openId = params.get("design");

  const shown = useMemo(() => (cat === "All" ? items : items.filter((w) => w.category === cat)), [items, cat]);
  const designs = shown.filter((w) => w.key.startsWith("g-"));
  const openIdx = openId ? designs.findIndex((d) => d.key === `g-${openId}`) : -1;

  const setParam = useCallback(
    (k: string, v: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (v === null) next.delete(k);
      else next.set(k, v);
      router.replace(`${path}${next.size ? `?${next}` : ""}`, { scroll: false });
    },
    [params, path, router],
  );

  const step = useCallback(
    (d: number) => {
      if (openIdx < 0 || !designs.length) return;
      const n = designs[(openIdx + d + designs.length) % designs.length];
      setParam("design", n.key.slice(2));
    },
    [designs, openIdx, setParam],
  );

  useEffect(() => {
    if (openIdx < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setParam("design", null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx, setParam, step]);

  const pills = ["All", ...cats.filter((c) => items.some((w) => w.category === c))];

  return (
    <>
      {pills.length > 2 && (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {pills.map((p) => (
            <button
              key={p}
              onClick={() => setParam("c", p === "All" ? null : p)}
              className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium transition ${
                cat === p ? "bg-ink text-white" : "bg-wash text-ink shadow-keylight hover:bg-[#ececee]"
              }`}
            >
              {p}
              <span className={`ml-1.5 ${cat === p ? "text-white/60" : "text-faint"}`}>
                {p === "All" ? items.length : items.filter((w) => w.category === p).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {!items.length ? (
        <div className="mt-6 rounded-[34px] bg-wash p-10 text-center">
          <p className="text-[18px] font-medium">{demo ? "Designs from Google Drive will appear here" : "New work is on its way"}</p>
          <p className="mx-auto mt-2 max-w-[380px] text-[14px] text-body">
            {demo ? "Connect Supabase and add the Drive folder link in the dashboard, then press Sync." : "Check back soon, or get in touch to see recent projects."}
          </p>
        </div>
      ) : (
        <div className={`mt-6 ${masonry ? "columns-2 gap-3 sm:columns-3" : "grid grid-cols-2 gap-3 sm:grid-cols-3"}`}>
          {shown.map((w, i) => {
            const isDesign = w.key.startsWith("g-");
            const ratio = masonry && w.width && w.height ? `${w.width} / ${w.height}` : "1 / 1";
            const inner = (
              <>
                <div className="h-full w-full transition duration-700 group-hover:scale-[1.04]">
                  <Tile src={w.image} alt={w.title} index={i} />
                </div>
                {!isDesign && (
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium backdrop-blur">Case study</span>
                )}
              </>
            );
            const cls = `group relative block w-full overflow-hidden rounded-[22px] bg-wash sm:rounded-[28px] ${masonry ? "mb-3 break-inside-avoid" : ""}`;
            return isDesign ? (
              <button key={w.key} className={cls} style={{ aspectRatio: ratio }} onClick={() => setParam("design", w.key.slice(2))} aria-label={`Open ${w.title}`}>
                {inner}
              </button>
            ) : (
              <Link key={w.key} href={w.href} className={cls} style={{ aspectRatio: ratio }}>
                {inner}
              </Link>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {openIdx >= 0 && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setParam("design", null)}
          >
            <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
              <p className="text-[14px] text-white/70">
                {designs[openIdx].category} · {openIdx + 1} / {designs.length}
              </p>
              <button onClick={() => setParam("design", null)} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16">
              <motion.img
                key={designs[openIdx].key}
                src={designs[openIdx].image!.replace(/w=\d+/, "w=2000")}
                alt={designs[openIdx].title}
                className="max-h-full max-w-full rounded-xl object-contain"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
              />
              {designs.length > 1 && (
                <>
                  <button
                    onClick={(e) => (e.stopPropagation(), step(-1))}
                    aria-label="Previous"
                    className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:left-4"
                  >
                    <Icon name="left" size={20} />
                  </button>
                  <button
                    onClick={(e) => (e.stopPropagation(), step(1))}
                    aria-label="Next"
                    className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:right-4"
                  >
                    <Icon name="right" size={20} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
