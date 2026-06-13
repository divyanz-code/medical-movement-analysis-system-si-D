// MEDMOVE AI design tokens. Clean medical teal/blue palette with light + dark modes.

export type ThemeMode = "light" | "dark";

export interface Palette {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primaryActive: string;
  primaryMuted: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  divider: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  overlay: string;
  skeleton: string;
  cardShadow: string;
}

export const lightPalette: Palette = {
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF2F6",
  primary: "#0F766E",
  primaryActive: "#115E59",
  primaryMuted: "#CCFBF1",
  secondary: "#0369A1",
  accent: "#14B8A6",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textInverse: "#FFFFFF",
  border: "#E2E8F0",
  divider: "#E2E8F0",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#0EA5E9",
  overlay: "rgba(15,23,42,0.45)",
  skeleton: "#E2E8F0",
  cardShadow: "rgba(15,23,42,0.06)",
};

export const darkPalette: Palette = {
  background: "#0B1220",
  surface: "#111B2E",
  surfaceAlt: "#162238",
  primary: "#14B8A6",
  primaryActive: "#0D9488",
  primaryMuted: "#134E4A",
  secondary: "#38BDF8",
  accent: "#2DD4BF",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textInverse: "#0B1220",
  border: "#1F2A44",
  divider: "#1F2A44",
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#38BDF8",
  overlay: "rgba(0,0,0,0.6)",
  skeleton: "#1F2A44",
  cardShadow: "rgba(0,0,0,0.4)",
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 30, fontWeight: "700" as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: "600" as const, letterSpacing: -0.2 },
  h4: { fontSize: 17, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: "600" as const, lineHeight: 22 },
  small: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: "500" as const, letterSpacing: 0.2 },
  label: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
};

export const shadows = (mode: ThemeMode) =>
  mode === "light"
    ? {
        sm: {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 2,
          elevation: 1,
        },
        md: {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
        },
        lg: {
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 6,
        },
      }
    : {
        sm: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 1,
        },
        md: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 14,
          elevation: 4,
        },
        lg: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.55,
          shadowRadius: 24,
          elevation: 8,
        },
      };

export const getPalette = (mode: ThemeMode): Palette =>
  mode === "dark" ? darkPalette : lightPalette;
