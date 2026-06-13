import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { FormField } from "@/src/components/FormField";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function ForgotPassword() {
  const router = useRouter();
  const { palette, spacing } = useTheme();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
          <Pressable
            testID="back-button"
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: palette.surface, borderColor: palette.border }]}
          >
            <Ionicons name="chevron-back" size={22} color={palette.textPrimary} />
          </Pressable>

          <View style={{ marginTop: 32 }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: palette.primaryMuted,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="key" size={22} color={palette.primary} />
            </View>
            <Text style={styles.title(palette.textPrimary)}>Forgot password?</Text>
            <Text style={{ color: palette.textSecondary, fontSize: 14, marginTop: 6 }}>
              Enter the email associated with your account. We will send you a verification link.
            </Text>
          </View>

          <View style={{ marginTop: 28 }}>
            <FormField
              testID="input-reset-email"
              label="Email"
              icon="mail-outline"
              placeholder="you@medmove.ai"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {sent ? (
              <View
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: palette.primaryMuted,
                  marginBottom: 14,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color={palette.primary} />
                <Text style={{ color: palette.primary, fontSize: 13, fontWeight: "600", marginLeft: 8 }}>
                  Reset link sent. Check your inbox.
                </Text>
              </View>
            ) : null}
            <Button
              testID="send-reset-link"
              label={sent ? "Resend link" : "Send reset link"}
              fullWidth
              iconRight="arrow-forward"
              onPress={() => setSent(true)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: (c: string) => ({
    color: c,
    fontSize: 28,
    fontWeight: "800" as const,
    marginTop: 20,
    letterSpacing: -0.5,
  }),
};
