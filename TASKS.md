# Tasks

Working roadmap for Contrarian. Checked = shipped, unchecked = planned. Keep this honest —
it's the quickest way for a new contributor (or agent) to see where things stand.

## Now — UI redesign (in progress)

Apple-Intelligence-style **hero takeover** in Contrarian's rose/red identity, desktop-first.

- [x] Project docs: `CLAUDE.md`, `ARCHITECTURE.md`, `TASKS.md`
- [x] Signature rose/red **Orb** component (animated, reduced-motion safe)
- [x] Shared **PromptBar** ("Ask anything" pill with waveform + send)
- [x] **Hero** landing: orb + greeting + "How can I help you today?" + prompt + quick chips
- [x] Animate hero → **workspace** (conversation + analysis + activity sidebar)
- [x] Restyle analysis cards / verdict for the premium dark surface
- [x] Center vignette glow, thin scrollbar, motion polish in `globals.css`
- [x] Verify in browser at desktop width; `npm run build` clean
- [x] Marketing **landing page** at `/` (hero, mock review, stats, lenses, CTA, footer)
- [x] **Docs page** at `/docs` (sidebar TOC, lifecycle, lenses & scoring, actions table, FAQ)
- [x] App experience moved to `/dashboard` (shared `BrandMark`, links to home/docs)

## Foundation (already in place)

- [x] Next.js 16 + Tailwind v4 + shadcn (`base-nova`) scaffold
- [x] Four-lens mock analysis engine (`lib/mock-analysis.ts`)
- [x] Intent parser for 8 onchain action types
- [x] Review state machine (`hooks/use-contrarian-analysis.ts`)
- [x] Score gauges, counter-arguments, verdict panel, activity feed
- [x] wagmi/viem wallet connection (Arbitrum), simulated execution

## Next — product

- [ ] Replace mock analysis with a real LLM call (four-persona prompt → structured output)
- [ ] Real transaction construction + simulation before signing (show expected result)
- [ ] Persist review history (localStorage, then a backend) instead of in-memory only
- [ ] Per-lens detail drill-down (expand a gauge to read `details[]`)
- [ ] Streaming lens results (render each persona as it finishes, not all at once)
- [ ] Wallet rejection handled as a quiet return-to-idle, not an error

## Next — UX / polish

- [ ] Keyboard shortcuts (⌘K to focus prompt, Esc to cancel an open review)
- [ ] Empty/error/loading state copy pass with concrete next actions
- [ ] Responsive pass for tablet (768px) and mobile (375px)
- [ ] Light mode (currently dark-only)
- [ ] Sound/haptic cue on `RECONSIDER` verdict (opt-in)

## Known gaps / debt

- [ ] No tests — add component tests for the state machine and intent parser
- [ ] Analysis is deterministic mock data; not real risk assessment
- [ ] Execution is simulated — no real onchain calls are made
</content>
