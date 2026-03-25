import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "#/components/layout/app-layout";
import { Skeleton } from "#/components/shared/skeleton";
import type { Flair } from "#/types/routes/dashboard";
import api from "#/lib/api";

export const Route = createFileRoute("/dashboard/flairs/$id")({
  component: FlairDetailPage,
});

function FlairDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["flair", id],
    queryFn: async () => {
      const res = await api.get(`/flair/${id}`);
      return res.data.flair as Flair;
    },
  });

  const flair = data;

  return (
    <AppLayout>
      <div className="max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <button
          onClick={() => navigate({ to: "/dashboard/flairs" })}
          className="mb-7 flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:text-[#fb923c]"
        >
          ← Back
        </button>

        {isLoading ? (
          <FlairDetailSkeleton />
        ) : !flair ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#333]">
              Flair not found
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                      flair.isResolved
                        ? "border-green-500/20 bg-green-500/5 text-green-500"
                        : "border-red-500/20 bg-red-500/5 text-red-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        flair.isResolved ? "bg-green-500" : "bg-red-500 animate-pulse"
                      }`}
                    />
                    {flair.isResolved ? "Resolved" : "Open"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fb923c]">
                    Flair
                  </span>
                </div>
                <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">
                  {flair.cause || "Service unreachable"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a7a7a]">
                  Started {formatDate(flair.startedAt)}
                  {flair.isResolved && flair.resolvedAt
                    ? ` · Resolved ${formatDate(flair.resolvedAt)}`
                    : " · Incident still open"}
                </p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DetailCard label="Started" value={timeAgo(flair.startedAt)} />
              <DetailCard
                label="Resolved"
                value={
                  flair.isResolved && flair.resolvedAt
                    ? timeAgo(flair.resolvedAt)
                    : "Still open"
                }
                tone={flair.isResolved ? "green" : "red"}
              />
              <DetailCard
                label="Timeline events"
                value={flair.logs?.length ?? 0}
              />
            </div>

            {flair.pulse ? (
              <Link
                to="/dashboard/$id"
                params={{ id: flair.pulse.id }}
                className="mb-8 block border border-[#1f1f1f] bg-[#111] px-4 py-5 transition-colors hover:border-[#fb923c] hover:bg-[#151515] sm:px-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
                  Pulse
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm font-medium text-[#f5f5f5]">
                    {flair.pulse.name || flair.pulse.publicId}
                  </p>
                  <p className="break-all font-mono text-[11px] text-[#666]">
                    {flair.pulse.url}
                  </p>
                </div>
              </Link>
            ) : null}

            <div className="border border-[#1f1f1f] bg-[#111]">
              <div className="border-b border-[#1f1f1f] px-4 py-4 sm:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                  Timeline
                </p>
              </div>

              {flair.logs?.length ? (
                <div className="px-4 py-5 sm:px-6">
                  <div className="relative pl-8">
                    <div className="absolute bottom-2 left-[9px] top-2 w-px bg-[#1f1f1f]" />
                  {flair.logs
                    .slice()
                    .sort(
                      (a, b) =>
                        parseBackendDate(b.createdAt).getTime() -
                        parseBackendDate(a.createdAt).getTime(),
                    )
                    .map((log) => (
                      <div
                        key={log.id}
                        className="relative pb-6 last:pb-0"
                      >
                        <span
                          className="absolute left-[-24px] top-2.5 h-2.5 w-2.5 rounded-full bg-[#2f2f2f]"
                        />
                        <div className={`rounded-sm border px-4 py-4 ${getLogTone(log.type).card}`}>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${getLogTone(log.type).badge}`}
                                >
                                  {formatLogType(log.type)}
                                </span>
                                <span className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
                                  {timeAgo(log.createdAt)}
                                </span>
                              </div>
                              <p className="mt-3 text-sm leading-6 text-[#f5f5f5]">
                                {log.message}
                              </p>
                            </div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] sm:shrink-0">
                              {formatDate(log.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-12 text-center sm:px-6">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#333]">
                    No logs found
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function DetailCard({
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
    <div className="border border-[#1f1f1f] bg-[#111] px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        {label}
      </p>
      <p className={`mt-2 text-[24px] font-extrabold tracking-[-0.03em] ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function FlairDetailSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="mb-3 h-3 w-24 rounded-none" />
        <Skeleton className="mb-2 h-8 w-72 rounded-none" />
        <Skeleton className="h-3 w-64 rounded-none" />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-[#1f1f1f] bg-[#111] px-5 py-4">
            <Skeleton className="mb-3 h-2.5 w-20 rounded-none" />
            <Skeleton className="h-7 w-16 rounded-none" />
          </div>
        ))}
      </div>
      <div className="border border-[#1f1f1f] bg-[#111] px-6 py-5">
        <Skeleton className="mb-4 h-2.5 w-20 rounded-none" />
        <Skeleton className="mb-3 h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-2/3 rounded-none" />
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parseBackendDate(dateStr));
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - parseBackendDate(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function parseBackendDate(dateStr: string) {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(dateStr);
  return new Date(hasTimezone ? dateStr : `${dateStr}Z`);
}

function formatLogType(type: string) {
  return type.replace(/-/g, " ");
}

function getLogTone(type: string) {
  switch (type) {
    case "service-down":
      return {
        badge: "border-red-500/20 bg-red-500/5 text-red-400",
        card: "border-red-500/10 bg-red-500/[0.04]",
      };
    case "service-resolved":
      return {
        badge: "border-green-500/20 bg-green-500/5 text-green-500",
        card: "border-green-500/10 bg-green-500/[0.04]",
      };
    case "email-sent":
      return {
        badge: "border-[#fb923c]/20 bg-[#fb923c]/5 text-[#fb923c]",
        card: "border-[#fb923c]/10 bg-[#fb923c]/[0.04]",
      };
    default:
      return {
        badge: "border-[#1f1f1f] bg-[#111] text-[#666]",
        card: "border-[#1a1a1a] bg-[#0d0d0d]",
      };
  }
}
