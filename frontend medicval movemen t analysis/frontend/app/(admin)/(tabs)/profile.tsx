import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function AdminProfile() {
  const { palette, radii, spacing, mode, toggleMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rows: { label: string; icon: keyof typeof Ionicons.glyphMap; toggle?: boolean; destructive?: boolean; onPress?: () => void }[] = [
    { label: "Workspace settings", icon: "construct-outline" },
    { label: "Security & audit logs", icon: "lock-closed-outline" },
    { label: "Billing", icon: "card-outline" },
    { label: "Dark mode", icon: "moon-outline", toggle: true },
    { label: "Help & support", icon: "help-circle-outline", onPress: () => router.push("/(admin)/help") },
    { label: "Sign out", icon: "log-out-outline", destructive: true, onPress: () => router.replace("/") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Admin Profile" showMenu />
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: insets.bottom + 100 }}>
        <View
          style={{
            backgroundColor: palette.surface,
            borderRadius: radii.lg,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: palette.border,
            padding: spacing.md,
          }}
        >
          <Text style={{ color: palette.textSecondary, fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }}>
            WORKSPACE
          </Text>
          <Text style={{ color: palette.textPrimary, fontSize: 20, fontWeight: "800", marginTop: 4 }}>
            MEDMOVE AI · HQ
          </Text>
          <Text style={{ color: palette.textSecondary, fontSize: 13, marginTop: 4 }}>
            admin@medmove.ai · 142 active sessions
          </Text>
        </View>

        <View style={{ marginTop: 18, backgroundColor: palette.surface, borderRadius: radii.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border, overflow: "hidden" }}>
          {rows.map((r, idx) => (
            <Pressable
              key={r.label}
              testID={`admin-profile-${idx}`}
              onPress={r.onPress}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 14,
                  borderTopWidth: idx === 0 ? 0 : StyleSheet.hairlineWidth,
                  borderColor: palette.divider,
                }}
              >
                <Ionicons name={r.icon} size={18} color={r.destructive ? palette.danger : palette.textPrimary} />
                <Text style={{ color: r.destructive ? palette.danger : palette.textPrimary, fontSize: 14, fontWeight: "600", marginLeft: 12, flex: 1 }}>
                  {r.label}
                </Text>
                {r.toggle ? (
                  <Switch
                    value={mode === "dark"}
                    onValueChange={toggleMode}
                    trackColor={{ false: palette.surfaceAlt, true: palette.primary }}
                    thumbColor="#fff"
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={palette.textSecondary} />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
