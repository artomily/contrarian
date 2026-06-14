import React from "react";
import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo";
import { fps, height, totalFrames, width } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DemoVideo"
      component={DemoVideo}
      durationInFrames={totalFrames}
      fps={fps}
      width={width}
      height={height}
    />
  );
};
