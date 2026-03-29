import { Link } from "@tanstack/react-router";
import { StatusDot } from "#/components/ui/pulse/status-dot";
import { PublicTooltipBar } from "#/components/ui/public-stats/public-tooltip-bar";
import type { PublicPulseSummary } from "#/types/routes/public-stats";
import { formatInterval, timeAgo } from "#/utils/helpers";
import {
  getPercentValue,
  getPublicPulseLabel,
  getPublicSummaryStatus,
} from "#/utils/public-stats";
import { FaArrowRight } from "react-icons/fa6";

type PublicPulseSummaryCardProps = {
  ownerId: string;
  pulse: PublicPulseSummary;
  now: number;
};

export function PublicPulseSummaryCard({
  ownerId,
  pulse,
  now,
}: PublicPulseSummaryCardProps) {
  const status = getPublicSummaryStatus(pulse);
  const overallUptime = getPercentValue(pulse.overallUptime);
  const routeId = pulse.publicId;

  return (
    <div className="border border-[#1f1f1f] bg-[#111111] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <StatusDot status={status} />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fb923c]">
              {pulse.publicId}
            </p>
          </div>
          <h2 className="text-xl font-bold tracking-[-0.03em] text-[#f5f5f5] break-words">
            {getPublicPulseLabel(pulse)}
          </h2>
          <p className="mt-2 break-all font-mono text-[11px] text-[#666]">
            {pulse.url}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <span
            className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
              pulse.isActive
                ? "border-green-500/25 text-green-500"
                : "border-[#2a2a2a] text-[#666]"
            }`}
          >
            {pulse.isActive ? "Active" : "Paused"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Metric
          label="Overall uptime"
          value={overallUptime !== null ? `${overallUptime.toFixed(3)}%` : "—"}
          tone={
            overallUptime === null
              ? undefined
              : overallUptime >= 99
                ? "green"
                : overallUptime >= 95
                  ? "orange"
                  : "red"
          }
        />
        <Metric label="Interval" value={formatInterval(pulse.interval)} />
        <Metric
          label="Last check"
          value={
            pulse.lastCheckedAt ? timeAgo(pulse.lastCheckedAt, now) : "Waiting"
          }
        />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#555]">
            Last 30 days
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#444]">
            Daily uptime
          </p>
        </div>
        <div className="flex h-14 items-end gap-1">
          {pulse.dailyUptime.map((point) => {
            const uptime = getPercentValue(point.uptime);

            return (
              <PublicTooltipBar
                key={point.date}
                label={`${point.date} • ${point.uptime ?? "No data"}`}
                tone={
                  uptime === null
                    ? "neutral"
                    : uptime >= 99
                      ? "green"
                      : uptime >= 95
                        ? "orange"
                        : "red"
                }
                height={
                  uptime === null
                    ? "18%"
                    : `${Math.max(18, Math.round(uptime))}%`
                }
              />
            );
          })}
        </div>
      </div>

      {routeId ? (
        <Link
          to="/stats/$id/$pulseId"
          params={{ id: ownerId, pulseId: routeId }}
          className="inline-flex items-center gap-1  mt-10 hover:text-[#fb923c]  font-mono text-[11px] uppercase  text-[#DDD]"
        >
          View pulse
          <FaArrowRight />
        </Link>
      ) : null}
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green" | "orange" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "text-green-500"
      : tone === "orange"
        ? "text-[#fb923c]"
        : tone === "red"
          ? "text-red-400"
          : "text-[#f5f5f5]";

  return (
    <div className="border border-[#1b1b1b] bg-[#0d0d0d] px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#444]">
        {label}
      </p>
      <p className={`mt-2 text-sm font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
