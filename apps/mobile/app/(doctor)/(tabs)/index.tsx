import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LineChart } from "@/src/components/LineChart";
import { MetricCard } from "@/src/components/MetricCard";
import { PatientCard } from "@/src/components/PatientCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { PATIENTS, PROGRESS_WEEKLY } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function DoctorHome() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flagged = PATIENTS.filter((p) => p.risk !== "low");

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Good morning, Dr. Verma" subtitle="Tuesday · 8:30 AM" showMenu rightIcon="search-outline" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: spacing.lg }}>
          <LinearGradient
            colors={[palette.secondary, palette.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: radii.lg,
              padding: spacing.md,
              ...shadow.md,
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }}>
              CLINIC TODAY
            </Text>
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 6 }}>
              5 sessions · 2 reviews
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 6, lineHeight: 19 }}>
              You have 2 patients flagged for risk. Reviewing them improves recovery outcomes by 38%.
            </Text>
            <Pressable
              testID="review-flagged"
              onPress={() => router.push("/(doctor)/(tabs)/patients")}
              style={{
                marginTop: 14,
                alignSelf: "flex-start",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.18)",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>Review flagged</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 6 }} />
            </Pressable>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <MetricCard label="Active patients" value={`${PATIENTS.length}`} icon="people" accent={palette.primary} delta="+2 this wk" positive />
            <MetricCard label="Avg compliance" value="82%" icon="checkmark-done" accent={palette.success} delta="+4%" positive />
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <MetricCard label="Avg recovery" value="68%" icon="trending-up" accent={palette.secondary} delta="+6%" positive />
            <MetricCard label="Risk flags" value={`${flagged.length}`} icon="alert" accent={palette.warning} delta="2 high" positive={false} />
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <View
            style={[
              {
                backgroundColor: palette.surface,
                borderRadius: radii.lg,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: palette.border,
                padding: spacing.md,
              },
              shadow.sm,
            ]}
          >
            <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "800" }}>
              Cohort recovery trend
            </Text>
            <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
              Across {PATIENTS.length} patients · 6 weeks
            </Text>
            <View style={{ marginTop: 10 }}>
              <LineChart
                labels={PROGRESS_WEEKLY.map((p) => p.label)}
                series={[
                  { label: "Recovery", color: palette.primary, values: PROGRESS_WEEKLY.map((p) => p.rom - 5) },
                  { label: "Compliance", color: palette.secondary, values: PROGRESS_WEEKLY.map((p) => p.compliance) },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <View style={styles.sectionRow}>
            <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800" }}>
              Flagged patients
            </Text>
            <Pressable testID="view-all-patients" onPress={() => router.push("/(doctor)/(tabs)/patients")}>
              <Text style={{ color: palette.primary, fontSize: 13, fontWeight: "700" }}>See all</Text>
            </Pressable>
          </View>
          <View style={{ gap: 10 }}>
            {flagged.map((p) => (
              <PatientCard
                key={p.id}
                testID={`patient-${p.id}`}
                patient={p}
                onPress={() => router.push({ pathname: "/(doctor)/patient-detail", params: { id: p.id } })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
});
