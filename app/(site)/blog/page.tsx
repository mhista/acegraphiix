import type { Metadata } from "next";
import { getContent } from "@/lib/content/queries";
import { PageHead } from "@/components/site/PageHead";
import { PostCard } from "@/components/site/sections";

export const metadata: Metadata = { title: "Blog" };

export default async function Blog() {
  const c = await getContent();
  return (
    <>
      <PageHead label="My Blog" title={c.settings.blog_title} />
      <section className="px-4 py-12 sm:px-6 sm:py-14">
        {c.posts.length ? (
          <div className="mx-auto max-w-[640px] space-y-3">
            {c.posts.map((p, i) => <PostCard key={p.id} p={p} i={i} />)}
          </div>
        ) : (
          <p className="text-center text-body">No posts yet.</p>
        )}
      </section>
      <div className="band" />
    </>
  );
}
