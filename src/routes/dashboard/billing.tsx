import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "#/components/layout/app-layout";
import { useUser } from "#/context/useUser";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  const { data: user } = useUser();
  const isFreePlan = user?.plan === "free";
  const pulseLimit = isFreePlan ? 5 : "Unlimited";
  const intervalLimit = isFreePlan ? "5 minutes minimum" : "1 minute minimum";

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
            Billing
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a7a7a]">
            Review your current plan, workspace limits, and what changes when
            you move up to Pro.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
                    Current plan
                  </p>
                  <p className="mt-3 text-[32px] font-extrabold tracking-[-0.04em] text-[#f5f5f5]">
                    {user?.plan?.toUpperCase() || "FREE"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#666]">
                    {isFreePlan
                      ? "You are currently on the free plan."
                      : "You are currently on a paid workspace plan."}
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center border border-[#1f1f1f] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#555] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
                >
                  Upgrade plan
                </button>
              </div>
            </div>

            <div className="mt-8 border border-[#1f1f1f] bg-[#111]">
              <div className="border-b border-[#1f1f1f] px-4 py-4 sm:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                  Limits
                </p>
              </div>

              <div className="divide-y divide-[#1a1a1a]">
                <LimitRow
                  label="Pulse limit"
                  value={String(pulseLimit)}
                  description="How many monitors you can create in this workspace."
                />
                <LimitRow
                  label="Minimum interval"
                  value={intervalLimit}
                  description="Fastest allowed check frequency on your current plan."
                />
                <LimitRow
                  label="Alerts"
                  value={isFreePlan ? "Email" : "Email + integrations"}
                  description="Available incident notification channels."
                />
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
              <p className="text-sm font-semibold text-[#f5f5f5]">
                Workspace summary
              </p>
              <div className="mt-5 space-y-4">
                <SummaryItem
                  label="Provider"
                  value={user?.provider || "github"}
                />
                <SummaryItem label="Email" value={user?.email || "—"} />
                <SummaryItem
                  label="Member since"
                  value={formatDate(user?.createdAt)}
                />
              </div>
            </div>

            <div className="mt-4 border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
              <p className="text-sm font-semibold text-[#f5f5f5]">
                Need more capacity?
              </p>
              <p className="mt-3 text-sm leading-6 text-[#777]">
                Upgrade to unlock shorter intervals, more pulses, and a bigger
                monitoring surface for your team.
              </p>
              <button
                type="button"
                className="mt-5 inline-flex cursor-pointer items-center justify-center bg-[#fb923c] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5]"
              >
                Explore Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function LimitRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#f5f5f5]">{label}</p>
        <p className="mt-1 text-sm text-[#666]">{description}</p>
      </div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-[#fb923c]">
        {value}
      </p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm text-[#f5f5f5]">{value}</p>
    </div>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
