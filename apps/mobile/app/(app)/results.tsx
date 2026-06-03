import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { patientFlow } from "../../src/runtime/client";
import type { AnalysisItem } from "../../src/types/contracts";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { MetricCard } from "../../src/ui/components/MetricCard";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { StatusChip } from "../../src/ui/components/StatusChip";
import { colors, moderateScale, radius, responsiveFont, spacing } from "../../src/ui/theme";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const slides = useMemo(() => {
    const list: { type: string; base64: string }[] = [];
    if (analysis?.calibration_frame_base64) {
      list.push({ type: "calibration", base64: analysis.calibration_frame_base64 });
    }
    if (analysis?.success_frame_base64) {
      list.push({ type: "success", base64: analysis.success_frame_base64 });
    }
    if (analysis?.tracking_frame_base64) {
      list.push({ type: "tracking", base64: analysis.tracking_frame_base64 });
    }
    return list;
  }, [analysis]);

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

        {/* Skeleton pose image card carousel */}
        {analysis && slides.length > 0 ? (
          <AppCard>
            <View style={styles.imageHeader}>
              <Feather name="activity" size={16} color={colors.accent} />
              <Text style={styles.imageTitle}>Calibration & Tracking Flow</Text>
            </View>
            <View
              style={styles.carouselContainer}
              onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
              {containerWidth > 0 && (
                <View style={{ width: containerWidth }}>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(e) => {
                      const slide = Math.round(e.nativeEvent.contentOffset.x / containerWidth);
                      if (slide !== activeIndex) {
                        setActiveIndex(slide);
                      }
                    }}
                    scrollEventThrottle={16}
                  >
                    {slides.map((item, idx) => {
                      let title = "1. Alignment Calibration";
                      let desc = "Red reference guide with live guidance prompts";
                      let titleColor = colors.white;

                      if (item.type === "success") {
                        title = "2. Calibration Complete";
                        desc = "Reference guide turns green after 2s of stability";
                        titleColor = colors.success || "#4CAF50";
                      } else if (item.type === "tracking") {
                        title = "3. Live Movement Tracking";
                        desc = "High-fidelity tracking, joint angles & telemetry HUD";
                        titleColor = colors.accent;
                      }

                      return (
                        <View key={idx} style={[styles.carouselSlide, { width: containerWidth }]}>
                          <Image
                            source={{ uri: `data:image/png;base64,${item.base64}` }}
                            style={styles.landmarkImage}
                            resizeMode="contain"
                          />
                          <View style={styles.slideLabelContainer}>
                            <Text style={[styles.slideLabelTitle, { color: titleColor }]}>
                              {title}
                            </Text>
                            <Text style={styles.slideLabelDesc}>{desc}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>

                  {/* Pagination Dots */}
                  <View style={styles.paginationRow}>
                    {slides.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          activeIndex === index && styles.paginationDotActive,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}
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
  },
  imageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  imageTitle: {
    color: colors.text,
    fontSize: responsiveFont(14),
    fontWeight: "700",
  },
  landmarkImage: {
    width: "100%",
    height: moderateScale(220),
  },
  carouselContainer: {
    width: "100%",
    alignItems: "center",
  },
  carouselSlide: {
    height: moderateScale(290),
    backgroundColor: colors.divider + "15",
    borderRadius: radius.md,
    overflow: "hidden",
  },
  slideLabelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  slideLabelTitle: {
    color: colors.white,
    fontSize: responsiveFont(13),
    fontWeight: "700",
  },
  slideLabelDesc: {
    color: "#A0A0A0",
    fontSize: responsiveFont(11),
    marginTop: 2,
  },
  paginationRow: {
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },
  paginationDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
  },
  paginationDotActive: {
    width: moderateScale(18),
    backgroundColor: colors.accent,
  },
});
