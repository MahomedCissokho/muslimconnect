import type { Ionicons } from '@expo/vector-icons';

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface HijriDate {
  day: string;
  month: { en: string; ar: string };
  year: string;
  designation: { abbreviated: string };
}

export interface AladhanResponse {
  data: {
    timings: PrayerTimings & Record<string, string>;
    date: {
      readable: string;
      hijri: HijriDate;
    };
  };
}

export interface PrayerInfo {
  key: keyof PrayerTimings;
  translationKey: string;
  arabicName: string;
  icon: keyof typeof Ionicons.glyphMap;
  time: string;
}

export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

/** Qibla alignment threshold in degrees */
export const QIBLA_THRESHOLD = 5;
