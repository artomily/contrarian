"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, XCircle } from "lucide-react";

interface VerdictPanelProps {
  verdict: "PROCEED" | "RECONSIDER";
  onProceed: () => void;
  onCancel: () => void;
}

export function VerdictPanel({ verdict, onProceed, onCancel }: VerdictPanelProps) {
  const isReconsider = verdict === "RECONSIDER";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="space-y-3"
    >
      <div
        className={`rounded-lg border px-5 py-4 text-center ${
          isReconsider
            ? "border-rose-500/20 bg-rose-500/5"
            : "border-emerald-500/20 bg-emerald-500/5"
        }`}
      >
        <p
          className={`font-mono text-xs font-bold uppercase tracking-widest ${
            isReconsider ? "text-rose-400" : "text-emerald-400"
          }`}
        >
          {isReconsider ? "Verdict: Reconsider" : "Verdict: Proceed with Caution"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {isReconsider
            ? "Multiple risk factors suggest pausing this decision"
            : "Risk is within bounds but remain vigilant"}
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onProceed}
          variant={isReconsider ? "outline" : "default"}
          className={`flex-1 h-11 font-mono text-xs font-semibold tracking-wider uppercase ${
            isReconsider
              ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Execute Anyway
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-11 font-mono text-xs font-semibold tracking-wider uppercase border-border text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}
