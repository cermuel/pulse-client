import { SectionHeader } from "./section-header";

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-(--pulse-border) px-6 py-20 lg:px-15 lg:py-30">
      <div className="mx-auto max-w-360">
        <SectionHeader
          tag="Pricing"
          title={"Free for now.\nNot forever."}
        />

        <div className="mt-16 border border-(--pulse-border) bg-(--pulse-black)">
          <div className="border-b border-(--pulse-border) px-8 py-8 lg:px-10 lg:py-10">
            <div className="inline-block bg-(--pulse-orange) px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-(--pulse-black)">
              Coming soon
            </div>
            <p className="mt-6 max-w-3xl text-[15px] leading-8 text-(--pulse-muted)">
              Pulse is fully open while we finish the billing experience. Use
              every feature, push it hard, and expect a clear heads-up before
              paid plans land.
            </p>
          </div>

          <div className="grid gap-px bg-(--pulse-border) md:grid-cols-3">
            <InfoCard
              label="Right now"
              title="Everything unlocked"
              description="Monitoring, alerts, flairs, and status pages are all available while pricing is still in the oven."
            />
            <InfoCard
              label="What changes"
              title="Paid plans are coming"
              description="We’ll introduce simple pricing once the billing flow is ready and the product earns it."
            />
            <InfoCard
              label="No surprises"
              title="You’ll get notice first"
              description="Nothing flips silently. We’ll make the switch clear before any billing starts."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-(--pulse-black) px-8 py-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-(--pulse-muted)">
        {label}
      </p>
      <p className="mt-3 text-[22px] leading-tight font-bold tracking-[-0.03em] text-(--pulse-white)">
        {title}
      </p>
      <p className="mt-3 text-[14px] leading-7 text-(--pulse-muted)">
        {description}
      </p>
    </div>
  );
}
