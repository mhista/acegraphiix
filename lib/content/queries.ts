import "server-only";
import { cache } from "react";
import { publicClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT, DEFAULT_SETTINGS } from "./defaults";
import type { GalleryItem, Post, Project, Settings, SiteContent } from "./types";

/* One read for the whole site. Every section on the home page needs a slice
   of it and the sidebar needs settings on every page, so it's fetched once per
   request (React `cache`) and pages are statically regenerated (ISR) — the
   dashboard revalidates them the moment something is saved.

   A broken or missing CMS must never take the site down: any failed query
   falls back to that slice's default and logs, rather than throwing. */

/* eslint-disable @typescript-eslint/no-explicit-any */
async function rows<T>(db: any, table: string, build: (q: any) => any, fallback: T[]): Promise<T[]> {
  try {
    const { data, error } = await build(db.from(table).select("*"));
    if (error) throw error;
    return (data as T[]) ?? [];
  } catch (e) {
    console.warn(`[content] ${table}: ${(e as Error)?.message ?? e} — using defaults`);
    return fallback;
  }
}

export const getContent = cache(async (): Promise<SiteContent> => {
  const db = publicClient();
  if (!db) {
    return { settings: DEFAULT_SETTINGS, ...DEFAULT_CONTENT, demo: true };
  }

  const byPos = (q: any) => q.order("position", { ascending: true });
  const pub = (q: any) => byPos(q.eq("published", true));

  const [settingsRow, projects, services, steps, experience, testimonials, tools, faqs, posts, gallery] =
    await Promise.all([
      rows<{ data: Partial<Settings> }>(db, "settings", (q) => q.eq("id", 1), []),
      rows<Project>(db, "projects", pub, []),
      rows(db, "services", pub, DEFAULT_CONTENT.services),
      rows(db, "process_steps", byPos, DEFAULT_CONTENT.steps),
      rows(db, "experience", byPos, DEFAULT_CONTENT.experience),
      rows(db, "testimonials", pub, []),
      rows(db, "tools", byPos, DEFAULT_CONTENT.tools),
      rows(db, "faqs", pub, DEFAULT_CONTENT.faqs),
      rows<Post>(db, "posts", (q) => q.eq("published", true).order("published_at", { ascending: false }), []),
      rows<GalleryItem>(
        db,
        "gallery_items",
        (q) =>
          q
            .eq("visible", true)
            .order("featured", { ascending: false })
            .order("position", { ascending: true })
            .order("created_time", { ascending: false })
            .limit(1000),
        [],
      ),
    ]);

  /* Settings are one JSON document. Merging over the defaults means a field
     added in a later version of the site simply shows its default until edited. */
  const settings = { ...DEFAULT_SETTINGS, ...(settingsRow[0]?.data ?? {}) } as Settings;

  return {
    settings,
    projects,
    services: services as SiteContent["services"],
    steps: steps as SiteContent["steps"],
    experience: experience as SiteContent["experience"],
    testimonials: testimonials as SiteContent["testimonials"],
    tools: tools as SiteContent["tools"],
    faqs: faqs as SiteContent["faqs"],
    posts,
    gallery,
    demo: false,
  };
});

export async function getProject(slug: string) {
  const { projects } = await getContent();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getPost(slug: string) {
  const { posts } = await getContent();
  return posts.find((p) => p.slug === slug) ?? null;
}

export { driveImage } from "./urls";
