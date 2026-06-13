import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { storage } from "@/src/utils/storage";

import {
  getPalette,
  Palette,
  radii,
  shadows,
  spacing,
  ThemeMode,
  typography,
} from "./index";

interface ThemeContextValue {
  mode: ThemeMode;
  palette: Palette;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadow: ReturnType<typeof shadows>;
  toggleMode: () => void;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "medmove.theme.mode";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(
    systemScheme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    (async () => {
      const saved = await storage.getItem<string>(STORAGE_KEY, "");
      if (saved === "light" || saved === "dark") {
        setModeState(saved);
      }
    })();
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    storage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((curr) => {
      const next = curr === "light" ? "dark" : "light";
      storage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      palette: getPalette(mode),
      spacing,
      radii,
      typography,
      shadow: shadows(mode),
      toggleMode,
      setMode,
    }),
    [mode, toggleMode, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
