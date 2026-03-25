type SectionHeaderProps = {
  tag: string;
  title?: string;
  centered?: boolean;
};

export function SectionHeader({
  tag,
  title,
  centered = false,
}: SectionHeaderProps) {
  return (
    <>
      <div
        className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-(--pulse-orange) font-mono ${
          centered ? "justify-center" : ""
        }`}
      >
        {tag}
      </div>
      {title && (
        <h2
          className={`mt-5 max-w-150 text-[clamp(36px,5vw,64px)] leading-none font-extrabold tracking-[-0.03em] ${
            centered ? "mx-auto text-center" : ""
          }`}
        >
          {title.split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h2>
      )}
    </>
  );
}
