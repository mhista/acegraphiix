import type { SiteContent } from "./types";
import { driveImage } from "./urls";
import { CATEGORIES } from "./defaults";

export interface WorkItem {
  key: string;
  title: string;
  category: string;
  image: string | null;
  href: string;
  width?: number | null;
  height?: number | null;
}

/* Case studies (projects) come first, then designs synced from Google Drive.
   A Drive design's category is the name of the Drive folder it lives in. */
export function workItems(c: SiteContent): WorkItem[] {
  const projects: WorkItem[] = c.projects.map((p) => ({
    key: `p-${p.id}`,
    title: p.title,
    category: p.category,
    image: p.cover_url,
    href: `/works/${p.slug}`,
  }));
  const designs: WorkItem[] = c.gallery.map((g) => ({
    key: `g-${g.id}`,
    title: prettyName(g.name),
    category: g.folder_name,
    image: driveImage(g.id, 1000),
    href: `/archive?design=${encodeURIComponent(g.id)}`,
    width: g.width,
    height: g.height,
  }));
  return [...projects, ...designs];
}

/** "IMG_2034 final-v3 (1).png" → "IMG 2034 final v3" — only used as alt text and hover labels. */
export function prettyName(file: string) {
  return file
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\(\d+\)$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Category pills: the service names, plus any Drive folder names that aren't among them. */
export function categories(c: SiteContent) {
  const fromServices = c.services.map((s) => s.title);
  const base = fromServices.length ? fromServices : CATEGORIES;
  const extra = new Set<string>();
  for (const w of workItems(c)) if (w.category && !base.includes(w.category)) extra.add(w.category);
  return [...base, ...extra];
}

/* ── Hand-picked sections ────────────────────────────────────────────
   In the dashboard (Drive designs) Jeremiah can tick a design into the
   Hero strip, the Latest Projects grid or the Archive collage. A section
   with picks shows exactly those, in the order he picked them. A section
   with no picks falls back to a sensible default, and the defaults are
   staggered so the three sections don't all show the same first designs. */

export type HomeSection = "hero" | "projects" | "archive";
export const SECTION_LIMITS: Record<HomeSection, number> = { hero: 12, projects: 6, archive: 8 };
export const SECTION_LABELS: Record<HomeSection, string> = { hero: "Hero strip", projects: "Latest projects", archive: "Archive" };

export function picked(c: SiteContent, section: HomeSection) {
  return c.gallery
    .filter((g) => g.sections?.includes(section))
    .sort((a, b) => (a.section_order ?? 0) - (b.section_order ?? 0))
    .slice(0, SECTION_LIMITS[section]);
}

const asWork = (g: SiteContent["gallery"][number]): WorkItem => ({
  key: `g-${g.id}`,
  title: prettyName(g.name),
  category: g.folder_name,
  image: driveImage(g.id, 1000),
  href: `/archive?design=${encodeURIComponent(g.id)}`,
  width: g.width,
  height: g.height,
});

export function heroItems(c: SiteContent): WorkItem[] {
  const p = picked(c, "hero");
  if (p.length) return p.map(asWork);
  return workItems(c).filter((w) => w.image).slice(0, SECTION_LIMITS.hero);
}

export function projectItems(c: SiteContent, limit = SECTION_LIMITS.projects): WorkItem[] {
  const p = picked(c, "projects");
  const cases = workItems(c).filter((w) => w.key.startsWith("p-"));
  if (p.length) return [...cases, ...p.map(asWork)].slice(0, Math.max(limit, cases.length));
  return workItems(c).slice(0, limit);
}

export function archiveItems(c: SiteContent) {
  const p = picked(c, "archive");
  if (p.length) return p;
  /* No picks: skip the designs the projects grid is already showing. */
  const used = new Set(projectItems(c).map((w) => w.key));
  const rest = c.gallery.filter((g) => !used.has(`g-${g.id}`));
  return (rest.length >= 4 ? rest : c.gallery).slice(0, SECTION_LIMITS.archive);
}
