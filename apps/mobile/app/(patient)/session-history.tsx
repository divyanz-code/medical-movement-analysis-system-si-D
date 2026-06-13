import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";
import { patientFlow } from "@/src/runtime/client";
import type { AnalysisItem } from "@/src/types/contracts";

export default function SessionHistory() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [sessions, setSessions] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await patientFlow.getHistory();
        setSessions(history || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader
        title="Session History"
        subtitle={loading ? "Loading sessions..." : `${sessions.length} sessions logged`}
        showBack
        onBack={() => router.back()}
      />
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={palette.primary} />
        </View>
      ) : sessions.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Ionicons name="videocam-off-outline" size={48} color={palette.textSecondary} style={{ marginBottom: 12 }} />
          <Text style={{ color: palette.textPrimary, fontSize: 16, fontWeight: "700" }}>
            No sessions recorded yet
          </Text>
          <Text style={{ color: palette.textSecondary, fontSize: 13, marginTop: 6, textAlign: "center", lineHeight: 20 }}>
            Perform your first guided assessment to view your AI analysis history here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + 40,
            gap: 10,
          }}
        >
          {sessions.map((s) => {
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
                testID={`session-${s.video_id}`}
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
                      name={isFacial ? "happy-outline" : "body-outline"}
                      size={20}
                      color={palette.primary}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: palette.textPrimary, fontSize: 15, fontWeight: "700" }}>
                      {isFacial ? "Facial Expression Analysis" : "Movement Joint Analysis"}
                    </Text>
                    <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                      {dateStr} · ID: #{s.video_id}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor:
                        scorePercent >= 85 ? palette.success + "22" : scorePercent >= 75 ? palette.warning + "22" : palette.danger + "22",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: scorePercent >= 85 ? palette.success : scorePercent >= 75 ? palette.warning : palette.danger,
                        fontSize: 16,
                        fontWeight: "800",
                      }}
                    >
                      {scorePercent || "—"}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>
                  <Stat label="ROM Min" value={s.min_angle !== null ? `${Math.round(s.min_angle)}°` : "—"} />
                  <Stat label="ROM Max" value={s.max_angle !== null ? `${Math.round(s.max_angle)}°` : "—"} />
                  <Stat label="Status" value={s.status} />
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { palette } = useTheme();
  return (
    <View style={{ flex: 1, padding: 10, borderRadius: 10, backgroundColor: palette.surfaceAlt }}>
      <Text style={{ color: palette.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 1 }}>
        {label}
      </Text>
      <Text style={{ color: palette.textPrimary, fontSize: 13, fontWeight: "800", marginTop: 4 }}>
        {value}
      </Text>
    </View>
  );
};
