import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { patientFlow } from "../../src/runtime/client";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { AppField } from "../../src/ui/components/AppField";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { responsiveFont, spacing, type ThemeColors } from "../../src/ui/theme";
import { useAppTheme } from "../../src/ui/themeProvider";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, mode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [name, setName] = useState("Shaurya Bansal");
  const [email, setEmail] = useState("shaurya@example.com");
  const [password, setPassword] = useState("StrongP@ssw0rd!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onRegister() {
    setLoading(true);
    setError(null);
    try {
      await patientFlow.registerAndLogin({ name, email, password });
      router.replace("/(auth)/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        style={mode === "dark" ? "light" : "dark"}
        backgroundColor={colors.authBackground}
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ScreenHeader
            onBack={() => router.back()}
            title="Create Account"
            subtitle="Start tracking your movement health"
          />

          <AppCard>
            <View style={styles.formContent}>
              <AppField
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
              />
              <AppField
                label="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
              />
              <AppField
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                helperText="Minimum 8 characters"
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <AppButton label="Create Account" onPress={onRegister} loading={loading} />
            </View>
          </AppCard>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.footerLink}>
              Sign In
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.authBackground
    },
    keyboardContainer: {
      flex: 1
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      justifyContent: "center",
      gap: spacing.lg
    },
    formContent: {
      gap: spacing.md
    },
    error: {
      color: colors.danger,
      fontSize: responsiveFont(14)
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center"
    },
    footerText: {
      color: colors.textMuted
    },
    footerLink: {
      color: colors.accent,
      fontWeight: "700"
    }
  });
}
