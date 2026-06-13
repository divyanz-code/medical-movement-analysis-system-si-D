import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { ChipRow } from "@/src/components/ChipRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { EXERCISES, PATIENTS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const CATS = [
  { id: "upper", label: "Upper" },
  { id: "lower", label: "Lower" },
  { id: "spine", label: "Spine" },
  { id: "facial", label: "Facial" },
];

export default function AssignExercise() {
  const { palette, radii, spacing } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const patient = PATIENTS.find((p) => p.id === id) ?? PATIENTS[0];

  const [cat, setCat] = useState("lower");
  const [selected, setSelected] = useState<string[]>([]);
  const [reps, setReps] = useState("12");
  const [days, setDays] = useState("7");

  const list = EXERCISES.filter((e) => e.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Assign Exercise" subtitle={`For ${patient.name}`} showBack onBack={() => router.back()} />
      <ChipRow items={CATS} selected={cat} onSelect={setCat} testID="assign-cat-row" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 130,
          gap: 10,
        }}
      >
        {list.map((e) => {
          const active = selected.includes(e.id);
          return (
            <Pressable
              key={e.id}
              testID={`assign-pick-${e.id}`}
              onPress={() =>
                setSelected((arr) => (active ? arr.filter((id) => id !== e.id) : [...arr, e.id]))
              }
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
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: active ? palette.primary : palette.surfaceAlt,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={active ? "checkmark" : "add"} size={18} color={active ? "#fff" : palette.textSecondary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                    {e.name}
                  </Text>
                  <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 2 }}>
                    ROM {e.targetROM} · {e.duration}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}

        <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "800", marginTop: 18 }}>
          Plan parameters
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Input label="Reps / set" value={reps} onChange={setReps} />
          <Input label="Days" value={days} onChange={setDays} />
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: spacing.lg,
          paddingBottom: insets.bottom + 16,
          backgroundColor: palette.background + "EE",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: palette.divider,
        }}
      >
        <Button
          testID="assign-save"
          label={`Assign ${selected.length || 0} exercise(s)`}
          fullWidth
          iconRight="checkmark"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  const { palette, radii } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: palette.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginBottom: 6 }}>
        {label.toUpperCase()}
      </Text>
      <View
        style={{
          backgroundColor: palette.surface,
          borderRadius: radii.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: palette.border,
          height: 46,
          paddingHorizontal: 12,
          justifyContent: "center",
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="number-pad"
          style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "700" }}
        />
      </View>
    </View>
  );
};
