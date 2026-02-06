// API Response Types
export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

// Quran Types
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  audio?: string;
  audioSecondary?: string[];
}

export interface QuranMeta {
  ayahs: {
    count: number;
  };
  surahs: {
    count: number;
    references: Surah[];
  };
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export interface JuzData {
  number: number;
  ayahs: Ayah[];
  surahs: {
    [key: string]: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    };
  };
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
}

// Type pour la liste des Juz
export interface JuzListItem {
  number: number;
  startSurah: string;
  startAyah: number;
  endSurah: string;
  endAyah: number;
}

// Type pour la liste des Pages
export interface PageListItem {
  number: number;
  startSurah: number;  // Numéro de la sourate
  startSurahName: string;  // Nom de la sourate
  startAyah: number;
  endSurah: number;
  endSurahName: string;
  endAyah: number;
  juz: number;
}

// Type pour les données de Page depuis l'API
export interface PageData {
  number: number;
  ayahs: Ayah[];
  surahs: {
    [key: string]: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    };
  };
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
}

// Type pour la liste des Hizb
export interface HizbListItem {
  hizbQuarter: number; // 1-240 (numéro du quart de Hizb)
  startSurah: number;  // Numéro de la sourate
  startSurahName: string;  // Nom de la sourate
  startAyah: number;
  endSurah: number;
  endSurahName: string;
  endAyah: number;
  juz: number;
}

// Type pour les données de Hizb depuis l'API
export interface HizbData {
  number: number;
  ayahs: Ayah[];
  surahs: {
    [key: string]: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    };
  };
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
}

// Prayer Types
export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sunrise: string;
  imsak: string;
  midnight: string;
}

export interface PrayerData {
  timings: PrayerTimes;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: string;
      month: string;
      year: string;
      designation: string;
      holidays: string[];
    };
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: string;
      month: string;
      year: string;
      designation: string;
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
      params: object;
    };
    latitudeAdjustmentMethod: string;
    midnightMode: string;
    school: string;
    offset: object;
  };
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    language: 'fr' | 'ar' | 'en';
    notifications: boolean;
    prayerReminders: boolean;
    lastReadSurah?: number;
    lastReadAyah?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Navigation Types
export type RootStackParamList = {
  index: undefined;
  onboarding: undefined;
  '(tabs)': undefined;
};

export type TabParamList = {
  index: undefined;
  prayer: undefined;
  qibla: undefined;
  profile: undefined;
};

// Hook Return Types
export interface UseQuranMetaReturn {
  data: QuranMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseSurahReturn {
  data: SurahData | null;
  loading: boolean;
  error: string | null;
}

export interface UsePrayerTimesReturn {
  data: PrayerData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}