import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, type ThemeColors } from "../theme";
import { useAppTheme } from "../themeProvider";

interface AngleVisualizerProps {
  angle: number;
  minAngle?: number;
  maxAngle?: number;
  size?: number;
}

export function AngleVisualizer({ angle, minAngle, maxAngle, size = 120 }: AngleVisualizerProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const normalized = Math.max(0, Math.min(180, angle));
  const rotation = `${normalized - 90}deg`;
  const dialSize = size;
  const dialRadius = dialSize / 2;

  return (
    <View style={styles.root}>
      <View style={[styles.dial, { width: dialSize, height: dialSize, borderRadius: dialRadius }]}>
        <View style={styles.crosshairVertical} />
        <View style={styles.crosshairHorizontal} />
        <View
          style={[
            styles.pointer,
            {
              transform: [{ rotate: rotation }]
            }
          ]}
        />
        <View style={styles.centerDot} />
      </View>
      <View style={styles.centerLabel}>
        <Text style={styles.angleValue}>{Math.round(angle)}°</Text>
      </View>
      {minAngle !== undefined || maxAngle !== undefined ? (
        <View style={styles.minMaxRow}>
          <Text style={styles.minMaxText}>
            {minAngle !== undefined ? `Min ${Math.round(minAngle)}°` : ""}
          </Text>
          <Text style={styles.minMaxText}>
            {maxAngle !== undefined ? `Max ${Math.round(maxAngle)}°` : ""}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      alignItems: "center"
    },
    dial: {
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center"
    },
    crosshairVertical: {
      position: "absolute",
      width: 1,
      height: "82%",
      backgroundColor: colors.border
    },
    crosshairHorizontal: {
      position: "absolute",
      height: 1,
      width: "82%",
      backgroundColor: colors.border
    },
    pointer: {
      position: "absolute",
      width: "40%",
      height: 3,
      backgroundColor: colors.accent,
      borderRadius: 2,
      right: "50%"
    },
    centerDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent
    },
    centerLabel: {
      position: "absolute",
      top: 44
    },
    angleValue: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 24
    },
    minMaxRow: {
      marginTop: spacing.xs,
      flexDirection: "row",
      gap: spacing.lg
    },
    minMaxText: {
      color: colors.textMuted,
      fontSize: 11
    }
  });
}
