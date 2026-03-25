import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "#/context/useUser";
import api from "../../lib/api";
import { AppLayout } from "#/components/layout/app-layout";
import type { Flair, Pulse } from "#/types/routes/dashboard";
import DashboardLoading from "#/components/ui/dashboard/dashboard-loading";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: user } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["pulses", "dashboard", { page: 1, per_page: 3 }],
    queryFn: async () => {
      const res = await api.get("/pulse", {
        params: { page: 1, per_page: 3 },
      });
      return res.data;
    },
  });
  const { data: flairsData, isLoading: flairsLoading } = useQuery({
    queryKey: ["flairs", "dashboard"],
    queryFn: async () => {
      const res = await api.get("/flair");
      return res.data;
    },
  });

  const pulses: Pulse[] = data?.pulses ?? [];
  const total = data?.total ?? 0;
  const flairs: Flair[] = flairsData?.flairs ?? [];
  const openFlairs = flairs.filter((flair) => !flair.isResolved);
  const pulseLimit = user?.plan === "free" ? 5 : null;
  const usagePercent = pulseLimit
    ? Math.min((total / pulseLimit) * 100, 100)
    : 0;

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
              Overview
            </p>
            <p className="mt-2 text-sm text-[#666]">
              Welcome back, here&apos;s what&apos;s happening.
            </p>
          </div>

          <Link
            to="/dashboard/pulses/new"
            className="inline-flex w-full items-center justify-center gap-2 bg-[#fb923c] px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5] sm:w-auto"
          >
            <span>+</span>
            <span>New pulse</span>
          </Link>
        </div>

        {isLoading || flairsLoading ? (
          <DashboardLoading />
        ) : (
          <>
            <div className="grid gap-5 xl:grid-cols-4">
              <div className="xl:col-span-3">
                <div className="mb-5 grid gap-4 md:grid-cols-2">
                  <OverviewCard
                    title="Total pulses"
                    value={total}
                    description="All monitors in your workspace."
                  />
                  <OverviewCard
                    title="Open flairs"
                    value={openFlairs.length}
                    description={
                      openFlairs.length > 0
                        ? "Incidents that still need attention."
                        : "No active incidents right now."
                    }
                  />
                </div>

                <div className="mb-5 border border-[#1f1f1f]">
                  <div className="flex items-center justify-between border-b border-[#1f1f1f] px-6 py-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                      Latest pulses
                    </p>
                    <Link
                      to="/dashboard/pulses"
                      className="font-mono text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:text-[#fb923c]"
                    >
                      View all
                    </Link>
                  </div>

                  {pulses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                      <p className="font-mono text-xs uppercase tracking-widest text-[#333]">
                        No pulses yet
                      </p>
                      <Link
                        to="/dashboard/pulses/new"
                        className="border border-[#1f1f1f] px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
                      >
                        Add your first pulse
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#1f1f1f]">
                              {[
                                "Name",
                                "URL",
                                "Method",
                                "Interval",
                                "Status",
                                "",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-6 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pulses.map((pulse) => (
                              <tr
                                key={pulse.id}
                                className="border-b border-[#1a1a1a] transition-colors hover:bg-[#131313]"
                              >
                                <td className="px-6 py-4 text-[13px] font-medium">
                                  {pulse.name ?? "—"}
                                </td>
                                <td className="px-6 py-4 font-mono text-[11px] text-[#666]">
                                  {pulse.url}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="border border-[#1f1f1f] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#555]">
                                    {pulse.method}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-[11px] text-[#555]">
                                  {pulse.interval}s
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${
                                      pulse.isActive
                                        ? "text-green-500"
                                        : "text-[#444]"
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        pulse.isActive
                                          ? "bg-green-500 animate-pulse"
                                          : "bg-[#333]"
                                      }`}
                                    />
                                    {pulse.isActive ? "Active" : "Paused"}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <Link
                                    to="/dashboard/$id"
                                    params={{ id: pulse.id }}
                                    className="font-mono text-[10px] uppercase tracking-widest text-[#333] transition-colors hover:text-[#fb923c]"
                                  >
                                    View →
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="divide-y divide-[#1a1a1a] lg:hidden">
                        {pulses.map((pulse) => (
                          <div key={pulse.id} className="space-y-4 px-4 py-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-medium">
                                  {pulse.name ?? "—"}
                                </p>
                                <p className="mt-1 break-all font-mono text-[11px] text-[#666]">
                                  {pulse.url}
                                </p>
                              </div>
                              <Link
                                to="/dashboard/$id"
                                params={{ id: pulse.id }}
                                className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#333] transition-colors hover:text-[#fb923c]"
                              >
                                View →
                              </Link>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="border border-[#1f1f1f] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#555]">
                                {pulse.method}
                              </span>
                              <span className="border border-[#1f1f1f] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#555]">
                                {pulse.interval}s
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 border border-[#1f1f1f] px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${
                                  pulse.isActive
                                    ? "text-green-500"
                                    : "text-[#444]"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    pulse.isActive
                                      ? "bg-green-500 animate-pulse"
                                      : "bg-[#333]"
                                  }`}
                                />
                                {pulse.isActive ? "Active" : "Paused"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="border border-[#1f1f1f]">
                  <div className="flex items-center justify-between border-b border-[#1f1f1f] px-6 py-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                      Flairs
                    </p>
                    <Link
                      to="/dashboard/flairs"
                      className="font-mono text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:text-[#fb923c]"
                    >
                      View all
                    </Link>
                  </div>

                  {flairs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                      <p className="font-mono text-xs uppercase tracking-widest text-[#333]">
                        No flairs yet
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#1f1f1f]">
                              {[
                                "Cause",
                                "Status",
                                "Started / Resolved",
                                "",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-6 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {flairs.slice(0, 5).map((flair) => (
                              <tr
                                key={flair.id}
                                className="border-b border-[#1a1a1a] transition-colors hover:bg-[#131313]"
                              >
                                <td className="px-6 py-4 text-[13px] font-medium text-[#f5f5f5]">
                                  {flair.cause || "Service unreachable"}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${
                                      flair.isResolved
                                        ? "text-green-500"
                                        : "text-red-400"
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        flair.isResolved
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    />
                                    {flair.isResolved ? "Resolved" : "Open"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-[11px] text-[#666]">
                                  Started {formatDate(flair.startedAt)}
                                  {flair.resolvedAt
                                    ? ` · Resolved ${formatDate(flair.resolvedAt)}`
                                    : ""}
                                </td>
                                <td className="px-6 py-4">
                                  <Link
                                    to="/dashboard/flairs/$id"
                                    params={{ id: flair.id }}
                                    className="font-mono text-[10px] uppercase tracking-widest text-[#333] transition-colors hover:text-[#fb923c]"
                                  >
                                    View →
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="divide-y divide-[#1a1a1a] lg:hidden">
                        {flairs.slice(0, 5).map((flair) => (
                          <div key={flair.id} className="space-y-3 px-4 py-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-[#f5f5f5]">
                                  {flair.cause || "Service unreachable"}
                                </p>
                                <p className="mt-2 font-mono text-[10px] text-[#666]">
                                  Started {formatDate(flair.startedAt)}
                                  {flair.resolvedAt
                                    ? ` · Resolved ${formatDate(flair.resolvedAt)}`
                                    : ""}
                                </p>
                              </div>
                              <Link
                                to="/dashboard/flairs/$id"
                                params={{ id: flair.id }}
                                className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#333] transition-colors hover:text-[#fb923c]"
                              >
                                View →
                              </Link>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${
                                flair.isResolved
                                  ? "text-green-500"
                                  : "text-red-400"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  flair.isResolved
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {flair.isResolved ? "Resolved" : "Open"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="xl:col-span-1">
                <div className="grid gap-4">
                  <div className="border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#f5f5f5]">
                          Pulse Usage
                        </p>
                        <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#f5f5f5]">
                          {pulseLimit ? `${total} / ${pulseLimit}` : `${total}`}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#555]">
                        {pulseLimit ? "Pulses" : "Unlimited"}
                      </span>
                    </div>
                    <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#191919]">
                      <div
                        className="h-full bg-[#fb923c] transition-[width]"
                        style={{ width: `${pulseLimit ? usagePercent : 12}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#555]">
                      <span>
                        {pulseLimit
                          ? `${usagePercent.toFixed(1)}% used`
                          : "Pro plan"}
                      </span>
                    </div>
                  </div>

                  <div className="border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
                    <p className="text-sm font-semibold text-[#f5f5f5]">
                      Active Flairs
                    </p>
                    {openFlairs.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-[#777]">No active flairs</p>
                        <Link
                          to="/dashboard/flairs"
                          className="mt-3 inline-flex font-mono text-[10px] uppercase tracking-widest text-[#fb923c] transition-colors hover:text-[#f5f5f5]"
                        >
                          Review incident history
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {openFlairs.slice(0, 2).map((flair) => (
                          <Link
                            key={flair.id}
                            to="/dashboard/flairs/$id"
                            params={{ id: flair.id }}
                            className="block border border-red-500/10 bg-red-500/5 px-3 py-3 transition-colors hover:border-red-500/20"
                          >
                            <p className="text-sm text-[#f5f5f5]">
                              {flair.cause || "Service unreachable"}
                            </p>
                            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-red-400">
                              Open incident
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function OverviewCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        {title}
      </p>
      <p className="mt-3 text-[32px] font-extrabold tracking-[-0.04em] text-[#f5f5f5]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#666]">{description}</p>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parseBackendDate(dateStr));
}

function parseBackendDate(dateStr: string) {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(dateStr);
  return new Date(hasTimezone ? dateStr : `${dateStr}Z`);
}
