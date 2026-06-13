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

export default function PatientHome() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const completed = TODAY_EXERCISES.filter((e) => e.status === "completed").length;
  const progressPct = Math.round((completed / TODAY_EXERCISES.length) * 100);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader
        title="Hello, Aarav"
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
        {/* Hero recovery card */}
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

        {/* Quick KPIs */}
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
              value="142°"
              icon="git-branch"
              delta="+8° this wk"
              positive
              accent={palette.secondary}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <MetricCard
              testID="metric-accuracy"
              label="Accuracy"
              value="91%"
              icon="ribbon"
              delta="+3% this wk"
              positive
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

        {/* Today's exercises */}
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

        {/* Recovery trend chart */}
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
                labels={PROGRESS_WEEKLY.map((p) => p.label)}
                series={[
                  { label: "ROM", color: palette.primary, values: PROGRESS_WEEKLY.map((p) => p.rom) },
                  { label: "Accuracy", color: palette.secondary, values: PROGRESS_WEEKLY.map((p) => p.accuracy) },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Last analysis */}
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
