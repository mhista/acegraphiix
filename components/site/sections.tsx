import Link from "next/link";
import { Icon } from "@/components/Icon";
import type { SiteContent } from "@/lib/content/types";
import { archiveItems, categories, heroItems, projectItems, type WorkItem } from "@/lib/content/works";
import { Section } from "./Section";
import { Tile } from "./Tile";
import { Mark } from "./TopBar";
import { Label, Lines, Reveal, WordReveal } from "./ui";

const CAT_ICON = ["bag", "phone", "folder", "brush", "image", "grid"];

/* ── Hero ──────────────────────────────────────────────────────────── */

export function Hero({ c }: { c: SiteContent }) {
  const s = c.settings;
  const items = heroItems(c);
  const tiles = items.length ? items : Array.from({ length: 8 }, (_, i) => ({ key: `ph${i}`, image: null, title: "", href: "/works", category: "" }));
  const loop = [...tiles, ...tiles];

  return (
    <>
      <section className="pb-14 pt-16 sm:pb-20 sm:pt-24">
        <div className="px-4 text-center sm:px-6">
          {s.announcement && (
            <Reveal>
              <Link
                href={s.announcement_url || "/works"}
                className="group mx-auto inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-ink py-1 pl-1 pr-4 text-[13px] font-medium text-white"
              >
                <span className="h-7 w-11 overflow-hidden rounded-full">
                  <Tile src={items[0]?.image ?? s.avatar_url} index={0} />
                </span>
                {s.announcement}
                <Icon name="arrow" size={15} className="transition group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <h1 className="mx-auto mt-6 max-w-[16ch] text-[clamp(38px,5vw,64px)] font-medium leading-[1.02] tracking-display sm:max-w-none">
              {s.hero_greeting}
              <br />
              <span className="inline-flex flex-wrap items-center justify-center gap-x-[0.22em]">
                {s.hero_line_1}
                <span className="inline-block translate-y-[0.04em] align-middle">
                  <Mark size={52} />
                </span>
                {s.hero_line_2}
              </span>
            </h1>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="mt-14 sm:mt-20">
          <div
            className="relative overflow-hidden"
            style={{ maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" }}
          >
            <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
              {loop.map((t, i) => (
                <Link
                  key={`${t.key}-${i}`}
                  href={t.href}
                  className="block h-[140px] w-[140px] shrink-0 overflow-hidden rounded-[26px] sm:h-[176px] sm:w-[176px] sm:rounded-[30px]"
                  tabIndex={i >= tiles.length ? -1 : undefined}
                  aria-label={t.title || "Selected work"}
                >
                  <Tile src={t.image} alt={t.title} index={i} />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
      <div className="band" />
    </>
  );
}

/* ── Latest projects ───────────────────────────────────────────────── */

export function Projects({ c, limit = 6 }: { c: SiteContent; limit?: number }) {
  const s = c.settings;
  const cats = categories(c).slice(0, 4);
  const shown = projectItems(c, limit);
  const demo = !shown.length;

  return (
    <Section id="projects">
      <Reveal>
        <Label>Latest Projects</Label>
        <div className="mt-4 flex items-end justify-between gap-6">
          <h2 className="h-section">
            <Lines text={s.projects_title} />
          </h2>
          <div className="hidden text-right text-[48px] font-medium leading-[1] tracking-display text-[#d4d4d8] sm:block">
            <span className="block text-[40px]">©</span>
            {s.projects_years}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
          {cats.map((cat, i) => (
            <Link
              key={cat}
              href={`/works?c=${encodeURIComponent(cat)}`}
              className="flex min-w-[150px] items-center justify-between gap-2 rounded-2xl bg-wash px-3 py-2.5 text-[14px] font-medium leading-tight text-ink shadow-keylight transition hover:bg-[#ececee]"
            >
              <span>{cat}</span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-keylight">
                <Icon name={CAT_ICON[i % CAT_ICON.length]} size={14} />
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
        {(demo ? [null, null, null, null] : shown).map((w: WorkItem | null, i: number) => (
          <Reveal key={w?.key ?? i} delay={(i % 2) * 0.06}>
            <Link
              href={w?.href ?? "/works"}
              className="group relative block aspect-square overflow-hidden rounded-[34px] bg-wash sm:rounded-[40px]"
            >
              <div className="h-full w-full transition duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
                <Tile src={w?.image} alt={w?.title} index={i + 1} label={demo ? cats[i % cats.length] : undefined} />
              </div>
              {w && (
                <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between rounded-2xl bg-white/85 px-4 py-3 opacity-0 backdrop-blur-md transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium">{w.title}</p>
                    <p className="text-[13px] text-muted">{w.category}</p>
                  </div>
                  <Icon name="arrowUpRight" size={18} />
                </div>
              )}
            </Link>
          </Reveal>
        ))}
      </div>

      {(c.gallery.length + c.projects.length > shown.length) && (
        <div className="mt-8 text-center">
          <Link href="/works" className="btn-dark">
            View all work
          </Link>
        </div>
      )}
    </Section>
  );
}

/* ── Services ──────────────────────────────────────────────────────── */

export function Services({ c }: { c: SiteContent }) {
  const s = c.settings;
  if (!c.services.length) return null;
  return (
    <Section id="services">
      <Reveal>
        <Label>Services</Label>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1.4fr_1fr] sm:items-end">
          <h2 className="h-section">
            <Lines text={s.services_title} />
          </h2>
          <p className="max-w-[300px] text-[15px] leading-[1.4] text-body sm:justify-self-end">{s.services_intro}</p>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-3.5">
        {c.services.map((sv, i) => (
          <Reveal key={sv.id} delay={(i % 2) * 0.06}>
            <article className="flex h-full flex-col rounded-[34px] bg-wash p-5 sm:p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-key">
                <Icon name={sv.icon || "bag"} size={20} />
              </span>
              <h3 className="mt-7 text-[26px] font-medium leading-[1.1] tracking-head sm:text-[30px]">{sv.title}</h3>
              <p className="mt-2 max-w-[340px] text-[15px] leading-[1.35] text-body">{sv.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {sv.features.map((f) => (
                  <li key={f} className="rounded-full bg-[#e8e8ea] px-3.5 py-1.5 text-[14px] font-medium text-ink">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <div className="flex items-end justify-between gap-3 border-t border-[#dcdce0] pt-5">
                  <div>
                    <p className="text-[14px] font-medium">From</p>
                    <p className="text-[24px] font-medium leading-[1.15] tracking-head">
                      {sv.price}
                      <span className="text-[20px]">{sv.unit}</span>
                    </p>
                  </div>
                  <Link href={`/contact?service=${encodeURIComponent(sv.title)}`} className="btn-dark shrink-0">
                    Book a Call
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {s.currency_note && <p className="mt-4 text-[13px] text-muted">{s.currency_note}</p>}
    </Section>
  );
}

/* ── Process + stat ────────────────────────────────────────────────── */

export function Process({ c }: { c: SiteContent }) {
  const s = c.settings;
  const n = c.steps.length;
  return (
    <Section id="process">
      <Reveal>
        <Label>Process</Label>
        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <h2 className="h-section">{s.process_title}</h2>
            <p className="mt-4 max-w-[330px] text-[15px] leading-[1.4] text-body">{s.process_intro}</p>
          </div>
          <p className="hidden shrink-0 text-[48px] font-medium leading-[1] tracking-display text-[#d4d4d8] sm:block">
            {String(n).padStart(2, "0")} Steps
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {c.steps.map((st, i) => (
          <Reveal key={st.id} delay={i * 0.06}>
            <div className={`h-full px-0 sm:px-4 ${i > 0 ? "lg:border-l lg:border-line" : "lg:pl-0"}`}>
              <div className="flex items-start justify-between">
                <p className="text-[16px] font-medium text-muted">Step {String(i + 1).padStart(2, "0")}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-key">
                  <Icon name={st.icon || "sparkles"} size={17} />
                </span>
              </div>
              <h3 className="mt-3 min-h-[56px] text-[24px] font-medium leading-[1.15] tracking-head">{st.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {st.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {s.stat_value && (
        <Reveal>
          <div className="mt-10 rounded-[34px] bg-[#0b0b0b] p-6 text-white sm:rounded-[44px] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <p className="text-[64px] font-medium leading-[1] tracking-display sm:text-[80px]">{s.stat_value}</p>
              <div>
                <p className="text-[18px] font-medium">{s.stat_label}</p>
                <p className="mt-1 max-w-[440px] text-[14px] leading-[1.45] text-faint">{s.stat_text}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-dashed border-white/15" />
          </div>
        </Reveal>
      )}
    </Section>
  );
}

/* ── Experience ────────────────────────────────────────────────────── */

export function ExperienceBlock({ c }: { c: SiteContent }) {
  if (!c.experience.length) return null;
  return (
    <Section id="experience">
      <Reveal className="text-center">
        <Label>My Experience</Label>
        <h2 className="h-section mx-auto mt-4 max-w-[18ch] sm:max-w-none">{c.settings.experience_title}</h2>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="mx-auto mt-10 max-w-[680px] rounded-[40px] bg-wash p-2 pb-8 sm:rounded-[48px] sm:p-3 sm:pb-10">
          <div className="rounded-[32px] bg-white px-5 py-6 shadow-card sm:rounded-[40px] sm:px-8 sm:py-8">
            <ol className="relative">
              {c.experience.map((e, i) => (
                <li key={e.id} className="relative grid grid-cols-[18px_1fr] gap-x-4 pb-8 last:pb-0 sm:grid-cols-[1fr_18px_1.1fr] sm:gap-x-5">
                  <div className="order-2 sm:order-1 sm:text-right">
                    <p className="text-[16px] font-medium leading-tight tracking-snug">{e.role}</p>
                    <p className="text-[14px] font-medium text-ink/80">{e.company}</p>
                    <p className="mt-0.5 text-[13px] text-muted">{e.period}</p>
                  </div>
                  <div className="relative order-1 row-span-2 flex justify-center sm:order-2 sm:row-span-1">
                    <span className="relative z-10 mt-1.5 h-3 w-3 rounded-full border-[3px] border-white bg-ink ring-1 ring-ink/20" />
                    {i < c.experience.length - 1 && <span className="absolute bottom-[-8px] top-5 w-px bg-line" />}
                  </div>
                  <ul className="order-3 mt-2 space-y-1.5 text-[14px] leading-[1.45] text-body sm:mt-0">
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-7 text-center">
            <Link href="/contact" className="btn-dark">
              Let&apos;s Work Together
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── Philosophy ────────────────────────────────────────────────────── */

export function Philosophy({ c }: { c: SiteContent }) {
  const s = c.settings;
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[34px] bg-[#1a120c] text-white sm:rounded-[44px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.philosophy_image_url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <div className="flex min-h-[520px] flex-col p-5 sm:min-h-[560px] sm:p-7">
            <Label light>My Philosophy</Label>
            <div className="mt-auto">
              <h2 className="h-section max-w-[14ch] sm:max-w-none">{s.philosophy_title}</h2>
              <div className="mt-6 grid gap-5 border-t border-white/20 pt-6 text-[15px] leading-[1.45] text-white/80 sm:grid-cols-2 sm:gap-8 sm:pl-6">
                <p>{s.philosophy_left}</p>
                <p>{s.philosophy_right}</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Toolkit ───────────────────────────────────────────────────────── */

export function Toolkit({ c }: { c: SiteContent }) {
  if (!c.tools.length) return null;
  return (
    <Section id="toolkit">
      <Label>Toolkits</Label>
      <WordReveal text={c.settings.toolkit_text} className="mt-4 max-w-[640px] text-[24px] font-medium leading-[1.15] tracking-snug sm:text-[32px]" />
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        {c.tools.map((t, i) => (
          <Reveal key={t.id} delay={(i % 2) * 0.05}>
            <div className="flex items-center gap-4 rounded-[26px] bg-wash p-2.5 pr-4 shadow-keylight">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-ink text-white shadow-key">
                <Icon name={t.icon || t.name} size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[18px] font-medium leading-tight tracking-snug">{t.name}</p>
                <p className="truncate text-[14px] text-muted">{t.description}</p>
              </div>
              <span className="rounded-full bg-[#e8e8ea] px-3 py-1.5 text-[14px] font-medium">{t.percent}%</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── Archive (Google Drive designs) ────────────────────────────────── */

export function Archive({ c }: { c: SiteContent }) {
  const designs = archiveItems(c);
  if (!designs.length && !c.demo) return null;
  const cells = designs.length ? designs : Array.from({ length: 8 }, () => null);
  /* A fixed rhythm of shapes that echoes the reference collage — large, wide,
     small, round, ending in a wide pill. Whatever the designs are, the rhythm holds. */
  const shapes = [
    "col-span-2 row-span-2 rounded-[40px]",
    "col-span-2 row-span-1 rounded-[32px]",
    "col-span-1 row-span-1 rounded-[26px]",
    "col-span-1 row-span-1 rounded-full",
    "col-span-2 row-span-1 rounded-[32px]",
    "col-span-2 row-span-2 rounded-[40px]",
    "col-span-2 row-span-1 rounded-[32px]",
    "col-span-4 row-span-2 rounded-[999px]",
  ];
  return (
    <Section id="archive">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <Label>Archive</Label>
          <h2 className="h-section mt-4">{c.settings.archive_title}</h2>
        </div>
        <Link href="/archive" className="btn-dark hidden shrink-0 sm:inline-flex">
          Open the archive
        </Link>
      </Reveal>
      <div className="mt-8 grid grid-flow-dense auto-rows-[92px] grid-cols-4 gap-3 sm:auto-rows-[120px]">
        {cells.map((g, i) => (
          <Reveal key={g?.id ?? i} delay={(i % 3) * 0.05} className={`${shapes[i % shapes.length]} overflow-hidden`}>
            <Link href={g ? `/archive?design=${encodeURIComponent(g.id)}` : "/archive"} className="group block h-full w-full overflow-hidden">
              <div className="h-full w-full transition duration-700 group-hover:scale-[1.05]">
                <Tile src={g ? `/api/drive/${encodeURIComponent(g.id)}?w=900` : null} alt={g?.name} index={i + 3} />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 text-center sm:hidden">
        <Link href="/archive" className="btn-dark">
          Open the archive
        </Link>
      </div>
    </Section>
  );
}

/* ── Blog preview ──────────────────────────────────────────────────── */

export function BlogPreview({ c }: { c: SiteContent }) {
  if (!c.posts.length) return null;
  return (
    <Section id="blog">
      <Reveal className="text-center">
        <Label>My Blog</Label>
        <h2 className="h-section mt-4">{c.settings.blog_title}</h2>
      </Reveal>
      <div className="mx-auto mt-10 max-w-[640px] space-y-3">
        {c.posts.slice(0, 3).map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <PostCard p={p} i={i} />
          </Reveal>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/blog" className="btn-dark">
          View All Posts
        </Link>
      </div>
    </Section>
  );
}

export function PostCard({ p, i }: { p: SiteContent["posts"][number]; i: number }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group flex gap-4 rounded-[32px] bg-wash p-2 pr-5 transition hover:bg-[#ededef]">
      <div className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[26px] sm:h-[150px] sm:w-[170px]">
        <Tile src={p.cover_url} alt="" index={i + 2} />
      </div>
      <div className="flex min-w-0 flex-col py-2">
        <p className="text-[17px] font-medium leading-tight tracking-snug sm:text-[18px]">{p.title}</p>
        {p.excerpt && <p className="mt-2 line-clamp-2 text-[14px] leading-[1.4] text-body">{p.excerpt}</p>}
        <div className="mt-auto flex items-center gap-2 pt-3 text-[13px] text-muted">
          {p.category && <span className="rounded-full bg-white px-2.5 py-1 text-ink">{p.category}</span>}
          {p.published_at && <span>{new Date(p.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}
        </div>
      </div>
    </Link>
  );
}
