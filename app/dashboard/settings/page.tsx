import { sessionClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/lib/content/defaults";
import type { Settings } from "@/lib/content/types";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { PageTitle } from "@/components/dashboard/Shell";

export default async function SettingsPage() {
  const db = (await sessionClient())!;
  const { data } = await db.from("settings").select("data").eq("id", 1).maybeSingle();
  const s = { ...DEFAULT_SETTINGS, ...((data?.data as Partial<Settings>) ?? {}) };
  return (
    <>
      <PageTitle title="Site settings" sub="Your details, headings and images across the whole site. Changes go live when you save." />
      <SettingsForm initial={s} />
    </>
  );
}
