import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "#/components/layout/app-layout";
import { Skeleton } from "#/components/shared/skeleton";
import type { Flair } from "#/types/routes/dashboard";
import api from "#/lib/api";
import { formatDate, parseBackendDate } from "#/utils/helpers";

export const Route = createFileRoute("/dashboard/flairs/")({
  component: FlairsPage,
});

function FlairsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const perPageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!perPageRef.current?.contains(event.target as Node)) {
        setIsPerPageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["flairs", "list", { page, per_page: perPage, query }],
    queryFn: async () => {
      const res = await api.get("/flair", {
        params: {
          page,
          per_page: perPage,
          query: query || undefined,
        },
      });
      return res.data;
    },
  });

  const flairs: Flair[] = useMemo(
    () =>
      (data?.flairs ?? [])
        .slice()
        .sort(
          (a: Flair, b: Flair) =>
            parseBackendDate(b.startedAt).getTime() -
            parseBackendDate(a.startedAt).getTime(),
        ),
    [data?.flairs],
  );
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

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

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-sm">
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setPage(1);
                setQuery(event.target.value);
              }}
              placeholder="Search by pulse name, URL, or cause"
              className="w-full border border-[#1f1f1f] bg-[#111] px-4 py-3 font-mono text-[12px] text-[#f5f5f5] placeholder-[#333] outline-none transition-colors focus:border-[#fb923c]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
              {total} total
            </p>

            <div ref={perPageRef} className="relative">
              <button
                type="button"
                onClick={() => setIsPerPageOpen((current) => !current)}
                className="inline-flex cursor-pointer items-center justify-between gap-3 border border-[#1f1f1f] bg-[#111] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#555] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
              >
                <span>{perPage} per page</span>
                <span
                  className={`transition-transform ${isPerPageOpen ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </button>

              {isPerPageOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-full border border-[#1f1f1f] bg-[#111] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                  {[10, 20, 30, 50].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setPerPage(value);
                        setPage(1);
                        setIsPerPageOpen(false);
                      }}
                      className={`block w-full cursor-pointer px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest transition-colors ${
                        perPage === value
                          ? "bg-[#181818] text-[#fb923c]"
                          : "text-[#666] hover:bg-[#161616] hover:text-[#f5f5f5]"
                      }`}
                    >
                      {value} per page
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border border-[#1f1f1f] bg-[#111]">
          <div className="border-b border-[#1f1f1f] px-4 py-4 sm:px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
              Results
            </p>
          </div>

          {isLoading ? (
            <FlairsListSkeleton />
          ) : flairs.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#333]">
                No flairs found
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
                    {flairs.map((flair) => (
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
                                flair.isResolved ? "bg-green-500" : "bg-red-500"
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
                {flairs.map((flair) => (
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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
            Page {page} of {Math.max(totalPages, 1)}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="cursor-pointer border border-[#1f1f1f] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#555] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  current < totalPages ? current + 1 : current,
                )
              }
              disabled={page >= totalPages}
              className="cursor-pointer border border-[#1f1f1f] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#555] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function FlairsListSkeleton() {
  return (
    <div className="divide-y divide-[#1a1a1a]">
      {[...Array(5)].map((_, index) => (
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
