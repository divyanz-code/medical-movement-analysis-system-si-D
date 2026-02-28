import { Dimensions, PixelRatio } from "react-native";

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export function scale(size: number): number {
  return (screenWidth / guidelineBaseWidth) * size;
}

export function verticalScale(size: number): number {
  return (screenHeight / guidelineBaseHeight) * size;
}

export function moderateScale(size: number, factor = 0.45): number {
  return size + (scale(size) - size) * factor;
}

export function responsiveFont(size: number): number {
  return Math.round(PixelRatio.roundToNearestPixel(moderateScale(size, 0.35)));
}

export type ThemeColors = {
  background: string;
  surface: string;
  authBackground: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  divider: string;
  primary: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  darkSurface: string;
  darkOverlay: string;
  white: string;
  whiteMuted: string;
  whiteSoft: string;
  whiteTint: string;
};

export const lightColors: ThemeColors = {
  background: "#FFFFFF",
  surface: "#F3F7FA",
  authBackground: "#EAF2F7",
  card: "#FFFFFF",
  text: "#163447",
  textMuted: "#6B8291",
  border: "#D4E1EA",
  divider: "#E4EDF3",
  primary: "#0F4C5C",
  accent: "#1F8A9C",
  accentSoft: "#DFF2F5",
  success: "#2E9E76",
  successSoft: "#E5F6EF",
  warning: "#C98A2E",
  warningSoft: "#FFF3E1",
  danger: "#D65A5A",
  dangerSoft: "#FDECEC",
  darkSurface: "#0E1F28",
  darkOverlay: "rgba(14,31,40,0.78)",
  white: "#FFFFFF",
  whiteMuted: "rgba(255,255,255,0.82)",
  whiteSoft: "rgba(255,255,255,0.92)",
  whiteTint: "rgba(255,255,255,0.24)"
} as const;

export const darkColors: ThemeColors = {
  background: "#08151C",
  surface: "#0C1D27",
  authBackground: "#091821",
  card: "#102531",
  text: "#E7F2F7",
  textMuted: "#9EB4C1",
  border: "#1E3B4B",
  divider: "#183545",
  primary: "#123745",
  accent: "#4EB2C1",
  accentSoft: "rgba(78,178,193,0.2)",
  success: "#50C49A",
  successSoft: "rgba(80,196,154,0.18)",
  warning: "#E2A94A",
  warningSoft: "rgba(226,169,74,0.2)",
  danger: "#F07B7B",
  dangerSoft: "rgba(240,123,123,0.2)",
  darkSurface: "#07131A",
  darkOverlay: "rgba(3,10,14,0.74)",
  white: "#FFFFFF",
  whiteMuted: "rgba(255,255,255,0.82)",
  whiteSoft: "rgba(255,255,255,0.92)",
  whiteTint: "rgba(255,255,255,0.24)"
} as const;

// Backward compatibility for files not yet migrated to theme hook.
export const colors = lightColors;

export const shadows = {
  card: {
    shadowColor: "#0F2D3A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  }
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999
} as const;
