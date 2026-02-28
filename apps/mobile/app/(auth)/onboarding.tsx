import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { patientFlow } from "../../src/runtime/client";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { colors, moderateScale, radius, responsiveFont, spacing } from "../../src/ui/theme";

type GenderOption = "male" | "female" | "other";

interface LimbOption {
  value: string;
  label: string;
}

interface GenderSelectorOption {
  value: GenderOption;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

const GENDER_OPTIONS: GenderSelectorOption[] = [
  { value: "male", label: "Male", icon: "user" },
  { value: "female", label: "Female", icon: "user-check" },
  { value: "other", label: "Other", icon: "users" }
];

const LIMB_OPTIONS: LimbOption[] = [
  { value: "right_shoulder", label: "Right Shoulder" },
  { value: "left_shoulder", label: "Left Shoulder" },
  { value: "right_elbow", label: "Right Elbow" },
  { value: "left_elbow", label: "Left Elbow" },
  { value: "right_wrist", label: "Right Wrist" },
  { value: "left_wrist", label: "Left Wrist" },
  { value: "right_hip", label: "Right Hip" },
  { value: "left_hip", label: "Left Hip" },
  { value: "right_knee", label: "Right Knee" },
  { value: "left_knee", label: "Left Knee" },
  { value: "right_ankle", label: "Right Ankle" },
  { value: "left_ankle", label: "Left Ankle" }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(27);
  const [gender, setGender] = useState<GenderOption | "">("");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [affectedLimb, setAffectedLimb] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedGender = useMemo(
    () => GENDER_OPTIONS.find((option) => option.value === gender) ?? null,
    [gender]
  );

  const selectedLimb = useMemo(
    () => LIMB_OPTIONS.find((option) => option.value === affectedLimb) ?? null,
    [affectedLimb]
  );

  const ageIsValid = useMemo(() => Number.isInteger(age) && age > 0, [age]);

  const stepIsValid = useMemo(() => {
    if (step === 1) return ageIsValid;
    if (step === 2) return gender.length > 0;
    return affectedLimb.length > 0;
  }, [step, ageIsValid, gender, affectedLimb]);

  const progressValue = useMemo(() => `${step} / 3`, [step]);

  async function onFinish() {
    if (!ageIsValid || !gender || !affectedLimb) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await patientFlow.updateProfile({
        age,
        gender,
        affected_limb: affectedLimb
      });
      router.replace("/(app)/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save onboarding details");
    } finally {
      setLoading(false);
    }
  }

  function onNext() {
    if (!stepIsValid) {
      setError("Please complete this step before continuing.");
      return;
    }

    setError(null);
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    onFinish().catch(() => {
      // Error is handled in onFinish.
    });
  }

  function onBack() {
    if (step === 1) {
      router.back();
      return;
    }
    setError(null);
    setStep((current) => current - 1);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" backgroundColor={colors.authBackground} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            title="Set Up Your Profile"
            subtitle="Step-by-step onboarding before your first assessment"
          />

          <AppCard>
            <View style={styles.formContent}>
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>Step {progressValue}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
                </View>
              </View>

              {step === 1 ? (
                <View style={styles.stepSection}>
                  <Text style={styles.stepTitle}>What is your age?</Text>
                  <Text style={styles.stepHint}>Used to personalize movement scoring.</Text>
                  <View style={styles.ageValueWrap}>
                    <Text style={styles.ageValueText}>{age} years</Text>
                  </View>
                  <Slider
                    value={age}
                    minimumValue={10}
                    maximumValue={90}
                    step={1}
                    minimumTrackTintColor={colors.accent}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.accent}
                    onValueChange={(value) => setAge(Math.round(value))}
                  />
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeText}>10</Text>
                    <Text style={styles.rangeText}>90</Text>
                  </View>
                </View>
              ) : null}

              {step === 2 ? (
                <View style={styles.stepSection}>
                  <Text style={styles.stepTitle}>Select your gender</Text>
                  <Text style={styles.stepHint}>This helps us calibrate baseline ranges.</Text>
                  <Pressable
                    style={styles.dropdownTrigger}
                    onPress={() => setGenderDropdownOpen((current) => !current)}
                  >
                    <View style={styles.dropdownValueRow}>
                      {selectedGender ? (
                        <>
                          <Feather name={selectedGender.icon} size={16} color={colors.accent} />
                          <Text style={styles.dropdownValueText}>{selectedGender.label}</Text>
                        </>
                      ) : (
                        <Text style={styles.dropdownPlaceholder}>Select gender</Text>
                      )}
                    </View>
                    <Feather name={genderDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
                  </Pressable>

                  {genderDropdownOpen ? (
                    <View style={styles.dropdownMenu}>
                      {GENDER_OPTIONS.map((option) => (
                        <Pressable
                          key={option.value}
                          style={[styles.dropdownItem, gender === option.value && styles.dropdownItemActive]}
                          onPress={() => {
                            setGender(option.value);
                            setGenderDropdownOpen(false);
                          }}
                        >
                          <View style={styles.dropdownValueRow}>
                            <Feather name={option.icon} size={15} color={colors.accent} />
                            <Text style={styles.dropdownItemText}>{option.label}</Text>
                          </View>
                          {gender === option.value ? (
                            <Feather name="check" size={15} color={colors.accent} />
                          ) : null}
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {step === 3 ? (
                <View style={styles.stepSection}>
                  <Text style={styles.stepTitle}>Choose affected limb</Text>
                  <Text style={styles.stepHint}>Select the primary joint/limb to assess.</Text>

                  <Pressable
                    style={styles.dropdownTrigger}
                    onPress={() => setDropdownOpen((current) => !current)}
                  >
                    <View style={styles.dropdownValueRow}>
                      {selectedLimb ? (
                        <Text style={styles.dropdownValueText}>{selectedLimb.label}</Text>
                      ) : (
                        <Text style={styles.dropdownPlaceholder}>Select affected limb</Text>
                      )}
                    </View>
                    <Feather name={dropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
                  </Pressable>

                  {dropdownOpen ? (
                    <View style={styles.dropdownMenu}>
                      {LIMB_OPTIONS.map((option) => (
                        <Pressable
                          key={option.value}
                          style={[styles.dropdownItem, affectedLimb === option.value && styles.dropdownItemActive]}
                          onPress={() => {
                            setAffectedLimb(option.value);
                            setDropdownOpen(false);
                          }}
                        >
                          <View style={styles.dropdownValueRow}>
                            <Text style={styles.dropdownItemText}>{option.label}</Text>
                          </View>
                          {affectedLimb === option.value ? (
                            <Feather name="check" size={15} color={colors.accent} />
                          ) : null}
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              ) : null}

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.actionsRow}>
                <View style={styles.actionCell}>
                  <AppButton label={step === 1 ? "Back" : "Previous"} onPress={onBack} variant="secondary" />
                </View>
                <View style={styles.actionCell}>
                  <AppButton
                    label={step === 3 ? "Finish" : "Next"}
                    onPress={onNext}
                    loading={loading}
                    disabled={loading}
                  />
                </View>
              </View>
            </View>
          </AppCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.authBackground
  },
  keyboardContainer: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: "center",
    gap: spacing.lg
  },
  formContent: {
    gap: spacing.md
  },
  progressRow: {
    gap: spacing.xs
  },
  progressText: {
    color: colors.textMuted,
    fontSize: responsiveFont(12),
    fontWeight: "600"
  },
  progressTrack: {
    height: moderateScale(6),
    borderRadius: radius.pill,
    backgroundColor: colors.divider,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent
  },
  stepSection: {
    gap: spacing.sm
  },
  stepTitle: {
    color: colors.text,
    fontSize: responsiveFont(18),
    fontWeight: "700"
  },
  stepHint: {
    color: colors.textMuted,
    fontSize: responsiveFont(13)
  },
  ageValueWrap: {
    alignSelf: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  ageValueText: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: responsiveFont(16)
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  rangeText: {
    color: colors.textMuted,
    fontSize: responsiveFont(12)
  },
  dropdownTrigger: {
    minHeight: moderateScale(52),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dropdownValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  dropdownPlaceholder: {
    color: colors.textMuted,
    fontSize: responsiveFont(15)
  },
  dropdownValueText: {
    color: colors.text,
    fontSize: responsiveFont(15),
    fontWeight: "600"
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    overflow: "hidden"
  },
  dropdownItem: {
    minHeight: moderateScale(44),
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  dropdownItemActive: {
    backgroundColor: colors.accentSoft
  },
  dropdownItemText: {
    color: colors.text,
    fontSize: responsiveFont(14),
    fontWeight: "500"
  },
  error: {
    color: colors.danger,
    fontSize: responsiveFont(14)
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  actionCell: {
    flex: 1
  }
});
