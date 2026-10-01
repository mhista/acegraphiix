import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/content/queries";
import { Markdown } from "@/lib/markdown";
import { Tile } from "@/components/site/Tile";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt ?? undefined, openGraph: { images: p.cover_url ? [p.cover_url] : [] } } : {};
}

export default async function PostPage({ params }: P) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  return (
    <>
      <article className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[640px]">
          <Link href="/blog" className="text-[14px] text-muted hover:text-ink">← All posts</Link>
          <div className="mt-5 flex items-center gap-2 text-[13px] text-muted">
            {p.category && <span className="chip">{p.category}</span>}
            {p.published_at && <span>{new Date(p.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>}
          </div>
          <h1 className="h-section mt-4">{p.title}</h1>
          {p.excerpt && <p className="mt-4 text-[17px] leading-[1.5] text-body">{p.excerpt}</p>}
        </div>
        {p.cover_url && (
          <div className="mx-auto mt-8 max-w-[820px] overflow-hidden rounded-[34px]">
            <Tile src={p.cover_url} alt="" />
          </div>
        )}
        <div className="mx-auto mt-10 max-w-[640px]">
          <Markdown source={p.body} />
        </div>
      </article>
      <div className="band" />
    </>
  );
}
