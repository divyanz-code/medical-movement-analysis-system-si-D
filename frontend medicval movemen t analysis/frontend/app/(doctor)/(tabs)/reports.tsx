import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { PATIENTS, REPORTS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function DoctorReports() {
  const { palette, radii, spacing, shadow } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Reports" subtitle="Patient PDF history" showMenu />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 100,
          gap: 10,
        }}
      >
        {REPORTS.map((r, idx) => {
          const p = PATIENTS[idx % PATIENTS.length];
          return (
            <View
              key={r.id}
              testID={`doctor-report-${r.id}`}
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
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: palette.primaryMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="document-text" size={22} color={palette.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                    {p.name} · {r.title}
                  </Text>
                  <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 4 }}>
                    {r.date} · {r.exercises} exercises
                  </Text>
                </View>
                <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>
                  {r.score}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
