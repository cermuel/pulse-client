type StatCardProps = {
  label: string;
  value: string | number;
  accent?: "green" | "orange" | "red";
  meta?: string;
};

export function StatCard({ label, value, accent, meta }: StatCardProps) {
  const colors = {
    green: "text-green-500",
    orange: "text-[#fb923c]",
    red: "text-red-400",
  };

  return (
    <div className="border border-[#1f1f1f] bg-[#111] px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        {label}
      </p>
      <p
        className={`mt-2 text-[26px] font-extrabold tracking-[-0.03em] tabular-nums ${
          accent ? colors[accent] : ""
        }`}
      >
        {value}
      </p>
      {meta ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#444] tabular-nums">
          {meta}
        </p>
      ) : null}
    </div>
  );
}
