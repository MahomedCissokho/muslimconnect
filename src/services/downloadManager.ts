import * as FileSystem from 'expo-file-system/legacy';

export interface DownloadEntry {
  status: 'pending' | 'downloading' | 'complete' | 'error';
  totalAyahs: number;
  downloadedAyahs: number;
}

export type DownloadManifest = Record<string, DownloadEntry>; // key = "reciterId:surahNumber"

class DownloadManager {
  private manifest: DownloadManifest = {};
  private listeners = new Set<(manifest: DownloadManifest) => void>();
  private abortControllers = new Map<string, boolean>(); // key -> shouldAbort

  async initialize(): Promise<void> {
    // Load manifest from downloads.json
    const manifestPath = FileSystem.documentDirectory + 'downloads.json';
    const info = await FileSystem.getInfoAsync(manifestPath);
    if (info.exists) {
      const content = await FileSystem.readAsStringAsync(manifestPath);
      this.manifest = JSON.parse(content);
    }
  }

  private async saveManifest() {
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + 'downloads.json',
      JSON.stringify(this.manifest)
    );
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.manifest }));
  }

  subscribe(listener: (manifest: DownloadManifest) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getManifest(): DownloadManifest { return { ...this.manifest }; }

  getKey(reciterId: string, surahNumber: number): string {
    return `${reciterId}:${surahNumber}`;
  }

  isSurahDownloaded(reciterId: string, surahNumber: number): boolean {
    return this.manifest[this.getKey(reciterId, surahNumber)]?.status === 'complete';
  }

  getDownloadProgress(reciterId: string, surahNumber: number): DownloadEntry | null {
    return this.manifest[this.getKey(reciterId, surahNumber)] || null;
  }

  getLocalAudioPath(reciterId: string, surahNumber: number, globalAyahNumber: number): string {
    return `${FileSystem.documentDirectory}audio/${reciterId}/${surahNumber}/${globalAyahNumber}.mp3`;
  }

  async isAyahDownloaded(reciterId: string, surahNumber: number, globalAyahNumber: number): Promise<boolean> {
    const path = this.getLocalAudioPath(reciterId, surahNumber, globalAyahNumber);
    const info = await FileSystem.getInfoAsync(path);
    return info.exists;
  }

  async downloadSurah(
    reciterId: string,
    surahNumber: number,
    ayahGlobalNumbers: number[],
    onProgress?: (downloaded: number, total: number) => void
  ): Promise<void> {
    const key = this.getKey(reciterId, surahNumber);
    const dir = `${FileSystem.documentDirectory}audio/${reciterId}/${surahNumber}/`;

    // Create directory
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    this.abortControllers.set(key, false);
    this.manifest[key] = { status: 'downloading', totalAyahs: ayahGlobalNumbers.length, downloadedAyahs: 0 };
    this.notify();

    let downloaded = 0;
    for (const globalNum of ayahGlobalNumbers) {
      if (this.abortControllers.get(key)) {
        this.manifest[key].status = 'error';
        this.notify();
        await this.saveManifest();
        return;
      }

      const url = `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalNum}.mp3`;
      const filePath = `${dir}${globalNum}.mp3`;

      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        try {
          await FileSystem.downloadAsync(url, filePath);
        } catch (error) {
          console.error(`[DownloadManager] Error downloading ayah ${globalNum}:`, error);
          // Continue with next ayah
        }
      }

      downloaded++;
      this.manifest[key].downloadedAyahs = downloaded;
      this.notify();
      onProgress?.(downloaded, ayahGlobalNumbers.length);
    }

    this.manifest[key].status = 'complete';
    this.notify();
    await this.saveManifest();
  }

  cancelDownload(reciterId: string, surahNumber: number) {
    this.abortControllers.set(this.getKey(reciterId, surahNumber), true);
  }

  async deleteSurahAudio(reciterId: string, surahNumber: number): Promise<void> {
    const dir = `${FileSystem.documentDirectory}audio/${reciterId}/${surahNumber}/`;
    const info = await FileSystem.getInfoAsync(dir);
    if (info.exists) {
      await FileSystem.deleteAsync(dir, { idempotent: true });
    }
    delete this.manifest[this.getKey(reciterId, surahNumber)];
    this.notify();
    await this.saveManifest();
  }

  async getStorageUsed(): Promise<number> {
    const audioDir = `${FileSystem.documentDirectory}audio/`;
    const info = await FileSystem.getInfoAsync(audioDir);
    if (!info.exists) return 0;
    // Approximate by counting files
    return info.size || 0;
  }
}

export const downloadManager = new DownloadManager();
