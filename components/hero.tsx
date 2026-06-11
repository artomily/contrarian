"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Coins,
  Link as LinkIcon,
  Sparkles,
  HandCoins,
  Banknote,
  ArrowUpDown,
  Droplets,
} from "lucide-react";
import { Orb } from "./orb";
import { PromptBar } from "./prompt-bar";

interface HeroProps {
  onSend: (value: string) => void;
  disabled?: boolean;
}

const QUICK_ACTIONS = [
  { label: "Swap", icon: ArrowRightLeft, text: "swap 100 USDC to SOL" },
  { label: "Stake", icon: Coins, text: "stake 50 SOL with Marinade" },
  { label: "Bridge", icon: LinkIcon, text: "bridge 200 USDC to Arbitrum" },
  { label: "Mint", icon: Sparkles, text: "mint an NFT from Mad Lads" },
  { label: "Lend", icon: HandCoins, text: "lend 500 USDC on Solend" },
  { label: "Borrow", icon: Banknote, text: "borrow 100 USDC against SOL" },
  { label: "Transfer", icon: ArrowUpDown, text: "send 10 SOL to 7xKv…abc" },
  { label: "LP", icon: Droplets, text: "provide liquidity 100 USDC + 100 SOL to Orca" },
];

function getGreeting() {
  const h = new Date().getHours();
  return h < 5
    ? "Working late"
    : h < 12
      ? "Good morning"
      : h < 18
        ? "Good afternoon"
        : "Good evening";
}

// No-op subscribe: the greeting only needs to be read once on the client.
const subscribeGreeting = () => () => {};

/**
 * Time-of-day greeting. Uses `useSyncExternalStore` so the server renders a stable
 * placeholder ("Welcome back") and the client swaps in the real greeting on hydration —
 * no hydration mismatch, and no setState-in-effect.
 */
function useGreeting() {
  return useSyncExternalStore(subscribeGreeting, getGreeting, () => "Welcome back");
}

export function Hero({ onSend, disabled = false }: HeroProps) {
  const greeting = useGreeting();

  return (
    <motion.div
      key="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-12"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-9"
      >
        <Orb size={208} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
        className="font-mono text-sm tracking-wide text-muted-foreground"
      >
        {greeting}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.45, ease: "easeOut" }}
        className="mt-2 max-w-2xl text-balance text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
      >
        How can I help you today?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.45, ease: "easeOut" }}
        className="mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground"
      >
        Describe an onchain action. I&apos;ll argue against it before it becomes a
        transaction.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.45, ease: "easeOut" }}
        className="mt-9 w-full max-w-2xl"
      >
        <PromptBar onSend={onSend} disabled={disabled} autoFocus size="lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.45, ease: "easeOut" }}
        className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2"
      >
        {QUICK_ACTIONS.map(({ label, icon: Icon, text }) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onSend(text)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.025] px-3.5 py-2 text-[13px] text-muted-foreground transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
