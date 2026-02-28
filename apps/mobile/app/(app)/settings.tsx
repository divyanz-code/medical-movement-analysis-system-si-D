import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { patientFlow } from "../../src/runtime/client";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { type ThemeColors } from "../../src/ui/theme";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { moderateScale, radius, responsiveFont, spacing } from "../../src/ui/theme";
import { useAppTheme } from "../../src/ui/themeProvider";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [notifications, setNotifications] = useState(true);
  const darkMode = mode === "dark";

  async function logout() {
    await patientFlow.logout();
    router.replace("/(auth)/login");
  }

  function openPrivacyPolicy() {
    Alert.alert(
      "Privacy Policy",
      "Your videos and analysis are only visible to your authenticated account. Data is transmitted over HTTPS."
    );
  }

  function openTermsOfService() {
    Alert.alert(
      "Terms of Service",
      "This MVP provides assistive movement insights and is not a medical diagnosis."
    );
  }

  function openHelpSupport() {
    Alert.alert("Help & Support", "For support, email: support@mma-app.local");
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" backgroundColor={colors.surface} />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Settings" subtitle="Preferences, privacy, and support" />

        <AppCard>
          <View style={styles.accountRow}>
            <View style={styles.accountIconWrap}>
              <Feather name="shield" size={18} color={colors.accent} />
            </View>
            <View style={styles.accountTextWrap}>
              <Text style={styles.accountTitle}>Protected Health Data</Text>
              <Text style={styles.accountSubtitle}>
                Your assessments are only visible to your authenticated account.
              </Text>
            </View>
          </View>
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <View style={styles.switchRow}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Feather name="bell" size={16} color={colors.accent} />
                </View>
                <View style={styles.switchTextWrap}>
                  <Text style={styles.switchTitle}>Notifications</Text>
                  <Text style={styles.switchSubtitle}>Assessment reminders and updates</Text>
                </View>
              </View>
              <View style={styles.switchControl}>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.border, true: colors.accentSoft }}
                  thumbColor={notifications ? colors.accent : colors.white}
                />
              </View>
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.switchRow}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Feather name="moon" size={16} color={colors.accent} />
                </View>
                <View style={styles.switchTextWrap}>
                  <Text style={styles.switchTitle}>Dark Mode</Text>
                  <Text style={styles.switchSubtitle}>Coming soon in a future release</Text>
                </View>
              </View>
              <View style={styles.switchControl}>
                <Switch
                  value={darkMode}
                  onValueChange={(value) => {
                    setMode(value ? "dark" : "light").catch(() => {
                      // Keep current mode on write failure.
                    });
                  }}
                  trackColor={{ false: colors.border, true: colors.accentSoft }}
                  thumbColor={darkMode ? colors.accent : colors.white}
                />
              </View>
            </View>
          </View>
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>Policies & Support</Text>
          <View style={styles.sectionContent}>
            <Pressable style={styles.menuRow} onPress={openPrivacyPolicy}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Feather name="lock" size={16} color={colors.accent} />
                </View>
                <Text style={styles.menuText}>Privacy Policy</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.textMuted} />
            </Pressable>
            <View style={styles.rowDivider} />
            <Pressable style={styles.menuRow} onPress={openTermsOfService}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Feather name="file-text" size={16} color={colors.accent} />
                </View>
                <Text style={styles.menuText}>Terms of Service</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.textMuted} />
            </Pressable>
            <View style={styles.rowDivider} />
            <Pressable style={styles.menuRow} onPress={openHelpSupport}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Feather name="help-circle" size={16} color={colors.accent} />
                </View>
                <Text style={styles.menuText}>Help & Support</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.textMuted} />
            </Pressable>
          </View>
        </AppCard>

        <View style={styles.signOutWrap}>
          <AppButton label="Sign Out" onPress={logout} variant="danger" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 108,
    gap: spacing.md
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm
  },
  accountIconWrap: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  accountTextWrap: {
    flex: 1
  },
  accountTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: responsiveFont(15)
  },
  accountSubtitle: {
    color: colors.textMuted,
    fontSize: responsiveFont(12),
    marginTop: spacing.xs,
    lineHeight: moderateScale(18)
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: responsiveFont(17)
  },
  sectionContent: {
    marginTop: spacing.md,
    gap: spacing.xs
  },
  switchRow: {
    minHeight: moderateScale(58),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    marginRight: spacing.sm
  },
  iconWrap: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  switchTextWrap: {
    flex: 1,
    justifyContent: "center"
  },
  switchControl: {
    minHeight: moderateScale(32),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs
  },
  switchTitle: {
    color: colors.text,
    fontWeight: "600"
  },
  switchSubtitle: {
    color: colors.textMuted,
    fontSize: responsiveFont(12),
    marginTop: 2
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.divider
  },
  menuRow: {
    minHeight: moderateScale(48),
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  menuText: {
    color: colors.text,
    fontWeight: "600"
  },
  signOutWrap: {
    marginTop: spacing.xs
  }
  });
}
