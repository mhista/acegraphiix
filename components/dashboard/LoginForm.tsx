"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";
import { inputCls } from "./fields";

export function LoginForm() {
  const [mode, setMode] = useState<"code" | "password">("code");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const reason = params.get("error");
  const REASONS: Record<string, string> = {
    link_expired: "That link has expired or was already used. Request a new code below.",
    other_browser: "Open the email link in the same browser you requested it from — or use the 6-digit code instead.",
    no_code: "That link was incomplete. Request a new one below.",
    not_configured: "Supabase keys are missing from this deployment.",
  };
  useEffect(() => {
    if (reason && REASONS[reason]) setMsg({ tone: "error", text: REASONS[reason] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reason]);
  const go = () => {
    router.replace(next.startsWith("/dashboard") ? next : "/dashboard");
    router.refresh();
  };

  /* Default: a six-digit code by email. Nothing to remember, and the first
     sign-in creates the account — whether it can edit anything is decided by
     the admins table, not by who can receive an email. The code only appears
     if the Supabase "Magic Link" and "Confirm signup" templates print
     {{ .Token }} (see README). */
  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await browserClient().auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true, emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
    setBusy(false);
    if (error) return setMsg({ tone: "error", text: error.message });
    setStep("verify");
    setMsg({ tone: "ok", text: `We emailed a 6-digit code to ${email.trim()}.` });
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await browserClient().auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) return setMsg({ tone: "error", text: error.message });
    go();
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await browserClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error)
      return setMsg({
        tone: "error",
        text:
          error.message === "Invalid login credentials"
            ? "Wrong email or password. If you've never set a password, use \u201cEmail me a code\u201d instead."
            : error.message,
      });
    go();
  };

  const reset = async () => {
    if (!email) return setMsg({ tone: "error", text: "Type your email first." });
    setBusy(true);
    const { error } = await browserClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/login/reset` });
    setBusy(false);
    setMsg(error ? { tone: "error", text: error.message } : { tone: "ok", text: "Check your inbox for a reset link." });
  };

  const note = msg && <p className={`text-[13px] ${msg.tone === "error" ? "text-red-600" : "text-green-700"}`}>{msg.text}</p>;

  if (mode === "code" && step === "verify")
    return (
      <form onSubmit={verify} className="space-y-3">
        <input
          className={`${inputCls} tracking-[0.35em]`}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          autoFocus
        />
        {note}
        <button disabled={busy || code.length < 6} className="btn-dark h-11 w-full disabled:opacity-60">{busy ? "Checking…" : "Sign in"}</button>
        <button type="button" onClick={() => { setStep("email"); setCode(""); setMsg(null); }} className="w-full text-center text-[13px] text-muted hover:text-ink">
          Use a different email or resend
        </button>
      </form>
    );

  return (
    <form onSubmit={mode === "code" ? sendCode : signIn} className="space-y-3">
      <input className={inputCls} type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {mode === "password" && (
        <input className={inputCls} type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      )}
      {note}
      <button disabled={busy} className="btn-dark h-11 w-full disabled:opacity-60">
        {busy ? "Please wait…" : mode === "code" ? "Email me a code" : "Sign in"}
      </button>
      <div className="flex justify-between gap-3 text-[13px] text-muted">
        <button type="button" onClick={() => { setMode(mode === "code" ? "password" : "code"); setMsg(null); }} className="hover:text-ink">
          {mode === "code" ? "Use a password instead" : "Email me a code instead"}
        </button>
        {mode === "password" && (
          <button type="button" onClick={reset} className="hover:text-ink">Forgot password?</button>
        )}
      </div>
    </form>
  );
}

export function ResetForm() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setMsg("Use at least 8 characters.");
    const { error } = await browserClient().auth.updateUser({ password });
    if (error) return setMsg(error.message);
    router.replace("/dashboard");
  };
  return (
    <form onSubmit={save} className="space-y-3">
      <input className={inputCls} type="password" autoComplete="new-password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {msg && <p className="text-[13px] text-red-600">{msg}</p>}
      <button className="btn-dark h-11 w-full">Save new password</button>
    </form>
  );
}
