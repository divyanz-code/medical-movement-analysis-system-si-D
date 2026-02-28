import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";

import { tokenStore } from "../src/runtime/client";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    async function bootstrap() {
      const token = await tokenStore.getToken();
      if (token) {
        router.replace("/(app)/profile");
      } else {
        router.replace("/(auth)/login");
      }
    }

    bootstrap().catch(() => router.replace("/(auth)/login"));
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ gap: 12, alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading Medical Movement Analysis...</Text>
      </View>
    </SafeAreaView>
  );
}
