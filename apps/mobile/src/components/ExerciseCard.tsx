import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ExerciseTemplate } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
  exercise: ExerciseTemplate;
  onPress?: () => void;
  scheduledAt?: string;
  status?: "pending" | "completed" | "missed";
  compact?: boolean;
  testID?: string;
}

export const ExerciseCard: React.FC<Props> = ({
  exercise,
  onPress,
  scheduledAt,
  status,
  compact,
  testID,
}) => {
  const { palette, radii, shadow, spacing } = useTheme();
  const isComplete = status === "completed";
  const isMissed = status === "missed";
  const statusColor = isComplete
    ? palette.success
    : isMissed
      ? palette.danger
      : palette.primary;

  return (
    <Pressable testID={testID} onPress={onPress}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            borderRadius: radii.lg,
            padding: spacing.sm,
          },
          shadow.sm,
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: compact ? 56 : 72,
              height: compact ? 56 : 72,
              borderRadius: radii.md,
              overflow: "hidden",
              backgroundColor: palette.surfaceAlt,
            }}
          >
            <Image
              source={{ uri: exercise.thumbnail }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              numberOfLines={1}
              style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "700" }}
            >
              {exercise.name}
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
              {exercise.bodyPart} · {exercise.reps} reps · {exercise.duration}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 6 }}>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                  backgroundColor: palette.primaryMuted,
                }}
              >
                <Text style={{ color: palette.primary, fontSize: 10, fontWeight: "700" }}>
                  ROM {exercise.targetROM}
                </Text>
              </View>
              {scheduledAt ? (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                    backgroundColor: palette.surfaceAlt,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="time-outline" size={11} color={palette.textSecondary} />
                  <Text
                    style={{
                      color: palette.textSecondary,
                      fontSize: 10,
                      fontWeight: "700",
                      marginLeft: 4,
                    }}
                  >
                    {scheduledAt}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{ alignItems: "center", marginLeft: 8 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: statusColor + "22",
              }}
            >
              <Ionicons
                name={
                  isComplete ? "checkmark" : isMissed ? "alert" : "play"
                }
                size={18}
                color={statusColor}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
});
