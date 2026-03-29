type PublicTooltipBarProps = {
  label: string;
  tone: "green" | "orange" | "red" | "neutral";
  height: string;
  widthClassName?: string;
};

export function PublicTooltipBar({
  label,
  tone,
  height,
  widthClassName = "flex-1",
}: PublicTooltipBarProps) {
  const toneClass =
    tone === "green"
      ? "bg-green-500/85"
      : tone === "orange"
        ? "bg-[#fb923c]/85"
        : tone === "red"
          ? "bg-red-500/85"
          : "bg-[#2a2a2a]";

  return (
    <div className={`group relative flex h-full items-end ${widthClassName}`}>
      <div className="flex h-full w-full items-end">
        <div
          className={`w-full rounded-xs ${toneClass} transition-opacity group-hover:opacity-85`}
          style={{ height }}
          aria-label={label}
        />
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-56 -translate-x-1/2 rounded-sm bg-[#f5f5f5] px-2 py-1.5 text-center font-mono text-[10px] leading-4 text-[#111111] opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-opacity group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
}
