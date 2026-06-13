import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { EXERCISES, PATIENTS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function DoctorAssignments() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Assignments" subtitle="Active rehab plans" showMenu />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <Button
          testID="new-assignment"
          label="New assignment"
          iconLeft="add"
          fullWidth
          onPress={() => router.push("/(doctor)/assign-exercise")}
        />

        <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "800", marginTop: spacing.lg, marginBottom: 10 }}>
          This week
        </Text>

        <View style={{ gap: 10 }}>
          {PATIENTS.slice(0, 4).map((p, idx) => {
            const ex = EXERCISES[(idx + 1) % EXERCISES.length];
            return (
              <View
                key={p.id}
                testID={`assignment-${p.id}`}
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
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: palette.primaryMuted,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="clipboard-outline" size={18} color={palette.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "800" }}>
                      {p.name}
                    </Text>
                    <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                      {ex.name} · {ex.reps} reps × 2/day
                    </Text>
                  </View>
                  <Pressable
                    testID={`assignment-edit-${p.id}`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: palette.surfaceAlt,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="pencil" size={14} color={palette.textPrimary} />
                  </Pressable>
                </View>
                <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
                  <Tag color={palette.primary} label={`ROM ${ex.targetROM}`} />
                  <Tag color={palette.secondary} label={`${ex.duration}/session`} />
                  <Tag color={palette.success} label={`${p.compliance}% adherence`} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const Tag: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: color + "22",
    }}
  >
    <Text style={{ color, fontSize: 11, fontWeight: "800" }}>{label}</Text>
  </View>
);
