import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AnalysisItem } from "../../types/contracts";
import { moderateScale, radius, responsiveFont, spacing, type ThemeColors } from "../theme";
import { useAppTheme } from "../themeProvider";
import { StatusChip } from "./StatusChip";

interface SessionCardProps {
  item: AnalysisItem;
  onPress?: () => void;
  previousScore?: number;
}

export function SessionCard({ item, onPress, previousScore }: SessionCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const date = new Date(item.updated_at);
  const scoreChange =
    previousScore !== undefined && item.movement_score !== null
      ? item.movement_score - previousScore
      : null;
  const status =
    item.status === "SUCCEEDED" ? "aligned" : item.status === "FAILED" ? "warning" : "processing";

  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.accentRail} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Session #{item.video_id}</Text>
            <View style={styles.timeRow}>
              <Feather name="clock" size={12} color={colors.textMuted} />
              <Text style={styles.subtitle}>
                {date.toLocaleDateString()} •{" "}
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>
          <StatusChip status={status} />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Score</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricValue}>{item.movement_score ?? "-"}</Text>
              {scoreChange !== null ? (
                <View style={styles.changeRow}>
                  <Feather
                    name={scoreChange >= 0 ? "arrow-up-right" : "arrow-down-right"}
                    size={12}
                    color={scoreChange >= 0 ? colors.success : colors.danger}
                  />
                  <Text
                    style={[
                      styles.changeValue,
                      { color: scoreChange >= 0 ? colors.success : colors.danger }
                    ]}
                  >
                    {Math.abs(scoreChange)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>ROM</Text>
            <Text style={styles.metricValue}>{item.range_of_motion ?? "-"}°</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      padding: spacing.md,
      flexDirection: "row",
      gap: spacing.sm
    },
    accentRail: {
      width: moderateScale(4),
      borderRadius: radius.pill,
      backgroundColor: colors.accent
    },
    content: {
      flex: 1,
      gap: spacing.sm
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.sm
    },
    headerLeft: {
      flex: 1
    },
    title: {
      color: colors.text,
      fontSize: responsiveFont(15),
      fontWeight: "700"
    },
    timeRow: {
      marginTop: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 4
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: responsiveFont(12)
    },
    metricsRow: {
      flexDirection: "row",
      gap: spacing.lg
    },
    metricItem: {
      flex: 1
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: responsiveFont(11)
    },
    metricValueRow: {
      marginTop: 2,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs
    },
    metricValue: {
      color: colors.text,
      fontWeight: "700",
      fontSize: responsiveFont(20)
    },
    changeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 2
    },
    changeValue: {
      fontSize: responsiveFont(11),
      fontWeight: "700"
    }
  });
}
