import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { stats } from "./landing-data";

export function HeroStatsTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % stats.length);
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeStat = stats[index];

  return (
    <div className="mt-10 flex justify-center">
      <div className="w-full max-w-xl border border-(--pulse-border) bg-(--pulse-black-2) px-5 py-4 text-center shadow-[0_0_0_1px_rgba(245,245,245,0.02)]">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-(--pulse-muted)">
          <span>Live telemetry</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-(--pulse-orange)" />
            rotating
          </span>
        </div>

        <div className="relative h-20 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStat.label}
              initial={{ y: 42, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -42, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="font-mono text-[clamp(28px,4vw,42px)] font-bold tracking-[-0.04em] text-(--pulse-white)">
                {activeStat.value}
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-(--pulse-orange)">
                {activeStat.label}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
