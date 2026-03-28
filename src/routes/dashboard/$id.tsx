import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useReducer } from "react";
import { INITIAL_UI_STATE } from "#/constants/pulse";
import { useUser } from "#/context/useUser";
import api from "../../lib/api";
import { AppLayout } from "#/components/layout/app-layout";
import { PulseDetailHeader } from "#/components/ui/pulse/pulse-detail-header";
import { PulseFlairsSection } from "#/components/ui/pulse/pulse-flairs-section";
import { PulseDetailModals } from "#/components/ui/pulse/pulse-detail-modals";
import { PulseDetailSkeleton } from "#/components/ui/pulse/pulse-detail-skeleton";
import { PulseResponseTimesSection } from "#/components/ui/pulse/pulse-response-times-section";
import { PulseSummaryStats } from "#/components/ui/pulse/pulse-summary-stats";
import { PulseUptimeSection } from "#/components/ui/pulse/pulse-uptime-section";
import { useNow } from "#/hooks/use-now";
import type {
  PulseDetail,
  ResponseTimePoint,
  UptimePoint,
} from "#/types/routes/pulse-detail";
import { parseBackendDate, timeAgo, timeUntil } from "#/utils/helpers";
import {
  getDeleteConfirmationOptions,
  getPulseEditForm,
  getPulseStatus,
  getResponseTimeStats,
  getUptimeStats,
  matchesDeleteConfirmation,
  pulseDetailUiReducer,
} from "#/utils/pulse-detail";

export const Route = createFileRoute("/dashboard/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [uiState, dispatch] = useReducer(
    pulseDetailUiReducer,
    INITIAL_UI_STATE,
  );
  const now = useNow();
  const { deleteValue, uptimePeriod, responseTimesPeriod, uptimeDesktopPage, editForm } =
    uiState;

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
  const { averageResponseTime, peakResponseTime, troughResponseTime } =
    getResponseTimeStats(responseTimes);
  const { uptime, uptimeDesktopPageCount, desktopUptimePoints } =
    getUptimeStats(uptimePoints, uptimeDesktopPage);

  useEffect(() => {
    if (!pulse) return;

    dispatch({
      type: "set_edit_form",
      value: getPulseEditForm(pulse),
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

  const deleteConfirmationOptions = useMemo(
    () => getDeleteConfirmationOptions(pulse),
    [pulse],
  );

  const deleteMatches =
    pulse && matchesDeleteConfirmation(deleteConfirmationOptions, deleteValue);
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

  const openFlairs = pulse?.flairs.filter((f) => !f.isResolved) ?? [];
  const status = getPulseStatus(pulse);
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
            <PulseDetailHeader
              pulse={pulse}
              status={status}
              isPauseResumePending={pauseResumePulse.isPending}
              onPauseResume={() =>
                pauseResumePulse.mutate(pulse.isActive ? "pause" : "resume")
              }
              onEdit={() => dispatch({ type: "open_edit" })}
              onDelete={() => dispatch({ type: "open_delete" })}
            />

            <PulseSummaryStats
              uptime={uptime}
              uptimeLabel={uptimePeriod}
              totalPings={uptimePoints.length}
              openFlairsCount={openFlairs.length}
              lastCheckedLabel={lastCheckedLabel}
              nextCheckLabel={nextCheckLabel}
            />

            <PulseUptimeSection
              uptimePeriod={uptimePeriod}
              uptimePoints={uptimePoints}
              desktopUptimePoints={desktopUptimePoints}
              uptimeDesktopPage={uptimeDesktopPage}
              uptimeDesktopPageCount={uptimeDesktopPageCount}
              isLoading={isUptimesLoading}
              isFreePlan={Boolean(isFreePlan)}
              onPeriodChange={(value) =>
                dispatch({ type: "set_uptime_period", value })
              }
              onPageChange={(value) =>
                dispatch({ type: "set_uptime_desktop_page", value })
              }
            />

            <PulseResponseTimesSection
              responseTimesPeriod={responseTimesPeriod}
              responseTimes={responseTimes}
              averageResponseTime={averageResponseTime}
              peakResponseTime={peakResponseTime}
              troughResponseTime={troughResponseTime}
              isLoading={isResponseTimesLoading}
              isFreePlan={Boolean(isFreePlan)}
              onPeriodChange={(value) =>
                dispatch({ type: "set_response_times_period", value })
              }
            />

            <PulseFlairsSection
              flairs={pulse.flairs}
              openFlairsCount={openFlairs.length}
            />
          </>
        )}
      </div>

      {pulse ? (
        <PulseDetailModals
          pulse={pulse}
          uiState={uiState}
          isFreePlan={Boolean(isFreePlan)}
          canDelete={Boolean(deleteMatches)}
          isSaving={editPulse.isPending}
          isDeleting={deletePulse.isPending}
          deleteErrorMessage={
            deletePulse.error instanceof Error
              ? deletePulse.error.message
              : (deletePulse.error as any)?.response?.data?.message
          }
          onFormChange={(updater) =>
            dispatch({
              type: "set_edit_form",
              value:
                typeof updater === "function"
                  ? updater(uiState.editForm)
                  : updater,
            })
          }
          onCloseEdit={() => {
            dispatch({ type: "close_edit" });
            dispatch({
              type: "set_edit_form",
              value: getPulseEditForm(pulse),
            });
          }}
          onSaveEdit={() => editPulse.mutate()}
          onDeleteValueChange={(value) =>
            dispatch({ type: "set_delete_value", value })
          }
          onCloseDelete={() => dispatch({ type: "close_delete" })}
          onDelete={() => deletePulse.mutate()}
        />
      ) : null}
    </AppLayout>
  );
}
