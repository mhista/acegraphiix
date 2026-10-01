import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createPlain } from "@supabase/supabase-js";
import { SUPABASE_ANON, SUPABASE_URL, hasSupabase } from "./env";

/** Session-aware client for the dashboard. RLS decides what it may touch. */
export async function sessionClient() {
  if (!hasSupabase) return null;
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* Called from a server component — middleware refreshes the cookie instead. */
        }
      },
    },
  });
}

/** Cookie-free anon client for public pages, so they can be cached. */
export function publicClient() {
  if (!hasSupabase) return null;
  return createPlain(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });
}

/** Service-role client. Only for the Drive sync cron, which has no user. */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase || !key) return null;
  return createPlain(SUPABASE_URL, key, { auth: { persistSession: false } });
}
