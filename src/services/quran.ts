import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import i18n from '../i18n';
import type { ApiResponse, HizbData, HizbListItem, JuzData, JuzListItem, PageData, PageListItem, QuranMeta, SurahData } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type ErrorCode = 'network' | 'notFound' | 'server' | 'timeout' | 'generic';

const getErrorMessage = (code: ErrorCode): string => {
  return i18n.t(`errors.${code}`);
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error(getErrorMessage('timeout'));
    }
    if (error.response?.status === 404) {
      throw new Error(getErrorMessage('notFound'));
    }
    if (error.response?.status >= 500) {
      throw new Error(getErrorMessage('server'));
    }
    throw new Error(getErrorMessage('network'));
  }
);

// Clés de stockage AsyncStorage
const STORAGE_KEYS = {
  JUZ_LIST: '@quran/juz_list',
  PAGE_LIST: '@quran/page_list',
  HIZB_LIST: '@quran/hizb_list',
  LAST_UPDATE: '@quran/last_update',
};

// Durée de validité du cache (7 jours)
const CACHE_VALIDITY_MS = 7 * 24 * 60 * 60 * 1000;

// Cache en mémoire pour les métadonnées
let juzListCache: JuzListItem[] | null = null;
let pageListCache: PageListItem[] | null = null;
let hizbListCache: HizbListItem[] | null = null;

// Flags pour suivre les chargements en cours
let isLoadingJuzList = false;
let isLoadingPageList = false;
let isLoadingHizbList = false;

// Helpers pour AsyncStorage
const loadFromStorage = async <T,>(key: string): Promise<T | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[QuranService] Error loading from storage (${key}):`, error);
    return null;
  }
};

const saveToStorage = async <T,>(key: string, data: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[QuranService] Error saving to storage (${key}):`, error);
  }
};

const isCacheValid = async (): Promise<boolean> => {
  try {
    const lastUpdate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    if (!lastUpdate) return false;

    const lastUpdateTime = parseInt(lastUpdate, 10);
    const now = Date.now();
    return (now - lastUpdateTime) < CACHE_VALIDITY_MS;
  } catch {
    return false;
  }
};

export const quranService = {
  async getMeta(): Promise<QuranMeta> {
    const response = await apiClient.get<ApiResponse<QuranMeta>>('/meta');
    
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    
    return response.data.data;
  },

  async getSurah(number: number): Promise<SurahData> {
    const response = await apiClient.get<ApiResponse<SurahData>>(`/surah/${number}`);
    
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    
    return response.data.data;
  },

  async getSurahWithTranslation(number: number, edition = 'fr.hamidullah'): Promise<SurahData> {
    const response = await apiClient.get<ApiResponse<SurahData>>(`/surah/${number}/${edition}`);

    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }

    return response.data.data;
  },

  async getSurahWithAudio(number: number, audioEdition = 'ar.alafasy'): Promise<SurahData> {
    const response = await apiClient.get<ApiResponse<SurahData>>(`/surah/${number}/${audioEdition}`);

    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }

    return response.data.data;
  },

  async getJuz(juzNumber: number, edition = 'quran-uthmani'): Promise<JuzData> {
    const response = await apiClient.get<ApiResponse<JuzData>>(`/juz/${juzNumber}/${edition}`);
    
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    
    return response.data.data;
  },

  async getJuzWithTranslation(juzNumber: number, edition = 'fr.hamidullah'): Promise<JuzData> {
    const response = await apiClient.get<ApiResponse<JuzData>>(`/juz/${juzNumber}/${edition}`);
    
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    
    return response.data.data;
  },

  async getJuzList(): Promise<JuzListItem[]> {
    // Return from memory cache if available
    if (juzListCache) {
      return juzListCache;
    }

    // Try to load from AsyncStorage first for instant return
    const storedData = await loadFromStorage<JuzListItem[]>(STORAGE_KEYS.JUZ_LIST);
    if (storedData && storedData.length > 0) {
      juzListCache = storedData;

      // Check if cache is still valid in background
      const cacheValid = await isCacheValid();
      if (!cacheValid && !isLoadingJuzList) {
        // Refresh data in background without blocking
        isLoadingJuzList = true;
        this.refreshJuzList().catch((error) => {
          console.error('[QuranService] Error refreshing Juz list:', error);
          isLoadingJuzList = false;
        });
      }

      return storedData;
    }

    // No cached data - fetch fresh data
    if (isLoadingJuzList) {
      // Wait for ongoing fetch
      return new Promise((resolve) => {
        const checkCache = setInterval(() => {
          if (juzListCache) {
            clearInterval(checkCache);
            resolve(juzListCache);
          }
        }, 100);
      });
    }

    isLoadingJuzList = true;
    const juzList = await this.refreshJuzList();
    isLoadingJuzList = false;
    return juzList;
  },

  async refreshJuzList(): Promise<JuzListItem[]> {
    const juzList: JuzListItem[] = [];

    for (let juzNum = 1; juzNum <= 30; juzNum++) {
      const juzData = await this.getJuz(juzNum);
      const ayahs = juzData.ayahs;

      if (ayahs.length > 0) {
        const firstAyah = ayahs[0];
        const lastAyah = ayahs[ayahs.length - 1];

        juzList.push({
          number: juzNum,
          startSurah: firstAyah.surah.englishName,
          startAyah: firstAyah.numberInSurah,
          endSurah: lastAyah.surah.englishName,
          endAyah: lastAyah.numberInSurah,
        });
      }
    }

    // Save to both memory and storage
    juzListCache = juzList;
    await saveToStorage(STORAGE_KEYS.JUZ_LIST, juzList);
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());

    return juzList;
  },

  // Récupérer une page spécifique
  async getPage(pageNumber: number, edition = 'quran-uthmani'): Promise<PageData> {
    console.log('[QuranService] getPage called with:', { pageNumber, edition });
    const response = await apiClient.get<ApiResponse<PageData>>(`/page/${pageNumber}/${edition}`);
    console.log('[QuranService] getPage response:', response.data);
    
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    
    return response.data.data;
  },

  // Récupérer la liste de toutes les pages (604 pages dans le Mushaf)
  async getPageList(): Promise<PageListItem[]> {
    console.log('[QuranService] getPageList called');

    // Return from memory cache if available
    if (pageListCache) {
      console.log('[QuranService] Returning cached page list');
      return pageListCache;
    }

    // Try to load from AsyncStorage first for instant return
    const storedData = await loadFromStorage<PageListItem[]>(STORAGE_KEYS.PAGE_LIST);
    if (storedData && storedData.length > 0) {
      console.log('[QuranService] Returning stored page list');
      pageListCache = storedData;

      // Check if cache is still valid in background
      const cacheValid = await isCacheValid();
      if (!cacheValid && !isLoadingPageList) {
        // Refresh data in background without blocking
        console.log('[QuranService] Refreshing page list in background');
        isLoadingPageList = true;
        this.refreshPageList().catch((error) => {
          console.error('[QuranService] Error refreshing Page list:', error);
          isLoadingPageList = false;
        });
      }

      return storedData;
    }

    // No cached data - fetch fresh data
    if (isLoadingPageList) {
      // Wait for ongoing fetch
      return new Promise((resolve) => {
        const checkCache = setInterval(() => {
          if (pageListCache) {
            clearInterval(checkCache);
            resolve(pageListCache);
          }
        }, 100);
      });
    }

    console.log('[QuranService] No cache found - fetching page list');
    isLoadingPageList = true;
    const pageList = await this.refreshPageList();
    isLoadingPageList = false;
    return pageList;
  },

  async refreshPageList(): Promise<PageListItem[]> {
    const pageList: PageListItem[] = [];

    // Récupérer les données pour chaque page (604 pages au total)
    for (let pageNum = 1; pageNum <= 604; pageNum++) {
      try {
        const pageData = await this.getPage(pageNum);
        const ayahs = pageData.ayahs;

        if (ayahs.length > 0) {
          const firstAyah = ayahs[0];
          const lastAyah = ayahs[ayahs.length - 1];

          pageList.push({
            number: pageNum,
            startSurah: firstAyah.surah.number,
            startSurahName: firstAyah.surah.englishName,
            startAyah: firstAyah.numberInSurah,
            endSurah: lastAyah.surah.number,
            endSurahName: lastAyah.surah.englishName,
            endAyah: lastAyah.numberInSurah,
            juz: firstAyah.juz,
          });
        }
      } catch (error) {
        console.error(`[QuranService] Error fetching page ${pageNum}:`, error);
      }
    }

    // Save to both memory and storage
    pageListCache = pageList;
    await saveToStorage(STORAGE_KEYS.PAGE_LIST, pageList);
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());

    console.log('[QuranService] refreshPageList returning', pageList.length, 'pages');
    return pageList;
  },

  // Récupérer un Hizb spécifique (quart de Hizb)
  async getHizb(hizbNumber: number, edition = 'quran-uthmani'): Promise<HizbData> {
    console.log('[QuranService] getHizb called with:', { hizbNumber, edition });
    const response = await apiClient.get<ApiResponse<HizbData>>(`/hizbQuarter/${hizbNumber}/${edition}`);
    console.log('[QuranService] getHizb response:', response.data);
    
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    
    return response.data.data;
  },

  // Récupérer la liste de tous les Hizb quarters (240 au total)
  async getHizbList(): Promise<HizbListItem[]> {
    console.log('[QuranService] getHizbList called');

    // Return from memory cache if available
    if (hizbListCache) {
      console.log('[QuranService] Returning cached hizb list');
      return hizbListCache;
    }

    // Try to load from AsyncStorage first for instant return
    const storedData = await loadFromStorage<HizbListItem[]>(STORAGE_KEYS.HIZB_LIST);
    if (storedData && storedData.length > 0) {
      console.log('[QuranService] Returning stored hizb list');
      hizbListCache = storedData;

      // Check if cache is still valid in background
      const cacheValid = await isCacheValid();
      if (!cacheValid && !isLoadingHizbList) {
        // Refresh data in background without blocking
        console.log('[QuranService] Refreshing hizb list in background');
        isLoadingHizbList = true;
        this.refreshHizbList().catch((error) => {
          console.error('[QuranService] Error refreshing Hizb list:', error);
          isLoadingHizbList = false;
        });
      }

      return storedData;
    }

    // No cached data - fetch fresh data
    if (isLoadingHizbList) {
      // Wait for ongoing fetch
      return new Promise((resolve) => {
        const checkCache = setInterval(() => {
          if (hizbListCache) {
            clearInterval(checkCache);
            resolve(hizbListCache);
          }
        }, 100);
      });
    }

    console.log('[QuranService] No cache found - fetching hizb list');
    isLoadingHizbList = true;
    const hizbList = await this.refreshHizbList();
    isLoadingHizbList = false;
    return hizbList;
  },

  async refreshHizbList(): Promise<HizbListItem[]> {
    const hizbList: HizbListItem[] = [];

    // Il y a 240 quarts de Hizb (Hizb Quarters) dans le Coran
    for (let hizbQuarterNum = 1; hizbQuarterNum <= 240; hizbQuarterNum++) {
      try {
        const hizbData = await this.getHizb(hizbQuarterNum);
        const ayahs = hizbData.ayahs;

        if (ayahs.length > 0) {
          const firstAyah = ayahs[0];
          const lastAyah = ayahs[ayahs.length - 1];

          hizbList.push({
            hizbQuarter: hizbQuarterNum,
            startSurah: firstAyah.surah.number,
            startSurahName: firstAyah.surah.englishName,
            startAyah: firstAyah.numberInSurah,
            endSurah: lastAyah.surah.number,
            endSurahName: lastAyah.surah.englishName,
            endAyah: lastAyah.numberInSurah,
            juz: firstAyah.juz,
          });
        }
      } catch (error) {
        console.error(`[QuranService] Error fetching hizb quarter ${hizbQuarterNum}:`, error);
      }
    }

    // Save to both memory and storage
    hizbListCache = hizbList;
    await saveToStorage(STORAGE_KEYS.HIZB_LIST, hizbList);
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());

    console.log('[QuranService] refreshHizbList returning', hizbList.length, 'hizb quarters');
    return hizbList;
  },

  // Fonction pour précharger toutes les métadonnées en arrière-plan
  async preloadMetadata(): Promise<void> {
    console.log('[QuranService] Starting metadata preload');

    // Précharger les Juz (rapide - 30 appels)
    if (!juzListCache && !isLoadingJuzList) {
      isLoadingJuzList = true;
      this.getJuzList()
        .then(() => {
          console.log('[QuranService] Juz metadata preloaded');
          isLoadingJuzList = false;
        })
        .catch((error) => {
          console.error('[QuranService] Error preloading Juz metadata:', error);
          isLoadingJuzList = false;
        });
    }

    // Précharger les Pages (long - 604 appels) - en arrière-plan
    if (!pageListCache && !isLoadingPageList) {
      isLoadingPageList = true;
      this.getPageList()
        .then(() => {
          console.log('[QuranService] Page metadata preloaded');
          isLoadingPageList = false;
        })
        .catch((error) => {
          console.error('[QuranService] Error preloading Page metadata:', error);
          isLoadingPageList = false;
        });
    }

    // Précharger les Hizb Quarters (long - 240 appels) - en arrière-plan
    if (!hizbListCache && !isLoadingHizbList) {
      isLoadingHizbList = true;
      this.getHizbList()
        .then(() => {
          console.log('[QuranService] Hizb metadata preloaded');
          isLoadingHizbList = false;
        })
        .catch((error) => {
          console.error('[QuranService] Error preloading Hizb metadata:', error);
          isLoadingHizbList = false;
        });
    }
  },

  // Fonction pour nettoyer le cache si nécessaire
  clearCache(): void {
    juzListCache = null;
    pageListCache = null;
    hizbListCache = null;
    isLoadingJuzList = false;
    isLoadingPageList = false;
    isLoadingHizbList = false;
    console.log('[QuranService] Cache cleared');
  },
};
