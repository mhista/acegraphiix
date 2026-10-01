import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content/queries";
import { categories, workItems } from "@/lib/content/works";
import { PageHead } from "@/components/site/PageHead";
import { Gallery } from "@/components/site/Gallery";

export const metadata: Metadata = { title: "Works" };

export default async function Works() {
  const c = await getContent();
  return (
    <>
      <PageHead label="Works" title="Selected work" intro="Brand identities, social campaigns and visual systems — case studies first, then designs straight from the studio archive." />
      <section className="px-4 py-12 sm:px-6 sm:py-14">
        <Suspense>
          <Gallery items={workItems(c)} cats={categories(c)} demo={c.demo} />
        </Suspense>
      </section>
      <div className="band" />
    </>
  );
}
