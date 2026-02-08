import { SURAHS, type SurahInfo } from './surahs';
import { JUZ_LIST, type JuzInfo } from './juz';
import { PAGES, type PageInfo } from './pages';
import { HIZB_QUARTERS, type HizbQuarterInfo } from './hizb';

export { SURAHS, JUZ_LIST, PAGES, HIZB_QUARTERS };
export type { SurahInfo, JuzInfo, PageInfo, HizbQuarterInfo };

export const getSurahName = (number: number): string => {
  return SURAHS.find(s => s.number === number)?.englishName ?? '';
};

export const getSurahArabicName = (number: number): string => {
  return SURAHS.find(s => s.number === number)?.name ?? '';
};

export const getSurahTransliteration = (number: number): string => {
  return SURAHS.find(s => s.number === number)?.transliteration ?? '';
};

export const TOTAL_AYAHS = 6236;
export const TOTAL_SURAHS = 114;
export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;
export const TOTAL_HIZB = 60;
export const TOTAL_HIZB_QUARTERS = 240;