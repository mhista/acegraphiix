import { notFound } from "next/navigation";
import { collection } from "@/lib/cms/collections";
import { sessionClient } from "@/lib/supabase/server";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { PageTitle } from "@/components/dashboard/Shell";

export default async function CollectionPage({ params }: { params: Promise<{ key: string }> }) {
  const c = collection((await params).key);
  if (!c) notFound();
  const db = (await sessionClient())!;
  const { data, error } = await db
    .from(c.table)
    .select("*")
    .order(c.order, { ascending: c.order === "position", nullsFirst: false });

  return (
    <>
      <PageTitle title={c.title} sub={c.description} />
      {error ? (
        <p className="rounded-2xl bg-red-50 p-4 text-[14px] text-red-700">Couldn&apos;t load {c.title.toLowerCase()}: {error.message}. Has supabase/schema.sql been run?</p>
      ) : (
        <CollectionManager collectionKey={c.key} rows={data ?? []} />
      )}
    </>
  );
}
