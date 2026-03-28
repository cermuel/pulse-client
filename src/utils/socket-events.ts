import type { QueryClient } from "@tanstack/react-query";
import type { Pulse } from "#/types/routes/dashboard";
import type {
  Ping,
  PingDetails,
  PulseDetail,
  ResponseTimePoint,
  UptimePoint,
} from "#/types/routes/pulse-detail";

export function getPulseRouteId(pathname: string) {
  const match = pathname.match(/^\/dashboard\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function syncNewPingIntoCache(queryClient: QueryClient, ping: PingDetails) {
  const createdAt = toIsoString(ping.createdAt);

  queryClient.setQueryData<PulseDetail>(["pulse", ping.pulseId], (current) => {
    if (!current) return current;

    return {
      ...current,
      lastCheckedAt: createdAt,
      pings: appendUniquePing(current.pings, {
        isUp: ping.isUp,
        createdAt,
      }),
    };
  });

  const uptimeQueries = queryClient.getQueriesData<UptimePoint[]>({
    queryKey: ["pulse", ping.pulseId, "uptimes"],
  });

  for (const [queryKey, points] of uptimeQueries) {
    if (!points) continue;

    queryClient.setQueryData<UptimePoint[]>(queryKey, [
      ...points.filter((point) => toIsoString(point.createdAt) !== createdAt),
      {
        isUp: ping.isUp,
        createdAt,
      },
    ]);
  }

  const responseTimeQueries = queryClient.getQueriesData<ResponseTimePoint[]>({
    queryKey: ["pulse", ping.pulseId, "response-times"],
  });

  for (const [queryKey, points] of responseTimeQueries) {
    if (!points) continue;

    queryClient.setQueryData<ResponseTimePoint[]>(queryKey, [
      ...points.filter((point) => toIsoString(point.createdAt) !== createdAt),
      {
        responseTime: ping.responseTime,
        createdAt,
      },
    ]);
  }
}

export function getPulseLabel(queryClient: QueryClient, pulseId: string) {
  const pulseDetail = queryClient.getQueryData<PulseDetail>(["pulse", pulseId]);
  if (pulseDetail) {
    return pulseDetail.name || pulseDetail.publicId || pulseDetail.url;
  }

  const pulseQueries = queryClient.getQueriesData<{ pulses?: Pulse[] }>({
    queryKey: ["pulses"],
  });

  for (const [, result] of pulseQueries) {
    const pulse = result?.pulses?.find((item) => item.id === pulseId);
    if (pulse) return pulse.name || pulse.url;
  }

  return "Pulse";
}

function appendUniquePing(pings: Ping[], nextPing: Ping) {
  const nextCreatedAt = toIsoString(nextPing.createdAt);
  const filteredPings = pings.filter(
    (ping) => toIsoString(ping.createdAt) !== nextCreatedAt,
  );

  return [...filteredPings, nextPing];
}

function toIsoString(value?: string | Date) {
  if (!value) return "";
  return value instanceof Date ? value.toISOString() : value;
}
