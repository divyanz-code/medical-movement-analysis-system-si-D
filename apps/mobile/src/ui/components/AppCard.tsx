import type { ReactNode } from "react";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { radius, shadows, spacing, type ThemeColors } from "../theme";
import { useAppTheme } from "../themeProvider";

interface AppCardProps {
  children: ReactNode;
}

export function AppCard({ children }: AppCardProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.card}>{children}</View>;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      ...shadows.card
    }
  });
}
