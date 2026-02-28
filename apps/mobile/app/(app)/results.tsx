import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from "react-native";

import { patientFlow } from "../../src/runtime/client";
import type { AnalysisItem } from "../../src/types/contracts";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { MetricCard } from "../../src/ui/components/MetricCard";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { StatusChip } from "../../src/ui/components/StatusChip";
import { colors, responsiveFont, spacing } from "../../src/ui/theme";

function getStatusLabel(analysis: AnalysisItem | null): string {
  if (!analysis) return "Waiting for analysis...";
  if (analysis.status === "SUCCEEDED") return "Assessment complete";
  if (analysis.status === "FAILED") return "Assessment failed";
  return analysis.status;
}

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ videoId?: string }>();
  const [analysis, setAnalysis] = useState<AnalysisItem | null>(null);
  const [status, setStatus] = useState<string>("Waiting for analysis...");

  useEffect(() => {
    async function load() {
      if (!params.videoId) {
        setStatus("Missing video ID");
        return;
      }

      const result = await patientFlow.pollAnalysis(Number(params.videoId), {
        maxAttempts: 30,
        delayMs: 500
      });
      setAnalysis(result);
      setStatus(result.status);
    }

    load().catch((error: unknown) => {
      setStatus(error instanceof Error ? error.message : "Could not fetch analysis");
    });
  }, [params.videoId]);

  const label = useMemo(() => getStatusLabel(analysis), [analysis]);

  async function shareReport() {
    if (!analysis) {
      Alert.alert("Report", "Result is still processing.");
      return;
    }
    const report = [
      "Medical Movement Analysis Report",
      `Status: ${analysis.status}`,
      `Movement Score: ${analysis.movement_score ?? "-"}`,
      `Min Angle: ${analysis.min_angle ?? "-"}`,
      `Max Angle: ${analysis.max_angle ?? "-"}`,
      `Range of Motion: ${analysis.range_of_motion ?? "-"}`,
      `Updated: ${new Date(analysis.updated_at).toLocaleString()}`
    ].join("\n");
    await Share.share({ message: report });
  }

  function downloadSummary() {
    if (!analysis) {
      Alert.alert("Download", "Result is still processing.");
      return;
    }
    Alert.alert("Download Ready", "PDF export integration will be added next.");
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" backgroundColor={colors.surface} />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          onBack={() => router.back()}
          title="Assessment Result"
          subtitle={label}
        />

        <AppCard>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreTitle}>Movement Score</Text>
            <Text style={styles.scoreValue}>{analysis?.movement_score ?? "-"}</Text>
            <StatusChip
              status={
                analysis?.status === "SUCCEEDED"
                  ? "success"
                  : analysis?.status === "FAILED"
                    ? "warning"
                    : "processing"
              }
              label={analysis?.status ?? "PENDING"}
            />
          </View>
        </AppCard>

        <View style={styles.metricRows}>
          <View style={styles.metricCell}>
            <MetricCard icon="chevron-down" label="Min Angle" value={analysis?.min_angle ?? "-"} unit="°" />
          </View>
          <View style={styles.metricCell}>
            <MetricCard icon="chevron-up" label="Max Angle" value={analysis?.max_angle ?? "-"} unit="°" />
          </View>
        </View>

        <MetricCard
          icon="maximize-2"
          label="Range of Motion"
          value={analysis?.range_of_motion ?? "-"}
          unit="°"
          variant="accent"
          trend="up"
        />

        {analysis?.status === "FAILED" ? (
          <AppCard>
            <Text style={styles.errorTitle}>Analysis Error</Text>
            <Text style={styles.errorText}>
              {analysis.error_code}: {analysis.error_message}
            </Text>
          </AppCard>
        ) : null}

        <View style={styles.actionRows}>
          <AppButton label="Share Report" onPress={shareReport} variant="secondary" />
          <AppButton label="Download Summary" onPress={downloadSummary} variant="secondary" />
        </View>
        <AppButton label="Go To History" onPress={() => router.push("/(app)/history")} />
        <AppButton label="New Assessment" onPress={() => router.push("/(app)/record")} variant="secondary" />

        <Text style={styles.statusText}>Status: {status}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 56,
    gap: spacing.md
  },
  scoreBlock: {
    alignItems: "center",
    gap: spacing.sm
  },
  scoreTitle: {
    color: colors.textMuted,
    fontSize: responsiveFont(12)
  },
  scoreValue: {
    color: colors.text,
    fontSize: responsiveFont(54),
    fontWeight: "700"
  },
  metricRows: {
    flexDirection: "row",
    gap: spacing.md
  },
  metricCell: {
    flex: 1
  },
  actionRows: {
    gap: spacing.sm
  },
  errorTitle: {
    color: colors.danger,
    fontWeight: "700"
  },
  errorText: {
    marginTop: spacing.xs,
    color: colors.text
  },
  statusText: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: responsiveFont(12)
  }
});
