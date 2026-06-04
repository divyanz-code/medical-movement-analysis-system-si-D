import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { tokenStore } from "../src/runtime/client";
import { appLaunchStore } from "../src/storage/appLaunchStore";
import { AppButton } from "../src/ui/components/AppButton";
import { moderateScale, radius, responsiveFont, spacing, type ThemeColors } from "../src/ui/theme";
import { useAppTheme } from "../src/ui/themeProvider";

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);

  async function continueToApp() {
    setLoading(true);
    try {
      await appLaunchStore.setHasSeenFirstLaunch();
      const token = await tokenStore.getToken();
      router.replace(token ? "/(app)/home" : "/(auth)/login");
    } catch {
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" backgroundColor={colors.primary} />

      <View style={styles.backGlowOne} />
      <View style={styles.backGlowTwo} />

      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Feather name="activity" size={moderateScale(34)} color={colors.accent} />
        </View>

        <Text style={styles.title}>Medical Movement Analysis</Text>
        <Text style={styles.subtitle}>
          Record guided assessments and track recovery with clear, secure insights.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Feather name="video" size={15} color={colors.whiteSoft} />
            <Text style={styles.featureText}>Capture movement videos</Text>
          </View>
          <View style={styles.featureRow}>
            <Feather name="bar-chart-2" size={15} color={colors.whiteSoft} />
            <Text style={styles.featureText}>Receive AI-based analysis</Text>
          </View>
          <View style={styles.featureRow}>
            <Feather name="shield" size={15} color={colors.whiteSoft} />
            <Text style={styles.featureText}>Private and secure by default</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton label="Get Started" onPress={continueToApp} disabled={loading} />
        {loading ? <ActivityIndicator style={styles.loader} color={colors.white} /> : null}
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.primary
    },
    backGlowOne: {
      position: "absolute",
      top: moderateScale(-70),
      right: moderateScale(-80),
      width: moderateScale(240),
      height: moderateScale(240),
      borderRadius: radius.pill,
      backgroundColor: "rgba(255,255,255,0.08)"
    },
    backGlowTwo: {
      position: "absolute",
      bottom: moderateScale(80),
      left: moderateScale(-60),
      width: moderateScale(200),
      height: moderateScale(200),
      borderRadius: radius.pill,
      backgroundColor: "rgba(255,255,255,0.06)"
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      justifyContent: "center",
      gap: spacing.md
    },
    logoWrap: {
      width: moderateScale(78),
      height: moderateScale(78),
      borderRadius: radius.lg,
      backgroundColor: colors.whiteSoft,
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      color: colors.white,
      fontSize: responsiveFont(30),
      fontWeight: "800"
    },
    subtitle: {
      color: colors.whiteMuted,
      fontSize: responsiveFont(14),
      lineHeight: moderateScale(22),
      maxWidth: moderateScale(320)
    },
    features: {
      marginTop: spacing.sm,
      gap: spacing.sm
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    },
    featureText: {
      color: colors.whiteSoft,
      fontSize: responsiveFont(14),
      fontWeight: "500"
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl
    },
    loader: {
      marginTop: spacing.sm
    }
  });
}
