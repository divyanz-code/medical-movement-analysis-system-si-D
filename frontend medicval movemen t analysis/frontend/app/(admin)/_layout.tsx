import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeProvider";

function CustomDrawer(props: any) {
  const { palette, radii, spacing } = useTheme();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: palette.surface }}>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <View
              style={{
                backgroundColor: palette.primaryMuted,
                borderRadius: radii.md,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: palette.accent,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="shield-checkmark" size={16} color="#fff" />
              </View>
              <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "800", marginLeft: 10, letterSpacing: 1.2 }}>
                ADMIN CONSOLE
              </Text>
            </View>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 14 }}>
              MEDMOVE AI · System operator
            </Text>
          </View>
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: palette.divider, marginTop: 12, marginBottom: 6 }} />
          <DrawerItem
            label="Dashboard"
            icon={({ size }) => <Ionicons name="speedometer-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => props.navigation.navigate("(tabs)")}
          />
          <DrawerItem
            label="Baseline Videos"
            icon={({ size }) => <Ionicons name="play-circle-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(admin)/baseline-videos")}
          />
          <DrawerItem
            label="About the Team"
            icon={({ size }) => <Ionicons name="people-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(admin)/team")}
          />
          <DrawerItem
            label="Help & Support"
            icon={({ size }) => <Ionicons name="help-circle-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(admin)/help")}
          />
        </DrawerContentScrollView>
        <Pressable
          testID="admin-logout"
          onPress={() => router.replace("/")}
          style={{
            margin: spacing.md,
            padding: spacing.sm,
            borderRadius: radii.md,
            backgroundColor: palette.surfaceAlt,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={palette.danger} />
          <Text style={{ color: palette.danger, fontSize: 14, fontWeight: "700", marginLeft: 10 }}>
            Sign out
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

export default function AdminLayout() {
  const { palette } = useTheme();
  return (
    <Drawer
      drawerContent={CustomDrawer}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280, backgroundColor: palette.surface },
        sceneStyle: { backgroundColor: palette.background },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Console" }} />
      <Drawer.Screen name="baseline-videos" options={{ title: "Baseline Videos" }} />
      <Drawer.Screen name="team" options={{ title: "Team" }} />
      <Drawer.Screen name="help" options={{ title: "Help" }} />
    </Drawer>
  );
}
