# Contrarian

**The AI Agent That Challenges Every Onchain Decision Before It Becomes a Transaction.**

---

## Problem

Humans are biased. In crypto, this leads to:

```
FOMO → Swap → Loss
Influencer Tweet → Buy → Loss
Panic → Sell → Market Rebound
```

There is no system that actively argues against a user's decision before it executes onchain.

---

## Solution

Contrarian is a **Decision Firewall for Onchain Actions**.

Instead of helping users confirm decisions, Contrarian actively searches for reasons why they may be wrong.

Contrarian is not an advisor. Contrarian is not a copilot. Contrarian is a **Red Team Agent**.

---

## Innovation

Rather than "helping me decide" like every other AI tool, Contrarian asks:

> "Why is this a bad idea?"

It deploys 4 review lenses against every transaction intent:

| Lens | Role |
|------|------|
| **Risk Analyst** | Finds downside |
| **Market Skeptic** | Challenges assumptions |
| **Opportunity Cost** | Identifies better alternatives |
| **Behavioral Psychologist** | Detects emotional decisions |

---

## How It Works

1. **Input** — User drafts a transaction (e.g., Swap 500 USDC → XYZ)
2. **Analyze** — Contrarian runs 4 independent lenses against the intent
3. **Review** — Scores rendered as a threat analysis dashboard
4. **Decide** — User chooses: Execute or Cancel

---

## Why Arbitrum

Fast and low-cost transaction review before execution.

---

## Tech Stack

- **Next.js 16** — App Router with React Server Components
- **Tailwind CSS v4** — Utility-first CSS
- **shadcn/ui** — Accessible UI primitives
- **Framer Motion** — Page load and score animations
- **wagmi + viem** — Wallet connection and onchain execution

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Flow

```
Create Transaction → Contrarian Review → Warning → Execute / Cancel
```

Approximately 2 minutes end-to-end.
