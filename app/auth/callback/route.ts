import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

/* Where the link in a sign-in / confirm-signup email lands.
   Handles both shapes Supabase sends:
   - ?code=…                    (PKCE — works when opened in the same browser that asked)
   - ?token_hash=…&type=email   (works in any browser; use this in the email templates) */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/dashboard";
  const safeNext = next.startsWith("/") ? next : "/dashboard";
  const fail = (reason: string) => NextResponse.redirect(new URL(`/login?error=${reason}`, url.origin));

  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!sbUrl || !anon) return fail("not_configured");

  const store = await cookies();
  const db = createServerClient(sbUrl, anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) =>
        list.forEach(({ name, value, options }) => store.set(name, value, options)),
    },
  });

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = (url.searchParams.get("type") || "email") as EmailOtpType;

  if (tokenHash) {
    const { error } = await db.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return fail("link_expired");
  } else if (code) {
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (error) return fail("other_browser");
  } else {
    return fail("no_code");
  }
  return NextResponse.redirect(new URL(safeNext, url.origin));
}
