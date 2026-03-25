import { marqueeItems } from "./landing-data";

export function MarqueeSection() {
  return (
    <section className="overflow-hidden border-y border-(--pulse-border) py-5">
      <div className="flex w-max gap-16 motion-safe:animate-[marquee_20s_linear_infinite]">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-5 whitespace-nowrap font-mono text-xs uppercase tracking-[0.15em] text-(--pulse-muted)"
          >
            <span>{item}</span>
            <span className="h-1 w-1 rounded-full bg-(--pulse-orange)" />
          </div>
        ))}
      </div>
    </section>
  );
}
