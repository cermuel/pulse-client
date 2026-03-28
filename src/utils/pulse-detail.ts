import { DESKTOP_UPTIME_PAGE_SIZE } from "#/constants/pulse";
import type {
  PulseDetail,
  PulseDetailUiAction,
  PulseDetailUiState,
  ResponseTimePoint,
  UptimePoint,
} from "#/types/routes/pulse-detail";

export function pulseDetailUiReducer(
  state: PulseDetailUiState,
  action: PulseDetailUiAction,
): PulseDetailUiState {
  switch (action.type) {
    case "open_edit":
      return { ...state, editError: "", isEditOpen: true };
    case "close_edit":
      return { ...state, editError: "", isEditOpen: false };
    case "open_delete":
      return { ...state, deleteValue: "", isDeleteModalOpen: true };
    case "close_delete":
      return { ...state, isDeleteModalOpen: false };
    case "set_delete_value":
      return { ...state, deleteValue: action.value };
    case "set_edit_error":
      return { ...state, editError: action.value };
    case "set_uptime_period":
      return {
        ...state,
        uptimePeriod: action.value,
        uptimeDesktopPage: 0,
      };
    case "set_response_times_period":
      return { ...state, responseTimesPeriod: action.value };
    case "set_uptime_desktop_page":
      return { ...state, uptimeDesktopPage: action.value };
    case "set_edit_form":
      return { ...state, editForm: action.value };
    default:
      return state;
  }
}

export function getPulseEditForm(pulse: PulseDetail) {
  return {
    publicId: pulse.publicId ?? "",
    name: pulse.name ?? "",
    interval: pulse.interval,
    expectedStatus: pulse.expectedStatus,
  };
}

export function getDeleteConfirmationOptions(pulse?: PulseDetail) {
  if (!pulse) return [];

  return [pulse.name, pulse.publicId].filter(
    (value): value is string => Boolean(value?.trim()),
  );
}

export function matchesDeleteConfirmation(options: string[], deleteValue: string) {
  const normalizedValue = deleteValue.trim().toLowerCase();

  return options.some(
    (value) => value.trim().toLowerCase() === normalizedValue,
  );
}

export function getResponseTimeStats(responseTimes: ResponseTimePoint[]) {
  if (responseTimes.length === 0) {
    return {
      averageResponseTime: null,
      peakResponseTime: null,
      troughResponseTime: null,
    };
  }

  return {
    averageResponseTime: Math.round(
      responseTimes.reduce((sum, point) => sum + point.responseTime, 0) /
        responseTimes.length,
    ),
    peakResponseTime: Math.min(
      ...responseTimes.map((point) => point.responseTime),
    ),
    troughResponseTime: Math.max(
      ...responseTimes.map((point) => point.responseTime),
    ),
  };
}

export function getUptimeStats(
  uptimePoints: UptimePoint[],
  uptimeDesktopPage: number,
) {
  const uptimeDesktopPageCount = Math.max(
    1,
    Math.ceil(uptimePoints.length / DESKTOP_UPTIME_PAGE_SIZE),
  );
  const desktopUptimePoints = uptimePoints.slice(
    uptimeDesktopPage * DESKTOP_UPTIME_PAGE_SIZE,
    (uptimeDesktopPage + 1) * DESKTOP_UPTIME_PAGE_SIZE,
  );
  const uptime =
    uptimePoints.length > 0
      ? Math.round(
          (uptimePoints.filter((point) => point.isUp).length /
            uptimePoints.length) *
            100,
        )
      : null;

  return {
    uptime,
    uptimeDesktopPageCount,
    desktopUptimePoints,
  };
}

export function getPulseStatus(pulse?: PulseDetail) {
  if (!pulse) return "pending" as const;
  if (pulse.pings.length === 0) return "pending" as const;

  return pulse.pings[pulse.pings.length - 1]?.isUp ? "up" : "down";
}
