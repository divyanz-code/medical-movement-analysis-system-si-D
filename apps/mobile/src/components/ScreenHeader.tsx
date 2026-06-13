import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRight?: () => void;
  rightBadge?: number;
}

export const ScreenHeader: React.FC<Props> = ({
  title,
  subtitle,
  showMenu,
  showBack,
  onBack,
  rightIcon,
  onRight,
  rightBadge,
}) => {
  const { palette, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 6,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.sm,
          backgroundColor: palette.background,
          borderBottomColor: palette.divider,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.leftRow}>
          {showMenu && (
            <Pressable
              testID="header-menu-button"
              onPress={() => (navigation as any).openDrawer?.()}
              style={[
                styles.iconBtn,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}
            >
              <Ionicons name="menu" size={20} color={palette.textPrimary} />
            </Pressable>
          )}
          {showBack && (
            <Pressable
              testID="header-back-button"
              onPress={onBack}
              style={[
                styles.iconBtn,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}
            >
              <Ionicons name="chevron-back" size={22} color={palette.textPrimary} />
            </Pressable>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text
              style={{
                color: palette.textPrimary,
                fontSize: 19,
                fontWeight: "700",
                letterSpacing: -0.2,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {rightIcon && (
          <Pressable
            testID="header-right-button"
            onPress={onRight}
            style={[
              styles.iconBtn,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}
          >
            <Ionicons name={rightIcon} size={20} color={palette.textPrimary} />
            {rightBadge && rightBadge > 0 ? (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: palette.danger, borderColor: palette.background },
                ]}
              >
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                  {rightBadge}
                </Text>
              </View>
            ) : null}
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  leftRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
});
