# Architecture

Contrarian is a Next.js (App Router) client application. There is no server
state and no database — the "AI" is a deterministic mock. This document explains how the
pieces fit together so a new contributor (human or agent) can navigate quickly.

## High-level shape

```
app/layout.tsx  ──► <Providers> (wagmi + react-query)
                      ├─► app/page.tsx ............ marketing landing (hero, mock review, lenses)
                      ├─► app/docs/page.tsx ........ documentation (server component, sidebar TOC)
                      └─► app/dashboard/page.tsx ... the app experience
                            │
                            ├─ idle ........  <Hero>      (orb + greeting + prompt + chips)
                            └─ active ......  <Workspace> (conversation + analysis + sidebar)
```

The landing and docs pages share `<SiteHeader>` / `<SiteFooter>`; the dashboard keeps its
own header (it carries `<WalletButton>`). `<BrandMark>` is the shared logo lockup.

`app/dashboard/page.tsx` owns no business logic itself — it reads state from the
`useContrarianAnalysis()` hook and swaps between two views based on whether any messages
exist. The transition between the two views is animated (the orb shrinks from hero centre
to a compact workspace marker).

## State machine — `hooks/use-contrarian-analysis.ts`

A single hook drives the entire review lifecycle. It holds three pieces of state:

- `messages: ChatMessage[]` — the conversation transcript.
- `history: ReviewEntry[]` — past decisions (feeds the Activity Feed).
- `isProcessing: boolean` — true while a lens analysis is running.

A "contrarian" message moves through these phases:

```
              parseIntent ok?
  user input ───────────────► analyzing ──► complete ──► executing ──► executed
        │ no                                   │  (Cancel)
        ▼                                      ▼
      error                                 (removed from transcript, logged to history)
```

| Action | Source | Effect |
|---|---|---|
| `submitForReview(input)` | prompt bar | parse intent → push user + `analyzing` msg → run mock analysis → `complete` (or `error`) |
| `execute(messageId)` | verdict panel | `executing` → (2s) `executed`, append `EXECUTED` to history with a fake tx hash |
| `cancel(messageId)` | verdict panel | remove the review from transcript, append `CANCELLED` to history |
| `reset()` | "New Review" | clear the transcript (returns to hero) |

`messages.length === 0` is the single source of truth for "show the hero".

## Data — `lib/mock-analysis.ts`

This file is the contract for every data shape in the UI. Two exported functions:

- **`parseIntent(input): DecisionIntent | null`** — regex-based NL parser. Recognises
  `swap | stake | bridge | mint | lend | borrow | transfer | provide-liquidity`. Returns
  `null` for unrecognised input (drives the `error` phase).
- **`runFullAnalysis(intent): Promise<AnalysisResult>`** — async (artificial delay) mock
  that produces four `LensResult`s, counter-arguments, and a `PROCEED | RECONSIDER` verdict.

```ts
AnalysisResult = {
  risk, fomo, opportunity, behavioral: LensResult   // { score, summary, details[] }
  counterArguments: string[]
  verdict: "PROCEED" | "RECONSIDER"
}
```

The four lenses map to the product's "red team" personas:
Risk Analyst · Market Skeptic · Opportunity Cost · Behavioral Psychologist.

## Component map

| Component | Role |
|---|---|
| `components/brand-mark.tsx` | Logo lockup (icon + wordmark), shared by all headers. |
| `components/site-header.tsx` | Sticky marketing nav (landing + docs) with Launch App CTA. |
| `components/site-footer.tsx` | Marketing footer with links + demo disclaimer. |
| `components/orb.tsx` | Signature animated rose/red sphere. Size-configurable; reused at hero + workspace scale. |
| `components/prompt-bar.tsx` | Shared rounded "Ask anything" input (waveform affordance + send). |
| `components/hero.tsx` | Idle landing: orb, greeting, headline, prompt, quick-action chips. |
| `components/chat-interface.tsx` | Conversation transcript + the phase cards (analyzing / complete / executing / executed / error). |
| `components/score-gauge.tsx` | Animated SVG arc gauge for a single lens score. |
| `components/counter-arguments.tsx` | Numbered list of the contrarian's objections. |
| `components/verdict-panel.tsx` | Final verdict + Execute / Cancel actions. |
| `components/activity-feed.tsx` | History of executed/cancelled reviews (workspace sidebar). |
| `components/wallet-button.tsx` | wagmi connect / chain switch / disconnect. |

## Styling

- All theme tokens live in `app/globals.css` under `:root` and the `@theme inline` block
  (Tailwind v4). Components consume semantic tokens (`bg-card`, `text-muted-foreground`,
  `border-border`) — not raw colors.
- The app is dark-only (`<html class="dark">` in the root layout).
- Motion is local to components via framer-motion; global keyframes (vignette, scrollbar)
  live in `globals.css`.

## Wallet / chain

`lib/wagmi.ts` configures Arbitrum One + Arbitrum Sepolia with the injected connector and
cookie storage. Execution in this demo is **simulated** — no transaction is actually sent.

## Notable constraints

- **This is a modified Next.js 16** (see `AGENTS.md`). Always consult
  `node_modules/next/dist/docs/` before touching a Next.js API.
- Everything that renders is a Client Component (`"use client"`) because the app is
  interaction-first; there is currently no server data to fetch.
</content>
