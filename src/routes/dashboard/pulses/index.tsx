import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AppLayout } from "#/components/layout/app-layout";
import { Skeleton } from "#/components/shared/skeleton";
import type { Pulse } from "#/types/routes/dashboard";
import api from "#/lib/api";

export const Route = createFileRoute("/dashboard/pulses/")({
  component: PulsesPage,
});

function PulsesPage() {
  const queryClient = useQueryClient();
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
    queryKey: ["pulses", "list", { page, per_page: perPage, query }],
    queryFn: async () => {
      const res = await api.get("/pulse", {
        params: {
          page,
          per_page: perPage,
          query: query || undefined,
        },
      });
      return res.data;
    },
  });

  const pulses: Pulse[] = data?.pulses ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const pauseResumePulse = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: string;
      action: "pause" | "resume";
    }) => {
      const res = await api.patch(`/pulse/${id}/${action}`);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pulses"] });
      await queryClient.invalidateQueries({ queryKey: ["pulse"] });
    },
  });

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
              Pulses
            </p>

            <p className="mt-2 text-sm leading-6 text-[#7a7a7a]">
              Search, browse, and manage every pulse attached to your account.
            </p>
          </div>

          <Link
            to="/dashboard/pulses/new"
            className="inline-flex w-full items-center justify-center gap-2 bg-[#fb923c] px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5] sm:w-auto"
          >
            <span>+</span>
            <span>New pulse</span>
          </Link>
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
              placeholder="Search by name or URL"
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
            <PulsesListSkeleton />
          ) : pulses.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#333]">
                No pulses found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1a1a1a]">
              {pulses.map((pulse) => {
                const isMutatingPulse =
                  pauseResumePulse.isPending &&
                  pauseResumePulse.variables?.id === pulse.id;

                return (
                  <div
                    key={pulse.id}
                    className="px-4 py-4 transition-colors hover:bg-[#141414] sm:px-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <Link
                        to="/dashboard/$id"
                        params={{ id: pulse.id }}
                        className="min-w-0 flex-1"
                      >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#f5f5f5]">
                        {pulse.name || "Untitled pulse"}
                      </p>
                      <p className="mt-1 break-all font-mono text-[11px] text-[#666]">
                        {pulse.url}
                      </p>
                    </div>
                      </Link>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span className="border border-[#1f1f1f] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#555]">
                          {pulse.method}
                        </span>
                        <span className="border border-[#1f1f1f] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#555]">
                          {pulse.interval}s
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                            pulse.isActive
                              ? "border-green-500/20 bg-green-500/5 text-green-500"
                              : "border-[#1f1f1f] text-[#444]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              pulse.isActive
                                ? "bg-green-500 animate-pulse"
                                : "bg-[#333]"
                            }`}
                          />
                          {pulse.isActive ? "Active" : "Paused"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            pauseResumePulse.mutate({
                              id: pulse.id,
                              action: pulse.isActive ? "pause" : "resume",
                            })
                          }
                          disabled={isMutatingPulse}
                          className="cursor-pointer border border-[#1f1f1f] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isMutatingPulse
                            ? pulse.isActive
                              ? "Pausing..."
                              : "Resuming..."
                            : pulse.isActive
                              ? "Pause"
                              : "Resume"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

function PulsesListSkeleton() {
  return (
    <div className="divide-y divide-[#1a1a1a]">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40 rounded-none" />
              <Skeleton className="mt-2 h-3 w-3/4 rounded-none" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-16 rounded-none" />
              <Skeleton className="h-7 w-18 rounded-none" />
              <Skeleton className="h-7 w-20 rounded-none" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
