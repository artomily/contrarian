// Fonts are bundled locally (public/fonts) and loaded by <FontLoader/> (see
// lib.tsx) instead of fetched from Google at render time — the render machine's
// network is unreliable for the gstatic CDN.
export const sans = "Geist";
export const mono = "Geist Mono";

export const FONT_FACES: Array<{ family: string; weight: string; file: string }> = [
  { family: sans, weight: "400", file: "fonts/Geist-Regular.woff2" },
  { family: sans, weight: "500", file: "fonts/Geist-Medium.woff2" },
  { family: sans, weight: "600", file: "fonts/Geist-SemiBold.woff2" },
  { family: sans, weight: "700", file: "fonts/Geist-Bold.woff2" },
  { family: sans, weight: "800", file: "fonts/Geist-Black.woff2" },
  { family: mono, weight: "400", file: "fonts/GeistMono-Regular.woff2" },
  { family: mono, weight: "500", file: "fonts/GeistMono-Medium.woff2" },
];

// Brand palette — mirrors app/globals.css (rose/red "red team" identity).
export const colors = {
  bg: "#09090b",
  bgWarm: "#120207",
  text: "#fafafa",
  muted: "rgba(250,250,250,0.60)",
  faint: "rgba(250,250,250,0.40)",
  rose: "#fb7185",
  roseBright: "#fecdd3",
  rose500: "#f43f5e",
  rose600: "#e11d48",
  rose700: "#be123c",
  danger: "#f43f5e",
  warning: "#f59e0b",
  success: "#34d399",
  border: "rgba(255,255,255,0.10)",
  panel: "rgba(255,255,255,0.03)",
};
