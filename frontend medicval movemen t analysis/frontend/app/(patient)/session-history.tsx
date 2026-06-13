import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { findExercise, SESSIONS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function SessionHistory() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Session History" subtitle={`${SESSIONS.length} sessions logged`} showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 40,
          gap: 10,
        }}
      >
        {SESSIONS.map((s) => {
          const ex = findExercise(s.exerciseId);
          return (
            <View
              key={s.id}
              testID={`session-${s.id}`}
              style={[
                {
                  backgroundColor: palette.surface,
                  borderRadius: radii.lg,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: palette.border,
                  padding: spacing.md,
                },
                shadow.sm,
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: palette.primaryMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={ex.category === "facial" ? "happy-outline" : "body-outline"}
                    size={20}
                    color={palette.primary}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "700" }}>
                    {ex.name}
                  </Text>
                  <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                    {s.date} · {s.duration}
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor:
                      s.score >= 85 ? palette.success + "22" : s.score >= 75 ? palette.warning + "22" : palette.danger + "22",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: s.score >= 85 ? palette.success : s.score >= 75 ? palette.warning : palette.danger,
                      fontSize: 16,
                      fontWeight: "800",
                    }}
                  >
                    {s.score}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
                <Stat label="ROM" value={s.romMax > 0 ? `${s.romMin}°–${s.romMax}°` : "—"} />
                <Stat label="Accuracy" value={`${s.accuracy}%`} />
                {s.symmetry ? <Stat label="Symmetry" value={`${s.symmetry}%`} /> : <Stat label="Duration" value={s.duration} />}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { palette } = useTheme();
  return (
    <View style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: palette.surfaceAlt }}>
      <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1 }}>
        {label}
      </Text>
      <Text style={{ color: palette.textPrimary, fontSize: 13, fontWeight: "800", marginTop: 4 }}>
        {value}
      </Text>
    </View>
  );
};
