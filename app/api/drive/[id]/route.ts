import { NextResponse } from "next/server";
import { fetchDriveImage } from "@/lib/drive";
import { publicClient } from "@/lib/supabase/server";

/* Serves one Drive design at a requested width. Only ids that are in the
   gallery and visible are served — this is not an open proxy for any Drive
   file. Responses are cached by the CDN for a year, so Drive is asked once
   per image per size. */

const SIZES = [400, 600, 900, 1000, 1200, 1600, 2000];

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[\w-]{10,100}$/.test(id)) return new NextResponse("Bad id", { status: 400 });

  const asked = Number(new URL(req.url).searchParams.get("w")) || 1200;
  const width = SIZES.find((s) => s >= asked) ?? 2000;

  const db = publicClient();
  if (db) {
    const { data } = await db.from("gallery_items").select("id").eq("id", id).maybeSingle();
    if (!data) return new NextResponse("Not found", { status: 404 });
  }

  try {
    const upstream = await fetchDriveImage(id, width);
    if (!upstream.ok || !upstream.body) return new NextResponse("Unavailable", { status: 502 });
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
      },
    });
  } catch (e) {
    console.error("[drive image]", (e as Error).message);
    return new NextResponse("Unavailable", { status: 502 });
  }
}
