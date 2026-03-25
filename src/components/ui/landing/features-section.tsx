import { features } from "./landing-data";
import { SectionHeader } from "./section-header";

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 lg:px-15 lg:py-30">
      <div className="mx-auto max-w-360">
        <SectionHeader tag="What Pulse does" />

        <div className="mt-20 grid gap-px border border-(--pulse-border) bg-(--pulse-border) md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ number, title, description, icon: Icon }) => (
            <div
              key={number}
              className="bg-(--pulse-black) px-9 py-10 transition-colors hover:bg-(--pulse-black-2)"
            >
              <div className="mb-4 font-mono text-[11px] tracking-widest text-(--pulse-border-bright)">
                {number}
              </div>
              <div className="mb-6 flex h-11 w-11 items-center justify-center border border-(--pulse-border-bright) transition-colors hover:border-(--pulse-orange)">
                <Icon className="h-5 w-5 text-(--pulse-orange)" />
              </div>
              <h3 className="text-lg font-bold tracking-[-0.02em]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-(--pulse-muted)">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
