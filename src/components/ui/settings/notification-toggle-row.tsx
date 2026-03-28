type NotificationToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function NotificationToggleRow({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: NotificationToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#f5f5f5]">{label}</p>
        <p className="mt-1 text-sm leading-6 text-[#666]">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
          checked
            ? "border-[#fb923c] bg-[#fb923c]/20"
            : "border-[#1f1f1f] bg-[#151515]"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 rounded-full transition-transform ${
            checked ? "translate-x-4 bg-[#fb923c]" : "translate-x-px bg-[#555]"
          }`}
        />
      </button>
    </div>
  );
}
