import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

import { patientFlow } from "../../src/runtime/client";
import type { AnalysisItem } from "../../src/types/contracts";
import { AppCard } from "../../src/ui/components/AppCard";
import { EmptyState } from "../../src/ui/components/EmptyState";
import { ScreenHeader } from "../../src/ui/components/ScreenHeader";
import { SessionCard } from "../../src/ui/components/SessionCard";
import { colors, radius, spacing } from "../../src/ui/theme";

export default function HistoryScreen() {
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AnalysisItem["status"]>("ALL");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    patientFlow
      .getHistory()
      .then(setItems)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load history"));
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesQuery = !query.trim() || `${item.video_id}`.includes(query.trim());
        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [items, query, statusFilter]
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" backgroundColor={colors.surface} />
      <View style={styles.headerWrap}>
        <ScreenHeader
          title="Assessment History"
          subtitle="Review your previous movement analyses"
        />
      </View>

      <View style={styles.content}>
        <AppCard>
          <Text style={styles.controlLabel}>Search</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by video id"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
          <View style={styles.filtersRow}>
            {(["ALL", "SUCCEEDED", "FAILED", "PROCESSING"] as const).map((filter) => {
              const active = statusFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setStatusFilter(filter)}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </AppCard>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={filtered}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => `${item.video_id}-${item.updated_at}`}
          ListEmptyComponent={
            <EmptyState
              icon="clock"
              title="No matching assessments"
              description="Change filters or run a new session."
            />
          }
          renderItem={({ item, index }) => (
            <SessionCard
              item={item}
              previousScore={filtered[index + 1]?.movement_score ?? undefined}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface
  },
  headerWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md
  },
  controlLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.xs
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text
  },
  filtersRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  filterChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6
  },
  filterChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600"
  },
  filterChipTextActive: {
    color: colors.accent
  },
  error: {
    color: colors.danger
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: 156
  }
});
