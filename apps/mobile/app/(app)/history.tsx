import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";

import type { AnalysisItem } from "../../src/types/contracts.js";
import { patientFlow } from "../../src/runtime/client.js";

function Row({ item }: { item: AnalysisItem }) {
  return (
    <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eee" }}>
      <Text style={{ fontWeight: "600" }}>Video #{item.video_id}</Text>
      <Text>Status: {item.status}</Text>
      <Text>ROM: {item.range_of_motion ?? "-"}</Text>
      <Text>Score: {item.movement_score ?? "-"}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    patientFlow
      .getHistory()
      .then(setItems)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load history")
      );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Analysis History</Text>
      {error ? <Text style={{ color: "#b00020" }}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.video_id}-${item.updated_at}`}
        renderItem={({ item }) => <Row item={item} />}
      />
    </SafeAreaView>
  );
}
