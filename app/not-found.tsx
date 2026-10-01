import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-[80px] font-medium leading-none tracking-display">404</p>
      <p className="text-body">This page doesn&apos;t exist — or it moved.</p>
      <Link href="/" className="btn-dark">Back home</Link>
    </div>
  );
}
