/** A block of the main column, followed by the thin grey band that separates sections. */
export function Section({
  id,
  children,
  className = "",
  band = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  band?: boolean;
}) {
  return (
    <>
      <section id={id} className={`scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20 ${className}`}>
        {children}
      </section>
      {band && <div className="band" />}
    </>
  );
}
