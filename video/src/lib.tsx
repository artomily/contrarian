import React from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, FONT_FACES, mono } from "./theme";

/**
 * Loads the locally-bundled Geist woff2 files and blocks rendering until they
 * are ready. Always clears its delayRender handle (even on failure / timeout),
 * so a slow font can never hang the render the way @remotion/fonts did.
 */
export const FontLoader: React.FC = () => {
  const [handle] = React.useState(() => delayRender("load-fonts"));

  const css = FONT_FACES.map(
    (f) =>
      `@font-face{font-family:'${f.family}';font-weight:${f.weight};font-style:normal;font-display:block;src:url('${staticFile(
        f.file,
      )}') format('woff2');}`,
  ).join("\n");

  React.useEffect(() => {
    let cleared = false;
    const done = () => {
      if (!cleared) {
        cleared = true;
        continueRender(handle);
      }
    };
    Promise.all(
      FONT_FACES.map((f) =>
        document.fonts.load(`${f.weight} 1em '${f.family}'`).catch(() => null),
      ),
    )
      .then(() => done())
      .catch((e) => cancelRender(e));
    // Hard fallback so the render never stalls on font loading.
    const t = setTimeout(done, 7000);
    return () => clearTimeout(t);
  }, [handle]);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

/** Easing helper: fade + rise in, clamped. */
export function useFadeUp(start: number, duration = 18, distance = 28) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * distance}px)`,
  };
}

/** Spring-driven scale-in. */
export function useSpringIn(start: number, damping = 200) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping } });
}

/** Background: warm-black with a slow-breathing rose glow. */
export const Bg: React.FC<{ children?: React.ReactNode; glow?: number }> = ({
  children,
  glow = 1,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 40);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 55% at 50% 42%, rgba(225,29,72,0.16), rgba(120,10,30,0.05) 45%, transparent 72%)",
          opacity: glow * (0.7 + 0.3 * pulse),
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 120%, rgba(0,0,0,0.6), transparent 60%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** Small uppercase mono kicker label. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      fontFamily: mono,
      fontSize: 22,
      letterSpacing: 6,
      textTransform: "uppercase",
      color: colors.rose,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A macOS-style browser window framing a product screenshot. */
export const BrowserFrame: React.FC<{
  src: string;
  width: number;
  /** object-position for cropping/zoom, e.g. "50% 100%". */
  objectPosition?: string;
  /** scale of the inner image for zoom-in crops. */
  imgScale?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ src, width, objectPosition = "50% 0%", imgScale = 1, height, style }) => {
  const h = height ?? (width * 9) / 16 + 44;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: 18,
        overflow: "hidden",
        background: "#0c0c0e",
        border: `1px solid ${colors.border}`,
        boxShadow:
          "0 50px 120px -30px rgba(0,0,0,0.85), 0 0 60px -20px rgba(244,63,94,0.30)",
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 18px",
          background: "rgba(255,255,255,0.04)",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div
            key={c}
            style={{ width: 13, height: 13, borderRadius: "50%", background: c }}
          />
        ))}
        <div
          style={{
            marginLeft: 16,
            fontFamily: mono,
            fontSize: 14,
            color: colors.faint,
          }}
        >
          contrarian.app
        </div>
      </div>
      <div style={{ width: "100%", height: h - 44, overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            transform: `scale(${imgScale})`,
          }}
        />
      </div>
    </div>
  );
};

/** A glowing, slowly-tumbling rose crystal (echoes the app's signature orb). */
export const Crystal: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => {
  const frame = useCurrentFrame();
  const rot = frame * 1.1;
  const wob = Math.sin(frame / 22) * 6;
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-40%",
          background:
            "radial-gradient(circle, rgba(244,63,94,0.55), rgba(225,29,72,0.15) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <svg
        viewBox="-60 -60 120 120"
        width={size}
        height={size}
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${wob}deg)`,
          filter: "drop-shadow(0 0 18px rgba(244,63,94,0.5))",
        }}
      >
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fecdd3" />
            <stop offset="0.5" stopColor="#fb7185" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f43f5e" />
            <stop offset="1" stopColor="#9f1239" />
          </linearGradient>
        </defs>
        {/* facet split driven by rotation for a faux-3D tumble */}
        <g transform={`scale(${0.78 + 0.22 * Math.abs(Math.cos((rot * Math.PI) / 180))}, 1)`}>
          <polygon points="0,-50 46,0 0,50 -46,0" fill="url(#cg1)" />
          <polygon points="0,-50 0,50 -46,0" fill="url(#cg2)" opacity="0.75" />
          <polygon points="0,-50 46,0 0,8" fill="#ffe4e6" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};
