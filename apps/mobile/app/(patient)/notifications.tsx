import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { NOTIFICATIONS, NotificationItem } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const ICONS: Record<NotificationItem["type"], keyof typeof Ionicons.glyphMap> = {
  reminder: "alarm-outline",
  report: "document-text-outline",
  doctor: "medkit-outline",
  system: "settings-outline",
};

export default function Notifications() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(NOTIFICATIONS);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader
        title="Notifications"
        subtitle={`${items.filter((i) => i.unread).length} unread`}
        showBack
        onBack={() => router.back()}
        rightIcon="checkmark-done"
        onRight={() => setItems(items.map((i) => ({ ...i, unread: false })))}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 40,
          gap: 10,
        }}
      >
        {items.map((n) => (
          <Pressable
            key={n.id}
            testID={`notification-${n.id}`}
            onPress={() => setItems(items.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))}
          >
            <View
              style={[
                {
                  backgroundColor: palette.surface,
                  borderRadius: radii.lg,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: n.unread ? palette.primary : palette.border,
                  padding: spacing.md,
                  flexDirection: "row",
                },
                shadow.sm,
              ]}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: palette.primaryMuted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={ICONS[n.type]} size={18} color={palette.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700", flex: 1 }}>
                    {n.title}
                  </Text>
                  {n.unread ? (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.primary }} />
                  ) : null}
                </View>
                <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 }}>
                  {n.message}
                </Text>
                <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 6, fontWeight: "600" }}>
                  {n.time}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
