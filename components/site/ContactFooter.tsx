"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";
import { sendEnquiry, type ContactState } from "@/lib/actions/contact";
import type { Settings } from "@/lib/content/types";
import { Mark } from "./TopBar";
import { Lines, Reveal } from "./ui";

function Field({ name, type = "text", placeholder, icon, required }: { name: string; type?: string; placeholder: string; icon: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-2 rounded-xl bg-white py-1 pl-4 pr-1.5 shadow-keylight focus-within:ring-2 focus-within:ring-ink/10">
      <input name={name} type={type} required={required} placeholder={placeholder} className="h-10 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint" />
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-wash text-muted">
        <Icon name={icon} size={14} />
      </span>
    </label>
  );
}

export function ContactFooter({ s, services }: { s: Settings; services: string[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendEnquiry, { ok: false });
  const form = useRef<HTMLFormElement>(null);
  const params = useSearchParams();
  const preset = params.get("service") ?? "";

  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state.ok]);

  const wa = s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <footer id="contact" className="scroll-mt-24 space-y-3 px-4 py-14 sm:px-6 sm:py-16">
      <Reveal>
        <div className="rounded-[40px] bg-wash p-2 pt-8 sm:rounded-[48px] sm:p-2.5 sm:pt-10">
          <div className="flex justify-center pb-6">
            <Mark size={56} />
          </div>
          <div className="rounded-[34px] bg-[#f9f9f9] px-5 py-10 text-center shadow-[inset_0_1px_0_#fff,0_1px_3px_rgb(0_0_0/.06)] sm:rounded-[40px] sm:py-12">
            <h2 className="h-section">
              <Lines text={s.contact_title} />
            </h2>
            <p className="mx-auto mt-4 max-w-[400px] text-[15px] leading-[1.4] text-body">{s.contact_text}</p>

            {state.ok ? (
              <div className="mx-auto mt-8 max-w-[380px] rounded-2xl bg-white p-5 text-left shadow-keylight">
                <p className="flex items-center gap-2 text-[15px] font-medium">
                  <Icon name="check" size={18} /> Message sent — thank you!
                </p>
                <p className="mt-1 text-[14px] text-body">I&apos;ll reply within a day. Need me sooner?</p>
                {wa && (
                  <a href={wa} target="_blank" rel="noreferrer" className="btn-dark mt-4 w-full">
                    <Icon name="whatsapp" size={16} /> Chat on WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <form ref={form} action={action} className="mx-auto mt-8 max-w-[380px] space-y-2.5 text-left">
                <Field name="name" placeholder="Enter your name" icon="user" required />
                <Field name="email" type="email" placeholder="Enter your e-mail" icon="mail" required />
                <label className="flex items-center gap-2 rounded-xl bg-white py-1 pl-4 pr-1.5 shadow-keylight">
                  <select name="service" defaultValue={preset} key={preset} className="h-10 min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none">
                    <option value="">What do you need? (optional)</option>
                    {services.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                    <option>Something else</option>
                  </select>
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell me a little about the project"
                  className="w-full resize-none rounded-xl bg-white px-4 py-3 text-[14px] shadow-keylight outline-none placeholder:text-faint focus:ring-2 focus:ring-ink/10"
                />
                <input name="company_site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                {state.error && state.error !== "offline" && <p className="text-[13px] text-red-600">{state.error}</p>}
                {state.error === "offline" && (
                  <p className="text-[13px] text-body">
                    The form isn&apos;t connected yet — email{" "}
                    <a className="underline" href={`mailto:${s.email}`}>
                      {s.email}
                    </a>
                    .
                  </p>
                )}
                <button disabled={pending} className="btn-dark h-11 w-full rounded-xl disabled:opacity-60">
                  {pending ? "Sending…" : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-[40px] bg-wash px-6 py-8 sm:rounded-[48px] sm:px-8 sm:py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a href={`mailto:${s.email}`} className="break-all text-[22px] font-medium tracking-head hover:underline sm:text-[28px]">
              {s.email}
            </a>
            <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-[22px] font-medium tracking-head hover:underline sm:text-[28px]">
              {s.phone}
            </a>
          </div>
          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex gap-10 text-[14px]">
              <div className="flex gap-4">
                <span className="text-muted">Links</span>
                <ul className="space-y-1 font-medium">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
              <div className="flex gap-4">
                <span className="text-muted">Resource</span>
                <ul className="space-y-1 font-medium">
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="/works">Works</Link></li>
                  <li><Link href="/archive">Archive</Link></li>
                </ul>
              </div>
            </div>
            <div className="text-[13px] text-body sm:text-right">
              <div className="flex gap-3 sm:justify-end">
                {s.socials.filter((x) => x.url).map((x) => (
                  <a key={x.label} href={x.url} target="_blank" rel="noreferrer" aria-label={x.label} className="text-ink hover:opacity-70">
                    <Icon name={x.label === "x" ? "xtwitter" : x.label} size={17} />
                  </a>
                ))}
              </div>
              <p className="mt-3">
                © {new Date().getFullYear()} {s.brand}. All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
