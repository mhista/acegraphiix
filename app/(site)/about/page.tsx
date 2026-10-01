import type { Metadata } from "next";
import { getContent } from "@/lib/content/queries";
import { PageHead } from "@/components/site/PageHead";
import { Section } from "@/components/site/Section";
import { ExperienceBlock, Philosophy, Toolkit } from "@/components/site/sections";
import { Reveal } from "@/components/site/ui";
import { Markdown } from "@/lib/markdown";

export const metadata: Metadata = { title: "About" };

export default async function About() {
  const c = await getContent();
  const s = c.settings;
  return (
    <>
      <PageHead label="About" title={`${s.hero_line_1} ${s.hero_line_2}`} />
      <Section>
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <Reveal>
            <div className="overflow-hidden rounded-[34px] bg-wash">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.portrait_url} alt={s.name} className="aspect-[4/5] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="text-[24px] font-medium leading-[1.2] tracking-head sm:text-[28px]">{s.sidebar_bio}</p>
            <div className="mt-6">
              <Markdown source={s.about_body} />
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-3 text-[14px]">
              <div className="rounded-2xl bg-wash p-4">
                <dt className="text-muted">Based in</dt>
                <dd className="mt-1 font-medium">{s.location}</dd>
              </div>
              <div className="rounded-2xl bg-wash p-4">
                <dt className="text-muted">Status</dt>
                <dd className="mt-1 font-medium">{s.available ? "Taking new projects" : "Fully booked"}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Section>
      <ExperienceBlock c={c} />
      <Philosophy c={c} />
      <div className="band" />
      <Toolkit c={c} />
    </>
  );
}
