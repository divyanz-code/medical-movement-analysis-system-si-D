import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { ChipRow } from "@/src/components/ChipRow";
import { ExerciseCard } from "@/src/components/ExerciseCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { EXERCISES } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const CATS = [
  { id: "all", label: "All" },
  { id: "upper", label: "Upper" },
  { id: "lower", label: "Lower" },
  { id: "spine", label: "Spine" },
  { id: "facial", label: "Facial" },
];

export default function AdminExercises() {
  const { palette, spacing } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState("all");
  const list = EXERCISES.filter((e) => cat === "all" || e.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Exercise Library" subtitle={`${list.length} templates`} showMenu rightIcon="add" />
      <ChipRow items={CATS} selected={cat} onSelect={setCat} testID="admin-ex-cat" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 100,
          gap: 10,
        }}
      >
        <Button label="Add new exercise" iconLeft="add" fullWidth testID="add-exercise" />
        {list.map((e) => (
          <ExerciseCard
            key={e.id}
            exercise={e}
            testID={`admin-exercise-${e.id}`}
            onPress={() =>
              router.push({ pathname: "/(patient)/exercise-detail", params: { id: e.id } })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
