import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LineChart } from "@/src/components/LineChart";
import { MetricCard } from "@/src/components/MetricCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import {
  ADMIN_USERS,
  PROGRESS_WEEKLY,
  SYSTEM_METRICS,
} from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function AdminOverview() {
  const { palette, radii, spacing, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const doctors = ADMIN_USERS.filter((u) => u.role === "Doctor").length;
  const patients = ADMIN_USERS.filter((u) => u.role === "Patient").length;

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="System Overview" subtitle="MEDMOVE AI · Production" showMenu />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[palette.accent, palette.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: radii.lg, padding: spacing.md, ...shadow.md }}
        >
          <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }}>
            UPTIME · 30 DAYS
          </Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "800", marginTop: 4, letterSpacing: -0.5 }}>
            99.98%
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 4 }}>
            All services healthy · Last incident 11 days ago
          </Text>
        </LinearGradient>

        <View style={{ flexDirection: "row", gap: 10, marginTop: spacing.md }}>
          <MetricCard label="Active users" value={`${ADMIN_USERS.length}`} icon="people" accent={palette.primary} delta="+4 this wk" positive />
          <MetricCard label="Doctors" value={`${doctors}`} icon="medkit" accent={palette.secondary} delta={`${doctors} live`} positive />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <MetricCard label="Patients" value={`${patients}`} icon="body" accent={palette.accent} delta="+12 this wk" positive />
          <MetricCard label="Sessions / day" value="216" icon="pulse" accent={palette.warning} delta="+18%" positive />
        </View>

        <View
          style={[
            {
              backgroundColor: palette.surface,
              borderRadius: radii.lg,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: palette.border,
              padding: spacing.md,
              marginTop: spacing.md,
            },
            shadow.sm,
          ]}
        >
          <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "800" }}>
            Engagement trend
          </Text>
          <View style={{ marginTop: 10 }}>
            <LineChart
              labels={PROGRESS_WEEKLY.map((p) => p.label)}
              series={[
                { label: "Sessions", color: palette.primary, values: PROGRESS_WEEKLY.map((p) => p.rom + 8) },
                { label: "Adherence", color: palette.secondary, values: PROGRESS_WEEKLY.map((p) => p.compliance) },
              ]}
            />
          </View>
        </View>

        <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginTop: spacing.lg, marginBottom: 10 }}>
          System health
        </Text>
        <View style={{ gap: 10 }}>
          {SYSTEM_METRICS.map((m) => {
            const color = m.status === "healthy" ? palette.success : m.status === "warning" ? palette.warning : palette.danger;
            return (
              <View
                key={m.label}
                testID={`system-${m.label}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: palette.surface,
                  borderRadius: radii.md,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: palette.border,
                  padding: 14,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: color + "22",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="pulse" size={18} color={color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: palette.textPrimary, fontSize: 13, fontWeight: "700" }}>
                    {m.label}
                  </Text>
                </View>
                <Text style={{ color, fontSize: 14, fontWeight: "800" }}>{m.value}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
