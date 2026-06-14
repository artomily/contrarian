"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbProps {
  /** Bounding size in px. */
  size?: number;
  /** Dim the ambient glow (used when the crystal is small, e.g. in the workspace). */
  subtle?: boolean;
  className?: string;
}

/**
 * Contrarian's signature element: a luminous rose/red **crystal** — a faceted
 * octahedron that slowly tumbles in 3D. It replaces the earlier sphere with an
 * angular "threat core" that reads as a red-team gem rather than a calm orb.
 *
 * Geometry is computed from `size` so it scales cleanly from the 40px workspace
 * badge to the 208px hero. The hex/rgba stops are intentional art values (facet
 * shading), not theme tokens — they describe the shading of a single object.
 */
export function Orb({ size = 220, subtle = false, className }: OrbProps) {
  const reduceMotion = useReducedMotion();

  // --- Octahedron geometry (all in px, derived from `size`) ---
  const R = size / 2; // distance from center to each vertex
  const edge = R * Math.SQRT2; // octahedron edge length
  const triH = (edge * Math.sqrt(3)) / 2; // height of one equilateral face
  const apothem = R / Math.SQRT2; // center → equator-edge midpoint
  const slant = (Math.atan(Math.SQRT2) * 180) / Math.PI; // ≈ 54.74° fold angle

  // Four facets of the top pyramid. The bottom pyramid is this group flipped 180°.
  const facetShades = [
    "linear-gradient(155deg, rgba(255,228,230,0.98), rgba(251,113,133,0.92) 45%, rgba(225,29,72,0.85))",
    "linear-gradient(155deg, rgba(251,113,133,0.95), rgba(244,63,94,0.85) 50%, rgba(159,18,57,0.85))",
    "linear-gradient(155deg, rgba(254,205,211,0.98), rgba(244,63,94,0.9) 50%, rgba(190,24,60,0.85))",
    "linear-gradient(155deg, rgba(244,63,94,0.92), rgba(225,29,72,0.85) 50%, rgba(136,19,55,0.85))",
  ];

  const Pyramid = ({ flip }: { flip?: boolean }) => (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        transform: flip ? "rotateX(180deg)" : undefined,
      }}
    >
      {[45, 135, 225, 315].map((angle, i) => (
        <div
          key={angle}
          className="absolute"
          style={{
            width: edge,
            height: triH,
            left: -edge / 2,
            top: -triH,
            transformOrigin: "50% 100%",
            transform: `rotateY(${angle}deg) translateZ(${apothem}px) rotateX(${slant}deg)`,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            background: facetShades[i],
            boxShadow:
              "inset 0 0 16px rgba(255,228,230,0.45), inset 0 0 1px rgba(255,255,255,0.7)",
            backfaceVisibility: "hidden",
          }}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size, perspective: size * 2.6 }}
      aria-hidden="true"
      animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 6, ease: "easeInOut", repeat: Infinity }
      }
    >
      {/* Ambient glow cast onto the page behind the crystal */}
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

      {/* The tumbling crystal */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          filter: "drop-shadow(0 0 18px rgba(244,63,94,0.45))",
        }}
        animate={
          reduceMotion
            ? { rotateX: -18, rotateY: 32 }
            : { rotateY: [0, 360], rotateX: [-14, -22, -14] }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                rotateY: { duration: 16, ease: "linear", repeat: Infinity },
                rotateX: { duration: 9, ease: "easeInOut", repeat: Infinity },
              }
        }
      >
        <Pyramid />
        <Pyramid flip />

        {/* Inner core glow, sits at the crystal's heart */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,228,230,0.85), rgba(244,63,94,0.25) 55%, transparent 72%)",
            filter: "blur(10px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
