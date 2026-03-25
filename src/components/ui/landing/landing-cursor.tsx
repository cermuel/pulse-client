import type { RefObject } from "react";

type LandingCursorProps = {
  cursorRef: RefObject<HTMLDivElement | null>;
  ringRef: RefObject<HTMLDivElement | null>;
};

export function LandingCursor({ cursorRef, ringRef }: LandingCursorProps) {
  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-9999 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--pulse-orange) transition-transform duration-100 md:block"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-9998 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(251,146,60,0.4)] transition-all duration-200 md:block"
      />
    </>
  );
}
