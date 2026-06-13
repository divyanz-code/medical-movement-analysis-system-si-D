import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useTheme } from "@/src/theme/ThemeProvider";

const FAQS = [
  {
    q: "How does AI analyse my movement?",
    a: "Our MediaPipe-based engine tracks 33 body landmarks and 468 facial landmarks in real time, calculating joint angles, symmetry and trajectory compliance to score every rep.",
  },
  {
    q: "Is my video data private?",
    a: "Yes. Video is processed in the secure rehab cloud, encrypted at rest, and accessible only to you and your assigned doctor.",
  },
  {
    q: "What if I miss an exercise?",
    a: "Missed exercises are flagged in your timeline. Your doctor sees compliance trends and can adjust your plan.",
  },
  {
    q: "Can my doctor see my live session?",
    a: "Doctors review session replays with skeleton overlays and angle data, not your live camera feed.",
  },
];

export default function Help() {
  const { palette, radii, spacing, shadow } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Help & Support" subtitle="We're here to help" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: insets.bottom + 40,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Contact icon="chatbubble-ellipses" label="Live chat" sub="9 AM – 9 PM" />
          <Contact icon="mail" label="Email us" sub="support@medmove.ai" />
        </View>

        <Text style={{ color: palette.textPrimary, fontSize: 17, fontWeight: "800", marginTop: spacing.lg, marginBottom: 10 }}>
          Frequently asked
        </Text>
        <View style={{ gap: 10 }}>
          {FAQS.map((f, i) => (
            <Pressable
              key={i}
              testID={`faq-${i}`}
              onPress={() => setOpen(open === i ? null : i)}
            >
              <View
                style={[
                  {
                    backgroundColor: palette.surface,
                    borderRadius: radii.md,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: palette.border,
                    padding: spacing.md,
                  },
                  shadow.sm,
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700", flex: 1 }}>
                    {f.q}
                  </Text>
                  <Ionicons
                    name={open === i ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={palette.textSecondary}
                  />
                </View>
                {open === i ? (
                  <Text style={{ color: palette.textSecondary, fontSize: 13, marginTop: 10, lineHeight: 20 }}>
                    {f.a}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const Contact: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; sub: string }> = ({ icon, label, sub }) => {
  const { palette, radii } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.surface,
        borderRadius: radii.md,
        padding: 14,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.border,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: palette.primaryMuted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={palette.primary} />
      </View>
      <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "800", marginTop: 10 }}>{label}</Text>
      <Text style={{ color: palette.textSecondary, fontSize: 11, marginTop: 2 }}>{sub}</Text>
    </View>
  );
};
