import axios from 'axios';

import i18n from '../i18n';
import type { ApiResponse, HizbData, JuzData, PageData, SurahData } from '../types';

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

/**
 * Service API Quran - uniquement pour le contenu (versets, audio, traductions).
 * Les métadonnées (liste sourates, juz, pages, hizb) sont en local dans src/data/.
 */
export const quranService = {
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

  async getPage(pageNumber: number, edition = 'quran-uthmani'): Promise<PageData> {
    const response = await apiClient.get<ApiResponse<PageData>>(`/page/${pageNumber}/${edition}`);
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    return response.data.data;
  },

  async getHizb(hizbNumber: number, edition = 'quran-uthmani'): Promise<HizbData> {
    const response = await apiClient.get<ApiResponse<HizbData>>(`/hizbQuarter/${hizbNumber}/${edition}`);
    if (response.data.code !== 200) {
      throw new Error(getErrorMessage('generic'));
    }
    return response.data.data;
  },
};