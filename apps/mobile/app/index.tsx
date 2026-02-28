import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { patientFlow, tokenStore } from "../src/runtime/client";
import { appLaunchStore } from "../src/storage/appLaunchStore";
import { profileNeedsOnboarding } from "../src/types/domain";
import { type ThemeColors } from "../src/ui/theme";
import { useAppTheme } from "../src/ui/themeProvider";

export default function IndexScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    async function bootstrap() {
      const hasSeenFirstLaunch = await appLaunchStore.getHasSeenFirstLaunch();
      if (!hasSeenFirstLaunch) {
        router.replace("/splash");
        return;
      }

      const token = await tokenStore.getToken();
      if (token) {
        const profile = await patientFlow.getProfile();
        router.replace(profileNeedsOnboarding(profile) ? "/(auth)/onboarding" : "/(app)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }

    bootstrap().catch(() => router.replace("/(auth)/login"));
  }, [router]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.text}>Loading app...</Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center"
    },
    content: {
      alignItems: "center",
      gap: 12
    },
    text: {
      color: colors.textMuted
    }
  });
}
