"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { Testimonial } from "@/lib/content/types";
import { Label, Lines, Reveal } from "./ui";

function Photo({ t, className = "" }: { t: Testimonial; className?: string }) {
  return t.photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={t.photo_url} alt={t.name} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full w-full items-center justify-center bg-[#e4e4e7] text-[28px] font-medium text-muted ${className}`}>
      {t.name.slice(0, 1)}
    </div>
  );
}

export function Testimonials({
  items,
  title,
  clients,
  sample,
}: {
  items: Testimonial[];
  title: string;
  clients: string;
  sample?: boolean;
}) {
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const t = items[i];
  const others = items.filter((_, j) => j !== i).slice(0, 2);
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  return (
    <>
      <section id="testimonials" className="px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <Label>Testimonials</Label>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="h-section">
              <Lines text={title} />
            </h2>
            {clients && <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {items.slice(0, 3).map((x) => (
                  <span key={x.id} className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                    <Photo t={x} />
                  </span>
                ))}
              </div>
              <div className="text-[13px] leading-tight">
                <p className="text-muted">Trusted by</p>
                <p className="font-medium">{clients}</p>
              </div>
            </div>}
          </div>
          {sample && (
            <p className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-900">
              Sample testimonials — shown only in preview until real ones are added
            </p>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-2 rounded-[36px] bg-wash p-2 sm:h-[440px] sm:grid-cols-[210px_1fr] sm:rounded-[44px] sm:p-2.5">
            <div className="hidden min-h-0 grid-rows-[1.7fr_1fr_1fr] gap-2 sm:grid">
              <div className="min-h-0 overflow-hidden rounded-[30px]">
                <AnimatePresence mode="wait">
                  <motion.div key={t.id} className="h-full" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
                    <Photo t={t} />
                  </motion.div>
                </AnimatePresence>
              </div>
              {others.map((o) => (
                <button key={o.id} onClick={() => setI(items.indexOf(o))} className="min-h-0 overflow-hidden rounded-[30px]" aria-label={`Show ${o.name}`}>
                  <Photo t={o} className="grayscale transition hover:grayscale-0" />
                </button>
              ))}
            </div>

            <div className="flex min-h-[340px] flex-col rounded-[30px] sm:min-h-0 bg-white p-6 shadow-card sm:rounded-[36px] sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex gap-1 text-ink">
                    {Array.from({ length: Math.max(0, Math.min(5, t.rating)) }, (_, k) => (
                      <Icon key={k} name="star" size={16} stroke={0} />
                    ))}
                  </div>
                  {t.tags.length > 0 && (
                    <p className="mt-4 text-[24px] font-medium tracking-head sm:text-[28px]">
                      {t.tags.map((tag, k) => (
                        <span key={tag}>
                          {k > 0 && <span className="mx-2 text-[#d4d4d8]">•</span>}
                          {tag}
                        </span>
                      ))}
                    </p>
                  )}
                  <blockquote className="mt-4 max-w-[480px] text-[15px] leading-[1.5] text-ink/85">&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 overflow-hidden rounded-full sm:hidden">
                        <Photo t={t} />
                      </span>
                      <div>
                        <p className="text-[15px] font-medium">{t.name}</p>
                        <p className="text-[13px] text-muted">{t.role}</p>
                      </div>
                    </div>
                    {items.length > 1 && (
                      <div className="flex gap-2">
                        <button onClick={() => go(-1)} aria-label="Previous" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-keylight">
                          <Icon name="left" size={16} />
                        </button>
                        <button onClick={() => go(1)} aria-label="Next" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-keylight">
                          <Icon name="right" size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </section>
      <div className="band" />
    </>
  );
}
