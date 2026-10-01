"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Settings } from "@/lib/content/types";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const SOCIAL_ICON: Record<string, string> = { x: "xtwitter", twitter: "xtwitter" };

function SocialKeys({ socials }: { socials: Settings["socials"] }) {
  const list = socials.filter((s) => s.url).slice(0, 4);
  if (!list.length) return null;
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
      {list.map((s) => (
        <a
          key={s.label}
          href={s.url}
          target={s.url.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          aria-label={s.label}
          className="flex h-11 items-center justify-center rounded-2xl bg-[#232323] text-white shadow-key transition hover:bg-[#2c2c2c]"
        >
          <Icon name={SOCIAL_ICON[s.label] ?? s.label} size={18} />
        </a>
      ))}
    </div>
  );
}

function Card({ s, nav, onNavigate }: { s: Settings; nav: NavItem[]; onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[30px] bg-[#0b0b0b] p-[7px] shadow-[0_20px_50px_-20px_rgb(0_0_0/.55)]">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] bg-[#171717]">
        {/* cover */}
        <div className="absolute inset-x-0 top-0 h-[150px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.cover_url} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#171717]/30 to-[#171717]" />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col px-5 pb-5 pt-[88px]">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.avatar_url}
              alt={s.name}
              className="h-[84px] w-[84px] shrink-0 rounded-full object-cover ring-[3px] ring-[#101010]"
            />
            <div className="min-w-0 pt-5">
              <p className="truncate text-[15px] font-medium text-white">{s.name}</p>
              <span className="mt-1.5 inline-flex whitespace-nowrap rounded-full border border-white/10 bg-white/[.08] px-2.5 py-1 text-[12px] text-white">
                {s.role}
              </span>
            </div>
          </div>

          <div className="my-5 border-t border-dashed border-white/15" />
          <p className="text-[14px] leading-[1.45] text-faint">{s.sidebar_bio}</p>

          <nav className="mt-5 flex flex-col gap-0.5">
            {nav.map((n) => {
              const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition ${
                    active ? "bg-white/[.07] text-white" : "text-white/90 hover:bg-white/[.05] hover:text-white"
                  }`}
                >
                  <Icon name={n.icon} size={17} className="text-white/80" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 pt-6">
            <SocialKeys socials={s.socials} />
            <Link
              href="/contact"
              onClick={onNavigate}
              className="flex h-12 items-center justify-center rounded-2xl bg-[#f5f5f5] text-[15px] font-medium text-ink shadow-glow transition hover:bg-white"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ s, nav }: { s: Settings; nav: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop: the sticky dark card */}
      <aside className="sticky top-0 hidden h-dvh w-[320px] shrink-0 py-4 pl-4 pr-3 lg:block">
        <Card s={s} nav={nav} />
      </aside>

      {/* Mobile: dark pill header + drawer */}
      <div className="sticky top-0 z-40 px-3 pt-3 lg:hidden">
        <div className="flex items-center gap-3 rounded-[22px] bg-[#141414] p-2.5 pr-3 shadow-[0_10px_30px_-12px_rgb(0_0_0/.6)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover" />
          <Link href="/" className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[15px] font-medium text-white">{s.name}</p>
            <p className="truncate text-[13px] text-faint">{s.role}</p>
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#262626] text-white shadow-key"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(340px,88vw)] p-3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="relative h-full">
          <Card s={s} nav={nav} onNavigate={() => setOpen(false)} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
