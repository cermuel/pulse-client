import { StatCard } from "#/components/ui/pulse/stat-card";

type PulseSummaryStatsProps = {
  uptime: number | null;
  uptimeLabel: string;
  totalPings: number;
  openFlairsCount: number;
  lastCheckedLabel: string;
  nextCheckLabel: string;
};

export function PulseSummaryStats({
  uptime,
  uptimeLabel,
  totalPings,
  openFlairsCount,
  lastCheckedLabel,
  nextCheckLabel,
}: PulseSummaryStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Uptime"
        value={uptime !== null ? `${uptime}%` : "—"}
        accent={
          uptime === null
            ? undefined
            : uptime >= 99
              ? "green"
              : uptime >= 90
                ? "orange"
                : "red"
        }
        meta={uptimeLabel}
      />
      <StatCard label="Total pings" value={totalPings} />
      <StatCard
        label="Open flairs"
        value={openFlairsCount}
        accent={openFlairsCount > 0 ? "red" : undefined}
      />
      <StatCard
        label="Last checked"
        value={lastCheckedLabel}
        meta={`Next ${nextCheckLabel}`}
      />
    </div>
  );
}
