import type { AnalysisItem, Profile } from "./contracts";

export function computeRangeOfMotion(minAngle: number, maxAngle: number): number {
  return maxAngle - minAngle;
}

export function isAnalysisTerminal(status: AnalysisItem["status"]): boolean {
  return status === "SUCCEEDED" || status === "FAILED";
}

export function profileNeedsOnboarding(profile: Profile): boolean {
  return profile.age === null || profile.gender === null || profile.affected_limb === null;
}
