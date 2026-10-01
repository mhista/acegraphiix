"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Icon } from "@/components/Icon";
import { collection as getCollection } from "@/lib/cms/collections";
import { deleteRow, reorder, saveRow, togglePublished } from "@/lib/actions/admin";
import { FieldRow, tidy } from "./fields";
import { useToast } from "./Toast";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any> & { id: string };

function blank(fields: ReturnType<typeof getCollection>) {
  const out: Record<string, any> = {};
  for (const f of fields!.fields) {
    out[f.key] = f.type === "boolean" ? f.key === "published" || f.key === "visible" : f.type === "list" || f.type === "images" ? [] : f.type === "number" ? (f.key === "rating" ? 5 : 0) : "";
  }
  return out;
}

export function CollectionManager({ collectionKey, rows: initial }: { collectionKey: string; rows: Row[] }) {
  /* The schema is looked up here rather than passed in, so no functions cross the server/client boundary. */
  const c = getCollection(collectionKey)!;
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => setRows(initial), [initial]);
  useEffect(() => {
    if (editing === "new") setForm(blank(c));
    else if (editing) setForm({ ...blank(c), ...editing });
  }, [editing, c]);
  useEffect(() => {
    document.body.style.overflow = editing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editing]);

  const save = () =>
    start(async () => {
      const id = editing === "new" ? null : (editing as Row).id;
      const r = await saveRow(c.key, id, tidy(c.fields, form));
      if (!r.ok) return toast(r.error ?? "Couldn't save", "error");
      toast("Saved — the website is updated");
      setEditing(null);
      router.refresh();
    });

  const remove = (row: Row) => {
    if (!confirm(`Delete this ${c.singular}? This can't be undone.`)) return;
    start(async () => {
      const r = await deleteRow(c.key, row.id);
      if (!r.ok) return toast(r.error ?? "Couldn't delete", "error");
      setRows((v) => v.filter((x) => x.id !== row.id));
      setEditing(null);
      toast("Deleted");
    });
  };

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    start(async () => {
      const r = await reorder(c.key, next.map((x) => x.id));
      if (!r.ok) toast(r.error ?? "Couldn't reorder", "error");
    });
  };

  const flip = (row: Row) => {
    const field = c.publishedField!;
    const v = !row[field];
    setRows((all) => all.map((x) => (x.id === row.id ? { ...x, [field]: v } : x)));
    start(async () => {
      const r = await togglePublished(c.key, row.id, v);
      if (!r.ok) toast(r.error ?? "Couldn't update", "error");
      else toast(v ? "Now visible on the site" : "Hidden from the site");
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing("new")} className="btn-dark">
          <Icon name="plus" size={16} /> Add {c.singular}
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-white p-10 text-center" style={{ borderColor: "#d4d4d8" }}>
          <p className="text-[16px] font-medium">No {c.title.toLowerCase()} yet</p>
          <p className="mt-1 text-[14px] text-body">Add the first one — it appears on the site as soon as you save.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
          {rows.map((row, i) => {
            const img = c.list.image ? row[c.list.image] : null;
            const pub = c.publishedField ? row[c.publishedField] : true;
            return (
              <li key={row.id} className="flex items-center gap-3 px-3 py-3 sm:px-4">
                {c.order === "position" && (
                  <div className="flex flex-col">
                    <button disabled={i === 0 || pending} onClick={() => move(i, -1)} className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-25" aria-label="Move up">
                      <Icon name="up" size={16} />
                    </button>
                    <button disabled={i === rows.length - 1 || pending} onClick={() => move(i, 1)} className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-25" aria-label="Move down">
                      <Icon name="down" size={16} />
                    </button>
                  </div>
                )}
                {c.list.image && (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-wash">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                )}
                <button onClick={() => setEditing(row)} className="min-w-0 flex-1 text-left">
                  <p className={`truncate text-[15px] font-medium ${pub ? "" : "text-muted"}`}>{row[c.list.title] || "Untitled"}</p>
                  {c.list.sub && <p className="truncate text-[13px] text-muted">{row[c.list.sub]}</p>}
                </button>
                {c.publishedField && (
                  <button
                    onClick={() => flip(row)}
                    className={`hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium sm:flex ${pub ? "bg-green-50 text-green-700" : "bg-wash text-muted"}`}
                  >
                    <Icon name={pub ? "eye" : "eyeOff"} size={13} /> {pub ? "Visible" : "Hidden"}
                  </button>
                )}
                <button onClick={() => setEditing(row)} className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium hover:bg-wash">
                  Edit
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Slide-over editor */}
      <div className={`fixed inset-0 z-50 bg-black/30 transition ${editing ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => !pending && setEditing(null)} />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[640px] flex-col bg-page shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          editing ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!editing}
      >
        {editing && (
          <>
            <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <p className="text-[17px] font-medium">{editing === "new" ? `New ${c.singular}` : `Edit ${c.singular}`}</p>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1.5 hover:bg-wash" aria-label="Close">
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {c.fields.map((f) => (
                  <FieldRow key={f.key} f={f} value={form[f.key]} onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-5 py-3.5">
              {editing !== "new" ? (
                <button onClick={() => remove(editing as Row)} disabled={pending} className="rounded-xl px-3 py-2 text-[14px] font-medium text-red-600 hover:bg-red-50">
                  Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button onClick={() => setEditing(null)} className="rounded-xl px-4 py-2.5 text-[14px] font-medium hover:bg-wash">
                  Cancel
                </button>
                <button onClick={save} disabled={pending} className="btn-dark disabled:opacity-60">
                  {pending ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
