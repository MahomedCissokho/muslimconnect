import React, { createContext, useContext, useEffect, useState } from 'react';
import { downloadManager, type DownloadManifest } from '../services/downloadManager';

interface DownloadContextValue {
  manifest: DownloadManifest;
  downloadSurah: (reciterId: string, surahNumber: number, ayahGlobalNumbers: number[]) => Promise<void>;
  cancelDownload: (reciterId: string, surahNumber: number) => void;
  deleteSurahAudio: (reciterId: string, surahNumber: number) => Promise<void>;
  isSurahDownloaded: (reciterId: string, surahNumber: number) => boolean;
  getLocalAudioPath: (reciterId: string, surahNumber: number, globalAyahNumber: number) => string;
  isInitialized: boolean;
}

const DownloadContext = createContext<DownloadContextValue | null>(null);

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [manifest, setManifest] = useState<DownloadManifest>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await downloadManager.initialize();
      setManifest(downloadManager.getManifest());
      setIsInitialized(true);
    };
    init();

    const unsubscribe = downloadManager.subscribe((updatedManifest) => {
      setManifest(updatedManifest);
    });

    return unsubscribe;
  }, []);

  const downloadSurah = async (
    reciterId: string,
    surahNumber: number,
    ayahGlobalNumbers: number[]
  ) => {
    await downloadManager.downloadSurah(reciterId, surahNumber, ayahGlobalNumbers);
  };

  const cancelDownload = (reciterId: string, surahNumber: number) => {
    downloadManager.cancelDownload(reciterId, surahNumber);
  };

  const deleteSurahAudio = async (reciterId: string, surahNumber: number) => {
    await downloadManager.deleteSurahAudio(reciterId, surahNumber);
  };

  const isSurahDownloaded = (reciterId: string, surahNumber: number) => {
    return downloadManager.isSurahDownloaded(reciterId, surahNumber);
  };

  const getLocalAudioPath = (
    reciterId: string,
    surahNumber: number,
    globalAyahNumber: number
  ) => {
    return downloadManager.getLocalAudioPath(reciterId, surahNumber, globalAyahNumber);
  };

  return (
    <DownloadContext.Provider
      value={{
        manifest,
        downloadSurah,
        cancelDownload,
        deleteSurahAudio,
        isSurahDownloaded,
        getLocalAudioPath,
        isInitialized,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownload(): DownloadContextValue {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownload must be used within a DownloadProvider');
  }
  return context;
}
