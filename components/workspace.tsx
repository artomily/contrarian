"use client";

import { motion } from "framer-motion";
import { Orb } from "./orb";
import { PromptBar } from "./prompt-bar";
import { ChatTranscript } from "./chat-interface";
import { ActivityFeed } from "./activity-feed";
import type { DecisionIntent, AnalysisResult } from "@/lib/mock-analysis";

interface ReviewEntry {
  id: string;
  intent: DecisionIntent;
  result: AnalysisResult;
  decision: "EXECUTED" | "CANCELLED";
  txHash?: string;
  timestamp: number;
}

type ChatMessage =
  | { id: string; role: "user"; content: string; intent: DecisionIntent }
  | {
      id: string;
      role: "contrarian";
      phase: "analyzing" | "complete" | "executing" | "executed" | "error";
      result?: AnalysisResult;
      txHash?: string;
      intent: DecisionIntent;
    };

interface WorkspaceProps {
  messages: ChatMessage[];
  history: ReviewEntry[];
  isProcessing: boolean;
  onSend: (value: string) => void;
  onExecute: (messageId: string) => void;
  onCancel: (messageId: string) => void;
  onReset: () => void;
}

export function Workspace({
  messages,
  history,
  isProcessing,
  onSend,
  onExecute,
  onCancel,
  onReset,
}: WorkspaceProps) {
  return (
    <motion.div
      key="workspace"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, ease: "easeOut", delay: 0.05 } }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 gap-8 px-6 pb-6 lg:flex-row">
        {/* Conversation column */}
        <section className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-center gap-3 py-4">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Orb size={40} subtle />
            </motion.div>
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold text-foreground">Contrarian</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                Challenging your decision…
              </p>
            </div>
          </header>

          <ChatTranscript
            messages={messages}
            onExecute={onExecute}
            onCancel={onCancel}
            onReset={onReset}
          />

          <div className="pt-3">
            <PromptBar
              onSend={onSend}
              disabled={isProcessing}
              size="md"
              placeholder="Describe another onchain action…"
            />
            <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground/50">
              Contrarian argues against every action. Mock analysis — not financial advice.
            </p>
          </div>
        </section>

        {/* Activity sidebar (desktop) */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto py-4 lg:block">
          <ActivityFeed entries={history} />
        </aside>
      </div>
    </motion.div>
  );
}
