"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  label: string;
  score: number;
  color: string;
  icon: React.ReactNode;
  delay?: number;
}

function ScoreArc({ score, color, delay = 0 }: { score: number; color: string; delay?: number }) {
  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="font-mono text-lg font-bold tabular-nums"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.8 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">%</span>
        </motion.span>
      </div>
    </div>
  );
}

export function ScoreGauge({ label, score, color, icon, delay = 0 }: ScoreGaugeProps) {
  const severity = score >= 70 ? "HIGH" : score >= 40 ? "MED" : "LOW";
  const severityColor =
    severity === "HIGH"
      ? "text-rose-400"
      : severity === "MED"
        ? "text-amber-400"
        : "text-emerald-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 rounded-lg border border-border/40 bg-card/50 px-4 py-3"
    >
      <ScoreArc score={score} color={color} delay={delay} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span
            className={`font-mono text-[10px] font-bold uppercase tracking-widest ${severityColor}`}
          >
            {severity}
          </span>
        </div>
        <p className="text-sm text-foreground leading-tight">
          {score >= 70
            ? "Critical — requires attention"
            : score >= 40
              ? "Moderate — review advised"
              : "Acceptable"}
        </p>
      </div>
    </motion.div>
  );
}
