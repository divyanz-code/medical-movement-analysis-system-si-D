import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChipRow } from "@/src/components/ChipRow";
import { PatientCard } from "@/src/components/PatientCard";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { PATIENTS } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "high", label: "High Risk" },
  { id: "medium", label: "Medium Risk" },
  { id: "low", label: "Low Risk" },
];

export default function DoctorPatients() {
  const { palette, radii, spacing } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const list = useMemo(
    () =>
      PATIENTS.filter(
        (p) =>
          (filter === "all" || p.risk === filter) &&
          (query.length === 0 || p.name.toLowerCase().includes(query.toLowerCase())),
      ),
    [filter, query],
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <ScreenHeader title="Patients" subtitle={`${PATIENTS.length} under your care`} showMenu />
      <View style={{ paddingHorizontal: spacing.lg, marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            height: 44,
            borderRadius: radii.md,
            backgroundColor: palette.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: palette.border,
          }}
        >
          <Ionicons name="search-outline" size={18} color={palette.textSecondary} />
          <TextInput
            testID="patients-search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search patients"
            placeholderTextColor={palette.textSecondary}
            style={{ flex: 1, marginLeft: 8, color: palette.textPrimary }}
          />
        </View>
      </View>
      <ChipRow items={FILTERS} selected={filter} onSelect={setFilter} testID="patient-filter-row" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: 8,
          paddingBottom: insets.bottom + 100,
          gap: 10,
        }}
      >
        {list.map((p) => (
          <PatientCard
            key={p.id}
            testID={`patient-${p.id}`}
            patient={p}
            onPress={() => router.push({ pathname: "/(doctor)/patient-detail", params: { id: p.id } })}
          />
        ))}
        {list.length === 0 ? (
          <Text style={{ color: palette.textSecondary, textAlign: "center", marginTop: 40 }}>
            No patients found.
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}
