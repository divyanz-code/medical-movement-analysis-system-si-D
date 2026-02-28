import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";

import type { AnalysisItem } from "../../src/types/contracts";
import { patientFlow } from "../../src/runtime/client";

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ videoId?: string }>();
  const [analysis, setAnalysis] = useState<AnalysisItem | null>(null);
  const [status, setStatus] = useState<string>("Waiting for analysis...");

  useEffect(() => {
    async function load() {
      if (!params.videoId) {
        setStatus("Missing video ID");
        return;
      }

      const result = await patientFlow.pollAnalysis(Number(params.videoId), {
        maxAttempts: 30,
        delayMs: 500
      });
      setAnalysis(result);
      setStatus(result.status);
    }

    load().catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "Could not fetch analysis";
      setStatus(message);
    });
  }, [params.videoId]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Analysis Result</Text>
      <Text>Status: {status}</Text>

      {analysis?.status === "SUCCEEDED" ? (
        <View style={{ gap: 8 }}>
          <Text>Min angle: {analysis.min_angle}</Text>
          <Text>Max angle: {analysis.max_angle}</Text>
          <Text>Range of motion: {analysis.range_of_motion}</Text>
          <Text>Movement score: {analysis.movement_score}</Text>
        </View>
      ) : null}

      {analysis?.status === "FAILED" ? (
        <Text style={{ color: "#b00020" }}>
          {analysis.error_code}: {analysis.error_message}
        </Text>
      ) : null}

      <Button title="Go to History" onPress={() => router.push("/(app)/history")} />
    </SafeAreaView>
  );
}
