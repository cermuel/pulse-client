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
  pulseId?: string;
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

export type PingDetails = {
  id: string;
  pulseId: string;
  statusCode: number;
  isUp: boolean;
  responseTime: number;
  error?: string;
  createdAt: Date;
};

export type PulseDetailUiState = {
  isEditOpen: boolean;
  isDeleteModalOpen: boolean;
  deleteValue: string;
  editError: string;
  uptimePeriod: Period;
  responseTimesPeriod: Period;
  uptimeDesktopPage: number;
  editForm: {
    publicId: string;
    name: string;
    interval: number;
    expectedStatus: number;
  };
};

export type PulseDetailUiAction =
  | { type: "open_edit" }
  | { type: "close_edit" }
  | { type: "open_delete" }
  | { type: "close_delete" }
  | { type: "set_delete_value"; value: string }
  | { type: "set_edit_error"; value: string }
  | { type: "set_uptime_period"; value: Period }
  | { type: "set_response_times_period"; value: Period }
  | { type: "set_uptime_desktop_page"; value: number }
  | {
      type: "set_edit_form";
      value: PulseDetailUiState["editForm"];
    };
