import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content/queries";
import { workItems } from "@/lib/content/works";
import { PageHead } from "@/components/site/PageHead";
import { Gallery } from "@/components/site/Gallery";

export const metadata: Metadata = { title: "Archive" };

export default async function ArchivePage() {
  const c = await getContent();
  const designs = workItems(c).filter((w) => w.key.startsWith("g-"));
  const folders = [...new Set(designs.map((d) => d.category))];
  return (
    <>
      <PageHead label="Archive" title={c.settings.archive_title} intro="Flyers, posters, identities and campaign visuals — the full body of work, sorted by kind." />
      <section className="px-4 py-12 sm:px-6 sm:py-14">
        <Suspense>
          <Gallery items={designs} cats={folders} masonry demo={c.demo} />
        </Suspense>
      </section>
      <div className="band" />
    </>
  );
}
