import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Image } from "expo-image";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
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
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ paddingTop: 0 }}
        >
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
            <View style={[styles.brandRow, { backgroundColor: palette.primaryMuted, borderRadius: radii.md }]}>
              <View style={[styles.logoBox, { backgroundColor: palette.primary }]}>
                <Ionicons name="pulse" size={18} color="#fff" />
              </View>
              <Text style={{ color: palette.textPrimary, fontSize: 16, fontWeight: "800", marginLeft: 10, letterSpacing: 1.4 }}>
                MEDMOVE AI
              </Text>
            </View>

            <View style={{ marginTop: spacing.lg, flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: "https://images.pexels.com/photos/32160037/pexels-photo-32160037.jpeg?auto=compress&cs=tinysrgb&w=300" }}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: palette.surfaceAlt }}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                  Aarav Sharma
                </Text>
                <Text style={{ color: palette.textSecondary, fontSize: 12 }}>
                  Recovery score 78%
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: palette.divider, marginVertical: 6 }} />

          <Text style={[styles.section, { color: palette.textSecondary }]}>NAVIGATE</Text>
          <DrawerItem
            label="Dashboard"
            icon={({ size }) => <Ionicons name="home-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => props.navigation.navigate("(tabs)")}
          />
          <DrawerItem
            label="Notifications"
            icon={({ size }) => <Ionicons name="notifications-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(patient)/notifications")}
          />
          <DrawerItem
            label="Reports"
            icon={({ size }) => <Ionicons name="document-text-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(patient)/reports")}
          />
          <DrawerItem
            label="Session History"
            icon={({ size }) => <Ionicons name="time-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(patient)/session-history")}
          />

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: palette.divider, marginVertical: 10 }} />

          <Text style={[styles.section, { color: palette.textSecondary }]}>LIBRARY</Text>
          <DrawerItem
            label="Baseline Discharge Videos"
            icon={({ size }) => <Ionicons name="play-circle-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(patient)/baseline-videos")}
          />
          <DrawerItem
            label="About the Team"
            icon={({ size }) => <Ionicons name="people-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(patient)/team")}
          />
          <DrawerItem
            label="Help & Support"
            icon={({ size }) => <Ionicons name="help-circle-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(patient)/help")}
          />
        </DrawerContentScrollView>

        <Pressable
          testID="logout-button"
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

export default function PatientLayout() {
  const { palette } = useTheme();
  return (
    <Drawer
      drawerContent={CustomDrawer}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 290, backgroundColor: palette.surface },
        sceneStyle: { backgroundColor: palette.background },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="exercise-detail" options={{ title: "Exercise" }} />
      <Drawer.Screen name="live-session" options={{ title: "Live Analysis" }} />
      <Drawer.Screen name="notifications" options={{ title: "Notifications" }} />
      <Drawer.Screen name="reports" options={{ title: "Reports" }} />
      <Drawer.Screen name="session-history" options={{ title: "History" }} />
      <Drawer.Screen name="baseline-videos" options={{ title: "Baseline Videos" }} />
      <Drawer.Screen name="team" options={{ title: "About Team" }} />
      <Drawer.Screen name="help" options={{ title: "Help" }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 4,
  },
});
