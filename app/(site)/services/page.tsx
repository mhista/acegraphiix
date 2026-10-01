import type { Metadata } from "next";
import { getContent } from "@/lib/content/queries";
import { Process, Services } from "@/components/site/sections";
import { Faq } from "@/components/site/Faq";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const c = await getContent();
  return (
    <>
      <Services c={c} />
      <Process c={c} />
      <Faq items={c.faqs} intro={c.settings.faq_intro} email={c.settings.email} />
    </>
  );
}
