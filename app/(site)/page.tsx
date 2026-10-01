import { getContent } from "@/lib/content/queries";
import { Archive, BlogPreview, ExperienceBlock, Hero, Philosophy, Process, Projects, Services, Toolkit } from "@/components/site/sections";
import { Testimonials } from "@/components/site/Testimonials";
import { Faq } from "@/components/site/Faq";

export default async function Home() {
  const c = await getContent();
  const s = c.settings;
  return (
    <>
      <Hero c={c} />
      <Projects c={c} />
      <Services c={c} />
      <Process c={c} />
      <ExperienceBlock c={c} />
      <Philosophy c={c} />
      <Testimonials items={c.testimonials} title={s.testimonials_title} clients={s.clients_count} sample={c.demo} />
      <Toolkit c={c} />
      <Archive c={c} />
      <BlogPreview c={c} />
      <Faq items={c.faqs} intro={s.faq_intro} email={s.email} />
    </>
  );
}
