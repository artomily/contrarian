import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AlertTriangle,
  Brain,
  Check,
  Scale,
  Shield,
  ShieldCheck,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { colors, mono, sans } from "./theme";
import {
  Bg,
  BrowserFrame,
  Crystal,
  Kicker,
  useFadeUp,
  useSpringIn,
} from "./lib";

/** Wraps a scene with edge crossfades. */
export const SceneWrap: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [duration - 14, duration], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut), fontFamily: sans }}>
      {children}
    </AbsoluteFill>
  );
};

const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 0,
}) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap,
      padding: 100,
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ───────────────────────────── S1 — HOOK ───────────────────────────── */
export const Hook: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(54, 22);
  const words = "There is no undo.".split(" ");
  const icon = useSpringIn(6);
  return (
    <SceneWrap duration={duration}>
      <Bg>
        <Center gap={34}>
          <div
            style={{
              transform: `scale(${icon})`,
              color: colors.rose,
              filter: "drop-shadow(0 0 22px rgba(244,63,94,0.6))",
            }}
          >
            <AlertTriangle size={68} strokeWidth={1.6} />
          </div>
          <Kicker style={{ opacity: useFadeUp(16, 16).opacity }}>
            The problem
          </Kicker>
          <div
            style={{
              display: "flex",
              gap: 26,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -3,
              color: colors.text,
              lineHeight: 1,
            }}
          >
            {words.map((w, i) => {
              const s = useSpringIn(22 + i * 5);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: s,
                    transform: `translateY(${(1 - s) * 40}px)`,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
          <div
            style={{
              ...sub,
              fontSize: 38,
              color: colors.muted,
              maxWidth: 1180,
              lineHeight: 1.4,
            }}
          >
            On a blockchain, every signature is final — and irreversible.
          </div>
        </Center>
      </Bg>
    </SceneWrap>
  );
};

/* ─────────────────────────── S2 — STATUS QUO ────────────────────────── */
const ConfirmPill: React.FC<{ label: string; action: string; delay: number }> = ({
  label,
  action,
  delay,
}) => {
  const s = useSpringIn(delay);
  const check = useSpringIn(delay + 8);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 24}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 30px",
        width: 520,
        borderRadius: 16,
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        fontFamily: mono,
      }}
    >
      <span style={{ color: colors.faint, fontSize: 22, width: 110 }}>{label}</span>
      <span style={{ color: colors.text, fontSize: 26, flex: 1 }}>{action}</span>
      <span
        style={{
          transform: `scale(${check})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(52,211,153,0.16)",
          color: colors.success,
        }}
      >
        <Check size={22} strokeWidth={3} />
      </span>
    </div>
  );
};

export const StatusQuo: React.FC<{ duration: number }> = ({ duration }) => {
  const headline = useFadeUp(54, 18);
  const question = useFadeUp(120, 20);
  return (
    <SceneWrap duration={duration}>
      <Bg glow={0.7}>
        <Center gap={20}>
          <Kicker style={{ marginBottom: 18, opacity: useFadeUp(8, 14).opacity }}>
            The status quo
          </Kicker>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ConfirmPill label="Wallet" action="Confirm" delay={18} />
            <ConfirmPill label="App" action="Approve" delay={30} />
            <ConfirmPill label="Bridge" action="Sign" delay={42} />
          </div>
          <div
            style={{
              ...headline,
              marginTop: 40,
              fontSize: 56,
              fontWeight: 700,
              color: colors.text,
            }}
          >
            Everything is built to say yes.
          </div>
          <div
            style={{
              ...question,
              fontSize: 42,
              fontWeight: 600,
              color: colors.rose,
            }}
          >
            Who argues for caution?
          </div>
        </Center>
      </Bg>
    </SceneWrap>
  );
};

/* ─────────────────────────── S3 — BRAND INTRO ───────────────────────── */
export const Intro: React.FC<{ duration: number }> = ({ duration }) => {
  const crystal = useSpringIn(6, 160);
  const word = useFadeUp(34, 20);
  const fw = useFadeUp(50, 18);
  const tag = useFadeUp(66, 20);
  return (
    <SceneWrap duration={duration}>
      <Bg>
        <Center gap={10}>
          <div style={{ transform: `scale(${crystal})`, marginBottom: 8 }}>
            <Crystal size={260} />
          </div>
          <div
            style={{
              ...word,
              fontSize: 116,
              fontWeight: 800,
              letterSpacing: -3,
              color: colors.text,
            }}
          >
            Contrarian
          </div>
          <div
            style={{
              ...fw,
              fontFamily: mono,
              fontSize: 24,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: colors.rose,
            }}
          >
            Decision Firewall
          </div>
          <div
            style={{
              ...tag,
              marginTop: 22,
              fontSize: 36,
              color: colors.muted,
              maxWidth: 1100,
              lineHeight: 1.4,
            }}
          >
            It argues against your transaction — before you ever sign.
          </div>
        </Center>
      </Bg>
    </SceneWrap>
  );
};

/* ─────────────────────────── S4 — DESCRIBE INTENT ───────────────────── */
export const Intent: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const frameIn = useSpringIn(6, 170);
  const full = "swap 100 USDC to SOL";
  const chars = Math.round(
    interpolate(frame, [42, 88], [0, full.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const cursorOn = Math.floor(frame / 15) % 2 === 0;
  const cap = useFadeUp(30, 16);
  return (
    <SceneWrap duration={duration}>
      <Bg glow={0.7}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
          <div
            style={{
              transform: `scale(${0.9 + frameIn * 0.1})`,
              opacity: frameIn,
            }}
          >
            <BrowserFrame src="shots/dashboard-idle.png" width={1180} />
          </div>
          <div
            style={{
              ...cap,
              marginTop: 48,
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontSize: 26,
                color: colors.rose,
                border: `1px solid ${colors.rose700}`,
                borderRadius: 10,
                padding: "8px 16px",
              }}
            >
              01
            </span>
            <span style={{ fontSize: 40, fontWeight: 600, color: colors.text }}>
              Describe your intent in plain English
            </span>
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: mono,
              fontSize: 34,
              color: colors.text,
              background: colors.panel,
              border: `1px solid ${colors.border}`,
              borderRadius: 14,
              padding: "16px 28px",
              minWidth: 520,
              textAlign: "left",
            }}
          >
            <span style={{ color: colors.faint }}>{"› "}</span>
            {full.slice(0, chars)}
            <span style={{ opacity: cursorOn ? 1 : 0, color: colors.rose }}>▍</span>
          </div>
        </AbsoluteFill>
      </Bg>
    </SceneWrap>
  );
};

/* ─────────────────────────── S5 — FOUR LENSES ───────────────────────── */
const LENSES = [
  { icon: Shield, name: "Risk Analyst", role: "Finds every way you could lose", color: colors.danger },
  { icon: TrendingDown, name: "Market Skeptic", role: "Questions the timing and the hype", color: colors.warning },
  { icon: Scale, name: "Opportunity Cost", role: "Asks what you're giving up", color: colors.rose },
  { icon: Brain, name: "Behavioral Psych", role: "Fear, or greed?", color: colors.roseBright },
];

export const Lenses: React.FC<{ duration: number }> = ({ duration }) => {
  const head = useFadeUp(34, 18);
  return (
    <SceneWrap duration={duration}>
      <Bg>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center", padding: 90 }}
        >
          <Kicker style={{ opacity: useFadeUp(10, 14).opacity }}>The red team</Kicker>
          <div
            style={{
              ...head,
              marginTop: 18,
              marginBottom: 64,
              fontSize: 60,
              fontWeight: 700,
              color: colors.text,
              textAlign: "center",
            }}
          >
            Four lenses. One job: change your mind.
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {LENSES.map((l, i) => {
              const s = useSpringIn(46 + i * 9, 180);
              const Icon = l.icon;
              return (
                <div
                  key={l.name}
                  style={{
                    opacity: s,
                    transform: `translateY(${(1 - s) * 36}px)`,
                    width: 360,
                    height: 320,
                    borderRadius: 22,
                    background: colors.panel,
                    border: `1px solid ${colors.border}`,
                    padding: 36,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(244,63,94,0.10)",
                      color: l.color,
                    }}
                  >
                    <Icon size={40} strokeWidth={1.7} />
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 16,
                      letterSpacing: 3,
                      color: colors.faint,
                    }}
                  >
                    {`0${i + 1}`}
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: colors.text }}>
                    {l.name}
                  </div>
                  <div style={{ fontSize: 24, color: colors.muted, lineHeight: 1.35 }}>
                    {l.role}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Bg>
    </SceneWrap>
  );
};

/* ─────────────────────────── S6 — VERDICT / SCORES ──────────────────── */
const StatChip: React.FC<{
  label: string;
  value: string;
  tag: string;
  delay: number;
  accent: string;
}> = ({ label, value, tag, delay, accent }) => {
  const s = useSpringIn(delay, 170);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 26}px) scale(${0.92 + s * 0.08})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "22px 40px",
        borderRadius: 18,
        background: colors.panel,
        border: `1px solid ${accent}55`,
        minWidth: 260,
      }}
    >
      <span style={{ fontFamily: mono, fontSize: 18, letterSpacing: 3, color: colors.faint }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: mono,
          fontSize: 72,
          fontWeight: 700,
          color: accent,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      <span style={{ fontFamily: mono, fontSize: 18, letterSpacing: 2, color: accent }}>
        {tag}
      </span>
    </div>
  );
};

export const Verdict: React.FC<{ duration: number }> = ({ duration }) => {
  const frameIn = useSpringIn(6, 170);
  return (
    <SceneWrap duration={duration}>
      <Bg glow={0.7}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 64 }}>
          <div style={{ transform: `scale(${0.9 + frameIn * 0.1})`, opacity: frameIn }}>
            <BrowserFrame src="shots/workspace-analysis.png" width={1120} />
          </div>
          <div style={{ marginTop: 46, display: "flex", gap: 26, alignItems: "center" }}>
            <StatChip label="RISK" value="93" tag="HIGH" delay={40} accent={colors.danger} />
            <StatChip label="FOMO" value="92" tag="HIGH" delay={50} accent={colors.warning} />
            <StatChip
              label="VERDICT"
              value="⚠"
              tag="RECONSIDER"
              delay={60}
              accent={colors.rose}
            />
          </div>
        </AbsoluteFill>
      </Bg>
    </SceneWrap>
  );
};

/* ─────────────────────────── S7 — THE DECISION ──────────────────────── */
const ChoiceBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  delay: number;
}> = ({ icon, label, primary, delay }) => {
  const s = useSpringIn(delay, 170);
  return (
    <div
      style={{
        opacity: s,
        transform: `scale(${0.9 + s * 0.1})`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "22px 42px",
        borderRadius: 14,
        fontFamily: mono,
        fontSize: 28,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: primary ? "#fff" : colors.muted,
        background: primary
          ? "linear-gradient(180deg,#f43f5e,#e11d48)"
          : "transparent",
        border: primary ? "none" : `1px solid ${colors.border}`,
        boxShadow: primary ? "0 0 40px -8px rgba(244,63,94,0.7)" : "none",
      }}
    >
      {icon}
      {label}
    </div>
  );
};

export const Decision: React.FC<{ duration: number }> = ({ duration }) => {
  const frameIn = useSpringIn(6, 170);
  const head = useFadeUp(34, 18);
  return (
    <SceneWrap duration={duration}>
      <Bg>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 80 }}>
          <div
            style={{
              ...head,
              fontSize: 64,
              fontWeight: 700,
              color: colors.text,
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            The final call is always yours.
          </div>
          <div style={{ fontSize: 32, color: colors.muted, marginBottom: 44, opacity: head.opacity }}>
            Contrarian is an advisor — never a gatekeeper.
          </div>
          <div style={{ transform: `scale(${0.92 + frameIn * 0.08})`, opacity: frameIn }}>
            <BrowserFrame
              src="shots/workspace-analysis.png"
              width={1000}
              height={420}
              objectPosition="50% 96%"
              imgScale={1.18}
            />
          </div>
          <div style={{ marginTop: 46, display: "flex", gap: 30 }}>
            <ChoiceBtn
              icon={<ShieldCheck size={28} />}
              label="Execute Anyway"
              primary
              delay={50}
            />
            <ChoiceBtn icon={<XCircle size={28} />} label="Cancel" delay={60} />
          </div>
        </AbsoluteFill>
      </Bg>
    </SceneWrap>
  );
};

/* ─────────────────────────── S8 — OUTRO / CTA ───────────────────────── */
export const Outro: React.FC<{ duration: number }> = ({ duration }) => {
  const crystal = useSpringIn(6, 160);
  const word = useFadeUp(28, 18);
  const tag = useFadeUp(44, 22);
  const cta = useFadeUp(70, 20);
  return (
    <SceneWrap duration={duration}>
      <Bg>
        <Center gap={14}>
          <div style={{ transform: `scale(${crystal})`, marginBottom: 6 }}>
            <Crystal size={220} />
          </div>
          <div
            style={{
              ...word,
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -2,
              color: colors.text,
            }}
          >
            Contrarian
          </div>
          <div
            style={{
              ...tag,
              fontSize: 44,
              fontWeight: 600,
              color: colors.rose,
              maxWidth: 1200,
              lineHeight: 1.3,
            }}
          >
            Every transaction deserves an argument.
          </div>
          <div
            style={{
              ...cta,
              marginTop: 30,
              fontFamily: mono,
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: colors.muted,
            }}
          >
            contrarian.app · think before you sign
          </div>
        </Center>
      </Bg>
    </SceneWrap>
  );
};
