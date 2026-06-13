import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChipRow } from "@/src/components/ChipRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ADMIN_USERS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "Patient", label: "Patients" },
  { id: "Doctor", label: "Doctors" },
  { id: "Admin", label: "Admins" },
];

export default function AdminUsers() {
  const { palette, radii, spacing, shadow } = useTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");

  const filtered = ADMIN_USERS.filter((u) => filter === "all" || u.role === filter);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Users" subtitle={`${ADMIN_USERS.length} total accounts`} showMenu rightIcon="person-add-outline" />
      <ChipRow items={FILTERS} selected={filter} onSelect={setFilter} testID="user-filter-row" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 100,
          gap: 10,
        }}
      >
        {filtered.map((u) => (
          <View
            key={u.id}
            testID={`admin-user-${u.id}`}
            style={[
              {
                backgroundColor: palette.surface,
                borderRadius: radii.lg,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: palette.border,
                padding: spacing.md,
                flexDirection: "row",
                alignItems: "center",
              },
              shadow.sm,
            ]}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: palette.primaryMuted,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={u.role === "Patient" ? "body" : u.role === "Doctor" ? "medkit" : "shield-checkmark"}
                size={18}
                color={palette.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: palette.textPrimary, fontSize: 14, fontWeight: "700" }}>
                {u.name}
              </Text>
              <Text style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
                {u.email} · Joined {u.joinedAt}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor:
                  u.status === "Active" ? palette.success + "22" : palette.danger + "22",
              }}
            >
              <Text
                style={{
                  color: u.status === "Active" ? palette.success : palette.danger,
                  fontSize: 10,
                  fontWeight: "800",
                  letterSpacing: 0.6,
                }}
              >
                {u.status.toUpperCase()}
              </Text>
            </View>
            <Pressable
              testID={`admin-user-menu-${u.id}`}
              style={{ marginLeft: 8, width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name="ellipsis-horizontal" size={18} color={palette.textSecondary} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
