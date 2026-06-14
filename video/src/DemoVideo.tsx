import React from "react";
import { AbsoluteFill, Audio, Sequence, Series, staticFile } from "remotion";
import { FontLoader } from "./lib";
import { colors } from "./theme";
import {
  leadFrames,
  sceneFrames,
  sceneList,
  type SceneId,
} from "./timeline";
import {
  Decision,
  Hook,
  Intent,
  Intro,
  Lenses,
  Outro,
  StatusQuo,
  Verdict,
} from "./scenes";

const COMPONENTS: Record<SceneId, React.FC<{ duration: number }>> = {
  s1_hook: Hook,
  s2_status_quo: StatusQuo,
  s3_intro: Intro,
  s4_intent: Intent,
  s5_lenses: Lenses,
  s6_verdict: Verdict,
  s7_decision: Decision,
  s8_outro: Outro,
};

export const DemoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <FontLoader />
      <Series>
        {sceneList.map((s) => {
          const frames = sceneFrames(s);
          const Comp = COMPONENTS[s.id];
          return (
            <Series.Sequence durationInFrames={frames} key={s.id}>
              <Comp duration={frames} />
              <Sequence from={leadFrames(s)}>
                <Audio src={staticFile(`audio/${s.id}.wav`)} />
              </Sequence>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
