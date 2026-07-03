import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExerciseCard } from "@/src/components/ExerciseCard";
import { LineChart } from "@/src/components/LineChart";
import { MetricCard } from "@/src/components/MetricCard";
import { ProgressRing } from "@/src/components/ProgressRing";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import {
  findExercise,
  NOTIFICATIONS,
  PROGRESS_WEEKLY,
  TODAY_EXERCISES,
} from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useUser } from "@/src/context/UserContext";
import { patientFlow } from "@/src/runtime/client";
import type { AnalysisItem } from "@/src/types/contracts";

export default function PatientHome() {
  const { palette, radii, spacing, shadow } = useTheme();
  const { profile, refreshProfile } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [history, setHistory] = React.useState<AnalysisItem[]>([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        await refreshProfile();
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
  }, [refreshProfile]);

  const completed = TODAY_EXERCISES.filter((e) => e.status === "completed").length;
  const progressPct = Math.round((completed / TODAY_EXERCISES.length) * 100);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Patient";

  
  const validRoms = history.filter((h) => h.range_of_motion !== null);
  const avgRomVal = validRoms.length > 0
    ? Math.round(validRoms.reduce((acc, h) => acc + (h.range_of_motion || 0), 0) / validRoms.length)
    : 142; 
  const avgRom = `${avgRomVal}°`;

  const romDelta = validRoms.length > 1
    ? (validRoms[validRoms.length - 1].range_of_motion || 0) - (validRoms[0].range_of_motion || 0)
    : 8;
  const romDeltaText = `${romDelta >= 0 ? "+" : ""}${romDelta}° vs baseline`;

  const validScores = history.filter((h) => h.movement_score !== null);
  const avgAccuracyVal = validScores.length > 0
    ? Math.round((validScores.reduce((acc, h) => acc + (h.movement_score || 0), 0) / validScores.length) * 100)
    : 91; 
  const avgAccuracy = `${avgAccuracyVal}%`;

  const accDelta = validScores.length > 1
    ? Math.round(((validScores[validScores.length - 1].movement_score || 0) - (validScores[0].movement_score || 0)) * 100)
    : 3;
  const accDeltaText = `${accDelta >= 0 ? "+" : ""}${accDelta}% vs baseline`;

  
  let chartLabels = PROGRESS_WEEKLY.map((p) => p.label);
  let chartRomValues = PROGRESS_WEEKLY.map((p) => p.rom);
  let chartAccValues = PROGRESS_WEEKLY.map((p) => p.accuracy);

  if (history.length >= 2) {
    const chartSessions = history.slice(-6);
    chartLabels = chartSessions.map((_, idx) => `S${idx + 1}`);
    chartRomValues = chartSessions.map((s) => Math.round(s.range_of_motion || 0));
    chartAccValues = chartSessions.map((s) => Math.round((s.movement_score || 0) * 100));
  }

  
  const latestSession = history[history.length - 1];

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader
        title={`Hello, ${firstName}`}
        subtitle="Let's keep recovering today."
        showMenu
        rightIcon="notifications-outline"
        rightBadge={unread}
        onRight={() => router.push("/(patient)/notifications")}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={{ paddingHorizontal: spacing.lg, marginTop: 4 }}>
          <LinearGradient
            colors={[palette.primary, palette.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: radii.lg,
              padding: spacing.md,
              flexDirection: "row",
              alignItems: "center",
              ...shadow.md,
            }}
          >
            <ProgressRing value={78} size={108} strokeWidth={10} label="Recovery" />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
                Week 6 · ACL rehab
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 6, lineHeight: 19 }}>
                You are 12 days ahead of schedule. Keep your knee flexion routine consistent.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.18)",
                }}
              >
                <Ionicons name="trophy" size={14} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700", marginLeft: 6 }}>
                  Streak · 14 days
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <MetricCard
              testID="metric-today"
              label="Today"
              value={`${completed}/${TODAY_EXERCISES.length}`}
              icon="checkmark-done"
              delta={`${progressPct}% done`}
              positive
              accent={palette.primary}
            />
            <MetricCard
              testID="metric-rom"
              label="Avg ROM"
              value={avgRom}
              icon="git-branch"
              delta={romDeltaText}
              positive={romDelta >= 0}
              accent={palette.secondary}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <MetricCard
              testID="metric-accuracy"
              label="Accuracy"
              value={avgAccuracy}
              icon="ribbon"
              delta={accDeltaText}
              positive={accDelta >= 0}
              accent={palette.accent}
            />
            <MetricCard
              testID="metric-compliance"
              label="Compliance"
              value="94%"
              icon="calendar"
              delta="-2% vs goal"
              positive={false}
              accent={palette.warning}
            />
          </View>
        </View>

        
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <View style={styles.sectionRow}>
            <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800" }}>
              Today&apos;s exercises
            </Text>
            <Pressable
              testID="link-exercises"
              onPress={() => router.push("/(patient)/(tabs)/exercises")}
            >
              <Text style={{ color: palette.primary, fontSize: 13, fontWeight: "700" }}>
                View all
              </Text>
            </Pressable>
          </View>
          <View style={{ gap: 10 }}>
            {TODAY_EXERCISES.map((a) => {
              const ex = findExercise(a.exerciseId);
              return (
                <ExerciseCard
                  key={a.id}
                  testID={`assigned-${a.id}`}
                  exercise={ex}
                  scheduledAt={a.scheduledAt}
                  status={a.status}
                  onPress={() =>
                    router.push({ pathname: "/(patient)/exercise-detail", params: { id: ex.id } })
                  }
                />
              );
            })}
          </View>
        </View>

        
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <View
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
            <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "700" }}>
              Recovery trend · 6 weeks
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
              ROM and Accuracy improvements
            </Text>
            <View style={{ marginTop: 10 }}>
              <LineChart
                labels={chartLabels}
                series={[
                  { label: "ROM", color: palette.primary, values: chartRomValues },
                  { label: "Accuracy", color: palette.secondary, values: chartAccValues },
                ]}
              />
            </View>
          </View>
        </View>

        
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginBottom: 10 }}>
            Last analysis
          </Text>
          <Pressable
            testID="last-analysis-card"
            onPress={() => router.push("/(patient)/session-history")}
          >
            <View
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
              {latestSession ? (
                <>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: palette.primaryMuted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={latestSession.analysis_type === "facial_expression" ? "happy-outline" : "body-outline"}
                        size={20}
                        color={palette.primary}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                        {latestSession.analysis_type === "facial_expression"
                          ? "Facial Expression Analysis"
                          : "Movement Joint Analysis"}
                      </Text>
                      <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                        {new Date(latestSession.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>
                        {latestSession.movement_score !== null ? Math.round(latestSession.movement_score * 100) : "—"}
                      </Text>
                      <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700" }}>
                        SCORE
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 14, gap: 12 }}>
                    <Stat
                      label="ROM Min"
                      value={latestSession.min_angle !== null ? `${Math.round(latestSession.min_angle)}°` : "—"}
                      color={palette.primary}
                    />
                    <Stat
                      label="ROM Max"
                      value={latestSession.max_angle !== null ? `${Math.round(latestSession.max_angle)}°` : "—"}
                      color={palette.success}
                    />
                    <Stat
                      label="ROM Total"
                      value={latestSession.range_of_motion !== null ? `${Math.round(latestSession.range_of_motion)}°` : "—"}
                      color={palette.secondary}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: palette.primaryMuted,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="pulse" size={20} color={palette.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                        Shoulder Flexion · 5m 12s
                      </Text>
                      <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                        Yesterday · 8:32 PM
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ color: palette.textPrimary, fontSize: 18, fontWeight: "800" }}>
                        88
                      </Text>
                      <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700" }}>
                        SCORE
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 14, gap: 12 }}>
                    <Stat label="ROM" value="5°–162°" color={palette.primary} />
                    <Stat label="Accuracy" value="92%" color={palette.success} />
                    <Stat label="Symmetry" value="89%" color={palette.secondary} />
                  </View>
                </>
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const Stat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => {
  const { palette } = useTheme();
  return (
    <View style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: palette.surfaceAlt }}>
      <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1 }}>
        {label}
      </Text>
      <Text style={{ color, fontSize: 14, fontWeight: "800", marginTop: 4 }}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
});
