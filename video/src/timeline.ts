import durations from "./durations.json";

export const fps = 30;
export const width = 1920;
export const height = 1080;

// Each scene: narration clip id + lead (silence before VO) + tail (hold after VO).
export const sceneList = [
  { id: "s1_hook", lead: 0.5, tail: 1.1 },
  { id: "s2_status_quo", lead: 0.4, tail: 0.9 },
  { id: "s3_intro", lead: 0.5, tail: 1.0 },
  { id: "s4_intent", lead: 0.5, tail: 1.0 },
  { id: "s5_lenses", lead: 0.4, tail: 1.0 },
  { id: "s6_verdict", lead: 0.5, tail: 1.1 },
  { id: "s7_decision", lead: 0.4, tail: 1.1 },
  { id: "s8_outro", lead: 0.5, tail: 1.8 },
] as const;

export type SceneId = (typeof sceneList)[number]["id"];

const dur = durations as Record<string, number>;

export const sceneFrames = (s: { id: SceneId; lead: number; tail: number }) =>
  Math.round((s.lead + (dur[s.id] ?? 0) + s.tail) * fps);

export const leadFrames = (s: { lead: number }) => Math.round(s.lead * fps);

export const narrationFrames = (id: SceneId) => Math.round((dur[id] ?? 0) * fps);

export const totalFrames = sceneList.reduce((a, s) => a + sceneFrames(s), 0);
