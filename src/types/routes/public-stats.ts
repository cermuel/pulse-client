export type PublicPingSummary = {
  isUp: boolean;
  createdAt?: string;
};

export type PublicDailyUptime = {
  date: string;
  uptime: string | null;
};

export type PublicPulseSummary = {
  id?: string;
  url: string;
  name: string | null;
  publicId: string;
  isActive: boolean;
  interval: number;
  lastCheckedAt: string | null;
  expectedStatus: number;
  pings: PublicPingSummary[];
  dailyUptime: PublicDailyUptime[];
  overallUptime: string;
};

export type PublicUserStatsResponse = {
  message: string;
  pulses: PublicPulseSummary[];
};

export type PublicPulse = {
  id: string;
  userId?: string;
  url: string;
  publicId: string;
  name: string | null;
  expectedStatus: number;
  method: string;
  isActive: boolean;
  interval: number;
  createdAt: string;
  lastCheckedAt: string | null;
  updatedAt?: string | null;
};

export type PublicPingDetail = {
  id: string;
  pulseId: string;
  statusCode: number;
  isUp: boolean;
  responseTime: number;
  error?: string | null;
  createdAt: string;
};

export type PublicUptimePoint = {
  isUp: boolean;
  createdAt?: string;
};

export type PublicLog = {
  id: string;
  flairId: string;
  message: string;
  type: string;
  createdAt: string;
};

export type PublicPulseStats = {
  pulse: PublicPulse;
  pings: PublicPingDetail[];
  responseTimes: PublicPingDetail[];
  last4HoursUptime: PublicUptimePoint[];
  last24HoursUptime: PublicUptimePoint[];
  lastWeekUptime: PublicUptimePoint[];
  lastMonthUptime: PublicUptimePoint[];
  recentLogs: PublicLog[];
};

export type PublicPulseStatsResponse = {
  message: string;
  pulses: PublicPulseStats;
};

export type PublicStatsPeriod = "4 hours" | "24 hours" | "7 days" | "28 days";
