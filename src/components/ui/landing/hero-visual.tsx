import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  alertIcon,
  metricSnapshots,
  uptimeHeights,
  uptimeStates,
} from "./landing-data";

const AlertIcon = alertIcon;

export function HeroVisual() {
  const [metricIndex, setMetricIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setMetricIndex((current) => (current + 1) % metricSnapshots.length);
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeMetrics = metricSnapshots[metricIndex];
  const statusTone =
    activeMetrics.status === "Down"
      ? {
          text: "text-red-500",
          bg: "bg-[rgba(239,68,68,0.1)]",
          glow: [
            "0 0 0 rgba(239,68,68,0)",
            "0 0 24px rgba(239,68,68,0.18)",
            "0 0 0 rgba(239,68,68,0)",
          ],
        }
      : activeMetrics.status === "Investigating"
        ? {
            text: "text-orange-400",
            bg: "bg-[rgba(251,146,60,0.12)]",
            glow: [
              "0 0 0 rgba(251,146,60,0)",
              "0 0 24px rgba(251,146,60,0.18)",
              "0 0 0 rgba(251,146,60,0)",
            ],
          }
        : {
            text: "text-green-500",
            bg: "bg-[rgba(34,197,94,0.1)]",
            glow: [
              "0 0 0 rgba(34,197,94,0)",
              "0 0 24px rgba(34,197,94,0.18)",
              "0 0 0 rgba(34,197,94,0)",
            ],
          };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-2xl space-y-4 overflow-hidden"
    >
      <motion.div className="overflow-hidden border border-(--pulse-border-bright) bg-(--pulse-black-2) p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-4">
        <div className="mb-5 flex items-center justify-between border-b border-(--pulse-border) pb-4">
          <span className="font-mono text-[13px] font-semibold">
            api.myapp.com
          </span>
          <motion.span
            className={`inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${statusTone.bg} ${statusTone.text}`}
          >
            <span className="h-1.5 w-1.5 animate-[pulse-dot_1.5s_ease-in-out_infinite] rounded-full bg-current" />
            {activeMetrics.status}
          </motion.span>
        </div>

        <div className="mb-5 flex h-7 sm:h-8 items-end gap-0.75">
          {uptimeHeights.map((height, index) => {
            const state = uptimeStates[index];
            const colorClass =
              state === 2
                ? "bg-[rgba(239,68,68,0.82)]"
                : state === 1
                  ? "bg-[rgba(251,146,60,0.8)]"
                  : "bg-[rgba(34,197,94,0.82)]";

            return (
              <motion.span
                key={`${height}-${index}`}
                className={`block flex-1 origin-bottom scale-y-0 rounded-[1px] motion-safe:animate-[bar-grow_0.4s_ease_forwards] ${colorClass}`}
                animate={state !== 0 ? { opacity: [0.78, 1, 0.78] } : undefined}
                transition={
                  state !== 0
                    ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                    : undefined
                }
                style={{
                  height: `${height}px`,
                  animationDelay: `${index * 0.02}s`,
                }}
              />
            );
          })}
        </div>

        <div className="my-4 h-10 overflow-hidden">
          <svg
            viewBox="0 0 360 40"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <motion.polyline
              points="0,30 30,25 60,28 90,20 120,22 150,18 180,24 210,16 240,19 270,14 300,18 330,12 360,15"
              fill="none"
              stroke="rgba(251,146,60,0.7)"
              strokeWidth="1.5"
              initial={{ pathLength: 0.2, opacity: 0.5 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.3,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 1.2,
              }}
            />
            <polyline
              points="0,30 30,25 60,28 90,20 120,22 150,18 180,24 210,16 240,19 270,14 300,18 330,12 360,15 360,40 0,40"
              fill="rgba(251,146,60,0.08)"
              stroke="none"
            />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCell label="Uptime (30d)" value={activeMetrics.uptime} />
          <MetricCell label="Avg response" value={activeMetrics.response} />
          <MetricCell label="Open flairs" value={activeMetrics.flairs} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-3 flex items-center justify-between border border-(--pulse-border) bg-(--pulse-black-3) px-4 sm:px-6 py-4"
      >
        <span className="font-mono text-xs">dashboard.myapp.com</span>
        <span className="inline-flex items-center gap-2 bg-[rgba(34,197,94,0.1)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-green-500">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Up
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35 }}
        className="flex items-start gap-3 border overflow-hidden border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.05)] px-4 sm:px-5 py-3.5"
      >
        <div>
          <AlertIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
        </div>
        <div className=" flex-1">
          <p className=" text-left font-mono text-xs font-medium text-red-500">
            payments.myapp.com is down
          </p>
          <p className="font-mono text-[10px] tracking-[0.06em] text-left text-(--pulse-muted) truncate w-full">
            Flair opened, 2 seconds ago, email sent
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

type MetricCellProps = {
  label: string;
  value: string;
};

function MetricCell({ label, value }: MetricCellProps) {
  return (
    <div className="min-w-0 flex-1 overflow-hidden">
      <div className="relative h-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 font-mono text-base font-semibold text-(--pulse-white) max-sm:text-sm"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-(--pulse-muted) max-sm:text-[8px]">
        {label}
      </div>
    </div>
  );
}
