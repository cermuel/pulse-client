import type { Period, PulseDetailUiState } from "#/types/routes/pulse-detail";

export const PERIOD_OPTIONS = [
  { label: "4 hours", value: "4 hours" },
  { label: "24 hours", value: "24 hours" },
  { label: "7 days", value: "7 days" },
  { label: "28 days", value: "28 days" },
  { label: "365 days", value: "365 days" },
] as const;

export const PREMIUM_PERIODS: Period[] = ["7 days", "28 days", "365 days"];
export const DESKTOP_UPTIME_PAGE_SIZE = 50;

export const INITIAL_UI_STATE: PulseDetailUiState = {
  isEditOpen: false,
  isDeleteModalOpen: false,
  deleteValue: "",
  editError: "",
  uptimePeriod: "4 hours",
  responseTimesPeriod: "4 hours",
  uptimeDesktopPage: 0,
  editForm: {
    publicId: "",
    name: "",
    interval: 300,
    expectedStatus: 200,
  },
};
