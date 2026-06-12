"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ListChecks,
  MessageSquareText,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Swords,
  TrendingDown,
  Wallet,
  XCircle,
} from "lucide-react";
import { Orb } from "@/components/orb";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

/** Shared scroll-entrance wrapper. MotionConfig (reducedMotion="user") strips the y-shift for reduced-motion users. */
function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {sub ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

// ── Hero product shot: a static, hand-set Contrarian review ─────────────────

const MOCK_LENSES = [
  { label: "Risk Analyst", score: 82, tone: "high" as const },
  { label: "Market Skeptic", score: 91, tone: "high" as const },
  { label: "Opportunity Cost", score: 67, tone: "med" as const },
  { label: "Behavioral Psych", score: 74, tone: "high" as const },
];

function MockLensRow({
  label,
  score,
  tone,
  delay,
}: {
  label: string;
  score: number;
  tone: "high" | "med";
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="w-32 shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:w-36">
        {label}
      </span>
      <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.span
          aria-hidden="true"
          className={cn(
            "block h-full w-full origin-left rounded-full",
            tone === "high" ? "bg-rose-500" : "bg-amber-500",
          )}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: score / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay, ease: "easeOut" }}
        />
      </span>
      <span className="w-8 text-right font-mono text-xs font-semibold tabular-nums text-foreground">
        {score}
      </span>
      <span
        className={cn(
          "w-9 text-right font-mono text-[10px] font-bold uppercase tracking-widest",
          tone === "high" ? "text-rose-400" : "text-amber-400",
        )}
      >
        {tone === "high" ? "High" : "Med"}
      </span>
    </div>
  );
}

/**
 * Illustration of a finished review. Purely decorative — the "buttons" are
 * spans on purpose so nothing here is focusable or pretends to work.
 */
function MockReview() {
  return (
    <figure className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-card/80 p-5 shadow-[0_30px_120px_-40px_rgba(244,63,94,0.35)] backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <p className="min-w-0 truncate font-mono text-sm text-foreground">
            swap 5,000 USDC → PEPE
          </p>
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Review complete · 2.4s
          </p>
        </div>

        <div className="space-y-3 py-5">
          {MOCK_LENSES.map((lens, i) => (
            <MockLensRow key={lens.label} {...lens} delay={0.15 + i * 0.1} />
          ))}
        </div>

        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-rose-400">
            Verdict: Reconsider
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Price surged 340% in 24h — classic pump pattern. Twitter mentions
            spiked 12x in one hour.
          </p>
        </div>

        <div className="mt-4 flex gap-3" aria-hidden="true">
          <span className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-rose-500/30 font-mono text-xs font-semibold uppercase tracking-wider text-rose-400">
            <ShieldCheck className="h-4 w-4" />
            Execute Anyway
          </span>
          <span className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <XCircle className="h-4 w-4" />
            Cancel
          </span>
        </div>
      </div>
      <figcaption className="sr-only">
        A Contrarian review of a 5,000 USDC swap: all four lenses flag concern
        and the verdict is Reconsider.
      </figcaption>
    </figure>
  );
}

// ── Sections ─────────────────────────────────────────────────────────────────

const STATS = [
  { value: "4", label: "adversarial lenses" },
  { value: "8", label: "onchain action types" },
  { value: "100%", label: "of intents challenged" },
  { value: "0", label: "decisions made for you" },
];

const STEPS = [
  {
    icon: MessageSquareText,
    title: "Describe the action",
    body: "Plain English in — “swap 100 USDC to SOL”. Contrarian parses it into a structured intent before anything goes near your wallet.",
  },
  {
    icon: Swords,
    title: "Get argued with",
    body: "Four adversarial lenses score the decision 0–100 for concern and build the strongest case against it — in seconds, not threads.",
  },
  {
    icon: ListChecks,
    title: "Decide with eyes open",
    body: "Execute Anyway or Cancel. Either way the call is yours, and it lands in your activity feed — on the record.",
  },
];

const LENSES = [
  {
    icon: ShieldAlert,
    name: "Risk Analyst",
    question: "What breaks?",
    body: "Hunts the downside: thin liquidity, unaudited contracts, depeg history, liquidation thresholds — the failure modes you skimmed past.",
  },
  {
    icon: TrendingDown,
    name: "Market Skeptic",
    question: "Why now?",
    body: "Detects FOMO. Pump patterns, influencer shills, and the fact that you searched this token fourteen times today.",
  },
  {
    icon: Scale,
    name: "Opportunity Cost",
    question: "What instead?",
    body: "Asks what else the capital could do — better yields, cheaper routes, smaller tranches, or simply waiting.",
  },
  {
    icon: Brain,
    name: "Behavioral Psych",
    question: "Why you?",
    body: "Reads your patterns: revenge trades, leverage spirals, the 2am mint right after a Discord hype call.",
  },
];

const GUARANTEES = [
  {
    icon: Wallet,
    title: "Non-custodial by design",
    body: "Your wallet connects through wagmi on Arbitrum. Contrarian never holds keys and never signs for you.",
  },
  {
    icon: ShieldCheck,
    title: "Execute Anyway is always there",
    body: "Every review ends with the same two buttons. Contrarian advises; it has no power to block you.",
  },
  {
    icon: ListChecks,
    title: "Every decision on the record",
    body: "Executed or cancelled, each review lands in your activity feed — so future-you can audit past-you.",
  },
];

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-dvh flex-col">
        {/* Ambient rose vignette behind everything */}
        <div aria-hidden="true" className="app-vignette" />

        <SiteHeader />

        <main className="flex-1">
          {/* Hero */}
          <section className="px-6 pb-20 pt-16 sm:pt-20">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-8"
              >
                <Orb size={160} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                className="font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-400"
              >
                Decision firewall for onchain actions
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45, ease: "easeOut" }}
                className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Every transaction deserves an argument.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
                className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                Contrarian is the AI agent that challenges your onchain
                decisions before they become transactions. Four adversarial
                lenses build the case against your intent — then the call is
                yours.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.45, ease: "easeOut" }}
                className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 px-7 text-base font-medium text-white shadow-[0_4px_24px_-4px_rgba(244,63,94,0.6)] transition-colors duration-150 hover:from-rose-400 hover:to-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px"
                >
                  Launch App
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center rounded-full border border-white/10 bg-white/[0.025] px-7 text-base text-muted-foreground transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Read the docs
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="mt-16"
            >
              <MockReview />
            </motion.div>
          </section>

          {/* Stats strip */}
          <section aria-label="Contrarian by the numbers" className="border-y border-border">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-2 lg:grid-cols-4">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex flex-col items-center gap-1 px-6 py-8 text-center",
                    i > 0 && "border-l border-border max-lg:odd:border-l-0",
                    i > 1 && "max-lg:border-t",
                  )}
                >
                  <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
                    {value}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="scroll-mt-24 px-6 py-24">
            <div className="mx-auto w-full max-w-6xl">
              <FadeIn>
                <SectionHeading
                  eyebrow="How it works"
                  title="Three steps between an impulse and a transaction"
                  sub="Most wallets ask you to confirm. Contrarian asks you to reconsider — then gets out of the way."
                />
              </FadeIn>

              <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
                {STEPS.map(({ icon: Icon, title, body }, i) => (
                  <FadeIn key={title} delay={i * 0.1}>
                    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/50 p-6">
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 ring-1 ring-rose-500/20">
                          <Icon className="h-5 w-5 text-rose-400" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* The four lenses */}
          <section id="lenses" className="scroll-mt-24 border-t border-border px-6 py-24">
            <div className="mx-auto w-full max-w-6xl">
              <FadeIn>
                <SectionHeading
                  eyebrow="The red team"
                  title="Four lenses, one job: change your mind"
                  sub="Every intent is reviewed by four adversarial personas. Each scores its concern from 0 to 100 and files its objections."
                />
              </FadeIn>

              <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {LENSES.map(({ icon: Icon, name, question, body }, i) => (
                  <FadeIn key={name} delay={i * 0.08}>
                    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/50 p-6 transition-colors duration-200 hover:border-rose-500/25">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 ring-1 ring-rose-500/20">
                        <Icon className="h-5 w-5 text-rose-400" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                        {name}
                      </h3>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-rose-400">
                        {question}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {body}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Control */}
          <section className="border-t border-border px-6 py-24">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
              <FadeIn>
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-400">
                    Your keys, your call
                  </p>
                  <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    It warns. It never blocks.
                  </h2>
                  <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                    Contrarian is a firewall, not a custodian. It will tell you
                    the pool is thin, the hype is manufactured, and that this is
                    your fourth impulsive trade this week — and then it will
                    hand you the button anyway. The point isn&apos;t to stop
                    you. It&apos;s to make sure you were never on autopilot.
                  </p>
                </div>
              </FadeIn>

              <div className="space-y-4">
                {GUARANTEES.map(({ icon: Icon, title, body }, i) => (
                  <FadeIn key={title} delay={i * 0.1}>
                    <div className="flex gap-4 rounded-2xl border border-border bg-card/50 p-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 ring-1 ring-rose-500/20">
                        <Icon className="h-5 w-5 text-rose-400" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-semibold tracking-tight text-foreground">
                          {title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {body}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="border-t border-border px-6 py-24">
            <FadeIn>
              <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                <Orb size={96} subtle />
                <h2 className="mt-8 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Ready to be argued with?
                </h2>
                <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
                  Describe an onchain action and see what four professional
                  skeptics make of it.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 px-7 text-base font-medium text-white shadow-[0_4px_24px_-4px_rgba(244,63,94,0.6)] transition-colors duration-150 hover:from-rose-400 hover:to-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px"
                >
                  Launch App
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </FadeIn>
          </section>
        </main>

        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
