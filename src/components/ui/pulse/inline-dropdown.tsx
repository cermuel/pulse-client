import { useEffect, useRef, useState } from "react";

type InlineDropdownProps = {
  label: string;
  value: string;
  options: readonly { label: string; value: string }[];
  onChange: (value: string) => void;
  disabledOptions?: readonly string[];
  disabledReason?: string;
  className?: string;
};

export function InlineDropdown({
  label,
  value,
  options,
  onChange,
  disabledOptions = [],
  disabledReason,
  className = "",
}: InlineDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        title={disabledReason}
        className="inline-flex cursor-pointer items-center justify-between gap-3 border border-[#1f1f1f] bg-[#111] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#555] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
      >
        <span>
          {label}: {value}
        </span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className={`${className} absolute right-0 top-[calc(100%+8px)] z-20 min-w-full overflow-y-scroll border border-[#1f1f1f] bg-[#111] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)]`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={disabledOptions.includes(option.value)}
              title={
                disabledOptions.includes(option.value)
                  ? disabledReason
                  : undefined
              }
              onClick={() => {
                if (disabledOptions.includes(option.value)) return;
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest transition-colors ${
                disabledOptions.includes(option.value)
                  ? "cursor-not-allowed text-[#333]"
                  : value === option.label || value === option.value
                    ? "cursor-pointer bg-[#181818] text-[#fb923c]"
                    : "cursor-pointer text-[#666] hover:bg-[#161616] hover:text-[#f5f5f5]"
              }`}
            >
              {option.label}
              {disabledOptions.includes(option.value) ? " • upgrade" : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
