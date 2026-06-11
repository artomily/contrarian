"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import type { DecisionIntent, AnalysisResult } from "@/lib/mock-analysis";

interface ReviewEntry {
  id: string;
  intent: DecisionIntent;
  result: AnalysisResult;
  decision: "EXECUTED" | "CANCELLED";
  txHash?: string;
  timestamp: number;
}

interface ActivityFeedProps {
  entries: ReviewEntry[];
}

function timeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export function ActivityFeed({ entries }: ActivityFeedProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-border/30 bg-card/30 px-4 py-8 text-center">
        <Clock className="mx-auto mb-2 h-4 w-4 text-muted-foreground" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          No reviews yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Activity Feed
        </h3>
      </div>

      <div className="space-y-1.5">
        <AnimatePresence>
          {entries.slice(0, 10).map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 rounded-md border border-border/20 bg-card/30 px-3 py-2"
            >
              {entry.decision === "EXECUTED" ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10">
                  <XCircle className="h-3 w-3 text-rose-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] text-foreground truncate">
                  {entry.intent.summary}
                </p>
              </div>

              <span
                className={`font-mono text-[10px] font-semibold uppercase ${
                  entry.decision === "EXECUTED" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {entry.decision}
              </span>

              <span className="font-mono text-[10px] text-muted-foreground/60 whitespace-nowrap">
                {timeAgo(entry.timestamp)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
