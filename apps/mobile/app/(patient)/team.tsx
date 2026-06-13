import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { TEAM } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function TeamScreen() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="About the Team" subtitle="Builders behind MEDMOVE AI" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 40,
          gap: 12,
        }}
      >
        <View
          style={[
            {
              backgroundColor: palette.primaryMuted,
              borderRadius: radii.lg,
              padding: spacing.md,
            },
          ]}
        >
          <Text style={{ color: palette.primary, fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }}>
            OUR MISSION
          </Text>
          <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800", marginTop: 8, lineHeight: 25 }}>
            Bring expert rehabilitation home with AI-powered motion intelligence.
          </Text>
        </View>

        {TEAM.map((t) => (
          <View
            key={t.id}
            testID={`team-${t.id}`}
            style={[
              {
                backgroundColor: palette.surface,
                borderRadius: radii.lg,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: palette.border,
                padding: spacing.md,
                flexDirection: "row",
                alignItems: "center",
              },
              shadow.sm,
            ]}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                overflow: "hidden",
                backgroundColor: palette.surfaceAlt,
              }}
            >
              <Image source={{ uri: t.avatar }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "800" }}>{t.name}</Text>
              <Text style={{ color: palette.primary, fontSize: 12, fontWeight: "700", marginTop: 2 }}>
                {t.role}
              </Text>
              <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 6, lineHeight: 18 }}>
                {t.bio}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
