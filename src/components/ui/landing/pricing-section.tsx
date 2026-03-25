import { pricingPlans } from "./landing-data";
import { SectionHeader } from "./section-header";

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-(--pulse-border) px-6 py-20 lg:px-15 lg:py-30">
      <div className="mx-auto max-w-360">
        <SectionHeader tag="Pricing" />

        <div className="mt-16 grid gap-px border border-(--pulse-border) bg-(--pulse-border) lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`px-9 py-10 ${
                plan.featured
                  ? "-m-px border border-(--pulse-orange) bg-(--pulse-black-2)"
                  : "bg-(--pulse-black)"
              }`}
            >
              {plan.featured ? (
                <div className="mb-5 inline-block bg-(--pulse-orange) px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-(--pulse-black)">
                  Most popular
                </div>
              ) : null}
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-(--pulse-muted)">
                {plan.name}
              </div>
              <div className="text-[52px] leading-none font-extrabold tracking-[-0.04em]">
                <sup className="mr-0.5 inline-block align-top text-xl font-semibold">
                  $
                </sup>
                {plan.price}
              </div>
              <div className="mt-2 font-mono text-[13px] text-(--pulse-muted)">
                {plan.period}
              </div>

              <ul className="my-8 space-y-0">
                {plan.features.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-b border-(--pulse-border) py-2.5 text-[13px] text-(--pulse-muted)"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-(--pulse-orange)" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`block px-6 py-3.5 text-center font-mono text-xs font-medium uppercase tracking-[0.08em] transition-all ${
                  plan.featured
                    ? "border border-(--pulse-orange) bg-(--pulse-orange) text-(--pulse-black) hover:border-(--pulse-white) hover:bg-(--pulse-white)"
                    : "border border-(--pulse-border-bright) text-(--pulse-white-2) hover:border-(--pulse-orange) hover:text-(--pulse-orange)"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
