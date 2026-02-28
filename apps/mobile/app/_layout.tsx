import { Stack } from "expo-router";
import { ThemeProvider } from "../src/ui/themeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" options={{ animation: "fade" }} />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(auth)/onboarding" />
        <Stack.Screen name="(app)" options={{ animation: "none" }} />
      </Stack>
    </ThemeProvider>
  );
}
