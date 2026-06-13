import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChipRow } from "@/src/components/ChipRow";
import { ExerciseCard } from "@/src/components/ExerciseCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { EXERCISES } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "upper", label: "Upper Limb" },
  { id: "lower", label: "Lower Limb" },
  { id: "spine", label: "Spine" },
  { id: "facial", label: "Facial" },
];

export default function ExercisesScreen() {
  const { palette, spacing } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState("all");

  const filtered = EXERCISES.filter((e) => cat === "all" || e.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Exercise Library" subtitle={`${filtered.length} exercises`} showMenu />
      <ChipRow items={CATEGORIES} selected={cat} onSelect={setCat} testID="exercise-categories" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 100,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.id}
            testID={`exercise-${ex.id}`}
            exercise={ex}
            onPress={() =>
              router.push({ pathname: "/(patient)/exercise-detail", params: { id: ex.id } })
            }
          />
        ))}
        {filtered.length === 0 ? (
          <Text style={{ color: palette.textSecondary, textAlign: "center", marginTop: 40 }}>
            No exercises in this category.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
