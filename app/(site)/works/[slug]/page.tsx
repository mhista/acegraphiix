import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getProject } from "@/lib/content/queries";
import { Markdown } from "@/lib/markdown";
import { Section } from "@/components/site/Section";
import { Tile } from "@/components/site/Tile";
import { Label, Reveal } from "@/components/site/ui";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? { title: p.title, description: p.summary ?? undefined, openGraph: { images: p.cover_url ? [p.cover_url] : [] } } : {};
}

export default async function ProjectPage({ params }: P) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const c = await getContent();
  const more = c.projects.filter((x) => x.id !== p.id).slice(0, 2);
  const meta = [
    ["Client", p.client],
    ["Year", p.year],
    ["Industry", p.industry],
    ["Service", p.category],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        <Reveal>
          <Link href="/works" className="text-[14px] text-muted hover:text-ink">← All works</Link>
          <h1 className="h-display mt-5">{p.title}</h1>
          {p.summary && <p className="mt-5 max-w-[560px] text-[17px] leading-[1.5] text-body">{p.summary}</p>}
          {meta.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {meta.map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-wash p-4">
                  <dt className="text-[12px] font-medium uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="mt-1 text-[15px] font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </Reveal>
        {p.cover_url && (
          <Reveal delay={0.08} className="mt-8 overflow-hidden rounded-[34px] sm:rounded-[40px]">
            <Tile src={p.cover_url} alt={p.title} />
          </Reveal>
        )}
      </section>
      {p.body && (
        <Section>
          <div className="mx-auto max-w-[640px]">
            <Markdown source={p.body} />
          </div>
        </Section>
      )}
      {p.gallery.length > 0 && (
        <Section>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.gallery.map((src, i) => (
              <Reveal key={src + i} className={`overflow-hidden rounded-[28px] ${i % 3 === 0 ? "sm:col-span-2" : ""}`}>
                <Tile src={src} alt={`${p.title} — image ${i + 1}`} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}
      {more.length > 0 && (
        <Section>
          <Label>Works</Label>
          <h2 className="h-section mt-4">Explore more works</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {more.map((m, i) => (
              <Link key={m.id} href={`/works/${m.slug}`} className="group block">
                <div className="aspect-square overflow-hidden rounded-[34px]">
                  <div className="h-full transition duration-700 group-hover:scale-[1.04]">
                    <Tile src={m.cover_url} alt={m.title} index={i} />
                  </div>
                </div>
                <p className="mt-3 text-[18px] font-medium">{m.title}</p>
                <p className="text-[14px] text-muted">{m.category}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
