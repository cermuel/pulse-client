import type {
  PublicPulseStats,
  PublicPulseSummary,
  PublicStatsPeriod,
} from "#/types/routes/public-stats";

export const PUBLIC_STATS_PERIODS: PublicStatsPeriod[] = [
  "4 hours",
  "24 hours",
  "7 days",
  "28 days",
];

export function getPublicPulseLabel(pulse: {
  name?: string | null;
  publicId?: string | null;
  url: string;
}) {
  return pulse.name?.trim() || pulse.publicId?.trim() || pulse.url;
}

export function getPercentValue(value?: string | null) {
  if (!value) return null;

  const parsed = Number.parseFloat(value.replace("%", ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function getPublicSummaryStatus(pulse: PublicPulseSummary) {
  if (pulse.pings.length === 0) return "pending" as const;

  const latestPing = pulse.pings.reduce((latest, current) => {
    if (!latest?.createdAt) return current;
    if (!current.createdAt) return latest;
    return new Date(current.createdAt) > new Date(latest.createdAt)
      ? current
      : latest;
  }, pulse.pings[0]);

  return latestPing?.isUp ? "up" : "down";
}

export function getPublicDetailStatus(stats: PublicPulseStats) {
  if (stats.pings.length === 0) return "pending" as const;
  return stats.pings[0]?.isUp ? "up" : "down";
}

export function getPublicUptimeSeries(
  stats: PublicPulseStats,
  period: PublicStatsPeriod,
) {
  switch (period) {
    case "4 hours":
      return stats.last4HoursUptime;
    case "24 hours":
      return stats.last24HoursUptime;
    case "7 days":
      return stats.lastWeekUptime;
    case "28 days":
      return stats.lastMonthUptime;
    default:
      return stats.last24HoursUptime;
  }
}

export function sortPublicPulses(pulses: PublicPulseSummary[]) {
  return [...pulses].sort((left, right) => {
    const leftStatus = getPublicSummaryStatus(left);
    const rightStatus = getPublicSummaryStatus(right);

    if (leftStatus !== rightStatus) {
      const rank = { down: 0, pending: 1, up: 2 };
      return rank[leftStatus] - rank[rightStatus];
    }

    return getPublicPulseLabel(left).localeCompare(getPublicPulseLabel(right));
  });
}
