import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "#/context/useUser";
import api from "../../lib/api";
import { AppLayout } from "#/components/layout/app-layout";
import { Skeleton } from "#/components/shared/skeleton";

export const Route = createFileRoute("/dashboard/$id")({
  component: RouteComponent,
});

type Ping = {
  isUp: boolean;
  createdAt?: string;
};

type Flair = {
  id: string;
  cause: string;
  isResolved: boolean;
  resolvedAt: string | null;
  startedAt: string;
};

type Pulse = {
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
  flairs: Flair[];
};

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");
  const [editError, setEditError] = useState<string>("");
  const [now, setNow] = useState(() => Date.now());
  const [editForm, setEditForm] = useState({
    publicId: "",
    name: "",
    interval: 300,
    expectedStatus: 200,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["pulse", id],
    queryFn: async () => {
      const res = await api.get(`/pulse/${id}`);
      return res.data.pulse as Pulse;
    },
  });

  const pulse = data;

  useEffect(() => {
    if (!pulse) return;

    setEditForm({
      publicId: pulse.publicId ?? "",
      name: pulse.name ?? "",
      interval: pulse.interval,
      expectedStatus: pulse.expectedStatus,
    });
  }, [pulse]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

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
      setEditError("");
      setIsEditOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["pulse", id] });
      await queryClient.invalidateQueries({ queryKey: ["pulses"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      setEditError(
        Array.isArray(message)
          ? message.join(", ")
          : typeof message === "string"
            ? message
            : "Couldn't update pulse",
      );
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

  const uptime =
    pulse && pulse.pings.length > 0
      ? Math.round(
          (pulse.pings.filter((p) => p.isUp).length / pulse.pings.length) * 100,
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
        new Date(pulse.lastCheckedAt).getTime() + pulse.interval * 1000,
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
                  onClick={() => {
                    setEditError("");
                    setIsEditOpen((current) => !current);
                  }}
                  className="cursor-pointer border border-[#1f1f1f] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteValue("");
                    setIsDeleteModalOpen(true);
                  }}
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
              />
              <StatCard label="Total pings" value={pulse.pings.length} />
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
            {pulse.pings.length > 0 && (
              <div className="mb-8 overflow-hidden border border-[#1f1f1f] bg-[#111]">
                <div className="flex flex-col gap-4 border-b border-[#1f1f1f] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                    PING HISTORY
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:min-w-70">
                    <MiniStat
                      label="Healthy"
                      value={pulse.pings.filter((ping) => ping.isUp).length}
                      tone="green"
                    />
                    <MiniStat
                      label="Failed"
                      value={pulse.pings.filter((ping) => !ping.isUp).length}
                      tone="red"
                    />
                    <MiniStat
                      label="Interval"
                      value={formatInterval(pulse.interval)}
                    />
                  </div>
                </div>

                <div className="px-4 py-5 sm:px-6">
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

                  <div className="overflow-x-auto">
                    <div className="flex min-w-120 items-end gap-1 rounded-sm">
                      {pulse.pings.slice(-80).map((ping, i, arr) => {
                        const isLatest = i === arr.length - 1;
                        return (
                          <div
                            key={i}
                            title={`${ping.isUp ? "Up" : "Down"}${ping.createdAt ? ` • ${formatDate(ping.createdAt)}` : ""}`}
                            className={`group relative flex-1 overflow-hidden rounded-xs transition-all hover:opacity-80 ${
                              ping.isUp ? "bg-green-500/85" : "bg-red-500/85"
                            } ${isLatest ? "ring-1 ring-[#f5f5f5]/20" : ""}`}
                            style={{
                              height: ping.isUp ? "56px" : "26px",
                            }}
                          >
                            <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flairs */}
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
                    .reverse()
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
          onChange={setEditForm}
          onClose={() => {
            setEditError("");
            setIsEditOpen(false);
            setEditForm({
              publicId: pulse.publicId ?? "",
              name: pulse.name ?? "",
              interval: pulse.interval,
              expectedStatus: pulse.expectedStatus,
            });
          }}
          onSave={() => editPulse.mutate()}
        />
      )}

      {pulse && isDeleteModalOpen && (
        <DeletePulseModal
          pulse={pulse}
          confirmationValue={deleteValue}
          onConfirmationChange={setDeleteValue}
          canDelete={Boolean(deleteMatches)}
          isDeleting={deletePulse.isPending}
          errorMessage={
            deletePulse.error instanceof Error
              ? deletePulse.error.message
              : (deletePulse.error as any)?.response?.data?.message
          }
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => deletePulse.mutate()}
        />
      )}
    </AppLayout>
  );
}

function StatusDot({ status }: { status: "up" | "down" | "pending" }) {
  if (status === "up")
    return (
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
    );
  if (status === "down")
    return <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />;
  return <span className="h-2 w-2 rounded-full bg-[#333]" />;
}

function StatCard({
  label,
  value,
  accent,
  meta,
}: {
  label: string;
  value: string | number;
  accent?: "green" | "orange" | "red";
  meta?: string;
}) {
  const colors = {
    green: "text-green-500",
    orange: "text-[#fb923c]",
    red: "text-red-400",
  };
  return (
    <div className="border border-[#1f1f1f] bg-[#111] px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        {label}
      </p>
      <p
        className={`mt-2 text-[26px] font-extrabold tracking-[-0.03em] tabular-nums ${
          accent ? colors[accent] : ""
        }`}
      >
        {value}
      </p>
      {meta ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444] tabular-nums">
          {meta}
        </p>
      ) : null}
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "green" | "red";
}) {
  const toneClass =
    tone === "green"
      ? "text-green-500"
      : tone === "red"
        ? "text-red-400"
        : "text-[#f5f5f5]";

  return (
    <div className="border border-[#1a1a1a] bg-[#0d0d0d] px-3 py-3">
      <p className="font-mono text-[9px] uppercase tracking-widest text-[#444]">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function PulseDetailSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-3 w-24 rounded-none mb-3" />
        <Skeleton className="h-8 w-64 rounded-none mb-2" />
        <Skeleton className="h-3 w-48 rounded-none" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-8 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-[#1f1f1f] bg-[#111] px-5 py-4">
            <Skeleton className="h-2.5 w-20 rounded-none mb-3" />
            <Skeleton className="h-7 w-12 rounded-none" />
          </div>
        ))}
      </div>
      <div className="border border-[#1f1f1f] bg-[#111] px-6 py-5 mb-8">
        <Skeleton className="h-2.5 w-20 rounded-none mb-4" />
        <Skeleton className="h-10 w-full rounded-none" />
      </div>
    </div>
  );
}

function timeAgo(dateStr: string, now = Date.now()) {
  const diff = now - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 1) return "0s ago";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function timeUntil(target: number, now = Date.now()) {
  const diff = target - now;
  if (diff <= 0) return "due now";
  const secs = Math.ceil(diff / 1000);
  if (secs < 60) return `in ${secs}s`;
  const mins = Math.ceil(secs / 60);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.ceil(mins / 60);
  return `in ${hrs}h`;
}

function formatInterval(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds % 3600 === 0) return `${seconds / 3600}h`;
  if (seconds % 60 === 0) return `${seconds / 60}m`;
  return `${seconds}s`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DeletePulseModal({
  pulse,
  confirmationValue,
  onConfirmationChange,
  canDelete,
  isDeleting,
  errorMessage,
  onClose,
  onDelete,
}: {
  pulse: Pulse;
  confirmationValue: string;
  onConfirmationChange: (value: string) => void;
  canDelete: boolean;
  isDeleting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md border border-[rgba(245,245,245,0.08)] bg-[#111] p-5 sm:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
          Delete pulse
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[#f5f5f5]">
          This action is permanent
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">
          Type{" "}
          <span className="text-[#f5f5f5]">{pulse.name || pulse.publicId}</span>{" "}
          or <span className="text-[#f5f5f5]">{pulse.publicId}</span> to confirm
          deletion.
        </p>

        <input
          type="text"
          value={confirmationValue}
          onChange={(event) => onConfirmationChange(event.target.value)}
          placeholder={pulse.name || pulse.publicId}
          className="mt-6 w-full border border-[rgba(245,245,245,0.14)] bg-[#161616] px-4 py-3 font-mono text-[12px] text-[#f5f5f5] outline-none transition-colors focus:border-[#fb923c]"
        />

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-400">
            {Array.isArray(errorMessage)
              ? errorMessage.join(", ")
              : errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center justify-center border border-[rgba(245,245,245,0.14)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete || isDeleting}
            className="inline-flex cursor-pointer items-center justify-center border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDeleting ? "Deleting..." : "Delete pulse"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditPulseModal({
  pulse,
  isFreePlan,
  form,
  errorMessage,
  isSaving,
  onChange,
  onClose,
  onSave,
}: {
  pulse: Pulse;
  isFreePlan: boolean;
  form: {
    publicId: string;
    name: string;
    interval: number;
    expectedStatus: number;
  };
  errorMessage?: string;
  isSaving: boolean;
  onChange: React.Dispatch<
    React.SetStateAction<{
      publicId: string;
      name: string;
      interval: number;
      expectedStatus: number;
    }>
  >;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl border border-[rgba(245,245,245,0.08)] bg-[#111] p-5 sm:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
          Edit pulse
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[#f5f5f5]">
          Update monitor settings
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">
          Change the core pulse settings for{" "}
          <span className="text-[#f5f5f5]">{pulse.name || pulse.publicId}</span>
          .
        </p>

        {errorMessage && (
          <div className="mt-6 border border-red-500/20 bg-red-500/5 px-4 py-3 font-mono text-[11px] text-red-400">
            {errorMessage}
          </div>
        )}

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <input
            type="text"
            placeholder="Name (optional)"
            value={form.name}
            onChange={(event) =>
              onChange((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full border border-[#1f1f1f] bg-[#111] px-5 py-3.5 font-mono text-[13px] text-[#f5f5f5] placeholder-[#2a2a2a] outline-none transition-colors focus:border-[#fb923c]"
          />

          <div className="flex items-center border border-[#1f1f1f] bg-[#111] transition-colors focus-within:border-[#fb923c]">
            <span className="border-r border-[#1f1f1f] px-4 py-3.5 font-mono text-[11px] text-[#2a2a2a]">
              pulse.app/s/
            </span>
            <input
              type="text"
              placeholder="public-id (optional)"
              value={form.publicId}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  publicId: event.target.value,
                }))
              }
              className="flex-1 bg-transparent px-4 py-3.5 font-mono text-[13px] text-[#f5f5f5] placeholder-[#2a2a2a] outline-none"
            />
          </div>

          <div className="space-y-4 border border-[#1a1a1a] p-4">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                Check interval
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-0">
                {[
                  { label: "1m", value: 60 },
                  { label: "5m", value: 300 },
                  { label: "10m", value: 600 },
                  { label: "30m", value: 1800 },
                  { label: "1h", value: 3600 },
                ].map(({ label, value }) => {
                  const isDisabled = isFreePlan && value === 60;
                  return (
                    <div
                      key={value}
                      className={`group relative flex-1 ${isDisabled ? "z-10" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          !isDisabled &&
                          onChange((current) => ({
                            ...current,
                            interval: value,
                          }))
                        }
                        disabled={isDisabled}
                        className={`w-full border py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors sm:border-b sm:border-r sm:border-t sm:first:border-l ${
                          form.interval === value
                            ? "border-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]"
                            : isDisabled
                              ? "cursor-not-allowed border-[#1f1f1f] bg-[#0e0e0e] text-[#2f2f2f] line-through"
                              : "cursor-pointer border-[#1f1f1f] bg-[#0e0e0e] text-[#444] hover:text-[#f5f5f5]"
                        }`}
                      >
                        {label}
                      </button>
                      {isDisabled && (
                        <div className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border border-[#2a2a2a] bg-[#0b0b0b] px-3 py-2 font-mono text-[10px] text-[#f5f5f5] shadow-[0_12px_24px_rgba(0,0,0,0.35)] group-hover:block">
                          1m checks are available on Pro only.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                Expected status
              </p>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-0">
                {[200, 201, 204, 301, 302].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      onChange((current) => ({
                        ...current,
                        expectedStatus: status,
                      }))
                    }
                    className={`cursor-pointer border py-2.5 font-mono text-[10px] tracking-wider transition-colors sm:flex-1 sm:border-b sm:border-r sm:border-t sm:first:border-l ${
                      form.expectedStatus === status
                        ? "border-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]"
                        : "border-[#1f1f1f] bg-[#0e0e0e] text-[#444] hover:text-[#f5f5f5]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center justify-center border border-[rgba(245,245,245,0.14)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex cursor-pointer items-center justify-center bg-[#fb923c] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
