import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";

import { moderateScale, radius, responsiveFont, spacing, type ThemeColors } from "../theme";
import { useAppTheme } from "../themeProvider";

interface AppFieldProps extends TextInputProps {
  label: string;
  helperText?: string;
}

export function AppField({ label, helperText, ...inputProps }: AppFieldProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const hasPasswordToggle = inputProps.secureTextEntry === true;
  const [hidePassword, setHidePassword] = useState(hasPasswordToggle);

  useEffect(() => {
    setHidePassword(hasPasswordToggle);
  }, [hasPasswordToggle]);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          {...inputProps}
          secureTextEntry={hasPasswordToggle ? hidePassword : inputProps.secureTextEntry}
          style={[styles.input, hasPasswordToggle && styles.inputWithAction]}
          placeholderTextColor={colors.textMuted}
        />
        {hasPasswordToggle ? (
          <Pressable style={styles.actionButton} onPress={() => setHidePassword((current) => !current)}>
            <Feather name={hidePassword ? "eye" : "eye-off"} size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    group: {
      gap: spacing.xs
    },
    label: {
      color: colors.text,
      fontWeight: "600"
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: moderateScale(13),
      color: colors.text,
      fontSize: responsiveFont(16)
    },
    inputRow: {
      position: "relative",
      justifyContent: "center"
    },
    inputWithAction: {
      paddingRight: moderateScale(44)
    },
    actionButton: {
      position: "absolute",
      right: spacing.sm,
      height: "100%",
      justifyContent: "center",
      alignItems: "center"
    },
    helper: {
      color: colors.textMuted,
      fontSize: responsiveFont(12)
    }
  });
}
