"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Tone = "ok" | "error";
const Ctx = createContext<(msg: string, tone?: Tone) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string; tone: Tone }[]>([]);
  const push = useCallback((msg: string, tone: Tone = "ok") => {
    const id = Date.now() + Math.random();
    setItems((v) => [...v, { id, msg, tone }]);
    setTimeout(() => setItems((v) => v.filter((t) => t.id !== id)), tone === "error" ? 7000 : 3000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`animate-rise rounded-2xl px-4 py-3 text-[14px] font-medium shadow-card ${t.tone === "error" ? "bg-red-600 text-white" : "bg-ink text-white"}`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
