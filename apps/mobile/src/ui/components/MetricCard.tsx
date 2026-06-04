import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { radius, responsiveFont, spacing, type ThemeColors } from "../theme";
import { useAppTheme } from "../themeProvider";

type MetricVariant = "default" | "accent" | "success" | "warning";
type Trend = "up" | "down" | "stable";

function buildVariantConfig(
  colors: ThemeColors
): Record<MetricVariant, { backgroundColor: string; borderColor: string; iconColor: string }> {
  return {
    default: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      iconColor: colors.textMuted
    },
    accent: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.border,
      iconColor: colors.accent
    },
    success: {
      backgroundColor: colors.successSoft,
      borderColor: colors.border,
      iconColor: colors.success
    },
    warning: {
      backgroundColor: colors.warningSoft,
      borderColor: colors.border,
      iconColor: colors.warning
    }
  };
}

interface MetricCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | number;
  unit?: string;
  trend?: Trend;
  variant?: MetricVariant;
}

export function MetricCard({
  icon,
  label,
  value,
  unit,
  trend,
  variant = "default"
}: MetricCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const variantConfig = useMemo(() => buildVariantConfig(colors), [colors]);
  const { width } = useWindowDimensions();
  const variantStyle = variantConfig[variant];
  const valueText = String(value);
  const baseValueSize = width < 360 ? 20 : width < 420 ? 22 : 24;
  const compactValueSize = valueText.length > 8 ? baseValueSize - 3 : baseValueSize;
  const unitSize = Math.max(12, compactValueSize - 7);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor
        }
      ]}
    >
      <View style={styles.labelRow}>
        <Feather name={icon} size={14} color={variantStyle.iconColor} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text
          style={[styles.value, { fontSize: compactValueSize }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {valueText}
        </Text>
        {unit ? (
          <Text style={[styles.unit, { fontSize: unitSize }]} numberOfLines={1}>
            {unit}
          </Text>
        ) : null}
      </View>
      {trend ? (
        <Text style={styles.trend}>
          {trend === "up" ? "Improving" : trend === "down" ? "Declining" : "Stable"}
        </Text>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      borderRadius: radius.md,
      borderWidth: 1,
      padding: spacing.md
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs
    },
    label: {
      color: colors.textMuted,
      fontSize: responsiveFont(12)
    },
    valueRow: {
      marginTop: spacing.xs,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 2
    },
    value: {
      color: colors.text,
      fontWeight: "700",
      flexShrink: 1
    },
    unit: {
      color: colors.textMuted,
      marginBottom: 2
    },
    trend: {
      marginTop: spacing.xs,
      color: colors.textMuted,
      fontSize: responsiveFont(11)
    }
  });
}
