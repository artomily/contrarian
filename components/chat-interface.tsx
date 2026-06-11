"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScoreGauge } from "./score-gauge";
import { CounterArguments } from "./counter-arguments";
import { VerdictPanel } from "./verdict-panel";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  TrendingUp,
  Lightbulb,
  Brain,
  Loader2,
  ArrowRightLeft,
  Coins,
  Link,
  Sparkles,
  HandCoins,
  Banknote,
  ArrowUpDown,
  Droplets,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { DecisionIntent, AnalysisResult } from "@/lib/mock-analysis";

type ChatMessage =
  | {
      id: string;
      role: "user";
      content: string;
      intent: DecisionIntent;
    }
  | {
      id: string;
      role: "contrarian";
      phase: "analyzing" | "complete" | "executing" | "executed" | "error";
      result?: AnalysisResult;
      txHash?: string;
      intent: DecisionIntent;
    };

const GAUGE_COLORS = {
  risk: "oklch(0.60 0.25 28)",
  fomo: "oklch(0.70 0.22 85)",
  opportunity: "oklch(0.65 0.20 235)",
  behavioral: "oklch(0.60 0.15 280)",
};

interface ChatTranscriptProps {
  messages: ChatMessage[];
  onExecute: (messageId: string) => void;
  onCancel: (messageId: string) => void;
  onReset: () => void;
  className?: string;
}

function intentColor(type: string): string {
  const map: Record<string, string> = {
    swap: "bg-cyan-500/20 text-cyan-400",
    stake: "bg-emerald-500/20 text-emerald-400",
    bridge: "bg-violet-500/20 text-violet-400",
    mint: "bg-pink-500/20 text-pink-400",
    lend: "bg-amber-500/20 text-amber-400",
    borrow: "bg-rose-500/20 text-rose-400",
    transfer: "bg-blue-500/20 text-blue-400",
    "provide-liquidity": "bg-teal-500/20 text-teal-400",
  };
  return map[type] || "bg-muted text-muted-foreground";
}

function intentIcon(type: string, className: string) {
  const map: Record<string, React.ReactNode> = {
    swap: <ArrowRightLeft className={className} />,
    stake: <Coins className={className} />,
    bridge: <Link className={className} />,
    mint: <Sparkles className={className} />,
    lend: <HandCoins className={className} />,
    borrow: <Banknote className={className} />,
    transfer: <ArrowUpDown className={className} />,
    "provide-liquidity": <Droplets className={className} />,
  };
  return map[type] || <ArrowRightLeft className={className} />;
}

function UserMessage({ message }: { message: ChatMessage & { role: "user" } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-br-md border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
        <div className="mb-1 flex items-center gap-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded ${intentColor(
              message.intent.type,
            )}`}
          >
            {intentIcon(message.intent.type, "h-3 w-3")}
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {message.intent.type.replace("-", " ")}
          </span>
        </div>
        <p className="text-sm text-foreground/90">{message.content}</p>
      </div>
    </motion.div>
  );
}

const lensStages = [
  { key: "risk", label: "Risk Analyst", color: "text-rose-400" },
  { key: "fomo", label: "Market Skeptic", color: "text-amber-400" },
  { key: "opportunity", label: "Opportunity Cost", color: "text-cyan-400" },
  { key: "behavioral", label: "Behavioral Psych", color: "text-violet-400" },
] as const;

/** Shared shell for every contrarian response card. */
function ContrarianCard({
  children,
  title = "Contrarian Analysis",
  busy = false,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  busy?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className="flex justify-start"
    >
      <div
        className={cn(
          "w-full max-w-[94%] space-y-4 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-sm",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/15 ring-1 ring-rose-500/20">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <span className="font-mono text-xs font-semibold text-rose-400">{title}</span>
          {busy && (
            <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function AnalyzingCard() {
  const [visibleLenses, setVisibleLenses] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLenses((prev) => {
        if (prev >= 4) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <ContrarianCard busy className="max-w-[90%] space-y-2.5">
      <div className="space-y-1.5">
        {lensStages.map((stage, i) => (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, height: 0 }}
            animate={
              visibleLenses > i
                ? { opacity: 1, height: "auto" }
                : { opacity: 0, height: 0 }
            }
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 ${
              visibleLenses > i ? "bg-white/[0.04]" : ""
            }`}
          >
            {visibleLenses > i ? (
              <CheckCircle2 className={`h-3.5 w-3.5 ${stage.color}`} />
            ) : (
              <Loader2 className={`h-3.5 w-3.5 animate-spin ${stage.color}`} />
            )}
            <span className="font-mono text-[11px] text-muted-foreground">
              {stage.label}
            </span>
          </motion.div>
        ))}
      </div>
    </ContrarianCard>
  );
}

function CompleteCard({
  message,
  onExecute,
  onCancel,
}: {
  message: ChatMessage & { role: "contrarian"; phase: "complete"; result: AnalysisResult };
  onExecute: () => void;
  onCancel: () => void;
}) {
  return (
    <ContrarianCard title="Analysis Complete">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <ScoreGauge
          label="Risk Score"
          score={message.result.risk.score}
          color={GAUGE_COLORS.risk}
          icon={<ShieldAlert className="h-3 w-3" />}
          delay={0}
        />
        <ScoreGauge
          label="FOMO Score"
          score={message.result.fomo.score}
          color={GAUGE_COLORS.fomo}
          icon={<TrendingUp className="h-3 w-3" />}
          delay={0.1}
        />
        <ScoreGauge
          label="Opportunity Cost"
          score={message.result.opportunity.score}
          color={GAUGE_COLORS.opportunity}
          icon={<Lightbulb className="h-3 w-3" />}
          delay={0.2}
        />
        <ScoreGauge
          label="Confidence"
          score={100 - message.result.behavioral.score}
          color={GAUGE_COLORS.behavioral}
          icon={<Brain className="h-3 w-3" />}
          delay={0.3}
        />
      </div>

      <CounterArguments args={message.result.counterArguments} />

      <VerdictPanel
        verdict={message.result.verdict}
        onProceed={onExecute}
        onCancel={onCancel}
      />
    </ContrarianCard>
  );
}

function ExecutingCard({
  message,
}: {
  message: ChatMessage & { role: "contrarian"; phase: "executing" };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 text-center">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-amber-400" />
        <p className="font-mono text-xs text-amber-400">Transaction executing…</p>
        {message.txHash && (
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            {String(message.txHash).slice(0, 20)}…
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ExecutedCard({
  message,
  onReset,
}: {
  message: ChatMessage & { role: "contrarian"; phase: "executed" };
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-emerald-500/20 bg-emerald-500/5 px-4 py-3.5 text-center">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>
        <p className="font-mono text-xs text-emerald-400">
          Transaction executed successfully
        </p>
        {message.txHash && (
          <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
            {String(message.txHash)}
          </p>
        )}
        <button
          onClick={onReset}
          className="mt-3 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] text-muted-foreground transition-colors duration-150 hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          New Review
        </button>
      </div>
    </motion.div>
  );
}

function ErrorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-rose-500/20 bg-rose-500/5 px-4 py-3.5">
        <div className="mb-1 flex items-center gap-2">
          <XCircle className="h-4 w-4 text-rose-400" />
          <span className="font-mono text-xs text-rose-400">
            I couldn&apos;t understand that
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Try something like &quot;swap 100 USDC to SOL&quot; or pick a quick action.
        </p>
      </div>
    </motion.div>
  );
}

export function ChatTranscript({
  messages,
  onExecute,
  onCancel,
  onReset,
  className,
}: ChatTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className={cn("scrollbar-thin min-h-0 flex-1 overflow-y-auto", className)}
    >
      <div className="mx-auto w-full max-w-2xl space-y-4 px-1 py-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            if (message.role === "user") {
              return <UserMessage key={message.id} message={message} />;
            }
            if (message.phase === "analyzing") {
              return <AnalyzingCard key={message.id} />;
            }
            if (message.phase === "complete" && message.result) {
              const completeMsg = message as ChatMessage & {
                role: "contrarian";
                phase: "complete";
                result: AnalysisResult;
              };
              return (
                <CompleteCard
                  key={completeMsg.id}
                  message={completeMsg}
                  onExecute={() => onExecute(completeMsg.id)}
                  onCancel={() => onCancel(completeMsg.id)}
                />
              );
            }
            if (message.phase === "executing") {
              return (
                <ExecutingCard
                  key={message.id}
                  message={message as ChatMessage & { role: "contrarian"; phase: "executing" }}
                />
              );
            }
            if (message.phase === "executed") {
              return (
                <ExecutedCard
                  key={message.id}
                  message={message as ChatMessage & { role: "contrarian"; phase: "executed" }}
                  onReset={onReset}
                />
              );
            }
            if (message.phase === "error") {
              return <ErrorCard key={message.id} />;
            }
            return null;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
