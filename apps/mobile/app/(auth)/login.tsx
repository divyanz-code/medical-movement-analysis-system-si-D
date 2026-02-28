import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";

import { patientFlow } from "../../src/runtime/client";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("shaurya@example.com");
  const [password, setPassword] = useState("StrongP@ssw0rd!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setLoading(true);
    setError(null);
    try {
      await patientFlow.login(email, password);
      router.replace("/(app)/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, gap: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Patient Login</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 }}
      />
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 }}
      />
      {error ? <Text style={{ color: "#b00020" }}>{error}</Text> : null}
      <Button title={loading ? "Signing in..." : "Login"} onPress={onLogin} disabled={loading} />
      <View style={{ marginTop: 8 }}>
        <Link href="/(auth)/register">Need an account? Register</Link>
      </View>
    </SafeAreaView>
  );
}
