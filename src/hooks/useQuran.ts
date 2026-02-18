import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { quranService } from '../services/quran';
import type { HizbData, JuzData, PageData, SurahData } from '../types';

export interface UseSurahReturn {
  data: SurahData | null;
  loading: boolean;
  error: string | null;
}

export interface UseJuzReturn {
  data: JuzData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePageReturn {
  data: PageData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseHizbReturn {
  data: HizbData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch le contenu d'une sourate (versets arabes) depuis l'API.
 * Pour la liste des sourates, utiliser SURAHS depuis src/data/.
 */
export const useSurah = (surahNumber: number | null): UseSurahReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surahNumber) return;

    const fetchSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        const surah = await quranService.getSurah(surahNumber);
        setData(surah);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.generic'));
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahNumber, t]);

  return { data, loading, error };
};

/**
 * Fetch le contenu d'un juz (versets) depuis l'API.
 * Pour la liste des juz, utiliser JUZ_LIST depuis src/data/.
 */
export const useJuz = (juzNumber: number | null, edition?: string): UseJuzReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<JuzData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJuz = useCallback(async () => {
    if (!juzNumber) return;

    try {
      setLoading(true);
      setError(null);
      const juz = await quranService.getJuz(juzNumber, edition);
      setData(juz);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [juzNumber, edition, t]);

  useEffect(() => {
    fetchJuz();
  }, [fetchJuz]);

  return { data, loading, error, refetch: fetchJuz };
};

/**
 * Fetch le contenu d'une page (versets) depuis l'API.
 * Pour la liste des pages, utiliser PAGES depuis src/data/.
 */
export const usePage = (pageNumber: number | null, edition?: string): UsePageReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (!pageNumber) return;

    try {
      setLoading(true);
      setError(null);
      const page = await quranService.getPage(pageNumber, edition);
      setData(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [pageNumber, edition, t]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { data, loading, error, refetch: fetchPage };
};

/**
 * Fetch le contenu d'un hizb quarter (versets) depuis l'API.
 * Pour la liste des hizb, utiliser HIZB_QUARTERS depuis src/data/.
 */
export const useHizb = (hizbNumber: number | null, edition?: string): UseHizbReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<HizbData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHizb = useCallback(async () => {
    if (!hizbNumber) return;

    try {
      setLoading(true);
      setError(null);
      const hizb = await quranService.getHizb(hizbNumber, edition);
      setData(hizb);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [hizbNumber, edition, t]);

  useEffect(() => {
    fetchHizb();
  }, [fetchHizb]);

  return { data, loading, error, refetch: fetchHizb };
};