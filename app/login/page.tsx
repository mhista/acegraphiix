import { Suspense } from "react";
import { LoginForm } from "@/components/dashboard/LoginForm";
import { hasSupabase } from "@/lib/supabase/env";

export default function Login() {
  return (
    <>
      <h1 className="mt-5 text-[24px] font-medium tracking-head">Website manager</h1>
      <p className="mb-6 mt-1 text-[14px] text-body">Sign in to update your site.</p>
      {hasSupabase ? (
        <Suspense>
          <LoginForm />
        </Suspense>
      ) : (
        <p className="rounded-xl bg-amber-50 p-3 text-[13px] text-amber-900">Supabase isn&apos;t connected yet. Add the keys to .env.local — see the README.</p>
      )}
    </>
  );
}
