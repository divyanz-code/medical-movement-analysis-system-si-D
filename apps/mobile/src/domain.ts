export interface AnalysisSummary {
  videoId: string;
  minAngle: number;
  maxAngle: number;
  movementScore: number;
}

export function computeRangeOfMotion(summary: AnalysisSummary): number {
  return summary.maxAngle - summary.minAngle;
}
