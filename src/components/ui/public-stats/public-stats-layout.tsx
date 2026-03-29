import type { ReactNode } from "react";

type PublicStatsLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  titleClassName?: string;
};

export function PublicStatsLayout({
  eyebrow,
  title,
  description,
  children,
  titleClassName = "",
}: PublicStatsLayoutProps) {
  return (
    <main className="h-dvh overflow-y-scroll bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 border-b border-[#1f1f1f] pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#666]">
            {eyebrow}
          </p>
          <h1
            className={`mt-2 max-w-full overflow-hidden text-2xl font-semibold tracking-[-0.03em] break-words text-[#f5f5f5] sm:text-3xl ${titleClassName}`}
          >
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#8a8a8a]">
            {description}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}
