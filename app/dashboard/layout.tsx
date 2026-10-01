import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/server";
import { COLLECTIONS } from "@/lib/cms/collections";
import { Shell, type ShellNav } from "@/components/dashboard/Shell";
import { ToastProvider } from "@/components/dashboard/Toast";

export const metadata = { title: "Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const db = await sessionClient();
  if (!db) redirect("/login");
  const { data: u } = await db.auth.getUser();
  if (!u.user) redirect("/login");
  const { data: isAdmin } = await db.rpc("is_admin");

  if (!isAdmin) {
    return (
      <div className="page-texture flex min-h-dvh items-center justify-center p-4">
        <div className="max-w-[440px] rounded-[28px] bg-white p-7 shadow-card">
          <h1 className="text-[22px] font-medium">Not an admin yet</h1>
          <p className="mt-2 text-[14px] leading-[1.5] text-body">
            You&apos;re signed in as <b>{u.user.email}</b>, but that email isn&apos;t in the <code>admins</code> table. In Supabase → SQL editor run:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-wash p-3 text-[12px]">{`insert into admins (email) values ('${u.user.email}');`}</pre>
        </div>
      </div>
    );
  }

  const { count } = await db.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new");

  const nav: ShellNav[][] = [
    [
      { href: "/dashboard", label: "Overview", icon: "home" },
      { href: "/dashboard/enquiries", label: "Enquiries", icon: "inbox", badge: count ?? 0 },
    ],
    [
      { href: "/dashboard/gallery", label: "Drive designs", icon: "image" },
      ...COLLECTIONS.map((c) => ({ href: `/dashboard/c/${c.key}`, label: c.title, icon: c.icon })),
    ],
    [{ href: "/dashboard/settings", label: "Site settings", icon: "settings" }],
  ];

  return (
    <ToastProvider>
      <Shell nav={nav} email={u.user.email ?? ""}>
        {children}
      </Shell>
    </ToastProvider>
  );
}
