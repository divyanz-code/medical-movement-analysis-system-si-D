import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { warn } from "../debug/logger";

const FIRST_LAUNCH_KEY = "mma_has_seen_first_launch";

export class AppLaunchStore {
  async getHasSeenFirstLaunch(): Promise<boolean> {
    try {
      if (Platform.OS === "web") {
        const value = localStorage.getItem(FIRST_LAUNCH_KEY);
        return value === "true";
      }
      const value = await SecureStore.getItemAsync(FIRST_LAUNCH_KEY);
      return value === "true";
    } catch (error) {
      warn("app-launch-store", "failed-to-read-first-launch-flag", { error });
      return false;
    }
  }

  async setHasSeenFirstLaunch(): Promise<void> {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(FIRST_LAUNCH_KEY, "true");
        return;
      }
      await SecureStore.setItemAsync(FIRST_LAUNCH_KEY, "true");
    } catch (error) {
      warn("app-launch-store", "failed-to-write-first-launch-flag", { error });
    }
  }
}

export const appLaunchStore = new AppLaunchStore();
