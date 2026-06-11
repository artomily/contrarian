"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface CounterArgumentsProps {
  args: string[];
}

export function CounterArguments({ args }: CounterArgumentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-400">
          Counter Arguments
        </h3>
      </div>

      <div className="space-y-2">
        {args.map((arg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 + i * 0.15 }}
            className="flex items-start gap-3 rounded-lg border border-border/30 bg-card/40 px-4 py-3"
          >
            <span className="mt-0.5 font-mono text-[10px] font-bold text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-sm text-foreground/80 leading-relaxed">{arg}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
