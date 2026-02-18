import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AyahBookmark {
  type: "ayah";
  id: string; // `ayah_${surahNumber}_${ayahNumberInSurah}`
  surahNumber: number;
  surahName: string;
  surahNameAr: string;
  ayahNumberInSurah: number;
  globalAyahNumber: number;
  textAr: string;
  transliteration?: string;
  translationFr?: string;
  translationEn?: string;
  savedAt: string;
}

export interface HadithBookmark {
  type: "hadith";
  id: string; // `hadith_${collectionId}_${hadithNumber}`
  collectionId: string;
  collectionNameFr: string;
  collectionNameEn: string;
  hadithNumber: number;
  textAr: string;
  textFr: string;
  textEn: string;
  narratorFr: string;
  narratorEn: string;
  reference: string;
  savedAt: string;
}

export interface DuaBookmark {
  type: "dua";
  id: string; // `dua_${duaId}`
  duaId: number;
  categoryId: string;
  titleFr: string;
  titleEn: string;
  textAr: string;
  textFr: string;
  textEn: string;
  referenceFr: string;
  referenceEn: string;
  savedAt: string;
}

export type Bookmark = AyahBookmark | HadithBookmark | DuaBookmark;

// ─── Storage ──────────────────────────────────────────────────────────────────

const KEY = "@app/bookmarks";

async function load(): Promise<Bookmark[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Bookmark[];
  } catch {
    return [];
  }
}

async function save(list: Bookmark[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const bookmarkService = {
  async getAll(): Promise<Bookmark[]> {
    const list = await load();
    return list.sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    );
  },

  async isBookmarked(id: string): Promise<boolean> {
    const list = await load();
    return list.some((b) => b.id === id);
  },

  async add(bookmark: Bookmark): Promise<void> {
    const list = await load();
    const filtered = list.filter((b) => b.id !== bookmark.id);
    filtered.unshift(bookmark);
    await save(filtered);
  },

  async remove(id: string): Promise<void> {
    const list = await load();
    await save(list.filter((b) => b.id !== id));
  },

  async toggle(bookmark: Bookmark): Promise<boolean> {
    const list = await load();
    const exists = list.some((b) => b.id === bookmark.id);
    if (exists) {
      await save(list.filter((b) => b.id !== bookmark.id));
      return false; // removed
    } else {
      list.unshift(bookmark);
      await save(list);
      return true; // added
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  },
};
