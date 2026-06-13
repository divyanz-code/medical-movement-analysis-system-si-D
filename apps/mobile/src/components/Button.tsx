import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth,
  loading,
  disabled,
  style,
  testID,
}) => {
  const { palette, radii } = useTheme();
  const heights: Record<Size, number> = { sm: 38, md: 48, lg: 56 };
  const padX: Record<Size, number> = { sm: 14, md: 18, lg: 22 };
  const fontSizes: Record<Size, number> = { sm: 13, md: 15, lg: 17 };

  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const textColor =
    variant === "ghost"
      ? palette.primary
      : variant === "secondary"
        ? palette.textPrimary
        : "#FFFFFF";

  const wrap = (children: React.ReactNode) => {
    if (isPrimary) {
      return (
        <LinearGradient
          colors={[palette.primary, palette.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            {
              height: heights[size],
              paddingHorizontal: padX[size],
              borderRadius: radii.md,
              opacity: disabled ? 0.5 : 1,
              width: fullWidth ? "100%" : undefined,
            },
            style,
          ]}
        >
          {children}
        </LinearGradient>
      );
    }
    return (
      <View
        style={[
          styles.base,
          {
            height: heights[size],
            paddingHorizontal: padX[size],
            borderRadius: radii.md,
            backgroundColor:
              variant === "secondary"
                ? palette.surfaceAlt
                : isDanger
                  ? palette.danger
                  : "transparent",
            borderWidth: variant === "ghost" ? 1 : 0,
            borderColor: palette.primary,
            opacity: disabled ? 0.5 : 1,
            width: fullWidth ? "100%" : undefined,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      {wrap(
        <View style={styles.row}>
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <>
              {iconLeft && (
                <Ionicons
                  name={iconLeft}
                  size={fontSizes[size] + 3}
                  color={textColor}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text
                style={{
                  color: textColor,
                  fontSize: fontSizes[size],
                  fontWeight: "700",
                  letterSpacing: 0.2,
                }}
              >
                {label}
              </Text>
              {iconRight && (
                <Ionicons
                  name={iconRight}
                  size={fontSizes[size] + 3}
                  color={textColor}
                  style={{ marginLeft: 8 }}
                />
              )}
            </>
          )}
        </View>,
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
});
