import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChipRow } from "@/src/components/ChipRow";
import { LineChart } from "@/src/components/LineChart";
import { MetricCard } from "@/src/components/MetricCard";
import { ProgressRing } from "@/src/components/ProgressRing";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import {
  findExercise,
  PROGRESS_WEEKLY,
  SESSIONS,
} from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const RANGES = [
  { id: "1w", label: "1 Week" },
  { id: "1m", label: "1 Month" },
  { id: "3m", label: "3 Months" },
  { id: "all", label: "All time" },
];

export default function PatientProgress() {
  const { palette, radii, spacing, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState("1m");

  const stats = {
    rom: { val: PROGRESS_WEEKLY.at(-1)!.rom, prev: PROGRESS_WEEKLY[0].rom },
    acc: { val: PROGRESS_WEEKLY.at(-1)!.accuracy, prev: PROGRESS_WEEKLY[0].accuracy },
    comp: { val: PROGRESS_WEEKLY.at(-1)!.compliance, prev: PROGRESS_WEEKLY[0].compliance },
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Progress" subtitle="Recovery trends" showMenu />
      <ChipRow items={RANGES} selected={range} onSelect={setRange} testID="range-row" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Recovery score */}
        <View
          style={[
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              borderRadius: radii.lg,
              borderWidth: StyleSheet.hairlineWidth,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
            },
            shadow.sm,
          ]}
        >
          <ProgressRing value={78} size={110} strokeWidth={10} label="Overall" />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={{ color: palette.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1.2 }}>
              RECOVERY SCORE
            </Text>
            <Text style={{ color: palette.textPrimary, fontSize: 24, fontWeight: "800", marginTop: 4 }}>
              On track
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 }}>
              You have improved 30 points in the last 6 weeks. Estimated full recovery in 4 weeks.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: spacing.md }}>
          <MetricCard
            label="ROM"
            value={`${stats.rom.val}°`}
            delta={`+${stats.rom.val - stats.rom.prev}°`}
            positive
            icon="git-branch"
            accent={palette.primary}
          />
          <MetricCard
            label="Accuracy"
            value={`${stats.acc.val}%`}
            delta={`+${stats.acc.val - stats.acc.prev}%`}
            positive
            icon="ribbon"
            accent={palette.secondary}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <MetricCard
            label="Compliance"
            value={`${stats.comp.val}%`}
            delta={`+${stats.comp.val - stats.comp.prev}%`}
            positive
            icon="calendar"
            accent={palette.accent}
          />
          <MetricCard
            label="Sessions"
            value={`${SESSIONS.length}`}
            delta="Last 6 wks"
            positive
            icon="albums"
            accent={palette.warning}
          />
        </View>

        {/* Chart */}
        <View
          style={[
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              borderRadius: radii.lg,
              borderWidth: StyleSheet.hairlineWidth,
              padding: spacing.md,
              marginTop: spacing.md,
            },
            shadow.sm,
          ]}
        >
          <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "700" }}>
            Trends
          </Text>
          <View style={{ marginTop: 10 }}>
            <LineChart
              labels={PROGRESS_WEEKLY.map((p) => p.label)}
              series={[
                { label: "ROM", color: palette.primary, values: PROGRESS_WEEKLY.map((p) => p.rom) },
                { label: "Accuracy", color: palette.secondary, values: PROGRESS_WEEKLY.map((p) => p.accuracy) },
                { label: "Compliance", color: palette.accent, values: PROGRESS_WEEKLY.map((p) => p.compliance) },
              ]}
            />
          </View>
        </View>

        {/* Recent sessions */}
        <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginTop: spacing.lg, marginBottom: 10 }}>
          Recent sessions
        </Text>
        <View style={{ gap: 10 }}>
          {SESSIONS.slice(0, 4).map((s) => {
            const ex = findExercise(s.exerciseId);
            return (
              <View
                key={s.id}
                style={[
                  {
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                    borderRadius: radii.lg,
                    borderWidth: StyleSheet.hairlineWidth,
                    padding: spacing.md,
                  },
                  shadow.sm,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: palette.primaryMuted,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={18} color={palette.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                      {ex.name}
                    </Text>
                    <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 2 }}>
                      {s.date} · {s.duration}
                    </Text>
                  </View>
                  <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>
                    {s.score}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const _styles = StyleSheet.create({});
