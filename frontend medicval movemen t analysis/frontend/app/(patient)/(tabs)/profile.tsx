import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";

interface Row {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  toggle?: boolean;
  destructive?: boolean;
  onPress?: () => void;
}

export default function PatientProfile() {
  const { palette, radii, spacing, shadow, mode, toggleMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rows: { section: string; items: Row[] }[] = [
    {
      section: "Account",
      items: [
        { id: "edit", label: "Edit profile", icon: "person-outline" },
        { id: "health", label: "Health information", icon: "medkit-outline" },
        { id: "doctor", label: "My doctor", icon: "people-outline" },
      ],
    },
    {
      section: "Activity",
      items: [
        { id: "history", label: "Session history", icon: "time-outline", onPress: () => router.push("/(patient)/session-history") },
        { id: "reports", label: "Reports & PDFs", icon: "document-text-outline", onPress: () => router.push("/(patient)/reports") },
        { id: "noti", label: "Notifications", icon: "notifications-outline", onPress: () => router.push("/(patient)/notifications") },
      ],
    },
    {
      section: "Preferences",
      items: [
        { id: "dark", label: "Dark mode", icon: "moon-outline", toggle: true },
        { id: "voice", label: "Voice feedback", icon: "volume-high-outline", toggle: true },
        { id: "reminder", label: "Exercise reminders", icon: "alarm-outline", toggle: true },
      ],
    },
    {
      section: "Support",
      items: [
        { id: "help", label: "Help & support", icon: "help-circle-outline", onPress: () => router.push("/(patient)/help") },
        { id: "team", label: "About the team", icon: "ribbon-outline", onPress: () => router.push("/(patient)/team") },
        { id: "logout", label: "Sign out", icon: "log-out-outline", destructive: true, onPress: () => router.replace("/") },
      ],
    },
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
              borderColor: palette.border,
              borderRadius: radii.lg,
              borderWidth: StyleSheet.hairlineWidth,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
            },
            shadow.sm,
          ]}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              overflow: "hidden",
              backgroundColor: palette.surfaceAlt,
            }}
          >
            <Image
              source={{ uri: "https://images.pexels.com/photos/32160037/pexels-photo-32160037.jpeg?auto=compress&cs=tinysrgb&w=300" }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>
              Aarav Sharma
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 13, marginTop: 2 }}>
              Knee · 34 yrs · ACL Reconstruction
            </Text>
            <View style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
                  backgroundColor: palette.primaryMuted,
                }}
              >
                <Text style={{ color: palette.primary, fontSize: 10, fontWeight: "800" }}>
                  WEEK 6
                </Text>
              </View>
              <Text style={{ color: palette.textSecondary, fontSize: 11, marginLeft: 8 }}>
                Dr. Neha Verma
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={palette.textSecondary} />
        </View>

        {rows.map((s) => (
          <View key={s.section} style={{ marginTop: 18 }}>
            <Text style={styles.section(palette.textSecondary)}>{s.section.toUpperCase()}</Text>
            <View
              style={{
                backgroundColor: palette.surface,
                borderRadius: radii.lg,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: palette.border,
                overflow: "hidden",
              }}
            >
              {s.items.map((it, idx) => (
                <Pressable
                  key={it.id}
                  testID={`profile-${it.id}`}
                  onPress={it.onPress}
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
                    <Ionicons
                      name={it.icon}
                      size={18}
                      color={it.destructive ? palette.danger : palette.textPrimary}
                    />
                    <Text
                      style={{
                        color: it.destructive ? palette.danger : palette.textPrimary,
                        fontSize: 14,
                        fontWeight: "600",
                        marginLeft: 12,
                        flex: 1,
                      }}
                    >
                      {it.label}
                    </Text>
                    {it.toggle ? (
                      <Switch
                        value={it.id === "dark" ? mode === "dark" : true}
                        onValueChange={it.id === "dark" ? toggleMode : () => {}}
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
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = {
  section: (c: string) => ({
    color: c,
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.4,
    marginBottom: 8,
  }),
};
