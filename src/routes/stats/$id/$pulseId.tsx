import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PublicStatsLayout } from "#/components/ui/public-stats/public-stats-layout";
import { PublicTooltipBar } from "#/components/ui/public-stats/public-tooltip-bar";
import { ResponseTimeChart } from "#/components/shared/response-time-chart";
import { Skeleton } from "#/components/shared/skeleton";
import { StatusDot } from "#/components/ui/pulse/status-dot";
import { StatCard } from "#/components/ui/pulse/stat-card";
import api from "#/lib/api";
import type {
  PublicPulseStatsResponse,
  PublicStatsPeriod,
} from "#/types/routes/public-stats";
import {
  formatDate,
  formatInterval,
  parseBackendDate,
  timeAgo,
  timeUntil,
} from "#/utils/helpers";
import { getResponseTimeStats, getUptimeStats } from "#/utils/pulse-detail";
import {
  PUBLIC_STATS_PERIODS,
  getPublicDetailStatus,
  getPublicPulseLabel,
  getPublicUptimeSeries,
} from "#/utils/public-stats";
import { useNow } from "#/hooks/use-now";

export const Route = createFileRoute("/stats/$id/$pulseId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id, pulseId } = Route.useParams();
  const now = useNow();
  const [period, setPeriod] = useState<PublicStatsPeriod>("24 hours");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-stats", id, pulseId],
    queryFn: async () => {
      const res = await api.get(`/stats/${id}/${pulseId}`);
      return res.data as PublicPulseStatsResponse;
    },
  });

  const stats = data?.pulses;
  const status = stats ? getPublicDetailStatus(stats) : "pending";
  const uptimePoints = stats ? getPublicUptimeSeries(stats, period) : [];
  const { uptime } = getUptimeStats(uptimePoints, 0);
  const { averageResponseTime, peakResponseTime, troughResponseTime } =
    getResponseTimeStats(stats?.responseTimes ?? []);
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Unable to load this service's public stats right now.";

  return (
    <PublicStatsLayout
      eyebrow="Service stats"
      title={stats ? getPublicPulseLabel(stats.pulse) : pulseId}
      description="A public service health view with recent checks, uptime windows, response time trends, and the latest activity logs."
    >
      <Link
        to="/stats/$id"
        params={{ id }}
        className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#666] transition-colors hover:text-[#fb923c]"
      >
        ← All monitored services
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-none" />
          <Skeleton className="h-96 w-full rounded-none" />
        </div>
      ) : isError || !stats ? (
        <div className="border border-red-500/20 bg-red-500/6 px-5 py-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-400">
            Couldn&apos;t load service stats
          </p>
          <p className="mt-3 text-sm text-[#c8c8c8]">{errorMessage}</p>
        </div>
      ) : (
        <>
          <div className="mb-8 border border-[#1f1f1f] bg-[#111111]/90 p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-3">
                  <StatusDot status={status} />
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fb923c]">
                    {stats.pulse.publicId}
                  </p>
                  <span
                    className={`w-fit border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                      stats.pulse.isActive
                        ? "border-green-500/25 text-green-500"
                        : "border-[#2a2a2a] text-[#666]"
                    }`}
                  >
                    {stats.pulse.isActive ? "Active" : "Paused"}
                  </span>
                </div>
                <h2 className="text-[28px] font-extrabold tracking-[-0.03em]">
                  {getPublicPulseLabel(stats.pulse)}
                </h2>
                <p className="mt-2 break-all font-mono text-[11px] text-[#666]">
                  {stats.pulse.url}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Selected uptime"
              value={uptime !== null ? `${uptime}%` : "—"}
              meta={period}
              accent={
                uptime === null
                  ? undefined
                  : uptime >= 99
                    ? "green"
                    : uptime >= 95
                      ? "orange"
                      : "red"
              }
            />
            <StatCard
              label="Check cadence"
              value={formatInterval(stats.pulse.interval)}
              meta={`${stats.pings.length} checks in range`}
            />
            <StatCard
              label="Last checked"
              value={
                stats.pulse.lastCheckedAt
                  ? timeAgo(stats.pulse.lastCheckedAt, now)
                  : "Waiting"
              }
              meta={
                stats.pulse.lastCheckedAt
                  ? `Next ${timeUntil(
                      parseBackendDate(stats.pulse.lastCheckedAt).getTime() +
                        stats.pulse.interval * 1000,
                      now,
                    )}`
                  : "Awaiting first ping"
              }
            />
          </div>

          <section className="mb-8 border border-[#1f1f1f] bg-[#111111]/90">
            <div className="flex flex-col gap-4 border-b border-[#1f1f1f] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                  Uptime windows
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444]">
                  Recent check history for {period.toLowerCase()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PUBLIC_STATS_PERIODS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPeriod(option)}
                    className={`cursor-pointer border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      option === period
                        ? "border-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]"
                        : "border-[#1f1f1f] text-[#666] hover:border-[#fb923c]/50 hover:text-[#fb923c]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              {uptimePoints.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-[#555]">
                  No uptime data for this window
                </div>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap items-center gap-4">
                    <Legend tone="green" label="Operational" />
                    <Legend tone="red" label="Failed" />
                  </div>
                  <div className="hide-scrollbar overflow-x-auto pb-2">
                    <div className="flex min-w-max items-end gap-1">
                      {uptimePoints.map((point, index) => (
                        <PublicTooltipBar
                          key={`${point.createdAt ?? period}-${index}`}
                          label={
                            point.createdAt
                              ? `${point.isUp ? "Operational" : "Failed"} • ${formatDate(point.createdAt)}`
                              : point.isUp
                                ? "Operational"
                                : "Failed"
                          }
                          tone={point.isUp ? "green" : "red"}
                          height={point.isUp ? "64px" : "38px"}
                          widthClassName="w-3 shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="mb-8 overflow-hidden border border-[#1f1f1f] bg-[#111111]/90">
            <div className="flex flex-col gap-4 border-b border-[#1f1f1f] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                  Response times
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444]">
                  Latency trend across the last 48 hours
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:min-w-70">
                <MiniStat
                  label="Peak"
                  value={peakResponseTime !== null ? `${peakResponseTime}ms` : "—"}
                  tone="green"
                />
                <MiniStat
                  label="Average"
                  value={
                    averageResponseTime !== null ? `${averageResponseTime}ms` : "—"
                  }
                />
                <MiniStat
                  label="Trough"
                  value={troughResponseTime !== null ? `${troughResponseTime}ms` : "—"}
                  tone="red"
                />
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <ResponseTimeChart
                values={stats.responseTimes.map((point) => point.responseTime)}
              />
            </div>
          </section>

          <section className="overflow-hidden border border-[#1f1f1f] bg-[#111111]/90">
            <div className="border-b border-[#1f1f1f] px-5 py-4 sm:px-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                Recent activity
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444]">
                Latest service log entries
              </p>
            </div>

            <div className="divide-y divide-[#1a1a1a]">
              {stats.recentLogs.length === 0 ? (
                <div className="px-5 py-8 text-sm text-[#555] sm:px-6">
                  No activity logs yet.
                </div>
              ) : (
                stats.recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-[#f5f5f5]">{log.message}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#555]">
                        {log.type}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[#666]">
                      {timeAgo(log.createdAt, now)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </PublicStatsLayout>
  );
}

function Legend({ tone, label }: { tone: "green" | "red"; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#555]">
      <span className={`h-2 w-2 rounded-full ${tone === "green" ? "bg-green-500" : "bg-red-500"}`} />
      {label}
    </span>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green" | "red";
}) {
  return (
    <div className="border border-[#1b1b1b] bg-[#0d0d0d] px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#444]">
        {label}
      </p>
      <p
        className={`mt-2 text-sm font-bold ${
          tone === "green"
            ? "text-green-500"
            : tone === "red"
              ? "text-red-400"
              : "text-[#f5f5f5]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
