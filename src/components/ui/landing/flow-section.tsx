import { steps } from "./landing-data";
import { SectionHeader } from "./section-header";

export function FlowSection() {
  return (
    <section id="how" className="border-t border-(--pulse-border) px-6 py-20 lg:px-15 lg:py-30">
      <div className="mx-auto max-w-360">
        <SectionHeader tag="How it works" />

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="border border-(--pulse-border) p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center border border-(--pulse-border-bright) bg-(--pulse-black) font-mono text-xs text-(--pulse-orange)">
                {step.number}
              </div>
              <h3 className="text-[15px] font-bold tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-(--pulse-muted)">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
