import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { patientFlow, tokenStore } from "../src/runtime/client";
import { appLaunchStore } from "../src/storage/appLaunchStore";
import { profileNeedsOnboarding } from "../src/types/domain";
import { colors } from "../src/ui/theme";

export default function IndexScreen() {
  const router = useRouter();

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

const styles = StyleSheet.create({
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
