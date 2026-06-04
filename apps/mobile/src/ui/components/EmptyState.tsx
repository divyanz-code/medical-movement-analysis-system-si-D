import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { moderateScale, radius, responsiveFont, spacing, type ThemeColors } from "../theme";
import { useAppTheme } from "../themeProvider";

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={28} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      paddingVertical: moderateScale(40),
      paddingHorizontal: spacing.xl,
      alignItems: "center"
    },
    iconWrap: {
      width: moderateScale(64),
      height: moderateScale(64),
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      marginTop: spacing.md,
      color: colors.text,
      fontWeight: "700",
      fontSize: responsiveFont(20)
    },
    description: {
      marginTop: spacing.xs,
      color: colors.textMuted,
      textAlign: "center",
      lineHeight: moderateScale(20)
    },
    actionButton: {
      marginTop: spacing.md,
      minHeight: moderateScale(42),
      borderRadius: radius.md,
      width: "100%",
      maxWidth: 280,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center"
    },
    actionText: {
      color: colors.white,
      fontWeight: "700"
    }
  });
}
