import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ title: "Login" }} />
      <Stack.Screen name="(auth)/register" options={{ title: "Register" }} />
      <Stack.Screen name="(app)/profile" options={{ title: "Profile" }} />
      <Stack.Screen name="(app)/record" options={{ title: "Record" }} />
      <Stack.Screen name="(app)/results" options={{ title: "Analysis Result" }} />
      <Stack.Screen name="(app)/history" options={{ title: "History" }} />
    </Stack>
  );
}
