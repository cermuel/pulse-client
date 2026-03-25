import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "#/components/layout/app-layout";
import { Skeleton } from "#/components/shared/skeleton";
import type { Flair } from "#/types/routes/dashboard";
import api from "#/lib/api";

export const Route = createFileRoute("/dashboard/flairs/")({
  component: FlairsPage,
});

function FlairsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["flairs"],
    queryFn: async () => {
      const res = await api.get("/flair");
      return res.data;
    },
  });

  const flairs: Flair[] = data?.flairs ?? [];
  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
            Flairs
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a7a7a]">
            Track open incidents, resolved outages, and the timeline behind each
            flair.
          </p>
        </div>

        <div className="border border-[#1f1f1f] bg-[#111]">
          <div className="border-b border-[#1f1f1f] px-4 py-4 sm:px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
              All incidents
            </p>
          </div>

          {isLoading ? (
            <FlairsListSkeleton />
          ) : flairs.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#333]">
                No flairs yet
              </p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1f1f1f]">
                      {["Cause", "Status", "Started / Resolved", ""].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-[#333]"
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {flairs
                      .slice()
                      .sort(
                        (a, b) =>
                          parseBackendDate(b.startedAt).getTime() -
                          parseBackendDate(a.startedAt).getTime(),
                      )
                      .map((flair) => (
                        <tr
                          key={flair.id}
                          className="border-b border-[#1a1a1a] transition-colors hover:bg-[#141414]"
                        >
                          <td className="px-6 py-3 text-[13px] font-medium text-[#f5f5f5]">
                            {flair.cause || "Service unreachable"}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
                                flair.isResolved
                                  ? "text-green-500"
                                  : "text-red-400"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  flair.isResolved
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {flair.isResolved ? "Resolved" : "Open"}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-mono text-[11px] text-[#666]">
                            Started {formatDate(flair.startedAt)}
                            {flair.resolvedAt
                              ? ` · Resolved ${formatDate(flair.resolvedAt)}`
                              : ""}
                          </td>
                          <td className="px-6 py-3">
                            <Link
                              to="/dashboard/flairs/$id"
                              params={{ id: flair.id }}
                              className="font-mono text-[10px] uppercase tracking-widest text-[#333] transition-colors hover:text-[#fb923c]"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#1a1a1a] lg:hidden">
                {flairs
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
                      className="block px-4 py-3 transition-colors hover:bg-[#141414] sm:px-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[#f5f5f5]">
                            {flair.cause || "Service unreachable"}
                          </p>
                          <p className="mt-1.5 font-mono text-[10px] text-[#666]">
                            Started {formatDate(flair.startedAt)}
                            {flair.resolvedAt
                              ? ` · Resolved ${formatDate(flair.resolvedAt)}`
                              : ""}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 font-mono text-[10px] uppercase tracking-widest ${
                            flair.isResolved ? "text-green-500" : "text-red-400"
                          }`}
                        >
                          {flair.isResolved ? "Resolved" : "Open"}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function FlairsListSkeleton() {
  return (
    <div className="divide-y divide-[#1a1a1a]">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-none" />
                <Skeleton className="h-3 w-20 rounded-none" />
              </div>
              <Skeleton className="mt-2 h-4 w-3/4 rounded-none" />
              <Skeleton className="mt-1.5 h-3 w-40 rounded-none" />
            </div>
            <Skeleton className="h-3 w-24 rounded-none" />
          </div>
        </div>
      ))}
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

function parseBackendDate(dateStr: string) {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(dateStr);
  return new Date(hasTimezone ? dateStr : `${dateStr}Z`);
}
