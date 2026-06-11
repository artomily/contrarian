"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptBarProps {
  onSend: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  /** "lg" for the hero, "md" for the workspace footer. */
  size?: "lg" | "md";
  className?: string;
}

/** Decorative voice-waveform glyph. Animates only while the bar is focused. */
function Waveform({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const bars = [0.4, 0.75, 1, 0.6, 0.85, 0.5];
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden="true">
      {bars.map((peak, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-rose-400/80"
          style={{ height: `${peak * 60}%` }}
          animate={
            active && !reduceMotion
              ? { scaleY: [0.4, peak, 0.4] }
              : { scaleY: 0.5 }
          }
          transition={
            active && !reduceMotion
              ? {
                  duration: 0.9,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.08,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

/**
 * The shared input surface. Holds its own draft state and emits `onSend` on submit.
 * Used full-width in the hero and pinned to the workspace footer.
 */
export function PromptBar({
  onSend,
  disabled = false,
  placeholder = "Ask anything…",
  autoFocus = false,
  size = "lg",
  className,
}: PromptBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const hasText = value.trim().length > 0;

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(
        // Glassy pill. Focus ring is rose to match the brand.
        "group/prompt relative flex items-center gap-3 rounded-full border bg-white/[0.035] backdrop-blur-xl transition-colors duration-150",
        "border-white/10 hover:border-white/15",
        "focus-within:border-rose-400/40 focus-within:bg-white/[0.05]",
        size === "lg" ? "h-16 pl-6 pr-2.5" : "h-13 pl-5 pr-2",
        className,
      )}
    >
      {/* Rose glow that intensifies on focus */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-focus-within/prompt:opacity-100"
        style={{ boxShadow: "0 0 0 1px rgba(244,63,94,0.15), 0 10px 50px -12px rgba(244,63,94,0.45)" }}
      />

      <label htmlFor={inputId} className="sr-only">
        Describe an onchain action for Contrarian to review
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "relative z-10 min-w-0 flex-1 bg-transparent text-foreground outline-none",
          "placeholder:text-muted-foreground/70 disabled:opacity-60",
          size === "lg" ? "text-lg" : "text-base",
        )}
      />

      <div className="relative z-10 flex items-center gap-2.5">
        <Waveform active={focused || hasText} />
        <button
          type="submit"
          disabled={disabled || !hasText}
          aria-label="Send for review"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full text-white transition-all duration-150",
            "bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500",
            "shadow-[0_4px_16px_-4px_rgba(244,63,94,0.6)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "active:translate-y-px",
            "disabled:from-muted disabled:to-muted disabled:text-muted-foreground disabled:shadow-none disabled:opacity-60",
            size === "lg" ? "h-11 w-11" : "h-9 w-9",
          )}
        >
          {hasText ? (
            <ArrowUp className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
          ) : (
            <AudioLines className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
          )}
        </button>
      </div>
    </form>
  );
}
