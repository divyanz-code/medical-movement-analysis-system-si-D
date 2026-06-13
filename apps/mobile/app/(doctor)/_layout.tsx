import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Image } from "expo-image";
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
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
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
                  backgroundColor: palette.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="medkit" size={16} color="#fff" />
              </View>
              <Text
                style={{
                  color: palette.textPrimary,
                  fontSize: 14,
                  fontWeight: "800",
                  marginLeft: 10,
                  letterSpacing: 1.2,
                }}
              >
                CLINICIAN PORTAL
              </Text>
            </View>

            <View style={{ marginTop: spacing.lg, flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=300" }}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: palette.surfaceAlt }}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                  Dr. Neha Verma
                </Text>
                <Text style={{ color: palette.textSecondary, fontSize: 12 }}>
                  Orthopedic · 24 patients
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: palette.divider, marginVertical: 6 }} />

          <Text style={[styles.section, { color: palette.textSecondary }]}>NAVIGATE</Text>
          <DrawerItem
            label="Dashboard"
            icon={({ size }) => <Ionicons name="grid-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => props.navigation.navigate("(tabs)")}
          />
          <DrawerItem
            label="Baseline Discharge Videos"
            icon={({ size }) => <Ionicons name="play-circle-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(doctor)/baseline-videos")}
          />
          <DrawerItem
            label="About the Team"
            icon={({ size }) => <Ionicons name="people-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(doctor)/team")}
          />
          <DrawerItem
            label="Help & Support"
            icon={({ size }) => <Ionicons name="help-circle-outline" size={size} color={palette.textPrimary} />}
            labelStyle={{ color: palette.textPrimary, fontWeight: "600", marginLeft: -16 }}
            onPress={() => router.push("/(doctor)/help")}
          />
        </DrawerContentScrollView>
        <Pressable
          testID="doctor-logout"
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

export default function DoctorLayout() {
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
      <Drawer.Screen name="patient-detail" options={{ title: "Patient" }} />
      <Drawer.Screen name="assign-exercise" options={{ title: "Assign" }} />
      <Drawer.Screen name="baseline-videos" options={{ title: "Baseline Videos" }} />
      <Drawer.Screen name="team" options={{ title: "Team" }} />
      <Drawer.Screen name="help" options={{ title: "Help" }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 4,
  },
});
