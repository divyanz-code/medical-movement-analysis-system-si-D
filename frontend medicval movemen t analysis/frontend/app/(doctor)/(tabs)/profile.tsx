import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function DoctorProfile() {
  const { palette, radii, spacing, shadow, mode, toggleMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rows: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress?: () => void; toggle?: boolean; destructive?: boolean }[] = [
    { label: "Edit profile", icon: "person-outline" },
    { label: "Clinic credentials", icon: "ribbon-outline" },
    { label: "Patient acceptance rules", icon: "options-outline" },
    { label: "Dark mode", icon: "moon-outline", toggle: true },
    { label: "Notifications", icon: "notifications-outline" },
    { label: "Help & support", icon: "help-circle-outline", onPress: () => router.push("/(doctor)/help") },
    { label: "Sign out", icon: "log-out-outline", destructive: true, onPress: () => router.replace("/") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Profile" showMenu />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <View
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
          <View style={{ width: 64, height: 64, borderRadius: 32, overflow: "hidden", backgroundColor: palette.surfaceAlt }}>
            <Image source={{ uri: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=300" }} style={{ width: "100%", height: "100%" }} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>Dr. Neha Verma</Text>
            <Text style={{ color: palette.textSecondary, fontSize: 13, marginTop: 2 }}>
              Orthopedic Physiotherapy · 12 yrs
            </Text>
            <View style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: palette.primaryMuted }}>
                <Text style={{ color: palette.primary, fontSize: 10, fontWeight: "800" }}>MCI · 04A6E1</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 18, backgroundColor: palette.surface, borderRadius: radii.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border, overflow: "hidden" }}>
          {rows.map((r, idx) => (
            <Pressable
              key={r.label}
              testID={`doctor-profile-${idx}`}
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
