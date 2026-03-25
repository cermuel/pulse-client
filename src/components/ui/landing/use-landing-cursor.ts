import { useEffect, useRef } from "react";

export function useLandingCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let frameId = 0;

    const moveCursor = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX}px`;
        cursorRef.current.style.top = `${mouseY}px`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }

      frameId = window.requestAnimationFrame(animateRing);
    };

    const updateHoverState = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button");
      const scaleUp = event.type === "pointerover" && interactive;

      if (cursorRef.current) {
        cursorRef.current.style.transform = scaleUp
          ? "translate(-50%, -50%) scale(2)"
          : "translate(-50%, -50%) scale(1)";
      }

      if (ringRef.current) {
        ringRef.current.style.transform = scaleUp
          ? "translate(-50%, -50%) scale(1.5)"
          : "translate(-50%, -50%) scale(1)";
        ringRef.current.style.borderColor = scaleUp
          ? "rgba(251,146,60,0.8)"
          : "rgba(251,146,60,0.4)";
      }
    };

    document.addEventListener("pointermove", moveCursor);
    document.addEventListener("pointerover", updateHoverState);
    document.addEventListener("pointerout", updateHoverState);
    frameId = window.requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerover", updateHoverState);
      document.removeEventListener("pointerout", updateHoverState);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return { cursorRef, ringRef };
}
