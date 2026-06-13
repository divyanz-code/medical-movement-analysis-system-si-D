import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
  size?: number;
  strokeWidth?: number;
  value: number; // 0-100
  label?: string;
  caption?: string;
  testID?: string;
}

export const ProgressRing: React.FC<Props> = ({
  size = 140,
  strokeWidth = 12,
  value,
  label,
  caption,
  testID,
}) => {
  const { palette } = useTheme();
  const v = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;

  return (
    <View
      testID={testID}
      style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}
    >
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={palette.primary} />
            <Stop offset="100%" stopColor={palette.accent} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={palette.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{
              color: palette.textPrimary,
              fontSize: 28,
              fontWeight: "700",
              letterSpacing: -0.5,
            }}
          >
            {v}
            <Text style={{ fontSize: 16, color: palette.textSecondary }}>%</Text>
          </Text>
          {label ? (
            <Text style={{ color: palette.textSecondary, fontSize: 12, fontWeight: "600", marginTop: 2 }}>
              {label}
            </Text>
          ) : null}
          {caption ? (
            <Text style={{ color: palette.textSecondary, fontSize: 10, marginTop: 2 }}>{caption}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};
