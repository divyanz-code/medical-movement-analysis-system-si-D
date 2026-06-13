import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BASELINE_PROGRAMS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function BaselineVideos() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<string | null>(BASELINE_PROGRAMS[0].id);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Baseline Videos" subtitle="Discharge protocols by condition" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 40,
          gap: 14,
        }}
      >
        {BASELINE_PROGRAMS.map((p) => {
          const isOpen = expanded === p.id;
          return (
            <View
              key={p.id}
              testID={`program-${p.id}`}
              style={[
                {
                  borderRadius: radii.lg,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: palette.border,
                  backgroundColor: palette.surface,
                  overflow: "hidden",
                },
                shadow.sm,
              ]}
            >
              <Pressable onPress={() => setExpanded(isOpen ? null : p.id)}>
                <View style={{ height: 130 }}>
                  <Image source={{ uri: p.cover }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={[StyleSheet.absoluteFill]}
                  />
                  <View style={{ position: "absolute", left: 16, right: 16, bottom: 12 }}>
                    <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>{p.title}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 3 }}>
                      {p.sessions.length} sessions
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 12,
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color="#fff" />
                  </View>
                </View>
              </Pressable>

              {isOpen ? (
                <View style={{ padding: spacing.md, gap: 8 }}>
                  <Text style={{ color: palette.textSecondary, fontSize: 12, marginBottom: 6 }}>
                    {p.description}
                  </Text>
                  {p.sessions.map((s, idx) => (
                    <View
                      key={s.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: palette.surfaceAlt,
                      }}
                    >
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: palette.primary,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="play" size={14} color="#fff" />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ color: palette.textPrimary, fontSize: 13, fontWeight: "700" }}>
                          {idx + 1}. {s.title}
                        </Text>
                        <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 2 }}>
                          {s.duration}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={palette.textSecondary} />
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
