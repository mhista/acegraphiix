import { sessionClient } from "@/lib/supabase/server";
import { Enquiries } from "@/components/dashboard/Enquiries";
import { PageTitle } from "@/components/dashboard/Shell";

export default async function EnquiriesPage() {
  const db = (await sessionClient())!;
  const { data } = await db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(500);
  return (
    <>
      <PageTitle title="Enquiries" sub="Everyone who filled in the contact form. Move each one along as the conversation goes — notes are private." />
      <Enquiries rows={data ?? []} />
    </>
  );
}
