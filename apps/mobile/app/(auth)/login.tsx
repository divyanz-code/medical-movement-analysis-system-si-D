import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
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
import { profileNeedsOnboarding } from "../../src/types/domain";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { AppField } from "../../src/ui/components/AppField";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { responsiveFont, spacing, type ThemeColors } from "../../src/ui/theme";
import { useAppTheme } from "../../src/ui/themeProvider";

export default function LoginScreen() {
  const router = useRouter();
  const { colors, mode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState("shaurya@example.com");
  const [password, setPassword] = useState("StrongP@ssw0rd!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setLoading(true);
    setError(null);
    try {
      await patientFlow.login(email, password);
      const profile = await patientFlow.getProfile();
      router.replace(profileNeedsOnboarding(profile) ? "/(auth)/onboarding" : "/(app)/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function onBiometricLogin() {
    Alert.alert("Biometric Sign-In", "Authenticate with Face ID / Fingerprint?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Authenticate",
        onPress: () => {
          onLogin().catch(() => {
            // Login errors are already handled in onLogin.
          });
        }
      }
    ]);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} backgroundColor={colors.authBackground} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            title="Welcome Back"
            subtitle="Sign in to continue your movement journey"
          />

          <AppCard>
            <View style={styles.formContent}>
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
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <AppButton label="Sign In" onPress={onLogin} loading={loading} />
              <AppButton
                label="Face ID / Fingerprint"
                onPress={onBiometricLogin}
                variant="secondary"
              />
            </View>
          </AppCard>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Link href="/(auth)/register" style={styles.footerLink}>
              Sign Up
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
