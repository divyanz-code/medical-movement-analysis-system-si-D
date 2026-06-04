import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode
} from "react";
import { ActivityIndicator, View, Platform } from "react-native";

import { darkColors, lightColors, type ThemeColors } from "./theme";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
}

const THEME_KEY = "mma_theme_mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function load() {
      let stored: string | null = null;
      if (Platform.OS === "web") {
        stored = localStorage.getItem(THEME_KEY);
      } else {
        stored = await SecureStore.getItemAsync(THEME_KEY);
      }
      if (stored === "dark" || stored === "light") {
        setModeState(stored);
      }
      setReady(true);
    }

    load().catch(() => setReady(true));
  }, []);

  const setMode = useCallback(async (modeToSet: ThemeMode) => {
    setModeState(modeToSet);
    if (Platform.OS === "web") {
      localStorage.setItem(THEME_KEY, modeToSet);
    } else {
      await SecureStore.setItemAsync(THEME_KEY, modeToSet);
    }
  }, []);

  const toggleMode = useCallback(async () => {
    setModeState((current) => {
      const next = current === "dark" ? "light" : "dark";
      if (Platform.OS === "web") {
        localStorage.setItem(THEME_KEY, next);
      } else {
        SecureStore.setItemAsync(THEME_KEY, next).catch(() => {});
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: mode === "dark" ? darkColors : lightColors,
      setMode,
      toggleMode
    }),
    [mode, setMode, toggleMode]
  );

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return value;
}
