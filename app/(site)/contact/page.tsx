import type { Metadata } from "next";
import { getContent } from "@/lib/content/queries";
import { PageHead } from "@/components/site/PageHead";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
  const { settings: s } = await getContent();
  const cards = [
    { icon: "whatsapp", label: "WhatsApp", value: s.phone, href: s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` : null },
    { icon: "mail", label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: "call", label: "Call", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
  ].filter((c) => c.href);
  return (
    <>
      <PageHead label="Contact" title="Let's talk about your brand" intro="Tell me what you're building — a new identity, a campaign, or a batch of flyers for this weekend. Fill in the form below or reach me directly." />
      <section className="grid gap-3 px-4 pt-12 sm:grid-cols-3 sm:px-6">
        {cards.map((c) => (
          <a key={c.label} href={c.href!} target={c.href!.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-[26px] bg-wash p-5 transition hover:bg-[#ececee]">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white shadow-key">
              <Icon name={c.icon} size={19} />
            </span>
            <p className="mt-5 text-[13px] text-muted">{c.label}</p>
            <p className="break-all text-[16px] font-medium">{c.value}</p>
          </a>
        ))}
      </section>
    </>
  );
}
