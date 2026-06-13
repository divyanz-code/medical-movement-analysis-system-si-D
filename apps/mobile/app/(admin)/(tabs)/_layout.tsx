import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeProvider";

export default function AdminTabsLayout() {
  const { palette, mode } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: Math.max(insets.bottom, 12),
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderRadius: 22,
          borderTopWidth: 0,
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : palette.surface,
          borderColor: palette.border,
          borderWidth: StyleSheet.hairlineWidth,
          shadowColor: "#000",
          shadowOpacity: mode === "dark" ? 0.4 : 0.1,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 20,
          elevation: 8,
        },
        tabBarBackground:
          Platform.OS === "ios"
            ? () => (
                <BlurView
                  tint={mode === "dark" ? "dark" : "light"}
                  intensity={70}
                  style={[StyleSheet.absoluteFill, { borderRadius: 22, overflow: "hidden" }]}
                />
              )
            : undefined,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Overview", tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "speedometer" : "speedometer-outline"} size={22} color={color} /> }} />
      <Tabs.Screen name="users" options={{ title: "Users", tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "people" : "people-outline"} size={22} color={color} /> }} />
      <Tabs.Screen name="exercises" options={{ title: "Library", tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "library" : "library-outline"} size={22} color={color} /> }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics", tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "analytics" : "analytics-outline"} size={22} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} /> }} />
    </Tabs>
  );
}
