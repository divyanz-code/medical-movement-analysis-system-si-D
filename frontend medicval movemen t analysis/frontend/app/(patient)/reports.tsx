import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { REPORTS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function Reports() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Reports" subtitle="Download or share PDFs" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 40,
          gap: 10,
        }}
      >
        {REPORTS.map((r) => (
          <Pressable key={r.id} testID={`report-${r.id}`}>
            <View
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
                  <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "700" }}>
                    {r.title}
                  </Text>
                  <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 4 }}>
                    {r.date} · {r.size} · {r.exercises} exercises
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>
                    {r.score}
                  </Text>
                  <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700" }}>
                    SCORE
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
                <ActionBtn icon="download-outline" label="Download" />
                <ActionBtn icon="share-social-outline" label="Share" />
                <ActionBtn icon="eye-outline" label="View" />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const ActionBtn: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string }> = ({ icon, label }) => {
  const { palette } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        backgroundColor: palette.surfaceAlt,
        borderRadius: 10,
      }}
    >
      <Ionicons name={icon} size={14} color={palette.textPrimary} />
      <Text style={{ color: palette.textPrimary, fontSize: 12, fontWeight: "700", marginLeft: 6 }}>
        {label}
      </Text>
    </View>
  );
};
