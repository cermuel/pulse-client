type StatusDotProps = {
  status: "up" | "down" | "pending";
};

export function StatusDot({ status }: StatusDotProps) {
  if (status === "up")
    return (
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
    );

  if (status === "down") {
    return <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />;
  }

  return <span className="h-2 w-2 rounded-full bg-[#333]" />;
}
