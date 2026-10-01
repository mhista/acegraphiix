export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
/** False until the Supabase keys are in .env.local — the site then runs on defaults. */
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON);
