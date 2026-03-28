import { StatusDot } from "#/components/ui/pulse/status-dot";
import type { PulseDetail } from "#/types/routes/pulse-detail";

type PulseDetailHeaderProps = {
  pulse: PulseDetail;
  status: "up" | "down" | "pending";
  isPauseResumePending: boolean;
  onPauseResume: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PulseDetailHeader({
  pulse,
  status,
  isPauseResumePending,
  onPauseResume,
  onEdit,
  onDelete,
}: PulseDetailHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-3">
          <StatusDot status={status} />
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
            {pulse.publicId}
          </p>
        </div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em]">
          {pulse.name || pulse.url}
        </h1>
        <p className="mt-1 font-mono text-[12px] text-[#555]">{pulse.url}</p>
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
          onClick={onPauseResume}
          disabled={isPauseResumePending}
          className="cursor-pointer border border-[#1f1f1f] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPauseResumePending
            ? pulse.isActive
              ? "Pausing..."
              : "Resuming..."
            : pulse.isActive
              ? "Pause"
              : "Resume"}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer border border-[#1f1f1f] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer border border-red-500/20 bg-red-500/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
