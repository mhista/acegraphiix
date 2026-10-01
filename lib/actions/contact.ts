"use server";

import { headers } from "next/headers";
import { publicClient } from "@/lib/supabase/server";
import { enquiryEmailHtml } from "@/lib/email/enquiry";

export interface ContactState {
  ok: boolean;
  error?: string;
}

const clean = (v: FormDataEntryValue | null, max = 2000) => String(v ?? "").trim().slice(0, max);

/* Tiny in-memory throttle: at most 5 messages per IP per 10 minutes, per
   server instance. Enough to blunt a bored bot; the honeypot does the rest. */
const hits = new Map<string, number[]>();

export async function sendEnquiry(_: ContactState, form: FormData): Promise<ContactState> {
  if (clean(form.get("company_site"))) return { ok: true }; // honeypot: pretend it worked

  const name = clean(form.get("name"), 120);
  const email = clean(form.get("email"), 200);
  const phone = clean(form.get("phone"), 40) || null;
  const service = clean(form.get("service"), 120) || null;
  const budget = clean(form.get("budget"), 60) || null;
  const message = clean(form.get("message"), 4000) || null;

  if (!name) return { ok: false, error: "Please add your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "That email doesn't look right." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return { ok: false, error: "Too many messages — please try again in a few minutes." };
  hits.set(ip, [...recent, now]);

  const db = publicClient();
  if (!db) return { ok: false, error: "offline" };

  const { error } = await db.from("enquiries").insert({ name, email, phone, service, budget, message });
  if (error) {
    console.error("[contact]", error.message);
    return { ok: false, error: "Something went wrong sending that. Please email me directly." };
  }

  /* Optional email ping (https://resend.com — free tier is plenty). */
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (key && to) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Website <onboarding@resend.dev>",
        to,
        reply_to: email,
        subject: `New enquiry from ${name}${service ? ` — ${service}` : ""}`,
        text: [`Name: ${name}`, `Email: ${email}`, phone && `Phone: ${phone}`, service && `Service: ${service}`, budget && `Budget: ${budget}`, "", message ?? ""]
          .filter((l) => l !== null && l !== undefined)
          .join("\n"),
        html: enquiryEmailHtml({ name, email, phone, service, budget, message, siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "" }),
      }),
    }).catch((e) => console.error("[contact] notify failed", e));
  }

  return { ok: true };
}
