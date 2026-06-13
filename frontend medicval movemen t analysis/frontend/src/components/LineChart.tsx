import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Line,
  Path,
  Stop,
} from "react-native-svg";

import { useTheme } from "@/src/theme/ThemeProvider";

interface Series {
  label: string;
  color: string;
  values: number[];
}

interface Props {
  labels: string[];
  series: Series[];
  height?: number;
  maxY?: number;
  showAxis?: boolean;
}

export const LineChart: React.FC<Props> = ({
  labels,
  series,
  height = 180,
  maxY = 100,
  showAxis = true,
}) => {
  const { palette } = useTheme();
  const padding = { left: 28, right: 12, top: 16, bottom: 28 };

  return (
    <View>
      <View style={{ position: "relative" }}>
        <Svg
          width="100%"
          height={height}
          viewBox={`0 0 320 ${height}`}
          preserveAspectRatio="none"
        >
          <Defs>
            {series.map((s, idx) => (
              <SvgGradient key={s.label} id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <Stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </SvgGradient>
            ))}
          </Defs>

          {showAxis &&
            [0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = padding.top + (height - padding.top - padding.bottom) * p;
              return (
                <Line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2={320 - padding.right}
                  y2={y}
                  stroke={palette.divider}
                  strokeWidth={0.6}
                  strokeDasharray="3,4"
                />
              );
            })}

          {series.map((s, sIdx) => {
            const w = 320 - padding.left - padding.right;
            const h = height - padding.top - padding.bottom;
            const step = w / Math.max(1, s.values.length - 1);
            const points = s.values.map((v, i) => {
              const x = padding.left + i * step;
              const y = padding.top + h - (v / maxY) * h;
              return { x, y };
            });
            const lineD = points
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
              .join(" ");
            const fillD = `${lineD} L ${points[points.length - 1].x} ${
              padding.top + h
            } L ${points[0].x} ${padding.top + h} Z`;
            return (
              <React.Fragment key={s.label}>
                <Path d={fillD} fill={`url(#grad-${sIdx})`} />
                <Path
                  d={lineD}
                  stroke={s.color}
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map((p, i) => (
                  <Circle key={i} cx={p.x} cy={p.y} r={3} fill={s.color} />
                ))}
              </React.Fragment>
            );
          })}
        </Svg>
        <View
          style={{
            position: "absolute",
            left: padding.left,
            right: padding.right,
            bottom: 0,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {labels.map((l) => (
            <Text key={l} style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "600" }}>
              {l}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.legend}>
        {series.map((s) => (
          <View key={s.label} style={styles.legendItem}>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: s.color,
                marginRight: 6,
              }}
            />
            <Text style={{ color: palette.textSecondary, fontSize: 11, fontWeight: "600" }}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legend: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
});
