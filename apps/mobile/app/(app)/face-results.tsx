import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { patientFlow } from "../../src/runtime/client";
import type { AnalysisItem, ExpressionScore } from "../../src/types/contracts";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { StatusChip } from "../../src/ui/components/StatusChip";
import { colors, moderateScale, radius, responsiveFont, spacing } from "../../src/ui/theme";

// Expression display config: emoji, label, description, color
const EXPRESSION_CONFIG: Record<
  string,
  { emoji: string; label: string; description: string; barColor: string }
> = {
  smile: { emoji: "😊", label: "Smile", description: "Mouth smile muscles", barColor: "#50C49A" },
  frown: { emoji: "😟", label: "Frown", description: "Mouth frown muscles", barColor: "#E2A94A" },
  eye_blink_left: {
    emoji: "😉",
    label: "Left Eye Blink",
    description: "Left eyelid closure",
    barColor: "#4EB2C1"
  },
  eye_blink_right: {
    emoji: "😉",
    label: "Right Eye Blink",
    description: "Right eyelid closure",
    barColor: "#4EB2C1"
  },
  eyebrow_raise: {
    emoji: "🤨",
    label: "Eyebrow Raise",
    description: "Outer brow elevation",
    barColor: "#A78BFA"
  },
  mouth_open: {
    emoji: "😮",
    label: "Mouth Open",
    description: "Jaw opening range",
    barColor: "#F07B7B"
  },
  lip_pucker: {
    emoji: "😗",
    label: "Lip Pucker",
    description: "Lip puckering movement",
    barColor: "#F472B6"
  },
  cheek_puff: {
    emoji: "🐡",
    label: "Cheek Puff",
    description: "Cheek inflation",
    barColor: "#FB923C"
  }
};

function getIntensityLabel(score: number): string {
  if (score >= 0.7) return "Strong";
  if (score >= 0.4) return "Moderate";
  if (score >= 0.15) return "Mild";
  return "Minimal";
}

function getIntensityColor(score: number): string {
  if (score >= 0.7) return colors.success;
  if (score >= 0.4) return colors.accent;
  if (score >= 0.15) return colors.warning;
  return colors.textMuted;
}

function getStatusLabel(analysis: AnalysisItem | null): string {
  if (!analysis) return "Analyzing facial expressions...";
  if (analysis.status === "SUCCEEDED") return "Expression analysis complete";
  if (analysis.status === "FAILED") return "Expression analysis failed";
  return analysis.status;
}

function ExpressionBar({ name, score }: { name: string; score: ExpressionScore }) {
  const config = EXPRESSION_CONFIG[name] ?? {
    label: name.replace(/_/g, " "),
    description: "",
    barColor: colors.accent
  };

  const peakPercent = Math.round(score.peak * 100);
  const meanPercent = Math.round(score.mean * 100);

  return (
    <View style={barStyles.container}>
      <View style={barStyles.header}>
        <View style={[barStyles.colorDot, { backgroundColor: config.barColor }]} />
        <View style={barStyles.labelGroup}>
          <Text style={barStyles.label}>{config.label}</Text>
          <Text style={barStyles.description}>{config.description}</Text>
        </View>
        <View style={barStyles.scoreGroup}>
          <Text style={[barStyles.peakScore, { color: getIntensityColor(score.peak) }]}>
            {peakPercent}%
          </Text>
          <Text style={barStyles.intensityLabel}>{getIntensityLabel(score.peak)}</Text>
        </View>
      </View>
      <View style={barStyles.trackContainer}>
        <View style={barStyles.track}>
          <View
            style={[
              barStyles.fillPeak,
              { width: `${Math.max(peakPercent, 2)}%`, backgroundColor: config.barColor }
            ]}
          />
          <View
            style={[
              barStyles.fillMean,
              {
                width: `${Math.max(meanPercent, 2)}%`,
                backgroundColor: config.barColor,
                opacity: 0.5
              }
            ]}
          />
        </View>
        <View style={barStyles.statsRow}>
          <Text style={barStyles.statText}>Min: {Math.round(score.min * 100)}%</Text>
          <Text style={barStyles.statText}>Mean: {meanPercent}%</Text>
          <Text style={barStyles.statText}>Peak: {peakPercent}%</Text>
        </View>
      </View>
    </View>
  );
}

const EXPRESSION_BLENDSHAPES_MAP: Record<string, string[]> = {
  smile: ["mouthSmileLeft", "mouthSmileRight"],
  frown: ["mouthFrownLeft", "mouthFrownRight"],
  eye_blink_left: ["eyeBlinkLeft"],
  eye_blink_right: ["eyeBlinkRight"],
  eyebrow_raise: ["browOuterUpLeft", "browOuterUpRight"],
  mouth_open: ["jawOpen"],
  lip_pucker: ["mouthPucker"],
  cheek_puff: ["cheekPuff"]
};

function getFrameScore(frame: Record<string, number>, name: string): number {
  const bsNames = EXPRESSION_BLENDSHAPES_MAP[name];
  if (!bsNames) return 0;
  const scores = bsNames.map((bs) => frame[bs] ?? 0);
  return scores.reduce((sum, s) => sum + s, 0) / bsNames.length;
}

function ExpressionTimeline({ perFrame }: { perFrame: Record<string, number>[] }) {
  const [selectedExpr, setSelectedExpr] = useState<string>("smile");

  const activeExpressions = Object.keys(EXPRESSION_CONFIG);

  const scores = useMemo(() => {
    return perFrame.map((frame) => getFrameScore(frame, selectedExpr));
  }, [perFrame, selectedExpr]);

  const config = EXPRESSION_CONFIG[selectedExpr] ?? {
    label: selectedExpr,
    barColor: colors.accent
  };

  return (
    <AppCard>
      <View style={styles.expressionHeader}>
        <Feather name="activity" size={16} color={colors.accent} />
        <Text style={styles.expressionTitle}>Expression Timeline</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={timelineStyles.selectorContainer}
      >
        {activeExpressions.map((name) => {
          const cfg = EXPRESSION_CONFIG[name];
          const isSelected = selectedExpr === name;
          return (
            <Pressable
              key={name}
              onPress={() => setSelectedExpr(name)}
              style={[
                timelineStyles.pill,
                isSelected && { backgroundColor: cfg.barColor + "20", borderColor: cfg.barColor }
              ]}
            >
              <View style={[timelineStyles.pillColorDot, { backgroundColor: cfg.barColor }]} />
              <Text
                style={[
                  timelineStyles.pillText,
                  isSelected && { color: cfg.barColor, fontWeight: "700" }
                ]}
              >
                {cfg.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={timelineStyles.chartContainer}>
        <View style={timelineStyles.gridContainer}>
          {[1.0, 0.75, 0.5, 0.25].map((level) => (
            <View key={level} style={timelineStyles.gridLine}>
              <Text style={timelineStyles.gridLabel}>{Math.round(level * 100)}%</Text>
              <View style={timelineStyles.line} />
            </View>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={timelineStyles.barsScrollContainer}
        >
          <View style={timelineStyles.barsWrapper}>
            {scores.map((score, index) => {
              const barHeight = Math.max(score * 120, 3);
              const isSecondMarker = index % 6 === 0;
              return (
                <View key={index} style={timelineStyles.barColumn}>
                  <View style={timelineStyles.barTrack}>
                    <View
                      style={[
                        timelineStyles.barFill,
                        {
                          height: barHeight,
                          backgroundColor: config.barColor,
                          borderTopLeftRadius: radius.sm,
                          borderTopRightRadius: radius.sm
                        }
                      ]}
                    />
                  </View>
                  <View style={timelineStyles.tickContainer}>
                    {isSecondMarker ? (
                      <Text style={timelineStyles.tickText}>{index / 6}s</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </AppCard>
  );
}

export default function FaceResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ videoId?: string }>();
  const [analysis, setAnalysis] = useState<AnalysisItem | null>(null);
  const [status, setStatus] = useState<string>("Analyzing facial expressions...");

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

  const expressionEntries = useMemo(() => {
    if (!analysis?.expression_summary) return [];
    return Object.entries(analysis.expression_summary).sort(
      ([, a], [, b]) => (b as ExpressionScore).peak - (a as ExpressionScore).peak
    );
  }, [analysis]);

  const overallScore = analysis?.movement_score ?? null;

  async function shareReport() {
    if (!analysis) {
      Alert.alert("Report", "Result is still processing.");
      return;
    }

    const lines = [
      "Facial Expression Analysis Report",
      `Status: ${analysis.status}`,
      `Overall Intensity: ${overallScore !== null ? Math.round(overallScore * 100) + "%" : "-"}`,
      ""
    ];

    if (analysis.expression_summary) {
      for (const [name, score] of Object.entries(analysis.expression_summary)) {
        const config = EXPRESSION_CONFIG[name];
        const displayName = config?.label ?? name;
        lines.push(`${displayName}: Peak ${Math.round((score as ExpressionScore).peak * 100)}%`);
      }
    }

    lines.push("", `Updated: ${new Date(analysis.updated_at).toLocaleString()}`);
    await Share.share({ message: lines.join("\n") });
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" backgroundColor={colors.surface} />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          onBack={() => router.back()}
          title="Face Expression Result"
          subtitle={label}
        />

        {/* Overall score card */}
        <AppCard>
          <View style={styles.scoreBlock}>
            <View style={styles.faceBadge}>
              <Feather name="smile" size={14} color={colors.accent} />
              <Text style={styles.faceBadgeText}>Facial Expression</Text>
            </View>
            <Text style={styles.scoreTitle}>Overall Intensity</Text>
            <Text style={styles.scoreValue}>
              {overallScore !== null ? `${Math.round(overallScore * 100)}%` : "-"}
            </Text>
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

        {/* Landmark image card */}
        {analysis?.landmark_image_base64 ? (
          <AppCard>
            <View style={styles.imageHeader}>
              <Feather name="image" size={16} color={colors.accent} />
              <Text style={styles.imageTitle}>Detected Face & Landmarks</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `data:image/png;base64,${analysis.landmark_image_base64}` }}
                style={styles.landmarkImage}
                resizeMode="contain"
              />
            </View>
          </AppCard>
        ) : null}

        {/* Per-frame timeline chart */}
        {analysis?.status === "SUCCEEDED" &&
        analysis.per_frame_blendshapes &&
        analysis.per_frame_blendshapes.length > 0 ? (
          <ExpressionTimeline perFrame={analysis.per_frame_blendshapes} />
        ) : null}

        {/* Expression breakdown */}
        {expressionEntries.length > 0 ? (
          <AppCard>
            <View style={styles.expressionHeader}>
              <Feather name="bar-chart-2" size={16} color={colors.accent} />
              <Text style={styles.expressionTitle}>Expression Breakdown</Text>
            </View>
            <View style={styles.expressionList}>
              {expressionEntries.map(([name, score]) => (
                <ExpressionBar key={name} name={name} score={score as ExpressionScore} />
              ))}
            </View>
          </AppCard>
        ) : null}

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
        </View>
        <AppButton label="Go To History" onPress={() => router.push("/(app)/history")} />
        <AppButton
          label="New Face Assessment"
          onPress={() => router.push("/(app)/face-record" as any)}
          variant="secondary"
        />

        <Text style={styles.statusText}>Status: {status}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const barStyles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  colorDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: radius.pill
  },
  labelGroup: {
    flex: 1
  },
  label: {
    color: colors.text,
    fontSize: responsiveFont(13),
    fontWeight: "700"
  },
  description: {
    color: colors.textMuted,
    fontSize: responsiveFont(10)
  },
  scoreGroup: {
    alignItems: "flex-end"
  },
  peakScore: {
    fontSize: responsiveFont(16),
    fontWeight: "800"
  },
  intensityLabel: {
    color: colors.textMuted,
    fontSize: responsiveFont(10),
    fontWeight: "600"
  },
  trackContainer: {
    marginTop: spacing.xs,
    marginLeft: moderateScale(34)
  },
  track: {
    height: moderateScale(6),
    backgroundColor: colors.divider,
    borderRadius: radius.pill,
    overflow: "hidden"
  },
  fillPeak: {
    position: "absolute",
    height: "100%",
    borderRadius: radius.pill
  },
  fillMean: {
    position: "absolute",
    height: "100%",
    borderRadius: radius.pill
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3
  },
  statText: {
    color: colors.textMuted,
    fontSize: responsiveFont(9)
  }
});

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
  faceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill
  },
  faceBadgeText: {
    color: colors.accent,
    fontSize: responsiveFont(11),
    fontWeight: "700"
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
  expressionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs
  },
  expressionTitle: {
    color: colors.text,
    fontSize: responsiveFont(14),
    fontWeight: "700"
  },
  expressionList: {
    gap: 0
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
  },
  imageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md
  },
  imageTitle: {
    color: colors.text,
    fontSize: responsiveFont(14),
    fontWeight: "700"
  },
  imageContainer: {
    width: "100%",
    height: moderateScale(220),
    backgroundColor: colors.divider + "30",
    borderRadius: radius.md,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center"
  },
  landmarkImage: {
    width: "100%",
    height: "100%"
  }
});

const timelineStyles = StyleSheet.create({
  selectorContainer: {
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.divider + "40",
    borderWidth: 1,
    borderColor: "transparent"
  },
  pillColorDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: radius.pill
  },
  pillText: {
    fontSize: responsiveFont(11),
    color: colors.textMuted,
    fontWeight: "500"
  },
  chartContainer: {
    height: 160,
    position: "relative",
    justifyContent: "flex-end"
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 25,
    justifyContent: "space-between"
  },
  gridLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  gridLabel: {
    fontSize: responsiveFont(8),
    color: colors.textMuted,
    width: 25,
    textAlign: "right"
  },
  line: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.divider,
    opacity: 0.5
  },
  barsScrollContainer: {
    paddingLeft: 30,
    paddingRight: spacing.md
  },
  barsWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 135
  },
  barColumn: {
    alignItems: "center",
    width: 12,
    height: "100%",
    justifyContent: "flex-end"
  },
  barTrack: {
    width: 6,
    height: 120,
    backgroundColor: colors.divider + "30",
    borderRadius: radius.pill,
    justifyContent: "flex-end",
    overflow: "hidden"
  },
  barFill: {
    width: "100%"
  },
  tickContainer: {
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4
  },
  tickText: {
    fontSize: responsiveFont(8),
    color: colors.textMuted,
    fontWeight: "600"
  }
});
