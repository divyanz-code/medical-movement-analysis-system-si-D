import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors, moderateScale, radius, responsiveFont } from "../theme";

type Variant = "primary" | "secondary" | "danger";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
}

export function AppButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary"
}: AppButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        inactive && styles.inactive
      ]}
      onPress={onPress}
      disabled={inactive}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? colors.text : colors.white} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "secondary" && styles.secondaryLabel,
            variant === "danger" && styles.dangerLabel
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: moderateScale(50),
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: {
    backgroundColor: colors.accent
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.border
  },
  inactive: {
    opacity: 0.6
  },
  label: {
    color: colors.white,
    fontSize: responsiveFont(15),
    fontWeight: "700"
  },
  secondaryLabel: {
    color: colors.text
  },
  dangerLabel: {
    color: colors.danger
  }
});
