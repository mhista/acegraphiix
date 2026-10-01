import { sessionClient } from "@/lib/supabase/server";
import { GalleryManager } from "@/components/dashboard/GalleryManager";
import { PageTitle } from "@/components/dashboard/Shell";

export default async function GalleryPage() {
  const db = (await sessionClient())!;

  let { data: items, error } = await db
    .from("gallery_items")
    .select("id,name,folder_name,visible,featured,synced_at,sections,section_order")
    .order("folder_name")
    .order("created_time", { ascending: false })
    .limit(5000);

  /* Migration 002 not run yet: still show the library, just without section picks. */
  const needsMigration = !!error && /sections|section_order/.test(error.message);
  if (needsMigration) {
    const r = await db
      .from("gallery_items")
      .select("id,name,folder_name,visible,featured,synced_at")
      .order("folder_name")
      .order("created_time", { ascending: false })
      .limit(5000);
    items = (r.data ?? []).map((i) => ({ ...i, sections: [], section_order: 0 }));
    error = r.error;
  }

  const { data: s } = await db.from("settings").select("data").eq("id", 1).maybeSingle();

  return (
    <>
      <PageTitle title="Drive designs" sub="Your Google Drive folder, on the website. Choose what shows, what leads, and what goes in each section." />
      {needsMigration && (
        <p className="mb-5 rounded-2xl bg-amber-50 px-4 py-3 text-[13px] leading-[1.5] text-amber-900">
          To pick designs for each home-page section, run <code>supabase/migrations/002_gallery_sections.sql</code> once in Supabase → SQL Editor, then refresh.
        </p>
      )}
      {error && !needsMigration && <p className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-[13px] text-red-800">{error.message}</p>}
      <GalleryManager
        items={items ?? []}
        folderUrl={((s?.data as { drive_folder_url?: string }) ?? {}).drive_folder_url ?? ""}
        hasKey={!!process.env.GOOGLE_API_KEY}
      />
    </>
  );
}
