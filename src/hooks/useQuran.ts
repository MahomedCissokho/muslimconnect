import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { quranService } from '../services/quran';
import type { HizbData, HizbListItem, JuzData, JuzListItem, PageData, PageListItem, QuranMeta, SurahData } from '../types';

// Types de retour des hooks
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

export interface UseJuzReturn {
  data: JuzData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseJuzListReturn {
  data: JuzListItem[];
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

export interface UsePageListReturn {
  data: PageListItem[];
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

export interface UseHizbListReturn {
  data: HizbListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useQuranMeta = (): UseQuranMetaReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<QuranMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeta = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const meta = await quranService.getMeta();
      setData(meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  return { data, loading, error, refetch: fetchMeta };
};

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

export const useJuzList = (): UseJuzListReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<JuzListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJuzList = useCallback(async () => {
    console.log('[useJuzList] Fetching juz list');
    try {
      setLoading(true);
      setError(null);
      const juzList = await quranService.getJuzList();
      console.log('[useJuzList] Fetched', juzList.length, 'juz');
      setData(juzList);
    } catch (err) {
      console.error('[useJuzList] Error:', err);
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchJuzList();
  }, [fetchJuzList]);

  return { data, loading, error, refetch: fetchJuzList };
};

// Hook pour récupérer une page spécifique
export const usePage = (pageNumber: number | null, edition?: string): UsePageReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async () => {
    if (!pageNumber) return;
    
    console.log('[usePage] Fetching page:', pageNumber);
    try {
      setLoading(true);
      setError(null);
      const page = await quranService.getPage(pageNumber, edition);
      console.log('[usePage] Page fetched successfully:', page);
      setData(page);
    } catch (err) {
      console.error('[usePage] Error:', err);
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

// Hook pour récupérer la liste des pages
export const usePageList = (): UsePageListReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageList = useCallback(async () => {
    console.log('[usePageList] Fetching page list');
    try {
      setLoading(true);
      setError(null);
      const pageList = await quranService.getPageList();
      console.log('[usePageList] Fetched', pageList.length, 'pages');
      setData(pageList);
    } catch (err) {
      console.error('[usePageList] Error:', err);
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPageList();
  }, [fetchPageList]);

  return { data, loading, error, refetch: fetchPageList };
};

// Hook pour récupérer un Hizb spécifique
export const useHizb = (hizbNumber: number | null, edition?: string): UseHizbReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<HizbData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHizb = useCallback(async () => {
    if (!hizbNumber) return;
    
    console.log('[useHizb] Fetching hizb:', hizbNumber);
    try {
      setLoading(true);
      setError(null);
      const hizb = await quranService.getHizb(hizbNumber, edition);
      console.log('[useHizb] Hizb fetched successfully:', hizb);
      setData(hizb);
    } catch (err) {
      console.error('[useHizb] Error:', err);
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

// Hook pour récupérer la liste des Hizb
export const useHizbList = (): UseHizbListReturn => {
  const { t } = useTranslation();
  const [data, setData] = useState<HizbListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHizbList = useCallback(async () => {
    console.log('[useHizbList] Fetching hizb list');
    try {
      setLoading(true);
      setError(null);
      const hizbList = await quranService.getHizbList();
      console.log('[useHizbList] Fetched', hizbList.length, 'hizb quarters');
      setData(hizbList);
    } catch (err) {
      console.error('[useHizbList] Error:', err);
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHizbList();
  }, [fetchHizbList]);

  return { data, loading, error, refetch: fetchHizbList };
};
