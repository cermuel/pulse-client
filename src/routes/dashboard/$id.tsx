import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useReducer } from "react";
import {
  DESKTOP_UPTIME_PAGE_SIZE,
  PERIOD_OPTIONS,
  PREMIUM_PERIODS,
} from "#/constants/pulse";
import { useUser } from "#/context/useUser";
import api from "../../lib/api";
import { AppLayout } from "#/components/layout/app-layout";
import { ResponseTimeChart } from "#/components/shared/response-time-chart";
import { DeletePulseModal } from "#/components/ui/pulse/delete-pulse-modal";
import { EditPulseModal } from "#/components/ui/pulse/edit-pulse-modal";
import { InlineDropdown } from "#/components/ui/pulse/inline-dropdown";
import { MiniStat } from "#/components/ui/pulse/mini-stat";
import { PulseDetailSkeleton } from "#/components/ui/pulse/pulse-detail-skeleton";
import { StatCard } from "#/components/ui/pulse/stat-card";
import { StatusDot } from "#/components/ui/pulse/status-dot";
import {
  formatDate,
  parseBackendDate,
  timeAgo,
  timeUntil,
} from "#/utils/helpers";
import { Skeleton } from "#/components/shared/skeleton";
import type {
  Period,
  PulseDetail,
  ResponseTimePoint,
  UptimePoint,
} from "#/types/routes/pulse-detail";

export const Route = createFileRoute("/dashboard/$id")({
  component: RouteComponent,
});

type PulseDetailUiState = {
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

type PulseDetailUiAction =
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

const INITIAL_UI_STATE: PulseDetailUiState = {
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

function pulseDetailUiReducer(
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

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [uiState, dispatch] = useReducer(pulseDetailUiReducer, INITIAL_UI_STATE);
  const now = useNow();
  const {
    isEditOpen,
    isDeleteModalOpen,
    deleteValue,
    editError,
    uptimePeriod,
    responseTimesPeriod,
    uptimeDesktopPage,
    editForm,
  } = uiState;

  const { data, isLoading } = useQuery({
    queryKey: ["pulse", id],
    queryFn: async () => {
      const res = await api.get(`/pulse/${id}`);
      return res.data.pulse as PulseDetail;
    },
  });

  const { data: responseTimesData, isLoading: isResponseTimesLoading } =
    useQuery({
      queryKey: ["pulse", id, "response-times", responseTimesPeriod],
      queryFn: async () => {
        const res = await api.get(`/ping/${id}`, {
          params: { period: responseTimesPeriod },
        });
        return res.data.times as ResponseTimePoint[];
      },
      enabled: Boolean(id),
    });

  const { data: uptimesData, isLoading: isUptimesLoading } = useQuery({
    queryKey: ["pulse", id, "uptimes", uptimePeriod],
    queryFn: async () => {
      const res = await api.get(`/ping/${id}/uptimes`, {
        params: { period: uptimePeriod },
      });
      return res.data.times as UptimePoint[];
    },
    enabled: Boolean(id),
  });

  const pulse = data;
  const responseTimes = responseTimesData ?? [];
  const uptimePoints = uptimesData ?? [];
  const averageResponseTime =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce((sum, point) => sum + point.responseTime, 0) /
            responseTimes.length,
        )
      : null;
  const peakResponseTime =
    responseTimes.length > 0
      ? Math.min(...responseTimes.map((point) => point.responseTime))
      : null;
  const troughResponseTime =
    responseTimes.length > 0
      ? Math.max(...responseTimes.map((point) => point.responseTime))
      : null;
  const uptimeDesktopPageCount = Math.max(
    1,
    Math.ceil(uptimePoints.length / DESKTOP_UPTIME_PAGE_SIZE),
  );
  const desktopUptimePoints = uptimePoints.slice(
    uptimeDesktopPage * DESKTOP_UPTIME_PAGE_SIZE,
    (uptimeDesktopPage + 1) * DESKTOP_UPTIME_PAGE_SIZE,
  );

  useEffect(() => {
    if (!pulse) return;

    dispatch({
      type: "set_edit_form",
      value: {
        publicId: pulse.publicId ?? "",
        name: pulse.name ?? "",
        interval: pulse.interval,
        expectedStatus: pulse.expectedStatus,
      },
    });
  }, [pulse]);

  useEffect(() => {
    if (uptimeDesktopPage > uptimeDesktopPageCount - 1) {
      dispatch({
        type: "set_uptime_desktop_page",
        value: Math.max(0, uptimeDesktopPageCount - 1),
      });
    }
  }, [uptimeDesktopPage, uptimeDesktopPageCount]);

  const deleteConfirmationOptions = useMemo(() => {
    if (!pulse) return [];
    return [pulse.name, pulse.publicId].filter((value): value is string =>
      Boolean(value?.trim()),
    );
  }, [pulse]);

  const deleteMatches =
    pulse &&
    deleteConfirmationOptions.some(
      (value) =>
        value.trim().toLowerCase() === deleteValue.trim().toLowerCase(),
    );
  const isFreePlan = user?.plan === "free";

  const editPulse = useMutation({
    mutationFn: async () => {
      const payload = {
        publicId: editForm.publicId || undefined,
        name: editForm.name || undefined,
        interval: Number(editForm.interval),
        expectedStatus: Number(editForm.expectedStatus),
      };

      const res = await api.patch(`/pulse/${id}`, payload);
      return res.data;
    },
    onSuccess: async () => {
      dispatch({ type: "close_edit" });
      await queryClient.invalidateQueries({ queryKey: ["pulse", id] });
      await queryClient.invalidateQueries({ queryKey: ["pulses"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      dispatch({
        type: "set_edit_error",
        value: Array.isArray(message)
          ? message.join(", ")
          : typeof message === "string"
            ? message
            : "Couldn't update pulse",
      });
    },
  });

  const deletePulse = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/pulse/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pulses"] });
      navigate({ to: "/dashboard" });
    },
  });

  const pauseResumePulse = useMutation({
    mutationFn: async (action: "pause" | "resume") => {
      const res = await api.patch(`/pulse/${id}/${action}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pulse", id] });
      await queryClient.invalidateQueries({ queryKey: ["pulses"] });
    },
  });

  const uptime =
    uptimePoints.length > 0
      ? Math.round(
          (uptimePoints.filter((p) => p.isUp).length / uptimePoints.length) *
            100,
        )
      : null;

  const openFlairs = pulse?.flairs.filter((f) => !f.isResolved) ?? [];
  const status =
    pulse?.pings.length === 0
      ? "pending"
      : pulse?.pings[pulse.pings.length - 1]?.isUp
        ? "up"
        : "down";
  const lastCheckedLabel = pulse?.lastCheckedAt
    ? timeAgo(pulse.lastCheckedAt, now)
    : "Waiting";
  const nextCheckLabel = pulse?.lastCheckedAt
    ? timeUntil(
        parseBackendDate(pulse.lastCheckedAt).getTime() + pulse.interval * 1000,
        now,
      )
    : `${pulse?.interval ?? 0}s cadence`;

  return (
    <AppLayout>
      <div className="max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Back */}
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="mb-7 flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:text-[#fb923c]"
        >
          ← Back
        </button>

        {isLoading ? (
          <PulseDetailSkeleton />
        ) : !pulse ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#333]">
              Pulse not found
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <StatusDot status={status} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
                    {pulse.publicId}
                  </p>
                </div>
                <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">
                  {pulse.name || pulse.url}
                </h1>
                <p className="mt-1 font-mono text-[12px] text-[#555]">
                  {pulse.url}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:shrink-0 lg:justify-end">
                <span
                  className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                    pulse.isActive
                      ? "border-green-500/30 text-green-500"
                      : "border-[#1f1f1f] text-[#444]"
                  }`}
                >
                  {pulse.isActive ? "Active" : "Paused"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    pauseResumePulse.mutate(pulse.isActive ? "pause" : "resume")
                  }
                  disabled={pauseResumePulse.isPending}
                  className="cursor-pointer border border-[#1f1f1f] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pauseResumePulse.isPending
                    ? pulse.isActive
                      ? "Pausing..."
                      : "Resuming..."
                    : pulse.isActive
                      ? "Pause"
                      : "Resume"}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "open_edit" })}
                  className="cursor-pointer border border-[#1f1f1f] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "open_delete" })}
                  className="cursor-pointer border border-red-500/20 bg-red-500/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Stats row */}
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
                meta={uptimePeriod}
              />
              <StatCard label="Total pings" value={uptimePoints.length} />
              <StatCard
                label="Open flairs"
                value={openFlairs.length}
                accent={openFlairs.length > 0 ? "red" : undefined}
              />
              <StatCard
                label="Last checked"
                value={lastCheckedLabel}
                meta={`Next ${nextCheckLabel}`}
              />
            </div>

            {/* Ping history bar */}
            <div className="mb-8 overflow-hidden border border-[#1f1f1f] bg-[#111]">
              <div className="flex flex-col gap-4 border-b border-[#1f1f1f] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                    PING HISTORY
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444]">
                    Uptime checks for {uptimePeriod.toLowerCase()}
                  </p>
                </div>
                <InlineDropdown
                  label="Period"
                  value={uptimePeriod}
                  options={PERIOD_OPTIONS}
                  onChange={(value) =>
                    dispatch({ type: "set_uptime_period", value: value as Period })
                  }
                  disabledOptions={isFreePlan ? PREMIUM_PERIODS : []}
                  disabledReason="Upgrade your plan to unlock 7 days, 28 days, and 365 days."
                  className="h-32!"
                />
              </div>

              <div className="px-4 py-5 sm:px-6">
                {isUptimesLoading ? (
                  <Skeleton className="h-32 w-full rounded-none" />
                ) : uptimePoints.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-sm text-[#555]">
                    No uptime data for this period
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#555]">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Operational
                      </span>
                      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#555]">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Failed
                      </span>
                    </div>

                    <div className="hide-scrollbar overflow-x-auto pb-1 lg:hidden">
                      <div className="flex w-max items-end gap-1 rounded-sm pr-2">
                        {uptimePoints.map((ping, i, arr) => {
                          const isLatest = i === arr.length - 1;
                          return (
                            <div
                              key={`${ping.createdAt ?? "uptime"}-${i}`}
                              title={`${ping.isUp ? "Up" : "Down"}${ping.createdAt ? ` • ${formatDate(ping.createdAt)}` : ""}`}
                              className={`group relative w-3 shrink-0 overflow-hidden rounded-xs transition-all hover:opacity-80 sm:w-4 ${
                                ping.isUp ? "bg-green-500/85" : "bg-red-500/85"
                              } ${isLatest ? "ring-1 ring-[#f5f5f5]/20" : ""}`}
                              style={{
                                height: ping.isUp ? "60px" : "40px",
                              }}
                            >
                              <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="hidden lg:block">
                      <div className="flex items-center gap-3">
                        {uptimePoints.length > DESKTOP_UPTIME_PAGE_SIZE ? (
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "set_uptime_desktop_page",
                                value: Math.max(0, uptimeDesktopPage - 1),
                              })
                            }
                            disabled={uptimeDesktopPage === 0}
                            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-[#1f1f1f] bg-[#111] font-mono text-sm text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Show previous uptime checks"
                          >
                            ‹
                          </button>
                        ) : null}

                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="flex items-end gap-1 rounded-sm">
                            {desktopUptimePoints.map((ping, i, arr) => {
                              const isLatest = i === arr.length - 1;
                              return (
                                <div
                                  key={`${ping.createdAt ?? "desktop-uptime"}-${i}`}
                                  title={`${ping.isUp ? "Up" : "Down"}${ping.createdAt ? ` • ${formatDate(ping.createdAt)}` : ""}`}
                                  className={`group relative flex-1 overflow-hidden rounded-xs transition-all hover:opacity-80 ${
                                    ping.isUp
                                      ? "bg-green-500/85"
                                      : "bg-red-500/85"
                                  } ${isLatest ? "ring-1 ring-[#f5f5f5]/20" : ""}`}
                                  style={{
                                    height: ping.isUp ? "60px" : "40px",
                                  }}
                                >
                                  <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {uptimePoints.length > DESKTOP_UPTIME_PAGE_SIZE ? (
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "set_uptime_desktop_page",
                                value: Math.min(
                                  uptimeDesktopPageCount - 1,
                                  uptimeDesktopPage + 1,
                                ),
                              })
                            }
                            disabled={
                              uptimeDesktopPage >= uptimeDesktopPageCount - 1
                            }
                            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-[#1f1f1f] bg-[#111] font-mono text-sm text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Show next uptime checks"
                          >
                            ›
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-8 overflow-hidden border border-[#1f1f1f] bg-[#111]">
              <div className="flex flex-col gap-4 border-b border-[#1f1f1f] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                    RESPONSE TIMES
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444]">
                    Live monitor latency trend for{" "}
                    {responseTimesPeriod.toLowerCase()}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <InlineDropdown
                    label="Period"
                    value={responseTimesPeriod}
                    options={PERIOD_OPTIONS}
                    onChange={(value) =>
                      dispatch({
                        type: "set_response_times_period",
                        value: value as Period,
                      })
                    }
                    disabledOptions={isFreePlan ? PREMIUM_PERIODS : []}
                    disabledReason="Upgrade your plan to unlock 7 days, 28 days, and 365 days."
                  />
                  <div className="grid grid-cols-3 gap-2 sm:min-w-70">
                    <MiniStat
                      label="Peak"
                      value={
                        isResponseTimesLoading
                          ? "..."
                          : peakResponseTime !== null
                            ? `${peakResponseTime}ms`
                            : "—"
                      }
                      tone="green"
                    />
                    <MiniStat
                      label="Average"
                      value={
                        isResponseTimesLoading
                          ? "..."
                          : averageResponseTime !== null
                            ? `${averageResponseTime}ms`
                            : "—"
                      }
                    />
                    <MiniStat
                      label="Trough"
                      value={
                        isResponseTimesLoading
                          ? "..."
                          : troughResponseTime !== null
                            ? `${troughResponseTime}ms`
                            : "—"
                      }
                      tone="red"
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6">
                {isResponseTimesLoading ? (
                  <ResponseTimeChart values={[]} loading />
                ) : responseTimes.length === 0 ? (
                  <div className="flex h-48 items-center justify-center text-sm text-[#555]">
                    No response time data for this period
                  </div>
                ) : (
                  <ResponseTimeChart
                    values={responseTimes.map((point) => point.responseTime)}
                  />
                )}
              </div>
            </div>

            <div className="border border-[#1f1f1f]">
              <div className="border-b border-[#1f1f1f] px-6 py-4 flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                  Flairs
                </p>
                {openFlairs.length > 0 && (
                  <span className="font-mono text-[10px] text-red-400">
                    {openFlairs.length} open
                  </span>
                )}
              </div>

              {pulse.flairs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#2a2a2a]">
                    No incidents
                  </p>
                </div>
              ) : (
                <div>
                  {pulse.flairs
                    .slice()
                    .sort(
                      (a, b) =>
                        parseBackendDate(b.startedAt).getTime() -
                        parseBackendDate(a.startedAt).getTime(),
                    )
                    .map((flair) => (
                      <Link
                        key={flair.id}
                        to="/dashboard/flairs/$id"
                        params={{ id: flair.id }}
                        className="block border-b border-[#191919] px-4 py-4 transition-colors hover:bg-[#141414] last:border-0 sm:px-6"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                          <span
                            className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                              flair.isResolved
                                ? "bg-green-500"
                                : "bg-red-500 animate-pulse"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[#f5f5f5]">
                              {flair.cause || "Service unreachable"}
                            </p>
                            <p className="mt-2 font-mono text-[10px] text-[#555]">
                              Started {formatDate(flair.startedAt)}
                              {flair.resolvedAt
                                ? ` · Resolved ${formatDate(flair.resolvedAt)}`
                                : ""}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-2 self-start border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider sm:shrink-0 ${
                              flair.isResolved
                                ? "border-green-500/20 bg-green-500/5 text-green-500"
                                : "border-red-500/20 bg-red-500/5 text-red-400"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                flair.isResolved ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            {flair.isResolved ? "Resolved" : "Open"}
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {pulse && isEditOpen && (
        <EditPulseModal
          pulse={pulse}
          isFreePlan={Boolean(isFreePlan)}
          form={editForm}
          errorMessage={editError}
          isSaving={editPulse.isPending}
          onChange={(updater) =>
            dispatch({
              type: "set_edit_form",
              value:
                typeof updater === "function"
                  ? updater(uiState.editForm)
                  : updater,
            })
          }
          onClose={() => {
            dispatch({ type: "close_edit" });
            dispatch({
              type: "set_edit_form",
              value: {
                publicId: pulse.publicId ?? "",
                name: pulse.name ?? "",
                interval: pulse.interval,
                expectedStatus: pulse.expectedStatus,
              },
            });
          }}
          onSave={() => editPulse.mutate()}
        />
      )}

      {pulse && isDeleteModalOpen && (
        <DeletePulseModal
          pulse={pulse}
          confirmationValue={deleteValue}
          onConfirmationChange={(value) =>
            dispatch({ type: "set_delete_value", value })
          }
          canDelete={Boolean(deleteMatches)}
          isDeleting={deletePulse.isPending}
          errorMessage={
            deletePulse.error instanceof Error
              ? deletePulse.error.message
              : (deletePulse.error as any)?.response?.data?.message
          }
          onClose={() => dispatch({ type: "close_delete" })}
          onDelete={() => deletePulse.mutate()}
        />
      )}
    </AppLayout>
  );
}

function useNow() {
  const [now, setNow] = useReducer(() => Date.now(), Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return now;
}
