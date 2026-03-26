export type Ping = {
  isUp: boolean;
  createdAt?: string;
};

export type ResponseTimePoint = {
  responseTime: number;
  createdAt?: string;
};

export type UptimePoint = {
  isUp: boolean;
  createdAt?: string;
};

export type Period = "4 hours" | "24 hours" | "7 days" | "28 days" | "365 days";

export type PulseFlair = {
  id: string;
  cause: string;
  isResolved: boolean;
  resolvedAt: string | null;
  startedAt: string;
};

export type PulseDetail = {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  isActive: boolean;
  expectedStatus: number;
  publicId: string;
  createdAt: string;
  lastCheckedAt: string | null;
  pings: Ping[];
  flairs: PulseFlair[];
};
