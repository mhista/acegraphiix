import Link from "next/link";
import { sessionClient } from "@/lib/supabase/server";
import { Icon } from "@/components/Icon";
import { PageTitle } from "@/components/dashboard/Shell";

export default async function Overview() {
  const db = (await sessionClient())!;
  const count = async (t: string, f?: [string, unknown]) => {
    let q = db.from(t).select("id", { count: "exact", head: true });
    if (f) q = q.eq(f[0], f[1]);
    return (await q).count ?? 0;
  };
  const [fresh, open, designs, visible, projects, testimonials] = await Promise.all([
    count("enquiries", ["status", "new"]),
    count("enquiries"),
    count("gallery_items"),
    count("gallery_items", ["visible", true]),
    count("projects"),
    count("testimonials", ["published", true]),
  ]);
  const { data: recent } = await db.from("enquiries").select("id,name,service,created_at,status").order("created_at", { ascending: false }).limit(5);

  const cards = [
    { href: "/dashboard/enquiries", label: "New enquiries", value: fresh, sub: `${open} all time`, icon: "inbox" },
    { href: "/dashboard/gallery", label: "Drive designs", value: visible, sub: `${designs} synced`, icon: "image" },
    { href: "/dashboard/c/projects", label: "Case studies", value: projects, sub: "projects", icon: "brush" },
    { href: "/dashboard/c/testimonials", label: "Testimonials", value: testimonials, sub: "live on the site", icon: "quote" },
  ];

  const todo = [
    !designs && { href: "/dashboard/gallery", text: "Connect your Google Drive folder so your designs show on the site" },
    !testimonials && { href: "/dashboard/c/testimonials", text: "Replace the sample testimonials with real client quotes, then make them visible" },
    !projects && { href: "/dashboard/c/projects", text: "Add a case study or two for your best projects (optional)" },
  ].filter(Boolean) as { href: string; text: string }[];

  return (
    <>
      <PageTitle title="Welcome back 👋" sub="Here's what's happening on your site." action={<a href="/" target="_blank" className="btn-dark"><Icon name="external" size={15} /> Open website</a>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-3xl border border-line bg-white p-5 transition hover:shadow-card">
            <Icon name={c.icon} size={18} className="text-muted" />
            <p className="mt-4 text-[34px] font-medium leading-none tracking-head">{c.value}</p>
            <p className="mt-1.5 text-[14px] font-medium">{c.label}</p>
            <p className="text-[12px] text-muted">{c.sub}</p>
          </Link>
        ))}
      </div>

      {todo.length > 0 && (
        <section className="mt-6 rounded-3xl border border-line bg-white p-5">
          <h2 className="text-[16px] font-medium">To finish setting up</h2>
          <ul className="mt-3 space-y-2">
            {todo.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="flex items-center gap-3 rounded-2xl bg-wash px-4 py-3 text-[14px] hover:bg-[#ececee]">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> <span className="flex-1">{t.text}</span> <Icon name="arrow" size={15} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-line bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-medium">Latest enquiries</h2>
          <Link href="/dashboard/enquiries" className="text-[13px] text-muted hover:text-ink">See all →</Link>
        </div>
        {recent?.length ? (
          <ul className="mt-3 divide-y divide-line">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-[14px]">
                <span className="font-medium">{r.name}</span>
                <span className="truncate text-muted">{r.service ?? "—"}</span>
                <span className="shrink-0 text-[12px] text-faint">{new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[14px] text-body">No messages yet — they&apos;ll appear here when someone uses the contact form.</p>
        )}
      </section>
    </>
  );
}
