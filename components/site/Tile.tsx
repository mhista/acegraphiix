/* A design image, or — before any work is connected — a quiet gradient
   placeholder so the layout still reads. Placeholders only ever appear in
   demo mode or in an empty dashboard, never mixed in with real work. */

const SWATCHES = [
  ["#fb923c", "#7c2d12"],
  ["#3f3f46", "#09090b"],
  ["#fda4af", "#881337"],
  ["#7dd3fc", "#0c4a6e"],
  ["#e7e5e4", "#a8a29e"],
  ["#bef264", "#365314"],
  ["#fcd34d", "#92400e"],
  ["#c4b5fd", "#3b0764"],
];

export function Tile({
  src,
  alt = "",
  index = 0,
  label,
  className = "",
  sizes,
}: {
  src?: string | null;
  alt?: string;
  index?: number;
  label?: string;
  className?: string;
  sizes?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} sizes={sizes} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }
  const [a, b] = SWATCHES[index % SWATCHES.length];
  return (
    <div
      className={`relative flex h-full w-full items-end overflow-hidden p-4 ${className}`}
      style={{ background: `radial-gradient(120% 90% at 20% 10%, ${a} 0%, ${b} 70%)` }}
      aria-hidden={!label}
    >
      <div
        className="absolute inset-0 opacity-[.18] mix-blend-overlay"
        style={{ backgroundImage: "radial-gradient(rgb(255 255 255) 1px, transparent 1px)", backgroundSize: "10px 10px" }}
      />
      {label && <span className="relative rounded-full bg-black/35 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">{label}</span>}
    </div>
  );
}
