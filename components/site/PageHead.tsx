import { Label, Reveal } from "./ui";

export function PageHead({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <>
      <section className="px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
        <Reveal>
          <Label>{label}</Label>
          <h1 className="h-display mt-5 max-w-[16ch]">{title}</h1>
          {intro && <p className="mt-5 max-w-[520px] text-[16px] leading-[1.5] text-body">{intro}</p>}
        </Reveal>
      </section>
      <div className="band" />
    </>
  );
}
