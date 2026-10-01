# Case study — Acegraphiix portfolio & studio dashboard

**Client:** Ndubuisi Jeremiah (Acegraphiix), graphic designer & brand strategist, Port Harcourt, Nigeria
**Year:** 2026
**Services:** Web design & development · Content management system · Lightweight CRM · Google Drive integration · Transactional email
**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase (Postgres, Auth, Storage), Google Drive API, Resend, Vercel

---

## One-liner

A portfolio that updates itself. Jeremiah drops designs into a Google Drive folder and they appear on his website, and
every enquiry lands in a dashboard built for following up.

## The brief

Jeremiah designs flyers, brand identities and social campaigns for clients across Nigeria and the UK. His work lived
in a Google Drive folder with hundreds of files. Showing it meant sending people a Drive link. He wanted:

- a premium, minimal portfolio in the style of a modern Framer site he'd chosen as a reference;
- his services and pricing (in naira), process, experience and FAQs, written in his own words;
- the ability to change anything himself, without calling a developer;
- his Drive designs on the site, without re-uploading them one by one.

## What we built

**A portfolio site** with a fixed profile card, an auto-scrolling hero strip of his latest work, a "projects that tell
stories" grid, priced service cards, a four-step process, a work-experience timeline, a philosophy statement,
testimonials, a toolkit, an archive collage, FAQs and a contact form. It's fully responsive, and on phones the profile
card becomes a compact header.

**A Google Drive pipeline.** He shares one folder. The site syncs it on demand and once a day, and subfolders become
filterable categories. Images are never copied into the database. A small proxy fetches a resized version from Drive
and the CDN caches it, so storage costs stay flat however large the archive grows. His choices (hidden, featured, or
placed in a section) survive every sync.

**A dashboard he runs himself:**
- **Drive designs:** search, filter and paginate the library; show, hide or feature designs; choose exactly which
  designs fill the hero strip, the projects grid and the archive collage.
- **Content editors** for projects (case studies), services, process, experience, testimonials, toolkit, FAQ and blog,
  plus site-wide settings for copy, photos, contact details and SEO. Saves go live instantly.
- **Enquiries CRM:** each contact-form message moves through New → Contacted → In progress → Won/Lost, with private
  notes, deal value, and one-tap reply by email or WhatsApp.
- **Passwordless sign-in** with a 6-digit code in a branded email. Only approved emails can edit.

**Branded emails:** sign-in, password reset, invite and email-change templates, plus an HTML "new enquiry" alert with
reply buttons.

## Details we cared about

- **Security lives in the database.** Postgres row-level security means visitors can only read published content and
  send an enquiry. The admin list decides who can edit, not the UI.
- **No fake social proof.** Testimonials stay hidden until real client quotes are added.
- **It never shows a blank page.** If the CMS is unreachable, each section falls back to sensible defaults instead
  of erroring.
- **Room to grow.** Pagination and bulk actions keep a library of hundreds of designs manageable.

## Results

- Jeremiah updates his portfolio by dropping files into Drive. No uploads, no developer.
- 74 designs went live on the first sync.
- Enquiries arrive as an email and a CRM record at the same time, so leads don't sit unanswered in a DM inbox.

## Screenshots

| | |
|---|---|
| Home (desktop) | `screenshots/home-hero.jpg` |
| Home (mobile) | `screenshots/home-mobile.jpg` |
| Full home page | `screenshots/home-full.jpg` |
| Projects grid | `screenshots/section-projects.jpg` |
| Services & pricing | `screenshots/section-services.jpg` |
| Process | `screenshots/section-process.jpg` |
| Experience | `screenshots/section-experience.jpg` |
| Philosophy & toolkit | `screenshots/section-philosophy-toolkit.jpg` |
| Archive collage | `screenshots/section-archive.jpg` |
| Dashboard overview | `screenshots/dashboard-overview.jpg` |
| Drive designs manager | `screenshots/dashboard-designs.jpg` |
| Services editor | `screenshots/dashboard-services.jpg` |

## Short version (for a project card)

> **Acegraphiix — Designer portfolio + studio dashboard.** A Next.js portfolio for a Port Harcourt brand designer
> that pulls his work straight from Google Drive, with a self-serve CMS and an enquiries CRM. He updates his site by
> dropping files into a folder.
> *Next.js · Supabase · Google Drive API · Vercel*
