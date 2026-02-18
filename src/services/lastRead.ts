import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Storage key ─────────────────────────────────
const KEY = "@app/lastRead";

// ── Types ───────────────────────────────────────
export type LastReadOrigin = "surah" | "juz" | "hizb" | "page";

export interface LastReadData {
  /** Surah number (1-114) */
  surahNumber: number;
  /** Ayah number in surah */
  ayahNumber: number;
  /** Origin context */
  origin: LastReadOrigin;
  /** Juz number (1-30) */
  juz?: number;
  /** Hizb number (1-60) */
  hizb?: number;
  /** Page number (1-604) */
  page?: number;
  /** ISO timestamp */
  timestamp: string;
}

// ── Service ─────────────────────────────────────
export const lastReadService = {
  async get(): Promise<LastReadData | null> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw) as LastReadData;
    } catch {
      return null;
    }
  },

  async set(data: Omit<LastReadData, "timestamp">): Promise<void> {
    const entry: LastReadData = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(entry));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  },
};
