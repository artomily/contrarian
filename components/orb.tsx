"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbProps {
  /** Diameter in px. */
  size?: number;
  /** Dim the ambient glow (used when the orb is small, e.g. in the workspace). */
  subtle?: boolean;
  className?: string;
}

/**
 * Contrarian's signature element: a luminous rose/red sphere with a slow internal
 * swirl and an ambient glow. Inspired by the Apple Intelligence orb, recolored to the
 * brand's "red team" identity.
 *
 * The hex stops below are intentional art values (a 3D-sphere gradient ramp), not theme
 * tokens — they describe the shading of a single illustrated object.
 */
export function Orb({ size = 220, subtle = false, className }: OrbProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
      animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 6, ease: "easeInOut", repeat: Infinity }
      }
    >
      {/* Ambient glow cast onto the page behind the sphere */}
      <div
        className="absolute rounded-full"
        style={{
          inset: subtle ? "-30%" : "-55%",
          background:
            "radial-gradient(circle, rgba(244,63,94,0.55), rgba(225,29,72,0.15) 45%, transparent 70%)",
          filter: "blur(40px)",
          opacity: subtle ? 0.5 : 0.9,
        }}
      />

      {/* The sphere */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 24%, #4a0c1b 0%, #2a0510 42%, #120207 70%, #09090b 100%)",
          boxShadow:
            "inset 0 -10px 36px rgba(0,0,0,0.85), inset 8px 10px 30px rgba(244,63,94,0.18), 0 0 1px rgba(254,205,211,0.25)",
        }}
      >
        {/* Swirl A — bright rose, lower-left, slow clockwise */}
        <motion.div
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 18, ease: "linear", repeat: Infinity }
          }
        >
          <div
            className="absolute rounded-full"
            style={{
              left: "8%",
              top: "44%",
              width: "78%",
              height: "78%",
              background:
                "radial-gradient(circle, rgba(251,113,133,0.95), rgba(244,63,94,0.25) 55%, transparent 70%)",
              filter: "blur(18px)",
            }}
          />
        </motion.div>

        {/* Swirl B — deep crimson, upper-right, slower counter-clockwise */}
        <motion.div
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 26, ease: "linear", repeat: Infinity }
          }
        >
          <div
            className="absolute rounded-full"
            style={{
              right: "10%",
              top: "12%",
              width: "60%",
              height: "60%",
              background:
                "radial-gradient(circle, rgba(225,29,72,0.85), rgba(136,19,55,0.2) 60%, transparent 72%)",
              filter: "blur(20px)",
            }}
          />
        </motion.div>

        {/* Crescent rim light — suggests light wrapping the bottom-right edge */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset -6px -8px 22px rgba(254,205,211,0.35), inset 0 0 1px rgba(255,255,255,0.4)",
          }}
        />

        {/* Specular highlight — glassy catch-light, top-left */}
        <div
          className="absolute rounded-full"
          style={{
            left: "20%",
            top: "13%",
            width: "34%",
            height: "22%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </motion.div>
  );
}
