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

export const colors = {
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
