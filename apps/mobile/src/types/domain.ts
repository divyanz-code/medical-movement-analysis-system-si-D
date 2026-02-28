import type { AnalysisItem } from "./contracts.js";

export function computeRangeOfMotion(minAngle: number, maxAngle: number): number {
  return maxAngle - minAngle;
}

export function isAnalysisTerminal(status: AnalysisItem["status"]): boolean {
  return status === "SUCCEEDED" || status === "FAILED";
}
