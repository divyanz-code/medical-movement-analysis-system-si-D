import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { findExercise } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function ExerciseDetail() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = findExercise(id || "ex-1");

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title={exercise.name} subtitle={exercise.bodyPart} showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: spacing.lg }}>
          <View
            style={{
              borderRadius: radii.lg,
              overflow: "hidden",
              backgroundColor: palette.surfaceAlt,
              ...shadow.md,
            }}
          >
            <Image source={{ uri: exercise.thumbnail }} style={{ width: "100%", height: 200 }} contentFit="cover" />
          </View>

          {/* Quick stats */}
          <View style={{ flexDirection: "row", marginTop: spacing.md, gap: 10 }}>
            <Stat label="Target ROM" value={exercise.targetROM} icon="git-branch" />
            <Stat label="Reps" value={String(exercise.reps)} icon="repeat" />
            <Stat label="Duration" value={exercise.duration} icon="time" />
          </View>

          <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginTop: spacing.lg }}>
            About this exercise
          </Text>
          <Text style={{ color: palette.textSecondary, fontSize: 14, marginTop: 8, lineHeight: 22 }}>
            {exercise.description}
          </Text>

          <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginTop: spacing.lg, marginBottom: 8 }}>
            Movement guidance
          </Text>
          <View
            style={[
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                borderRadius: radii.lg,
                borderWidth: StyleSheet.hairlineWidth,
                padding: spacing.md,
              },
              shadow.sm,
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={[styles.dot, { backgroundColor: palette.success }]} />
              <Text style={{ color: palette.textPrimary, fontSize: 13, marginLeft: 8 }}>
                Green marker: starting position
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <View style={[styles.dot, { backgroundColor: palette.danger }]} />
              <Text style={{ color: palette.textPrimary, fontSize: 13, marginLeft: 8 }}>
                Red marker: target end position
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <Ionicons name="git-merge" color={palette.primary} size={14} />
              <Text style={{ color: palette.textPrimary, fontSize: 13, marginLeft: 8 }}>
                Trace the animated arc with smooth motion
              </Text>
            </View>
          </View>

          <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginTop: spacing.lg, marginBottom: 8 }}>
            Instructions
          </Text>
          <View style={{ gap: 8 }}>
            {exercise.instructions.map((step, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  backgroundColor: palette.surface,
                  borderRadius: radii.md,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: palette.border,
                  padding: 12,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: palette.primaryMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: palette.primary, fontSize: 11, fontWeight: "800" }}>
                    {idx + 1}
                  </Text>
                </View>
                <Text style={{ color: palette.textPrimary, fontSize: 13, marginLeft: 10, flex: 1, lineHeight: 19 }}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: spacing.lg,
          paddingBottom: insets.bottom + 16,
          backgroundColor: palette.background + "EE",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: palette.divider,
        }}
      >
        <Button
          testID="start-exercise-button"
          label="Start with AI Coach"
          iconRight="play"
          fullWidth
          onPress={() => router.push({ pathname: "/(patient)/live-session", params: { id: exercise.id } })}
        />
      </View>
    </View>
  );
}

const Stat: React.FC<{ label: string; value: string; icon: keyof typeof Ionicons.glyphMap }> = ({
  label,
  value,
  icon,
}) => {
  const { palette } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 12,
        backgroundColor: palette.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.border,
        alignItems: "flex-start",
      }}
    >
      <Ionicons name={icon} size={14} color={palette.primary} />
      <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1, marginTop: 6 }}>
        {label}
      </Text>
      <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "800", marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: { width: 12, height: 12, borderRadius: 6 },
});
