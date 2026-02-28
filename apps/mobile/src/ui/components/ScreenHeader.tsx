import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, moderateScale, radius, responsiveFont, spacing } from "../theme";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  light?: boolean;
}

export function ScreenHeader({ title, subtitle, onBack, light = false }: ScreenHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            style={[
              styles.backButton,
              light ? styles.backButtonLight : styles.backButtonDark
            ]}
            onPress={onBack}
          >
            <Feather name="arrow-left" size={20} color={light ? colors.white : colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>
      <Text style={[styles.title, light && styles.lightTitle]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, light && styles.lightSubtitle]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.sm
  },
  topRow: {
    flexDirection: "row"
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center"
  },
  backButtonDark: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card
  },
  backButtonLight: {
    backgroundColor: colors.darkOverlay
  },
  backPlaceholder: {
    width: moderateScale(36),
    height: moderateScale(36)
  },
  title: {
    color: colors.text,
    fontSize: responsiveFont(30),
    fontWeight: "700"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: responsiveFont(15),
    lineHeight: moderateScale(22)
  },
  lightTitle: {
    color: colors.white
  },
  lightSubtitle: {
    color: colors.whiteMuted
  }
});
