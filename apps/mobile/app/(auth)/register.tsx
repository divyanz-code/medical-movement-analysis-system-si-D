import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";

import { Button } from "@/src/components/Button";
import { ChipRow } from "@/src/components/ChipRow";
import { FormField } from "@/src/components/FormField";
import { useTheme } from "@/src/theme/ThemeProvider";
import { storage } from "@/src/utils/storage";
import { patientFlow } from "@/src/runtime/client";

type Role = "patient" | "doctor" | "admin";

export default function Register() {
  const router = useRouter();
  const { palette, spacing } = useTheme();
  const params = useLocalSearchParams<{ role?: string }>();
  const role: Role = (params.role as Role) || "patient";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [bodyPart, setBodyPart] = useState("knee");
  const [specialization, setSpecialization] = useState("ortho");
  const [hospital, setHospital] = useState("");
  const [license, setLicense] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Name, email, and password are required.");
      return;
    }
    setLoading(true);
    try {
      await patientFlow.registerAndLogin({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (role === "patient") {
        const ageNum = parseInt(age, 10);
        await patientFlow.updateProfile({
          age: isNaN(ageNum) ? 0 : ageNum,
          gender: gender,
          affected_limb: bodyPart,
        });
      }

      await storage.setItem("medmove.role", role);
      await storage.setItem("medmove.email", email.trim().toLowerCase());
      setLoading(false);
      if (role === "patient") router.replace("/(patient)/(tabs)");
      else if (role === "doctor") router.replace("/(doctor)/(tabs)");
      else router.replace("/(admin)/(tabs)");
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Registration Failed", err.message || "An error occurred");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            testID="back-button"
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: palette.surface, borderColor: palette.border }]}
          >
            <Ionicons name="chevron-back" size={22} color={palette.textPrimary} />
          </Pressable>

          <Text
            style={{
              color: palette.textPrimary,
              fontSize: 28,
              fontWeight: "800",
              marginTop: 24,
              letterSpacing: -0.5,
            }}
          >
            Create {role} account
          </Text>
          <Text style={{ color: palette.textSecondary, fontSize: 14, marginTop: 6 }}>
            Just a few details to personalise your rehab journey.
          </Text>

          <View style={{ marginTop: 28 }}>
            <FormField
              testID="input-name"
              label="Full Name"
              icon="person-outline"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <FormField
              testID="input-email"
              label="Email"
              icon="mail-outline"
              placeholder="you@medmove.ai"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <FormField
              testID="input-phone"
              label="Phone"
              icon="call-outline"
              placeholder="+91 ..."
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <FormField
              testID="input-password"
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secure
            />

            {role === "patient" ? (
              <>
                <FormField
                  testID="input-age"
                  label="Age"
                  icon="calendar-outline"
                  placeholder="32"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                />
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={{ marginHorizontal: -20, marginBottom: 10 }}>
                  <ChipRow
                    items={[
                      { id: "male", label: "Male" },
                      { id: "female", label: "Female" },
                      { id: "other", label: "Other" },
                    ]}
                    selected={gender}
                    onSelect={setGender}
                  />
                </View>
                <Text style={styles.fieldLabel}>Affected body part</Text>
                <View style={{ marginHorizontal: -20, marginBottom: 10 }}>
                  <ChipRow
                    items={[
                      { id: "shoulder", label: "Shoulder" },
                      { id: "elbow", label: "Elbow" },
                      { id: "knee", label: "Knee" },
                      { id: "hip", label: "Hip" },
                      { id: "spine", label: "Spine" },
                      { id: "face", label: "Face" },
                    ]}
                    selected={bodyPart}
                    onSelect={setBodyPart}
                  />
                </View>
              </>
            ) : null}

            {role === "doctor" ? (
              <>
                <Text style={styles.fieldLabel}>Specialization</Text>
                <View style={{ marginHorizontal: -20, marginBottom: 10 }}>
                  <ChipRow
                    items={[
                      { id: "ortho", label: "Orthopedic" },
                      { id: "physio", label: "Physiotherapy" },
                      { id: "neuro", label: "Neuro Rehab" },
                      { id: "sports", label: "Sports Medicine" },
                    ]}
                    selected={specialization}
                    onSelect={setSpecialization}
                  />
                </View>
                <FormField
                  testID="input-hospital"
                  label="Hospital / Clinic"
                  icon="business-outline"
                  placeholder="City General Hospital"
                  value={hospital}
                  onChangeText={setHospital}
                  autoCapitalize="words"
                />
                <FormField
                  testID="input-license"
                  label="License Number"
                  icon="ribbon-outline"
                  placeholder="MCI-XXXXXXX"
                  value={license}
                  onChangeText={setLicense}
                />
              </>
            ) : null}
          </View>

          <View style={{ marginTop: 18 }}>
            <Button
              testID="register-submit-button"
              label="Create account"
              iconRight="arrow-forward"
              fullWidth
              loading={loading}
              onPress={onSubmit}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 22,
            }}
          >
            <Text style={{ color: palette.textSecondary, fontSize: 13 }}>Have an account? </Text>
            <Pressable testID="navigate-login" onPress={() => router.back()}>
              <Text style={{ color: palette.primary, fontSize: 13, fontWeight: "700" }}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  fieldLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
});
