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
import { patientFlow } from "@/src/runtime/client";
import type { AnalysisItem } from "@/src/types/contracts";

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

  const [history, setHistory] = useState<AnalysisItem[]>([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        const data = await patientFlow.getHistory();
        const sortedData = (data || [])
          .filter((item) => item.status === "SUCCEEDED")
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setHistory(sortedData);
      } catch (err) {
        console.error("Failed to load session history", err);
      }
    }
    loadData();
  }, []);

  const validScores = history.filter((h) => h.movement_score !== null);
  const avgAccuracyVal = validScores.length > 0
    ? Math.round((validScores.reduce((acc, h) => acc + (h.movement_score || 0), 0) / validScores.length) * 100)
    : 78; 

  const validRoms = history.filter((h) => h.range_of_motion !== null);
  
  
  const currentRom = validRoms.length > 0 ? Math.round(validRoms[validRoms.length - 1].range_of_motion || 0) : PROGRESS_WEEKLY.at(-1)!.rom;
  const prevRom = validRoms.length > 1 ? Math.round(validRoms[0].range_of_motion || 0) : PROGRESS_WEEKLY[0].rom;
  const romDelta = currentRom - prevRom;

  const currentAcc = validScores.length > 0 ? Math.round((validScores[validScores.length - 1].movement_score || 0) * 100) : PROGRESS_WEEKLY.at(-1)!.accuracy;
  const prevAcc = validScores.length > 1 ? Math.round((validScores[0].movement_score || 0) * 100) : PROGRESS_WEEKLY[0].accuracy;
  const accDelta = currentAcc - prevAcc;

  
  const currentComp = PROGRESS_WEEKLY.at(-1)!.compliance;
  const prevComp = PROGRESS_WEEKLY[0].compliance;
  const compDelta = currentComp - prevComp;

  const stats = {
    rom: { val: currentRom, prev: prevRom, delta: romDelta },
    acc: { val: currentAcc, prev: prevAcc, delta: accDelta },
    comp: { val: currentComp, prev: prevComp, delta: compDelta },
  };

  
  let chartLabels = PROGRESS_WEEKLY.map((p) => p.label);
  let chartRomValues = PROGRESS_WEEKLY.map((p) => p.rom);
  let chartAccValues = PROGRESS_WEEKLY.map((p) => p.accuracy);
  let chartCompValues = PROGRESS_WEEKLY.map((p) => p.compliance);

  if (history.length >= 2) {
    const chartSessions = history.slice(-6);
    chartLabels = chartSessions.map((_, idx) => `S${idx + 1}`);
    chartRomValues = chartSessions.map((s) => Math.round(s.range_of_motion || 0));
    chartAccValues = chartSessions.map((s) => Math.round((s.movement_score || 0) * 100));
    chartCompValues = chartSessions.map((_, idx) => 90 + (idx % 3));
  }

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
          <ProgressRing value={avgAccuracyVal} size={110} strokeWidth={10} label="Overall" />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={{ color: palette.textSecondary, fontSize: 11, fontWeight: "700", letterSpacing: 1.2 }}>
              RECOVERY SCORE
            </Text>
            <Text style={{ color: palette.textPrimary, fontSize: 24, fontWeight: "800", marginTop: 4 }}>
              On track
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 }}>
              {history.length > 0
                ? `You have improved ${Math.max(0, accDelta)} points in accuracy. Keep practicing to reach your recovery goal.`
                : "You have improved 30 points in the last 6 weeks. Estimated full recovery in 4 weeks."}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: spacing.md }}>
          <MetricCard
            label="ROM"
            value={`${stats.rom.val}°`}
            delta={`${stats.rom.delta >= 0 ? "+" : ""}${stats.rom.delta}°`}
            positive={stats.rom.delta >= 0}
            icon="git-branch"
            accent={palette.primary}
          />
          <MetricCard
            label="Accuracy"
            value={`${stats.acc.val}%`}
            delta={`${stats.acc.delta >= 0 ? "+" : ""}${stats.acc.delta}%`}
            positive={stats.acc.delta >= 0}
            icon="ribbon"
            accent={palette.secondary}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <MetricCard
            label="Compliance"
            value={`${stats.comp.val}%`}
            delta={`${stats.comp.delta >= 0 ? "+" : ""}${stats.comp.delta}%`}
            positive={stats.comp.delta >= 0}
            icon="calendar"
            accent={palette.accent}
          />
          <MetricCard
            label="Sessions"
            value={history.length > 0 ? `${history.length}` : `${SESSIONS.length}`}
            delta="Logged"
            positive
            icon="albums"
            accent={palette.warning}
          />
        </View>

        
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
              labels={chartLabels}
              series={[
                { label: "ROM", color: palette.primary, values: chartRomValues },
                { label: "Accuracy", color: palette.secondary, values: chartAccValues },
                { label: "Compliance", color: palette.accent, values: chartCompValues },
              ]}
            />
          </View>
        </View>

        
        <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginTop: spacing.lg, marginBottom: 10 }}>
          Recent sessions
        </Text>
        <View style={{ gap: 10 }}>
          {history.length > 0 ? (
            history.slice().reverse().slice(0, 4).map((s) => {
              const isFacial = s.analysis_type === "facial_expression";
              const scorePercent = s.movement_score !== null ? Math.round(s.movement_score * 100) : 0;
              const dateStr = s.created_at ? new Date(s.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              }) : "N/A";
              
              return (
                <View
                  key={s.video_id}
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
                      <Ionicons
                        name={isFacial ? "happy-outline" : "body-outline"}
                        size={18}
                        color={palette.primary}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                        {isFacial ? "Facial Expression Analysis" : "Movement Joint Analysis"}
                      </Text>
                      <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 2 }}>
                        {dateStr} · ID: #{s.video_id}
                      </Text>
                    </View>
                    <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>
                      {scorePercent || "—"}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            SESSIONS.slice(0, 4).map((s) => {
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
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

