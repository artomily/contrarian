@AGENTS.md

# Contrarian — working notes for Claude

> **The AI agent that challenges every onchain decision before it becomes a transaction.**

Contrarian is a **Decision Firewall**. Instead of confirming what a user wants to do,
it actively argues against it: every transaction intent is run through four adversarial
review lenses, scored, and surfaced as a threat dashboard. The user then chooses to
**Execute Anyway** or **Cancel**.

This is a frontend demo — all analysis is mocked locally (`lib/mock-analysis.ts`). There
is no backend and no real LLM call. Wallet connection (wagmi/viem, Arbitrum) is wired but
execution is simulated.

## Commands

```bash
npm run dev     # start dev server on http://localhost:3000
npm run build   # production build (run before claiming UI work is done)
npm run lint    # eslint
```

There is no test suite. Verify visually with the dev server and `npm run build`.

## Stack

- **Next.js 16** (App Router, React 19) — ⚠️ see `AGENTS.md`: this Next.js has breaking
  changes. Read `node_modules/next/dist/docs/` before using any Next.js API.
- **Tailwind CSS v4** — config-less, driven by `@theme` + CSS variables in `app/globals.css`.
- **shadcn/ui** (`base-nova` style, built on `@base-ui/react`) — primitives in `components/ui/`.
- **framer-motion** — page/score/orb animation.
- **lucide-react** — icons.
- **wagmi + viem** — wallet connection on Arbitrum (`lib/wagmi.ts`).
- **@tanstack/react-query** — required by wagmi (`app/providers.tsx`).

## Where things live

- `app/page.tsx` — marketing **landing page** (hero, mock review, lenses, CTA).
- `app/docs/page.tsx` — **documentation** (server component, sidebar TOC).
- `app/dashboard/page.tsx` — the app: **hero takeover** when idle, **workspace**
  (conversation + analysis + activity sidebar) once a review starts.
- `components/site-header.tsx` / `site-footer.tsx` / `brand-mark.tsx` — shared site chrome.
- `app/layout.tsx` — root layout, fonts (`Geist`/`Geist Mono`), forces `dark`.
- `app/providers.tsx` — wagmi + react-query providers.
- `hooks/use-contrarian-analysis.ts` — the state machine for the review lifecycle.
- `lib/mock-analysis.ts` — intent parsing + mocked four-lens analysis (source of truth for data shapes).
- `components/` — feature components (orb, prompt bar, chat, analysis cards, activity feed).
- `components/ui/` — shadcn primitives. Don't hand-edit unless restyling intentionally.

See `ARCHITECTURE.md` for the data flow and `TASKS.md` for the roadmap.

## Design system (read before styling)

- **Visual direction:** premium, dark, Apple-Intelligence-inspired hero with a glowing
  **rose/red orb** as the signature element. The brand is rose/red (a "red team" warning
  tool) — keep it. Do **not** introduce a blue palette.
- **Color & spacing come from tokens**, never magic hex/px. Use the CSS variables and
  semantic helpers (`--color-danger/warning/success/info`) defined in `app/globals.css`
  and the Tailwind scale. Rose accents = danger/contrarian voice.
- **Type:** `font-sans` (Geist) for prose, `font-mono` (Geist Mono) for labels, scores,
  addresses, and any number (`tabular-nums`).
- **Motion:** follow the duration tiers (micro 100ms / short 150ms / medium 200–250ms /
  long 300–400ms, cap 500ms). Specify the property (`transition-colors`/`-transform`),
  never `transition-all`. Every animation must respect `prefers-reduced-motion`.
- **Accessibility is non-negotiable:** real `<button>`/`<a>`, visible focus rings, ≥40px
  hit targets, AA contrast, labels on inputs.
</content>
</invoke>
