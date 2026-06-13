// Animated SVG body skeleton overlay used on the Live Camera Analysis screen.
// This is a visual mock of MediaPipe Pose landmarks until the native AI service
// is integrated. Joints gently breathe to feel live.

import React, { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Line } from "react-native-svg";

// Normalized 0-1 landmark coordinates (MediaPipe-style skeleton)
const LANDMARKS = {
  head: [0.5, 0.16],
  neck: [0.5, 0.24],
  rShoulder: [0.4, 0.3],
  lShoulder: [0.6, 0.3],
  rElbow: [0.34, 0.42],
  lElbow: [0.66, 0.42],
  rWrist: [0.3, 0.55],
  lWrist: [0.7, 0.55],
  hip: [0.5, 0.55],
  rHip: [0.44, 0.56],
  lHip: [0.56, 0.56],
  rKnee: [0.43, 0.74],
  lKnee: [0.57, 0.74],
  rAnkle: [0.42, 0.92],
  lAnkle: [0.58, 0.92],
} as const;

const EDGES: [keyof typeof LANDMARKS, keyof typeof LANDMARKS][] = [
  ["head", "neck"],
  ["neck", "rShoulder"],
  ["neck", "lShoulder"],
  ["rShoulder", "rElbow"],
  ["rElbow", "rWrist"],
  ["lShoulder", "lElbow"],
  ["lElbow", "lWrist"],
  ["rShoulder", "rHip"],
  ["lShoulder", "lHip"],
  ["rHip", "lHip"],
  ["rHip", "rKnee"],
  ["lHip", "lKnee"],
  ["rKnee", "rAnkle"],
  ["lKnee", "lAnkle"],
];

interface Props {
  width: number;
  height: number;
  color?: string;
  accent?: string;
}

export const SkeletonOverlay: React.FC<Props> = ({
  width,
  height,
  color = "#14B8A6",
  accent = "#10B981",
}) => {
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => cancelAnimation(breathe);
  }, [breathe]);

  const px = (p: readonly [number, number]) => ({ x: p[0] * width, y: p[1] * height });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.6 + breathe.value * 0.4,
  }));

  return (
    <Animated.View style={[{ position: "absolute", top: 0, left: 0, width, height }, animatedStyle]}>
      <Svg width={width} height={height}>
        {EDGES.map(([a, b], i) => {
          const pa = px(LANDMARKS[a]);
          const pb = px(LANDMARKS[b]);
          return (
            <Line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
        {Object.entries(LANDMARKS).map(([k, p]) => {
          const point = px(p as readonly [number, number]);
          return (
            <Circle
              key={k}
              cx={point.x}
              cy={point.y}
              r={5}
              fill={accent}
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};
