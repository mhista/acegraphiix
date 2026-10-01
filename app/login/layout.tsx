export const metadata = { title: "Sign in", robots: { index: false } };

export default function L({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-texture flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-[380px] rounded-[32px] bg-white p-7 shadow-card">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-[18px] font-bold text-white">A</span>
        {children}
      </div>
    </div>
  );
}
