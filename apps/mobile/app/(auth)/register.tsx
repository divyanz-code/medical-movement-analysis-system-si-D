import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Button, SafeAreaView, Text, TextInput } from "react-native";

import { patientFlow } from "../../src/runtime/client";

export default function RegisterScreen() {
  const router = useRouter();
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
      router.replace("/(app)/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, gap: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Create Account</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full name"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 }}
      />
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
      <Button
        title={loading ? "Creating..." : "Register"}
        onPress={onRegister}
        disabled={loading}
      />
      <Link href="/(auth)/login">Already have an account? Login</Link>
    </SafeAreaView>
  );
}
