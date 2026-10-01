"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SETTINGS_GROUPS } from "@/lib/cms/collections";
import { saveSettings } from "@/lib/actions/admin";
import type { Settings, Social } from "@/lib/content/types";
import { FieldRow } from "./fields";
import { useToast } from "./Toast";

/* Social links are stored as [{label, url}] but edited as "instagram | https://…" lines. */
const toLines = (s: Social[]) => s.map((x) => `${x.label} | ${x.url}`);
const fromLines = (lines: string[]): Social[] =>
  lines
    .map((l) => l.split("|").map((p) => p.trim()))
    .filter(([label]) => label)
    .map(([label, url = ""]) => ({ label: label.toLowerCase(), url }));

export function SettingsForm({ initial }: { initial: Settings }) {
  const [data, setData] = useState<Record<string, unknown>>({ ...initial, socials: toLines(initial.socials) });
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const set = (k: string, v: unknown) => {
    setData((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };

  const save = () =>
    start(async () => {
      const r = await saveSettings({ ...data, socials: fromLines((data.socials as string[]) ?? []) });
      if (!r.ok) return toast(r.error ?? "Couldn't save", "error");
      toast("Saved — the website is updated");
      setDirty(false);
      router.refresh();
    });

  return (
    <div className="space-y-5 pb-24">
      {SETTINGS_GROUPS.map((g) => (
        <section key={g.title} className="rounded-3xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[18px] font-medium tracking-snug">{g.title}</h2>
          {g.help && <p className="mt-0.5 text-[13px] text-muted">{g.help}</p>}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {g.fields.map((f) => (
              <FieldRow key={f.key} f={f} value={data[f.key]} onChange={(v) => set(f.key, v)} />
            ))}
          </div>
        </section>
      ))}
      <div className={`fixed bottom-4 left-1/2 z-40 -translate-x-1/2 transition lg:left-[calc(50%+124px)] ${dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
        <div className="flex items-center gap-3 rounded-2xl bg-ink py-2 pl-4 pr-2 text-white shadow-card">
          <span className="text-[14px]">Unsaved changes</span>
          <button onClick={save} disabled={pending} className="rounded-xl bg-white px-4 py-2 text-[14px] font-medium text-ink disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
