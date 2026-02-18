import type { SurahInGroup } from "../types";
import { HIZB_QUARTERS, type HizbQuarterInfo } from "./hizb";
import { JUZ_LIST, type JuzInfo } from "./juz";
import { PAGES, type PageInfo } from "./pages";
import { SURAHS, type SurahInfo } from "./surahs";

export { HIZB_QUARTERS, JUZ_LIST, PAGES, SURAHS };
export type { HizbQuarterInfo, JuzInfo, PageInfo, SurahInfo };

export const getSurahName = (number: number): string => {
  return SURAHS.find((s) => s.number === number)?.englishName ?? "";
};

export const getSurahArabicName = (number: number): string => {
  return SURAHS.find((s) => s.number === number)?.name ?? "";
};

export const getSurahTransliteration = (number: number): string => {
  return SURAHS.find((s) => s.number === number)?.transliteration ?? "";
};

export const TOTAL_AYAHS = 6236;
export const TOTAL_SURAHS = 114;
export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;
export const TOTAL_HIZB = 60;
export const TOTAL_HIZB_QUARTERS = 240;

/**
 * Get the list of surahs (with ayah ranges) that fall within start→end.
 */
export function getSurahsInRange(
  startSurah: number,
  startAyah: number,
  endSurah: number,
  endAyah: number,
): SurahInGroup[] {
  const result: SurahInGroup[] = [];
  for (let i = startSurah; i <= endSurah; i++) {
    const surah = SURAHS.find((s) => s.number === i);
    if (!surah) continue;
    result.push({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      transliteration: surah.transliteration,
      revelationType: surah.revelationType,
      numberOfAyahs: surah.numberOfAyahs,
      fromAyah: i === startSurah ? startAyah : 1,
      toAyah: i === endSurah ? endAyah : surah.numberOfAyahs,
    });
  }
  return result;
}

/**
 * Get the full range (startSurah/Ayah → endSurah/Ayah) for a given Hizb number (1-60).
 */
export function getHizbRange(hizbNumber: number): {
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
} {
  const quarters = HIZB_QUARTERS.filter((q) => q.hizb === hizbNumber);
  if (quarters.length === 0) {
    return { startSurah: 1, startAyah: 1, endSurah: 1, endAyah: 7 };
  }

  const firstQuarter = quarters[0];
  const nextHizbQ1 = HIZB_QUARTERS.find((q) => q.hizb === hizbNumber + 1);

  if (nextHizbQ1) {
    if (nextHizbQ1.startAyah === 1) {
      const prevSurah = SURAHS.find(
        (s) => s.number === nextHizbQ1.startSurah - 1,
      );
      return {
        startSurah: firstQuarter.startSurah,
        startAyah: firstQuarter.startAyah,
        endSurah: nextHizbQ1.startSurah - 1,
        endAyah: prevSurah?.numberOfAyahs ?? 1,
      };
    }
    return {
      startSurah: firstQuarter.startSurah,
      startAyah: firstQuarter.startAyah,
      endSurah: nextHizbQ1.startSurah,
      endAyah: nextHizbQ1.startAyah - 1,
    };
  }

  // Last hizb (60) → ends at Surah 114 (An-Nas), ayah 6
  return {
    startSurah: firstQuarter.startSurah,
    startAyah: firstQuarter.startAyah,
    endSurah: 114,
    endAyah: 6,
  };
}
