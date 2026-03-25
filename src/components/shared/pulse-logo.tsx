type PulseLogoProps = {
  className?: string;
  size?: number;
  animated?: boolean;
};

export function PulseLogo({
  className = "",
  size = 28,
  animated = true,
}: PulseLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        className="fill-[#111] stroke-[rgba(245,245,245,0.1)]"
      />

      <path
        d="M5 16H10L12.4 11L16 22L19.2 13.5L21.1 16H27"
        className="stroke-[#7c3b13]"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 16H10L12.4 11L16 22L19.2 13.5L21.1 16H27"
        className={`stroke-[#fb923c] ${animated ? "motion-safe:animate-[pulse-logo-dash_2.2s_linear_infinite]" : ""}`}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 48"
      />

      <circle
        cx="5"
        cy="16"
        r="1.4"
        className={`fill-[#fb923c] ${animated ? "motion-safe:animate-[pulse-dot_2s_ease-in-out_infinite]" : ""}`}
      />
    </svg>
  );
}
