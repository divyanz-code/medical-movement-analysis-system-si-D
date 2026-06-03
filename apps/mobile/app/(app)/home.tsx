import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { patientFlow } from "../../src/runtime/client";
import type { AnalysisItem } from "../../src/types/contracts";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { MetricCard } from "../../src/ui/components/MetricCard";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { responsiveFont, spacing, type ThemeColors } from "../../src/ui/theme";
import { useAppTheme } from "../../src/ui/themeProvider";

function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs Work";
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors, mode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [name, setName] = useState("there");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    patientFlow
      .getHistory()
      .then(setItems)
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Failed to load dashboard");
      });

    patientFlow
      .getProfile()
      .then((profile) => {
        const firstName = profile.name.trim().split(" ")[0];
        if (firstName) setName(firstName);
      })
      .catch(() => {
        // Keep fallback.
      });
  }, []);

  const latest = useMemo(() => items[0] ?? null, [items]);
  const successfulCount = useMemo(
    () => items.filter((item) => item.status === "SUCCEEDED").length,
    [items]
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} backgroundColor={colors.surface} />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title={`Welcome back, ${name}`}
          subtitle="Track movement progress and start guided sessions."
        />

        <AppCard>
          <Text style={styles.kicker}>Latest Score</Text>
          <Text style={styles.scoreValue}>{latest?.movement_score ?? "-"}</Text>
          <Text style={styles.scoreHint}>
            {latest?.movement_score ? scoreLabel(latest.movement_score) : "No assessment data yet"}
          </Text>
        </AppCard>

        <View style={styles.actionStack}>
          <AppButton label="Record Assessment" onPress={() => router.push("/(app)/record")} />
          <AppButton label="😊 Face Expression Assessment" onPress={() => router.push("/(app)/face-record" as any)} variant="secondary" />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCell}>
            <MetricCard icon="activity" label="Total Sessions" value={items.length} variant="accent" />
          </View>
          <View style={styles.metricCell}>
            <MetricCard icon="check-circle" label="Completed" value={successfulCount} variant="success" />
          </View>
        </View>

        {status ? <Text style={styles.error}>{status}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 108,
    gap: spacing.md
  },
  kicker: {
    color: colors.textMuted,
    fontSize: responsiveFont(12)
  },
  scoreValue: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: responsiveFont(44),
    fontWeight: "700"
  },
  scoreHint: {
    color: colors.accent,
    fontWeight: "600"
  },
  actionStack: {
    gap: spacing.sm
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  metricCell: {
    flex: 1
  },
  error: {
    color: colors.danger
  }
  });
}
