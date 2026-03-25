export type Pulse = {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  isActive: boolean;
  lastCheckedAt: string;
  expectedStatus: number;
};

export type FlairLog = {
  id: string;
  message: string;
  type: string;
  createdAt: string;
};

export type Flair = {
  id: string;
  cause: string | null;
  isResolved: boolean;
  resolvedAt: string | null;
  startedAt: string;
  pulseId: string;
  userId: string;
  pulse?: {
    id: string;
    name: string | null;
    publicId: string;
    url: string;
    method: string;
    interval: number;
  };
  logs?: FlairLog[];
};
