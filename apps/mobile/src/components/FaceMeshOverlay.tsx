// Face placement oval + symmetry guide for facial rehab Live screen.

import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Ellipse,
  Line,
  Path,
} from "react-native-svg";

interface Props {
  width: number;
  height: number;
  color?: string;
  accent?: string;
}

// Approximate face mesh anchor points (normalized within the oval bounds)
const FACE_DOTS: [number, number][] = [
  // forehead arc
  [0.35, 0.22], [0.5, 0.18], [0.65, 0.22],
  // eyebrows
  [0.34, 0.34], [0.42, 0.32], [0.58, 0.32], [0.66, 0.34],
  // eyes
  [0.38, 0.42], [0.45, 0.41], [0.55, 0.41], [0.62, 0.42],
  // nose
  [0.5, 0.5], [0.5, 0.56],
  // cheeks
  [0.32, 0.55], [0.68, 0.55],
  // mouth
  [0.42, 0.7], [0.5, 0.71], [0.58, 0.7], [0.5, 0.74],
  // jaw
  [0.36, 0.82], [0.5, 0.88], [0.64, 0.82],
];

export const FaceMeshOverlay: React.FC<Props> = ({
  width,
  height,
  color = "#14B8A6",
  accent = "#FFFFFF",
}) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.6 + pulse.value * 0.4,
  }));

  // Oval bounds (face placement guide) centered
  const cx = width / 2;
  const cy = height * 0.48;
  const rx = width * 0.28;
  const ry = height * 0.36;

  return (
    <Animated.View style={[{ position: "absolute", top: 0, left: 0, width, height }, animatedStyle]}>
      <Svg width={width} height={height}>
        {/* Face placement oval */}
        <Ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          stroke={color}
          strokeWidth={2.5}
          fill="transparent"
          strokeDasharray="8,6"
        />
        {/* corner brackets for cinematic feel */}
        <Path
          d={`M ${cx - rx + 8} ${cy - ry - 18} h -20 v 20`}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${cx + rx - 8} ${cy - ry - 18} h 20 v 20`}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${cx - rx + 8} ${cy + ry + 18} h -20 v -20`}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={`M ${cx + rx - 8} ${cy + ry + 18} h 20 v -20`}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
        {/* symmetry axis */}
        <Line
          x1={cx}
          y1={cy - ry}
          x2={cx}
          y2={cy + ry}
          stroke={accent}
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="3,4"
        />
        {/* mesh dots within the oval */}
        {FACE_DOTS.map(([nx, ny], i) => {
          const x = cx - rx + nx * (rx * 2);
          const y = cy - ry + ny * (ry * 2);
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={2}
              fill={accent}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};
