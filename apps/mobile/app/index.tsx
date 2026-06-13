import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeProvider";
import { tokenStore } from "@/src/runtime/client";
import { storage } from "@/src/utils/storage";

type Role = "patient" | "doctor" | "admin";

interface RoleOption {
  id: Role;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
}

export default function Index() {
  const router = useRouter();
  const { palette, radii, spacing, shadow } = useTheme();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await tokenStore.getToken();
        const storedRole = await storage.getItem("medmove.role", null);
        if (token && storedRole) {
          if (storedRole === "patient") {
            router.replace("/(patient)/(tabs)");
            return;
          } else if (storedRole === "doctor") {
            router.replace("/(doctor)/(tabs)");
            return;
          } else if (storedRole === "admin") {
            router.replace("/(admin)/(tabs)");
            return;
          }
        }
      } catch (err) {
        console.error("Auth bootstrap check failed", err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  const roles: RoleOption[] = [
    {
      id: "patient",
      title: "I'm a Patient",
      subtitle: "Track exercises, follow guided rehab, see progress.",
      icon: "body",
      accent: palette.primary,
    },
    {
      id: "doctor",
      title: "I'm a Doctor",
      subtitle: "Assign protocols, monitor patients, review AI reports.",
      icon: "medkit",
      accent: palette.secondary,
    },
    {
      id: "admin",
      title: "Administrator",
      subtitle: "Manage users, exercises and system health.",
      icon: "shield-checkmark",
      accent: palette.accent,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <LinearGradient
        colors={[palette.primary, palette.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 380,
        }}
      />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
            <View style={styles.brandRow}>
              <View style={[styles.logoBox, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
                <Ionicons name="pulse" size={22} color="#fff" />
              </View>
              <Text style={styles.brand}>MEDMOVE AI</Text>
            </View>

            <View style={{ marginTop: 36 }}>
              <Text style={styles.heroTitle}>
                AI-powered{"\n"}rehabilitation.{"\n"}
                <Text style={{ color: "#E0FFFA" }}>From home.</Text>
              </Text>
              <Text style={styles.heroSub}>
                Real-time pose & facial analysis. Guided exercises. Tele-rehab between doctor and patient.
              </Text>
            </View>

            <View style={{ marginTop: 28, marginBottom: 18 }}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 11,
                  fontWeight: "700",
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                }}
              >
                Continue as
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, gap: 12 }}>
            {roles.map((r) => (
              <Pressable
                key={r.id}
                testID={`role-${r.id}`}
                onPress={() =>
                  router.push({ pathname: "/(auth)/login", params: { role: r.id } })
                }
                style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
              >
                <View
                  style={[
                    {
                      backgroundColor: palette.surface,
                      borderColor: palette.border,
                      borderRadius: radii.lg,
                      padding: spacing.md,
                      borderWidth: StyleSheet.hairlineWidth,
                      flexDirection: "row",
                      alignItems: "center",
                    },
                    shadow.md,
                  ]}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: r.accent + "22",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={r.icon} size={22} color={r.accent} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text
                      style={{ color: palette.textPrimary, fontSize: 16, fontWeight: "700" }}
                    >
                      {r.title}
                    </Text>
                    <Text
                      style={{ color: palette.textSecondary, fontSize: 12, marginTop: 3 }}
                    >
                      {r.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="arrow-forward" size={20} color={palette.textSecondary} />
                </View>
              </Pressable>
            ))}
          </View>

          <View style={{ paddingHorizontal: 24, marginTop: 28 }}>
            <Text style={{ color: palette.textSecondary, fontSize: 12, textAlign: "center" }}>
              By continuing you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: "row", alignItems: "center" },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    marginLeft: 10,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
    maxWidth: 320,
  },
});
