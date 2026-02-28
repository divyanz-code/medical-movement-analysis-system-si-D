import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { colors, radius, shadows, spacing } from "../theme";

interface AppCardProps {
  children: ReactNode;
}

export function AppCard({ children }: AppCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card
  }
});
