import Link from "next/link";
import type { Settings } from "@/lib/content/types";

/** The monogram key — his "A" on a raised dark tile, used in the top bar and the hero line. */
export function Mark({ size = 44 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[28%] text-white"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(160deg,#3a3a3a 0%,#161616 55%,#050505 100%)",
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / .22), inset 0 -3px 0 rgb(0 0 0 / .6), 0 4px 10px rgb(0 0 0 / .35)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" width={size * 0.56} height={size * 0.56}>
        <path d="M14 50 29.5 10h5L50 50h-8.2l-3.4-9.4H25.6L22.2 50H14Zm14-16h8l-4-11.4L28 34Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function TopBar({ s }: { s: Settings }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="flex items-center gap-1.5 rounded-[18px] bg-wash p-1.5">
        <Link href="/" aria-label="Home" className="hidden sm:block">
          <Mark size={36} />
        </Link>
        <a
          href={s.socials.find((x) => x.label === "instagram")?.url || "#"}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-white/70 px-3 py-2 text-[14px] font-medium text-ink shadow-keylight"
        >
          {s.handle}
        </a>
        <span className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-[14px] font-medium text-body">
          New work
          <span className="flex items-center gap-1.5 text-ink">
            <span className={`h-1.5 w-1.5 rounded-full ${s.available ? "animate-blink bg-green-500" : "bg-faint"}`} />
            {s.available ? s.availability_label : "Booked"}
          </span>
        </span>
      </div>
      <div className="hidden border-r-2 border-line pr-3 text-right text-[14px] leading-tight sm:block">
        <p className="text-body">Based in</p>
        <p className="whitespace-nowrap font-medium text-ink">{s.location}</p>
      </div>
    </div>
  );
}
