import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";

import { patientFlow } from "../../src/runtime/client.js";

export default function ProfileScreen() {
  const router = useRouter();
  const [age, setAge] = useState("27");
  const [gender, setGender] = useState("male");
  const [affectedLimb, setAffectedLimb] = useState("right_knee");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    patientFlow
      .getProfile()
      .then((profile) => {
        if (profile.age !== null) setAge(String(profile.age));
        if (profile.gender !== null) setGender(profile.gender);
        if (profile.affected_limb !== null) setAffectedLimb(profile.affected_limb);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Could not load profile";
        setStatus(message);
      });
  }, []);

  async function onSave() {
    try {
      await patientFlow.updateProfile({
        age: Number(age),
        gender,
        affected_limb: affectedLimb
      });
      setStatus("Profile updated");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Profile update failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Profile</Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        placeholder="Age"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 }}
      />
      <TextInput
        value={gender}
        onChangeText={setGender}
        placeholder="Gender"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 }}
      />
      <TextInput
        value={affectedLimb}
        onChangeText={setAffectedLimb}
        placeholder="Affected limb"
        style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 }}
      />
      <Button title="Save Profile" onPress={onSave} />
      <View style={{ gap: 8 }}>
        <Button title="Record Movement Video" onPress={() => router.push("/(app)/record")} />
        <Button title="View History" onPress={() => router.push("/(app)/history")} />
      </View>
      {status ? <Text>{status}</Text> : null}
    </SafeAreaView>
  );
}
