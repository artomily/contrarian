import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How Contrarian works: the review lifecycle, the four adversarial lenses, scoring, supported onchain actions, and the limits of this demo.",
};

const SECTIONS = [
  { id: "overview", index: "01", title: "Overview" },
  { id: "quickstart", index: "02", title: "Quickstart" },
  { id: "lifecycle", index: "03", title: "The review lifecycle" },
  { id: "lenses", index: "04", title: "Lenses & scoring" },
  { id: "actions", index: "05", title: "Supported actions" },
  { id: "wallet", index: "06", title: "Wallet & execution" },
  { id: "limitations", index: "07", title: "Limitations" },
  { id: "faq", index: "08", title: "FAQ" },
];

const ACTIONS: { action: string; example: string; parsed: string }[] = [
  { action: "Swap", example: "swap 100 USDC to SOL", parsed: "amount, from, to" },
  { action: "Stake", example: "stake 50 SOL with Marinade", parsed: "amount, token, protocol" },
  { action: "Bridge", example: "bridge 200 USDC to Arbitrum", parsed: "amount, token, destination" },
  { action: "Mint", example: "mint an NFT from Mad Lads", parsed: "collection" },
  { action: "Lend", example: "lend 500 USDC on Solend", parsed: "amount, token, protocol" },
  { action: "Borrow", example: "borrow 100 USDC against SOL", parsed: "amount, token, collateral" },
  { action: "Transfer", example: "send 10 SOL to 7xKv…abc", parsed: "amount, token, recipient" },
  {
    action: "Provide liquidity",
    example: "provide liquidity 100 USDC + 100 SOL to Orca",
    parsed: "pair amounts, protocol",
  },
];

const LENS_DOCS = [
  {
    name: "Risk Analyst",
    question: "What breaks?",
    body: "Looks for hard downside: thin or concentrated liquidity, unaudited or upgradeable contracts, exploit and depeg history, oracle deviation, liquidation thresholds, lock-up periods.",
  },
  {
    name: "Market Skeptic",
    question: "Why now?",
    body: "Looks for manufactured urgency: pump patterns, social-volume spikes, influencer promotion, unsustainable yields, and signs you are reacting to hype rather than acting on a plan.",
  },
  {
    name: "Opportunity Cost",
    question: "What instead?",
    body: "Compares the action against alternatives: better risk-adjusted yields, cheaper routes, splitting the entry into tranches, hedging, or simply waiting.",
  },
  {
    name: "Behavioral Psychologist",
    question: "Why you?",
    body: "Reads the decision against your own patterns: position sizes outside your rules, revenge trades, leverage spirals, yield-hopping, and pressure from other people.",
  },
];

function DocSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-28 border-t border-border pt-10 first:border-t-0 first:pt-0"
    >
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-400">
        {index}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-card px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground/90">
      {children}
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3">
      <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-rose-400">
        Demo build
      </p>
      <div className="mt-1 text-sm leading-relaxed text-foreground/80">{children}</div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div aria-hidden="true" className="app-vignette" />

      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-400">
            Documentation
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground">
            How Contrarian works
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Everything you need to know about the decision firewall: the review
            lifecycle, the four adversarial lenses, what they score, and what
            this demo does — and deliberately does not — do.
          </p>
        </div>

        {/* Mobile table of contents */}
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2 lg:hidden">
          {SECTIONS.map(({ id, title }) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/[0.025] px-4 text-[13px] text-muted-foreground transition-colors duration-150 hover:border-white/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {title}
            </a>
          ))}
        </nav>

        <div className="mt-12 flex gap-12">
          {/* Desktop sidebar */}
          <nav
            aria-label="On this page"
            className="sticky top-24 hidden w-56 shrink-0 self-start lg:block"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <ul className="mt-3 space-y-0.5">
              {SECTIONS.map(({ id, index, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="flex h-10 items-center gap-2.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-white/[0.04] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
                      {index}
                    </span>
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="min-w-0 max-w-2xl flex-1 space-y-10 pb-12">
            <DocSection id="overview" index="01" title="Overview">
              <p>
                Contrarian is a <strong className="font-semibold text-foreground">decision firewall</strong>.
                Instead of confirming what you want to do onchain, it actively
                argues against it: every transaction intent is run through four
                adversarial review lenses, scored for concern, and surfaced as a
                threat dashboard. You then choose to{" "}
                <strong className="font-semibold text-foreground">Execute Anyway</strong> or{" "}
                <strong className="font-semibold text-foreground">Cancel</strong>.
              </p>
              <p>
                The premise: most onchain losses don&apos;t come from bad
                infrastructure, they come from unchallenged decisions. Wallets
                ask <em>“confirm?”</em> — Contrarian asks <em>“are you sure,
                and here&apos;s why you might not be.”</em>
              </p>
              <Callout>
                This build is a frontend demo. The analysis is mocked locally
                (deterministic phrase pools, no LLM call) and execution is
                simulated — no real transaction is ever sent. The data shapes
                match the planned production output.
              </Callout>
            </DocSection>

            <DocSection id="quickstart" index="02" title="Quickstart">
              <p>
                The fastest way in is the hosted dashboard — no wallet
                required to run a review:
              </p>
              <p>
                <Link
                  href="/dashboard"
                  className="font-medium text-rose-400 underline-offset-4 transition-colors duration-150 hover:text-rose-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Open the dashboard →
                </Link>
              </p>
              <p>To run it locally instead:</p>
              <CodeBlock>{`npm install
npm run dev   # http://localhost:3000`}</CodeBlock>
              <p>
                Then open the dashboard and describe an action in plain
                English, for example{" "}
                <InlineCode>swap 100 USDC to SOL</InlineCode> or{" "}
                <InlineCode>stake 50 SOL with Marinade</InlineCode>. Connecting
                a wallet (injected connector, Arbitrum) is optional and only
                affects the header — reviews work without it.
              </p>
            </DocSection>

            <DocSection id="lifecycle" index="03" title="The review lifecycle">
              <p>
                Every intent moves through a small state machine. If the input
                can&apos;t be parsed into a known action, the review ends in an
                error state and you can rephrase.
              </p>
              <CodeBlock>{`intent ──► analyzing ──► complete ──► executing ──► executed
   │                       │
   ▼ unparseable           ▼ cancel
 error                  logged as CANCELLED`}</CodeBlock>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="font-semibold text-foreground">Analyzing</strong> — the four
                  lenses run in parallel; results arrive together after a short
                  delay.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Complete</strong> — scores,
                  counter-arguments, and a verdict are on screen. The review
                  waits for your decision.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Executing → Executed</strong> —
                  choosing Execute Anyway simulates the transaction and logs it
                  to the activity feed with a mock hash.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Cancelled</strong> — the
                  review leaves the transcript and is logged as{" "}
                  <InlineCode>CANCELLED</InlineCode>. Cancelling is recorded on
                  purpose: avoided mistakes are wins worth counting.
                </li>
              </ul>
            </DocSection>

            <DocSection id="lenses" index="04" title="Lenses & scoring">
              <p>
                Each lens answers one question and scores its{" "}
                <strong className="font-semibold text-foreground">level of concern</strong> from 0
                to 100 — higher means more reason to pause.
              </p>
              <div className="space-y-3">
                {LENS_DOCS.map(({ name, question, body }) => (
                  <div key={name} className="rounded-lg border border-border bg-card/50 p-4">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                        {name}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
                        {question}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/80">{body}</p>
                  </div>
                ))}
              </div>
              <p>Scores map to three severity bands:</p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-card text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Score</th>
                      <th className="px-4 py-3 font-semibold">Severity</th>
                      <th className="px-4 py-3 font-semibold">Reading</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-mono tabular-nums">0–39</td>
                      <td className="px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                        Low
                      </td>
                      <td className="px-4 py-3 text-foreground/80">Acceptable</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono tabular-nums">40–69</td>
                      <td className="px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-amber-400">
                        Med
                      </td>
                      <td className="px-4 py-3 text-foreground/80">Moderate — review advised</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono tabular-nums">70–100</td>
                      <td className="px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-rose-400">
                        High
                      </td>
                      <td className="px-4 py-3 text-foreground/80">Critical — requires attention</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The verdict is derived from the average of the four scores:
                above 55 the review reads{" "}
                <InlineCode>RECONSIDER</InlineCode>; at or below it reads{" "}
                <InlineCode>PROCEED WITH CAUTION</InlineCode>. There is no
                third verdict and no hard block — the final decision is always
                yours.
              </p>
            </DocSection>

            <DocSection id="actions" index="05" title="Supported actions">
              <p>
                The intent parser recognizes eight onchain action types from
                plain English. Anything it can&apos;t parse returns an error
                state with a prompt to rephrase.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-card text-left font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Action</th>
                      <th className="px-4 py-3 font-semibold">Example prompt</th>
                      <th className="px-4 py-3 font-semibold">Parsed fields</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ACTIONS.map(({ action, example, parsed }) => (
                      <tr key={action}>
                        <td className="px-4 py-3 font-medium text-foreground">{action}</td>
                        <td className="px-4 py-3 font-mono text-[13px] text-foreground/80">
                          {example}
                        </td>
                        <td className="px-4 py-3 text-foreground/80">{parsed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DocSection>

            <DocSection id="wallet" index="06" title="Wallet & execution">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Wallet connection uses{" "}
                  <strong className="font-semibold text-foreground">wagmi + viem</strong> with the
                  injected connector (MetaMask, Rabby, and similar).
                </li>
                <li>
                  Supported chains are{" "}
                  <strong className="font-semibold text-foreground">Arbitrum One</strong> and{" "}
                  <strong className="font-semibold text-foreground">Arbitrum Sepolia</strong>; the
                  header offers a one-click switch if you&apos;re elsewhere.
                </li>
                <li>
                  Execution is{" "}
                  <strong className="font-semibold text-foreground">simulated</strong>. Execute
                  Anyway produces a mock transaction hash — no calldata is
                  built and nothing is signed or broadcast.
                </li>
                <li>
                  Review history lives in memory only and resets on reload.
                </li>
              </ul>
            </DocSection>

            <DocSection id="limitations" index="07" title="Limitations">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Analysis is a deterministic local mock — phrase pools and
                  weighted random scores, not a real risk assessment.
                </li>
                <li>
                  No persistence: history, scores, and verdicts vanish on
                  reload.
                </li>
                <li>
                  The intent parser is regex-based and intentionally narrow;
                  it covers the eight actions above and nothing else.
                </li>
                <li>Nothing in this product is financial advice.</li>
              </ul>
              <p>
                On the roadmap: a real four-persona LLM call with structured
                output, transaction construction with pre-sign simulation, and
                persistent review history.
              </p>
            </DocSection>

            <DocSection id="faq" index="08" title="FAQ">
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold tracking-tight text-foreground">
                    Does Contrarian ever block a transaction?
                  </h3>
                  <p className="mt-1.5">
                    No. Every review ends with Execute Anyway and Cancel.
                    Contrarian is built to make you pause, never to take the
                    decision away from you.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight text-foreground">
                    Is the analysis real?
                  </h3>
                  <p className="mt-1.5">
                    Not in this demo — lens results come from a local mock. The
                    interaction model, scoring bands, and data shapes are the
                    real contract the production agent will fill.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight text-foreground">
                    Why does it log cancelled reviews?
                  </h3>
                  <p className="mt-1.5">
                    Because a cancelled bad trade is the product working. The
                    activity feed treats avoided mistakes as first-class
                    outcomes, not discarded drafts.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight text-foreground">
                    Which networks are supported?
                  </h3>
                  <p className="mt-1.5">
                    Wallet connection targets Arbitrum One and Arbitrum
                    Sepolia. Since execution is simulated, reviews themselves
                    are chain-agnostic.
                  </p>
                </div>
              </div>
            </DocSection>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
