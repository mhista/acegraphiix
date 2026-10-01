import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncDrive } from "@/lib/drive";
import { serviceClient } from "@/lib/supabase/server";

/* Daily re-sync (vercel.json → crons), so new designs dropped into the Drive
   folder show up without anyone opening the dashboard. Vercel sends
   "Authorization: Bearer <CRON_SECRET>". */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  try {
    const res = await syncDrive(db);
    revalidatePath("/", "layout");
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
