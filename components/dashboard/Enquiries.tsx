"use client";

import { useMemo, useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { deleteEnquiry, updateEnquiry } from "@/lib/actions/admin";
import type { Enquiry } from "@/lib/content/types";
import { inputCls } from "./fields";
import { useToast } from "./Toast";

type E = Enquiry & { value?: string | null; updated_at?: string };

export const STATUS: { key: Enquiry["status"]; label: string; dot: string }[] = [
  { key: "new", label: "New", dot: "bg-blue-500" },
  { key: "contacted", label: "Contacted", dot: "bg-amber-500" },
  { key: "in_progress", label: "In progress", dot: "bg-violet-500" },
  { key: "won", label: "Won", dot: "bg-green-500" },
  { key: "lost", label: "Lost", dot: "bg-zinc-400" },
  { key: "archived", label: "Archived", dot: "bg-zinc-300" },
];

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.round(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function Card({ e, onChange, onDelete }: { e: E; onChange: (p: Partial<E>) => void; onDelete: () => void }) {
  const [notes, setNotes] = useState(e.notes ?? "");
  const [value, setValue] = useState(e.value ?? "");
  const [pending, start] = useTransition();
  const toast = useToast();
  const phone = (e.phone ?? "").replace(/\D/g, "");
  const wa = phone ? `https://wa.me/${phone.startsWith("0") ? `234${phone.slice(1)}` : phone}` : null;

  const patch = (p: { status?: string; notes?: string; value?: string }) =>
    start(async () => {
      const r = await updateEnquiry(e.id, p);
      if (!r.ok) return toast(r.error ?? "Couldn't save", "error");
      onChange(p as Partial<E>);
      if (p.status) toast(`Moved to ${STATUS.find((s) => s.key === p.status)?.label}`);
    });

  return (
    <article className="rounded-3xl border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[16px] font-medium">{e.name}</p>
          <p className="text-[13px] text-muted">
            <a href={`mailto:${e.email}`} className="hover:underline">{e.email}</a>
            {e.phone && <> · {e.phone}</>} · {ago(e.created_at)}
          </p>
        </div>
        <select
          value={e.status}
          disabled={pending}
          onChange={(ev) => patch({ status: ev.target.value })}
          className="rounded-full border border-line bg-wash px-3 py-1.5 text-[13px] font-medium outline-none"
        >
          {STATUS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      {(e.service || e.budget) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {e.service && <span className="chip text-[12px]">{e.service}</span>}
          {e.budget && <span className="chip text-[12px]">{e.budget}</span>}
        </div>
      )}
      {e.message && <p className="mt-3 whitespace-pre-line rounded-2xl bg-wash p-3.5 text-[14px] leading-[1.5] text-ink/90">{e.message}</p>}

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_160px]">
        <textarea
          className={`${inputCls} min-h-[44px] resize-y text-[13px]`}
          placeholder="Private notes — what they need, what you quoted, next step…"
          value={notes}
          onChange={(ev) => setNotes(ev.target.value)}
          onBlur={() => notes !== (e.notes ?? "") && patch({ notes })}
          rows={1}
        />
        <input
          className={`${inputCls} text-[13px]`}
          placeholder="Deal value, e.g. ₦150k"
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          onBlur={() => value !== (e.value ?? "") && patch({ value })}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={`mailto:${e.email}?subject=${encodeURIComponent(`Re: your ${e.service ? e.service.toLowerCase() : "design"} enquiry`)}&body=${encodeURIComponent(`Hi ${e.name.split(" ")[0]},\n\nThanks for reaching out!\n\n`)}`}
          onClick={() => e.status === "new" && patch({ status: "contacted" })}
          className="btn-dark py-2 text-[13px]"
        >
          <Icon name="mail" size={15} /> Reply
        </a>
        {wa && (
          <a
            href={`${wa}?text=${encodeURIComponent(`Hi ${e.name.split(" ")[0]}, thanks for your message on my website!`)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => e.status === "new" && patch({ status: "contacted" })}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-[13px] font-medium text-white"
          >
            <Icon name="whatsapp" size={15} /> WhatsApp
          </a>
        )}
        <button onClick={onDelete} className="ml-auto rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600" aria-label="Delete">
          <Icon name="trash" size={16} />
        </button>
      </div>
    </article>
  );
}

export function Enquiries({ rows: initial }: { rows: E[] }) {
  const [rows, setRows] = useState(initial);
  const [tab, setTab] = useState<string>("open");
  const [q, setQ] = useState("");
  const toast = useToast();

  const counts = useMemo(() => {
    const c: Record<string, number> = { open: 0 };
    for (const r of rows) {
      c[r.status] = (c[r.status] ?? 0) + 1;
      if (!["won", "lost", "archived"].includes(r.status)) c.open++;
    }
    return c;
  }, [rows]);

  const shown = rows.filter(
    (r) =>
      (tab === "all" || (tab === "open" ? !["won", "lost", "archived"].includes(r.status) : r.status === tab)) &&
      (!q || `${r.name} ${r.email} ${r.message} ${r.service}`.toLowerCase().includes(q.toLowerCase())),
  );

  const tabs = [{ key: "open", label: "Open" }, ...STATUS.map((s) => ({ key: s.key, label: s.label })), { key: "all", label: "All" }];

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["New", counts.new ?? 0],
          ["In conversation", (counts.contacted ?? 0) + (counts.in_progress ?? 0)],
          ["Won", counts.won ?? 0],
          ["All time", rows.length],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[12px] text-muted">{k}</p>
            <p className="text-[26px] font-medium leading-tight tracking-head">{v}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium ${tab === t.key ? "bg-ink text-white" : "bg-white text-body ring-1 ring-line"}`}
            >
              {t.label}
              {t.key !== "all" && counts[t.key] ? <span className="ml-1 opacity-60">{counts[t.key]}</span> : null}
            </button>
          ))}
        </div>
        <input className={`${inputCls} sm:ml-auto sm:w-[220px]`} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {shown.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-white p-10 text-center text-[14px] text-body" style={{ borderColor: "#d4d4d8" }}>
          {rows.length ? "Nothing here." : "No enquiries yet. Messages from the website's contact form land here."}
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((e) => (
            <Card
              key={e.id}
              e={e}
              onChange={(p) => setRows((all) => all.map((x) => (x.id === e.id ? { ...x, ...p } : x)))}
              onDelete={async () => {
                if (!confirm("Delete this enquiry for good?")) return;
                const r = await deleteEnquiry(e.id);
                if (!r.ok) return toast(r.error ?? "Couldn't delete", "error");
                setRows((all) => all.filter((x) => x.id !== e.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
