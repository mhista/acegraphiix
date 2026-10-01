"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { Faq as FaqT } from "@/lib/content/types";
import { Label, Reveal } from "./ui";

export function Faq({ items, intro, email }: { items: FaqT[]; intro: string; email: string }) {
  const [open, setOpen] = useState<string | null>(items[1]?.id ?? items[0]?.id ?? null);
  if (!items.length) return null;
  return (
    <>
      <section id="faq" className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="flex flex-col">
            <Label>FAQ</Label>
            <h2 className="mt-4 max-w-[330px] text-[24px] font-medium leading-[1.17] tracking-head">{intro}</h2>
            <div className="mt-8 lg:mt-auto">
              <p className="text-[14px] text-body">Still have a question? Send me an email</p>
              <a href={`mailto:${email}`} className="btn-dark mt-3">
                Send Me Email
              </a>
            </div>
          </Reveal>
          <div className="space-y-2.5">
            {items.map((f, i) => {
              const isOpen = open === f.id;
              return (
                <Reveal key={f.id} delay={i * 0.04}>
                  <div className="rounded-[26px] bg-wash p-1.5">
                    <button
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <span className="flex-1 rounded-[20px] bg-white px-4 py-3.5 text-[16px] font-medium tracking-snug shadow-keylight">
                        {f.question}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.span
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="block overflow-hidden"
                            >
                              <span className="block whitespace-pre-line pt-2 text-[14px] font-normal leading-[1.5] text-body">{f.answer}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="mr-3 shrink-0 text-ink">
                        <Icon name={isOpen ? "x" : "plus"} size={18} />
                      </span>
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <div className="band" />
    </>
  );
}
