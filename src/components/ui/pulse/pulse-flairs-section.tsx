import { Link } from "@tanstack/react-router";
import { formatDate, parseBackendDate } from "#/utils/helpers";
import type { PulseFlair } from "#/types/routes/pulse-detail";

type PulseFlairsSectionProps = {
  flairs: PulseFlair[];
  openFlairsCount: number;
};

export function PulseFlairsSection({
  flairs,
  openFlairsCount,
}: PulseFlairsSectionProps) {
  return (
    <div className="border border-[#1f1f1f]">
      <div className="flex items-center justify-between border-b border-[#1f1f1f] px-6 py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
          Flairs
        </p>
        {openFlairsCount > 0 ? (
          <span className="font-mono text-[10px] text-red-400">
            {openFlairsCount} open
          </span>
        ) : null}
      </div>

      {flairs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#2a2a2a]">
            No incidents
          </p>
        </div>
      ) : (
        <div>
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
                className="block border-b border-[#191919] px-4 py-4 transition-colors hover:bg-[#141414] last:border-0 sm:px-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <span
                    className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      flair.isResolved
                        ? "bg-green-500"
                        : "animate-pulse bg-red-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
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
  );
}
