"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Field } from "@/lib/cms/collections";
import { browserClient } from "@/lib/supabase/browser";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] outline-none transition placeholder:text-faint focus:border-ink/40 focus:ring-4 focus:ring-ink/5";

/* Uploads go straight from the browser to Supabase Storage (bucket "media"),
   so large images never pass through the server. Images wider than 2400px are
   scaled down first — phone photos and exports are often 6000px+. */
async function shrink(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp || bmp.width <= 2400) return file;
  const scale = 2400 / bmp.width;
  const canvas = document.createElement("canvas");
  canvas.width = 2400;
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.86));
}

export async function uploadImage(file: File): Promise<string> {
  const db = browserClient();
  const blob = await shrink(file);
  const ext = blob === file ? (file.name.split(".").pop() || "jpg").toLowerCase() : "jpg";
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from("media").upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return db.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      onChange(await uploadImage(f));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <div
        className="group relative flex min-h-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed bg-wash"
        style={{ borderColor: "#d4d4d8" }}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files[0]);
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="max-h-[220px] w-full object-contain" />
        ) : (
          <div className="text-center text-[13px] text-muted">
            <Icon name="image" size={22} className="mx-auto mb-1.5" />
            {busy ? "Uploading…" : "Click or drop an image"}
          </div>
        )}
        {value && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-lg bg-white px-3 py-1.5 text-[13px] font-medium">{busy ? "Uploading…" : "Replace"}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="rounded-lg bg-white px-3 py-1.5 text-[13px] font-medium text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      <input className={`${inputCls} mt-2 text-[12px]`} value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image link" />
      {err && <p className="mt-1 text-[12px] text-red-600">{err}</p>}
    </div>
  );
}

function ImagesInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setErr("");
    setBusy(files.length);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      try {
        urls.push(await uploadImage(f));
      } catch (e) {
        setErr((e as Error).message);
      }
      setBusy((n) => n - 1);
    }
    onChange([...value, ...urls]);
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl bg-wash">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} className="rounded-md bg-white/90 p-1" aria-label="Move left">
                <Icon name="left" size={14} />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded-md bg-white/90 p-1 text-red-600" aria-label="Remove">
                <Icon name="trash" size={14} />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="rounded-md bg-white/90 p-1" aria-label="Move right">
                <Icon name="right" size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed text-[12px] text-muted hover:bg-wash"
          style={{ borderColor: "#d4d4d8" }}
        >
          <Icon name="plus" size={18} />
          {busy ? `Uploading ${busy}…` : "Add images"}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
      {err && <p className="mt-1 text-[12px] text-red-600">{err}</p>}
    </div>
  );
}

function IconInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${value === o ? "border-ink bg-ink text-white" : "border-line bg-white hover:bg-wash"}`}
          title={o}
        >
          <Icon name={o} size={17} />
        </button>
      ))}
      <input className={`${inputCls} w-[90px]`} value={value} onChange={(e) => onChange(e.target.value)} placeholder="custom" />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function FieldInput({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) {
  switch (f.type) {
    case "textarea":
      return <textarea className={`${inputCls} min-h-[96px] resize-y`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
    case "markdown":
      return (
        <textarea
          className={`${inputCls} min-h-[240px] resize-y font-mono text-[13px] leading-[1.6]`}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"## A heading\n\nA paragraph of text.\n\n- A bullet point\n- Another one"}
        />
      );
    case "number":
      return <input type="number" className={inputCls} value={value ?? 0} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />;
    case "boolean":
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative h-7 w-12 rounded-full transition ${value ? "bg-ink" : "bg-[#d4d4d8]"}`}
          role="switch"
          aria-checked={!!value}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-6" : "left-1"}`} />
        </button>
      );
    case "image":
      return <ImageInput value={value ?? ""} onChange={onChange} />;
    case "images":
      return <ImagesInput value={Array.isArray(value) ? value : []} onChange={onChange} />;
    case "list":
      return (
        <textarea
          className={`${inputCls} min-h-[110px] resize-y`}
          value={Array.isArray(value) ? value.join("\n") : value ?? ""}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder={f.placeholder ?? "One per line"}
        />
      );
    case "select":
      return (
        <div>
          <input className={inputCls} list={`opts-${f.key}`} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          <datalist id={`opts-${f.key}`}>
            {f.options?.map((o) => <option key={o} value={o} />)}
          </datalist>
        </div>
      );
    case "icon":
      return <IconInput value={value ?? ""} onChange={onChange} options={f.options ?? []} />;
    case "date":
      return <input type="date" className={inputCls} value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)} />;
    default:
      return <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />;
  }
}

export function FieldRow({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) {
  return (
    <div className={`block ${f.wide || f.type === "image" || f.type === "images" || f.type === "markdown" ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-[13px] font-medium">
        {f.label}
        {f.required && <span className="text-red-500"> *</span>}
      </span>
      <FieldInput f={f} value={value} onChange={onChange} />
      {f.help && <span className="mt-1 block text-[12px] leading-[1.4] text-muted">{f.help}</span>}
    </div>
  );
}

/** Lists are edited as lines; trim and drop blanks before saving. */
export function tidy(fields: Field[], data: Record<string, any>) {
  const out = { ...data };
  for (const f of fields) if (f.type === "list" && Array.isArray(out[f.key])) out[f.key] = out[f.key].map((s: string) => s.trim()).filter(Boolean);
  return out;
}
