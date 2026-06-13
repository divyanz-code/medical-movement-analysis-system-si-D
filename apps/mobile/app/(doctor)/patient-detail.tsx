import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { LineChart } from "@/src/components/LineChart";
import { ProgressRing } from "@/src/components/ProgressRing";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import {
  findExercise,
  PATIENTS,
  PROGRESS_WEEKLY,
  SESSIONS,
} from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function PatientDetail() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const patient = PATIENTS.find((p) => p.id === id) ?? PATIENTS[0];

  const riskColor =
    patient.risk === "high"
      ? palette.danger
      : patient.risk === "medium"
        ? palette.warning
        : palette.success;

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title={patient.name} subtitle={patient.condition} showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: spacing.lg }}>
          <View
            style={[
              {
                backgroundColor: palette.surface,
                borderRadius: radii.lg,
                borderColor: palette.border,
                borderWidth: StyleSheet.hairlineWidth,
                padding: spacing.md,
                flexDirection: "row",
                alignItems: "center",
              },
              shadow.sm,
            ]}
          >
            <Image
              source={{ uri: patient.avatar }}
              style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: palette.surfaceAlt }}
            />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ color: palette.textPrimary, fontSize: 16, fontWeight: "800" }}>
                {patient.name}
              </Text>
              <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                {patient.age}y · {patient.gender} · {patient.bodyPart}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: riskColor, marginRight: 6 }} />
                <Text style={{ color: riskColor, fontSize: 11, fontWeight: "800", textTransform: "uppercase" }}>
                  {patient.risk} risk
                </Text>
              </View>
            </View>
            <ProgressRing size={68} strokeWidth={6} value={patient.recovery} label="Recov." />
          </View>

          <View style={{ flexDirection: "row", marginTop: spacing.md, gap: 10 }}>
            <Stat label="Compliance" value={`${patient.compliance}%`} />
            <Stat label="Sessions" value="24" />
            <Stat label="Last seen" value={patient.lastSession} />
          </View>

          <View
            style={[
              {
                backgroundColor: palette.surface,
                borderRadius: radii.lg,
                borderColor: palette.border,
                borderWidth: StyleSheet.hairlineWidth,
                padding: spacing.md,
                marginTop: spacing.md,
              },
              shadow.sm,
            ]}
          >
            <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "800" }}>
              Recovery trajectory
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
                      borderRadius: radii.lg,
                      borderColor: palette.border,
                      borderWidth: StyleSheet.hairlineWidth,
                      padding: spacing.md,
                    },
                    shadow.sm,
                  ]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="play-circle" size={22} color={palette.primary} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ color: palette.textPrimary, fontWeight: "700", fontSize: 14 }}>
                        {ex.name}
                      </Text>
                      <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 2 }}>
                        {s.date} · ROM {s.romMin}°–{s.romMax}°
                      </Text>
                    </View>
                    <Text style={{ color: palette.textPrimary, fontSize: 16, fontWeight: "800" }}>
                      {s.score}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: spacing.lg,
          paddingBottom: insets.bottom + 16,
          backgroundColor: palette.background + "EE",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderColor: palette.divider,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Button label="Message" variant="secondary" iconLeft="chatbubble-outline" style={{ flex: 1 }} />
        <Button
          testID="assign-exercise-cta"
          label="Assign exercise"
          iconRight="add"
          style={{ flex: 1.4 }}
          onPress={() => router.push({ pathname: "/(doctor)/assign-exercise", params: { id: patient.id } })}
        />
      </View>
    </View>
  );
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { palette } = useTheme();
  return (
    <View style={{ flex: 1, padding: 10, borderRadius: 12, backgroundColor: palette.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border }}>
      <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1 }}>
        {label}
      </Text>
      <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "800", marginTop: 4 }}>
        {value}
      </Text>
    </View>
  );
};
