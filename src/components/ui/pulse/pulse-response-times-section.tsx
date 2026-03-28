import { ResponseTimeChart } from "#/components/shared/response-time-chart";
import { InlineDropdown } from "#/components/ui/pulse/inline-dropdown";
import { MiniStat } from "#/components/ui/pulse/mini-stat";
import { PERIOD_OPTIONS, PREMIUM_PERIODS } from "#/constants/pulse";
import type { Period, ResponseTimePoint } from "#/types/routes/pulse-detail";

type PulseResponseTimesSectionProps = {
  responseTimesPeriod: Period;
  responseTimes: ResponseTimePoint[];
  averageResponseTime: number | null;
  peakResponseTime: number | null;
  troughResponseTime: number | null;
  isLoading: boolean;
  isFreePlan: boolean;
  onPeriodChange: (value: Period) => void;
};

export function PulseResponseTimesSection({
  responseTimesPeriod,
  responseTimes,
  averageResponseTime,
  peakResponseTime,
  troughResponseTime,
  isLoading,
  isFreePlan,
  onPeriodChange,
}: PulseResponseTimesSectionProps) {
  return (
    <div className="mb-8 overflow-hidden border border-[#1f1f1f] bg-[#111]">
      <div className="flex flex-col gap-4 border-b border-[#1f1f1f] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
            RESPONSE TIMES
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444]">
            Live monitor latency trend for {responseTimesPeriod.toLowerCase()}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <InlineDropdown
            label="Period"
            value={responseTimesPeriod}
            options={PERIOD_OPTIONS}
            onChange={(value) => onPeriodChange(value as Period)}
            disabledOptions={isFreePlan ? PREMIUM_PERIODS : []}
            disabledReason="Upgrade your plan to unlock 7 days, 28 days, and 365 days."
          />
          <div className="grid grid-cols-3 gap-2 sm:min-w-70">
            <MiniStat
              label="Peak"
              value={
                isLoading
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
                isLoading
                  ? "..."
                  : averageResponseTime !== null
                    ? `${averageResponseTime}ms`
                    : "—"
              }
            />
            <MiniStat
              label="Trough"
              value={
                isLoading
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
        {isLoading ? (
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
  );
}
