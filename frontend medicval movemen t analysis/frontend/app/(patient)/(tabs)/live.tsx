import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { ChipRow } from "@/src/components/ChipRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { EXERCISES, ExerciseTemplate } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const MODES = [
  { id: "body", label: "Body Pose" },
  { id: "face", label: "Facial Mesh" },
];

export default function LiveEntry() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState("body");
  const [selected, setSelected] = useState<ExerciseTemplate>(EXERCISES[0]);

  const list = EXERCISES.filter((e) =>
    mode === "face" ? e.category === "facial" : e.category !== "facial",
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Live Analysis" subtitle="MediaPipe AI · Real-time" showMenu />
      <ChipRow items={MODES} selected={mode} onSelect={setMode} testID="live-mode-row" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero preview */}
        <View
          style={[
            {
              backgroundColor: palette.surface,
              borderRadius: radii.lg,
              borderColor: palette.border,
              borderWidth: StyleSheet.hairlineWidth,
              overflow: "hidden",
            },
            shadow.md,
          ]}
        >
          <View style={{ height: 200, backgroundColor: "#0F172A" }}>
            <Image
              source={{
                uri:
                  mode === "face"
                    ? "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=940"
                    : "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=940",
              }}
              style={{ width: "100%", height: "100%", opacity: 0.85 }}
              contentFit="cover"
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.35)" }]} />
            <View style={{ position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between" }}>
              <Badge label={mode === "face" ? "FACE MESH" : "POSE LANDMARKS"} color={palette.primary} />
              <Badge label="REAL-TIME · 30 FPS" color={palette.success} />
            </View>
            <View style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
                {selected.name}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 4 }}>
                Target ROM {selected.targetROM} · {selected.reps} reps
              </Text>
            </View>
          </View>
          <View style={{ padding: spacing.md }}>
            <Text style={{ color: palette.textPrimary, fontSize: 13, lineHeight: 19 }}>
              {selected.description}
            </Text>
            <Button
              testID="start-live-button"
              label="Start Live Session"
              iconRight="play"
              fullWidth
              style={{ marginTop: 14 }}
              onPress={() =>
                router.push({ pathname: "/(patient)/live-session", params: { id: selected.id } })
              }
            />
          </View>
        </View>

        {/* Exercise picker */}
        <Text
          style={{
            color: palette.textPrimary,
            fontSize: 15,
            fontWeight: "800",
            marginTop: spacing.lg,
            marginBottom: 8,
          }}
        >
          Choose exercise
        </Text>
        <View style={{ gap: 10 }}>
          {list.map((e) => {
            const active = e.id === selected.id;
            return (
              <Pressable
                key={e.id}
                testID={`pick-${e.id}`}
                onPress={() => setSelected(e)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    borderRadius: radii.md,
                    backgroundColor: active ? palette.primaryMuted : palette.surface,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: active ? palette.primary : palette.border,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: active ? palette.primary : palette.surfaceAlt,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={mode === "face" ? "happy-outline" : "body-outline"}
                      size={18}
                      color={active ? "#fff" : palette.textSecondary}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: palette.textPrimary, fontWeight: "700", fontSize: 14 }}>
                      {e.name}
                    </Text>
                    <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 2 }}>
                      {e.bodyPart} · ROM {e.targetROM}
                    </Text>
                  </View>
                  <Ionicons
                    name={active ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={active ? palette.primary : palette.textSecondary}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const Badge: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: color + "DD",
    }}
  >
    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 1.1 }}>
      {label}
    </Text>
  </View>
);
