"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Hero } from "@/components/hero";
import { Workspace } from "@/components/workspace";
import { WalletButton } from "@/components/wallet-button";
import { useContrarianAnalysis } from "@/hooks/use-contrarian-analysis";

export default function Home() {
  const { messages, history, isProcessing, submitForReview, execute, cancel, reset } =
    useContrarianAnalysis();

  const isIdle = messages.length === 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex h-dvh flex-col overflow-hidden">
        {/* Ambient rose vignette behind everything */}
        <div aria-hidden="true" className="app-vignette" />

        <header className="z-50 flex shrink-0 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 ring-1 ring-rose-500/20">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
            </div>
            <div className="leading-tight">
              <p className="font-mono text-sm font-bold tracking-tight text-foreground">
                Contrarian
              </p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Decision Firewall
              </p>
            </div>
          </div>
          <WalletButton />
        </header>

        <main className="flex min-h-0 flex-1 flex-col">
          <AnimatePresence mode="wait">
            {isIdle ? (
              <Hero key="hero" onSend={submitForReview} disabled={isProcessing} />
            ) : (
              <Workspace
                key="workspace"
                messages={messages}
                history={history}
                isProcessing={isProcessing}
                onSend={submitForReview}
                onExecute={execute}
                onCancel={cancel}
                onReset={reset}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </MotionConfig>
  );
}
