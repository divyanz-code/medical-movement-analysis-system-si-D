import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { patientFlow } from "../../src/runtime/client";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { AppField } from "../../src/ui/components/AppField";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { colors, moderateScale, radius, responsiveFont, spacing } from "../../src/ui/theme";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileScreen() {
  const [name, setName] = useState("Patient");
  const [email, setEmail] = useState("-");
  const [age, setAge] = useState("27");
  const [gender, setGender] = useState("male");
  const [affectedLimb, setAffectedLimb] = useState("right_knee");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    patientFlow
      .getProfile()
      .then((profile) => {
        setName(profile.name);
        setEmail(profile.email);
        if (profile.age !== null) setAge(String(profile.age));
        if (profile.gender !== null) setGender(profile.gender);
        if (profile.affected_limb !== null) setAffectedLimb(profile.affected_limb);
      })
      .catch(() => {
        Alert.alert("Profile", "Could not load profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function onSave() {
    try {
      await patientFlow.updateProfile({
        age: Number(age),
        gender,
        affected_limb: affectedLimb
      });
      setIsEditing(false);
      Alert.alert("Profile Updated", "Your profile was saved successfully.");
    } catch (error) {
      Alert.alert("Update Failed", error instanceof Error ? error.message : "Profile update failed");
    }
  }

  function onStartEdit() {
    setIsEditing(true);
  }

  function onCancelEdit() {
    setIsEditing(false);
  }

  const avatarText = useMemo(() => initials(name), [name]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" backgroundColor={colors.surface} />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Profile" subtitle="Your account and clinical details" />

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarText}</Text>
            </View>
            <View style={styles.identityText}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
          <View style={styles.heroMetaRow}>
            <View style={styles.badge}>
              <Feather name="shield" size={13} color={colors.accent} />
              <Text style={styles.badgeText}>Secure Account</Text>
            </View>
            <View style={styles.badge}>
              <Feather name="user" size={13} color={colors.accent} />
              <Text style={styles.badgeText}>Profile Type: Patient</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <AppCard>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              {!isEditing ? (
                <Pressable style={styles.inlineEditButton} onPress={onStartEdit}>
                  <Feather name="edit-2" size={14} color={colors.accent} />
                  <Text style={styles.inlineEditText}>Edit</Text>
                </Pressable>
              ) : null}
            </View>
            {loading ? <ActivityIndicator color={colors.accent} /> : null}
            <View style={styles.formFields}>
              <AppField
                label="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                placeholder="Age"
                editable={isEditing}
              />
              <AppField
                label="Gender"
                value={gender}
                onChangeText={setGender}
                placeholder="Gender"
                editable={isEditing}
              />
              <AppField
                label="Affected Limb"
                value={affectedLimb}
                onChangeText={setAffectedLimb}
                placeholder="Affected limb"
                editable={isEditing}
              />
              {isEditing ? (
                <View style={styles.actionsRow}>
                  <View style={styles.actionCell}>
                    <AppButton label="Cancel" onPress={onCancelEdit} variant="secondary" />
                  </View>
                  <View style={styles.actionCell}>
                    <AppButton label="Save Profile" onPress={onSave} />
                  </View>
                </View>
              ) : null}
            </View>
          </AppCard>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 96,
    gap: spacing.md
  },
  heroCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  avatar: {
    width: moderateScale(74),
    height: moderateScale(74),
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.accent,
    fontSize: responsiveFont(24),
    fontWeight: "700"
  },
  identityText: {
    flex: 1,
    gap: spacing.xs
  },
  email: {
    color: colors.textMuted,
    fontSize: responsiveFont(13)
  },
  name: {
    color: colors.text,
    fontSize: responsiveFont(24),
    fontWeight: "700"
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: moderateScale(6)
  },
  badgeText: {
    color: colors.accent,
    fontSize: responsiveFont(12),
    fontWeight: "600"
  },
  sectionWrap: {
    borderRadius: radius.lg
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: responsiveFont(17)
  },
  inlineEditButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  inlineEditText: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: responsiveFont(12)
  },
  formFields: {
    marginTop: spacing.md,
    gap: spacing.md
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs
  },
  actionCell: {
    flex: 1
  },
  
});
