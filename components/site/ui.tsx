"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/** Fade-and-rise on first scroll into view. */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Words light up one by one as the paragraph scrolls in — the Toolkit intro. */
export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0.12, filter: "blur(4px)" }}
          animate={inView ? { opacity: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.5, delay: i * 0.045, ease: "easeOut" }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

export function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center self-start rounded-full px-3 py-1.5 text-[13px] font-medium ${
        light ? "bg-white text-ink" : "bg-ink text-white"
      }`}
    >
      {children}
    </span>
  );
}

/** Multi-line headings come from the CMS with "\n" breaks. */
export function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
