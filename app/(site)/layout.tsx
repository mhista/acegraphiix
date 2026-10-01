import { Suspense } from "react";
import { getContent } from "@/lib/content/queries";
import { Sidebar, type NavItem } from "@/components/site/Sidebar";
import { TopBar } from "@/components/site/TopBar";
import { ContactFooter } from "@/components/site/ContactFooter";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = await getContent();
  const nav: NavItem[] = [
    { href: "/about", label: "About", icon: "user" },
    { href: "/services", label: "Services", icon: "bag" },
    { href: "/works", label: "Works", icon: "brush" },
    ...(c.gallery.length || c.demo ? [{ href: "/archive", label: "Archive", icon: "image" }] : []),
    ...(c.posts.length ? [{ href: "/blog", label: "Blog", icon: "book" }] : []),
  ];

  return (
    <div className="page-texture min-h-dvh">
      <div className="mx-auto flex max-w-[1320px] flex-col lg:flex-row">
        <Sidebar s={c.settings} nav={nav} />
        <main className="min-w-0 flex-1 border-x border-line bg-white lg:mr-4">
          <TopBar s={c.settings} />
          {children}
          <Suspense>
            <ContactFooter s={c.settings} services={c.services.map((x) => x.title)} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
