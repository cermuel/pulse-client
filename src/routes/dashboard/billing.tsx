import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "#/components/layout/app-layout";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
              Billing
            </p>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a7a7a]">
              Pricing is still cooking. For now, every feature stays unlocked
              while we shape the paid plans.
            </p>
          </div>

          <div className="border border-[#1f1f1f] bg-[#111] px-6 py-8 sm:px-8 sm:py-10">
            <div className="inline-block bg-[#fb923c] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#0e0e0e]">
              Coming soon
            </div>

            <h1 className="mt-6 text-[36px] font-extrabold tracking-[-0.04em] text-[#f5f5f5] sm:text-[48px]">
              Free for now. Not forever.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#8a8a8a] sm:text-[15px]">
              We&apos;re keeping Pulse wide open while we finish the billing
              experience. Enjoy the free ride, kick the tires, and we&apos;ll let
              you know before pricing goes live.
            </p>

            <div className="mt-8 grid gap-px border border-[#1f1f1f] bg-[#1f1f1f] md:grid-cols-3">
              <FeatureCard
                label="Today"
                value="Everything unlocked"
                description="Build, monitor, and explore the full product while billing is on the bench."
              />
              <FeatureCard
                label="Later"
                value="Paid plans arrive"
                description="Simple pricing is on the way once the experience feels ready to charge for."
              />
              <FeatureCard
                label="Heads up"
                value="No surprise switch"
                description="You’ll get a clear notice before anything changes."
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function FeatureCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-[#111] px-5 py-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#666]">
        {label}
      </p>
      <p className="mt-3 text-base font-semibold text-[#f5f5f5]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#777]">{description}</p>
    </div>
  );
}
