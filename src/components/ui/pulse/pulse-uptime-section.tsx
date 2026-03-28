import { Skeleton } from "#/components/shared/skeleton";
import { InlineDropdown } from "#/components/ui/pulse/inline-dropdown";
import { DESKTOP_UPTIME_PAGE_SIZE, PERIOD_OPTIONS } from "#/constants/pulse";
import { formatDate } from "#/utils/helpers";
import type { Period, UptimePoint } from "#/types/routes/pulse-detail";

type PulseUptimeSectionProps = {
  uptimePeriod: Period;
  uptimePoints: UptimePoint[];
  desktopUptimePoints: UptimePoint[];
  uptimeDesktopPage: number;
  uptimeDesktopPageCount: number;
  isLoading: boolean;
  isFreePlan: boolean;
  onPeriodChange: (value: Period) => void;
  onPageChange: (value: number) => void;
};

export function PulseUptimeSection({
  uptimePeriod,
  uptimePoints,
  desktopUptimePoints,
  uptimeDesktopPage,
  uptimeDesktopPageCount,
  isLoading,
  isFreePlan,
  onPeriodChange,
  onPageChange,
}: PulseUptimeSectionProps) {
  return (
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
          onChange={(value) => onPeriodChange(value as Period)}
          disabledOptions={isFreePlan ? ["7 days", "28 days", "365 days"] : []}
          disabledReason="Upgrade your plan to unlock 7 days, 28 days, and 365 days."
          className="h-32!"
        />
      </div>

      <div className="px-4 py-5 sm:px-6">
        {isLoading ? (
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
                {uptimePoints.map((ping, index, points) => (
                  <UptimeBar
                    key={`${ping.createdAt ?? "uptime"}-${index}`}
                    ping={ping}
                    isLatest={index === points.length - 1}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center gap-3">
                {uptimePoints.length > DESKTOP_UPTIME_PAGE_SIZE ? (
                  <button
                    type="button"
                    onClick={() => onPageChange(Math.max(0, uptimeDesktopPage - 1))}
                    disabled={uptimeDesktopPage === 0}
                    className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-[#1f1f1f] bg-[#111] font-mono text-sm text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Show previous uptime checks"
                  >
                    ‹
                  </button>
                ) : null}

                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-end gap-1 rounded-sm">
                    {desktopUptimePoints.map((ping, index, points) => (
                      <UptimeBar
                        key={`${ping.createdAt ?? "desktop-uptime"}-${index}`}
                        ping={ping}
                        isLatest={index === points.length - 1}
                      />
                    ))}
                  </div>
                </div>

                {uptimePoints.length > DESKTOP_UPTIME_PAGE_SIZE ? (
                  <button
                    type="button"
                    onClick={() =>
                      onPageChange(
                        Math.min(uptimeDesktopPageCount - 1, uptimeDesktopPage + 1),
                      )
                    }
                    disabled={uptimeDesktopPage >= uptimeDesktopPageCount - 1}
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
  );
}

function UptimeBar({
  ping,
  isLatest,
  compact = false,
}: {
  ping: UptimePoint;
  isLatest: boolean;
  compact?: boolean;
}) {
  return (
    <div
      title={`${ping.isUp ? "Up" : "Down"}${ping.createdAt ? ` • ${formatDate(ping.createdAt)}` : ""}`}
      className={`group relative overflow-hidden rounded-xs transition-all hover:opacity-80 ${
        compact ? "w-3 shrink-0 sm:w-4" : "flex-1"
      } ${ping.isUp ? "bg-green-500/85" : "bg-red-500/85"} ${
        isLatest ? "ring-1 ring-[#f5f5f5]/20" : ""
      }`}
      style={{
        height: ping.isUp ? "60px" : "40px",
      }}
    >
      <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
    </div>
  );
}
