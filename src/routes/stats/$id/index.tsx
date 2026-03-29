import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicPulseSummaryCard } from "#/components/ui/public-stats/public-pulse-summary-card";
import { PublicStatsLayout } from "#/components/ui/public-stats/public-stats-layout";
import { Skeleton } from "#/components/shared/skeleton";
import api from "#/lib/api";
import type { PublicUserStatsResponse } from "#/types/routes/public-stats";
import { useNow } from "#/hooks/use-now";
import { sortPublicPulses } from "#/utils/public-stats";

export const Route = createFileRoute("/stats/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const now = useNow();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public-stats", id],
    queryFn: async () => {
      const res = await api.get(`/stats/${id}`);
      return res.data as PublicUserStatsResponse;
    },
  });

  const pulses = sortPublicPulses(data?.pulses ?? []);
  const errorMessage =
    error instanceof Error ? error.message : "Unable to load public stats right now.";

  return (
    <PublicStatsLayout
      eyebrow="Public stats"
      title={`${id}'s monitored services`}
      titleClassName="max-w-4xl break-all sm:break-words"
      description="A live public snapshot of service health, recent uptime, and check cadence across every published monitor."
    >
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-none" />
          ))}
        </div>
      ) : isError ? (
        <div className="border border-red-500/20 bg-red-500/6 px-5 py-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-400">
            Couldn&apos;t load stats
          </p>
          <p className="mt-3 text-sm text-[#c8c8c8]">{errorMessage}</p>
        </div>
      ) : pulses.length === 0 ? (
        <div className="border border-[#1f1f1f] bg-[#111111]/90 px-5 py-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#666]">
            No public monitors yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pulses.map((pulse) => (
            <PublicPulseSummaryCard
              key={pulse.publicId}
              ownerId={id}
              pulse={pulse}
              now={now}
            />
          ))}
        </div>
      )}
    </PublicStatsLayout>
  );
}
