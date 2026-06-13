import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  accent?: string;
  testID?: string;
}

export const MetricCard: React.FC<Props> = ({
  label,
  value,
  delta,
  positive,
  icon,
  accent,
  testID,
}) => {
  const { palette, radii, spacing, shadow } = useTheme();
  const color = accent ?? palette.primary;
  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          borderRadius: radii.lg,
          padding: spacing.md,
        },
        shadow.sm,
      ]}
    >
      <View style={styles.row}>
        {icon && (
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: color + "22", borderRadius: 10 },
            ]}
          >
            <Ionicons name={icon} size={16} color={color} />
          </View>
        )}
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </View>
      <Text
        style={{
          color: palette.textPrimary,
          fontSize: 26,
          fontWeight: "700",
          marginTop: 8,
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>
      {delta ? (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <Ionicons
            name={positive ? "trending-up" : "trending-down"}
            size={14}
            color={positive ? palette.success : palette.danger}
          />
          <Text
            style={{
              color: positive ? palette.success : palette.danger,
              fontSize: 12,
              fontWeight: "600",
              marginLeft: 4,
            }}
          >
            {delta}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth, flex: 1, minWidth: 0 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});
