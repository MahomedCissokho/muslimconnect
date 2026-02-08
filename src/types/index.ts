// API Response Types
export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

// Ayah type (returned by API when fetching verse content)
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

// API content types (for fetching actual verses/audio)
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
