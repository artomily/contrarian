"use client";

import Link from "next/link";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { BookOpen } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Hero } from "@/components/hero";
import { Workspace } from "@/components/workspace";
import { WalletButton } from "@/components/wallet-button";
import { useContrarianAnalysis } from "@/hooks/use-contrarian-analysis";

export default function DashboardPage() {
  const { messages, history, isProcessing, submitForReview, execute, cancel, reset } =
    useContrarianAnalysis();

  const isIdle = messages.length === 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex h-dvh flex-col overflow-hidden">
        {/* Ambient rose vignette behind everything */}
        <div aria-hidden="true" className="app-vignette" />

        <header className="z-50 flex shrink-0 items-center justify-between px-6 py-4">
          <Link
            href="/"
            aria-label="Contrarian home"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <BrandMark />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/docs"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Docs
            </Link>
            <WalletButton />
          </div>
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
