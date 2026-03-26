type MiniStatProps = {
  label: string;
  value: string | number;
  tone?: "green" | "red" | "orange";
};

export function MiniStat({ label, value, tone }: MiniStatProps) {
  const toneClass =
    tone === "green"
      ? "text-green-500"
      : tone === "orange"
        ? "text-[#fb923c]"
        : tone === "red"
          ? "text-red-400"
          : "text-[#f5f5f5]";

  return (
    <div className="border border-[#1a1a1a] bg-[#0d0d0d] px-3 py-2">
      <p className="font-mono text-[9px] uppercase tracking-widest text-[#444]">
        {label}
      </p>
      <p className={`mt-0.5 text-[13px] font-semibold leading-tight ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
