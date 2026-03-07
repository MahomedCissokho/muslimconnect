import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

import { DEFAULT_RECITER_ID } from "../data/reciters";

// --- Storage keys ---
const KEYS = {
  RECITER_ID: "@settings/reciterId",
  DISPLAY_OPTIONS: "@settings/displayOptions",
  LANGUAGE: "@settings/language",
  PLAYER_POSITION: "@settings/playerPosition",
} as const;

// --- Types ---
export interface DisplayOptions {
  showArabic: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
}

export type AppLanguage = "fr" | "en";

// --- Defaults ---
export const DEFAULT_DISPLAY_OPTIONS: DisplayOptions = {
  showArabic: true,
  showTransliteration: true,
  showTranslation: true,
};

// Detect device language at module level for default
const getDeviceDefault = (): AppLanguage => {
  try {
    const code = getLocales()?.[0]?.languageCode;
    if (code === "en") return "en";
  } catch {}
  return "fr";
};

export const DEFAULT_LANGUAGE: AppLanguage = getDeviceDefault();

// Default player position (0 = normal position above tab bar)
export const DEFAULT_PLAYER_POSITION = 0;

// --- Service ---
export const settingsService = {
  // Reciter
  async getReciterId(): Promise<string> {
    const value = await AsyncStorage.getItem(KEYS.RECITER_ID);
    return value ?? DEFAULT_RECITER_ID;
  },

  async setReciterId(id: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.RECITER_ID, id);
  },

  // Display options
  async getDisplayOptions(): Promise<DisplayOptions> {
    const value = await AsyncStorage.getItem(KEYS.DISPLAY_OPTIONS);
    if (value) {
      try {
        return JSON.parse(value) as DisplayOptions;
      } catch {
        return DEFAULT_DISPLAY_OPTIONS;
      }
    }
    return DEFAULT_DISPLAY_OPTIONS;
  },

  async setDisplayOptions(options: DisplayOptions): Promise<void> {
    await AsyncStorage.setItem(KEYS.DISPLAY_OPTIONS, JSON.stringify(options));
  },

  // Language
  async getLanguage(): Promise<AppLanguage> {
    const value = await AsyncStorage.getItem(KEYS.LANGUAGE);
    if (value === "en" || value === "fr") {
      return value;
    }
    return DEFAULT_LANGUAGE;
  },

  async setLanguage(lang: AppLanguage): Promise<void> {
    await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
  },

  // Player position (for draggable AudioPlayerBar)
  async getPlayerPosition(): Promise<number> {
    const value = await AsyncStorage.getItem(KEYS.PLAYER_POSITION);
    if (value) {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "number" ? parsed : DEFAULT_PLAYER_POSITION;
      } catch {
        return DEFAULT_PLAYER_POSITION;
      }
    }
    return DEFAULT_PLAYER_POSITION;
  },

  async setPlayerPosition(position: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.PLAYER_POSITION, JSON.stringify(position));
  },
};
