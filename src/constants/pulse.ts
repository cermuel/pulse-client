import type { Period } from "#/types/routes/pulse-detail";

export const PERIOD_OPTIONS = [
  { label: "4 hours", value: "4 hours" },
  { label: "24 hours", value: "24 hours" },
  { label: "7 days", value: "7 days" },
  { label: "28 days", value: "28 days" },
  { label: "365 days", value: "365 days" },
] as const;

export const PREMIUM_PERIODS: Period[] = ["7 days", "28 days", "365 days"];
export const DESKTOP_UPTIME_PAGE_SIZE = 50;
