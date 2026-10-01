"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { signOut } from "@/lib/actions/admin";

export interface ShellNav {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

export function Shell({ nav, email, children }: { nav: ShellNav[][]; email: string; children: React.ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === "/dashboard" ? path === href : path.startsWith(href));
  const flat = nav.flat();

  return (
    <div className="min-h-dvh bg-page text-ink">
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-line bg-white px-3 py-4 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 pb-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-[15px] font-bold text-white">A</span>
          <span className="leading-tight">
            <span className="block text-[15px] font-medium">Studio</span>
            <span className="block text-[12px] text-muted">Website manager</span>
          </span>
        </Link>
        <nav className="flex-1 space-y-5 overflow-y-auto">
          {nav.map((group, gi) => (
            <div key={gi} className="space-y-0.5">
              {group.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium transition ${
                    active(n.href) ? "bg-ink text-white" : "text-body hover:bg-wash hover:text-ink"
                  }`}
                >
                  <Icon name={n.icon} size={17} />
                  <span className="flex-1">{n.label}</span>
                  {!!n.badge && (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${active(n.href) ? "bg-white text-ink" : "bg-ink text-white"}`}>{n.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="space-y-1 border-t border-line pt-3">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium text-body hover:bg-wash">
            <Icon name="external" size={17} /> View website
          </a>
          <form action={signOut}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium text-body hover:bg-wash">
              <Icon name="logout" size={17} /> Sign out
            </button>
          </form>
          <p className="truncate px-3 pt-1 text-[12px] text-faint">{email}</p>
        </div>
      </aside>

      {/* Mobile top bar + scrolling tabs */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-[14px] font-bold text-white">A</span>
            <span className="text-[15px] font-medium">Studio</span>
          </Link>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" className="rounded-lg p-2 text-body" aria-label="View website">
              <Icon name="external" size={18} />
            </a>
            <form action={signOut}>
              <button className="rounded-lg p-2 text-body" aria-label="Sign out">
                <Icon name="logout" size={18} />
              </button>
            </form>
          </div>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {flat.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${
                active(n.href) ? "bg-ink text-white" : "bg-wash text-body"
              }`}
            >
              {n.label}
              {!!n.badge && <span className="rounded-full bg-red-500 px-1.5 text-[10px] text-white">{n.badge}</span>}
            </Link>
          ))}
        </nav>
      </header>

      <main className="lg:pl-[248px]">
        <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div>
        <h1 className="text-[28px] font-medium leading-tight tracking-head sm:text-[34px]">{title}</h1>
        {sub && <p className="mt-1.5 max-w-[620px] text-[14px] leading-[1.45] text-body">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
