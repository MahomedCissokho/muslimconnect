/**
 * Build audio URL for a specific ayah from the Islamic Network CDN.
 * Used for all reciters whose `everyayahFolder` is NOT set.
 */
export function buildAudioUrl(reciterId: string, globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyahNumber}.mp3`;
}

/**
 * Build audio URL from everyayah.com for reciters not on the Islamic Network CDN.
 * Format: /data/{folder}/{SSS}{AAA}.mp3
 *   SSS = surah number zero-padded to 3 digits
 *   AAA = ayah number in surah zero-padded to 3 digits
 */
export function buildEveryayahAudioUrl(
  folder: string,
  surahNumber: number,
  ayahNumberInSurah: number,
): string {
  const s = String(surahNumber).padStart(3, '0');
  const a = String(ayahNumberInSurah).padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${s}${a}.mp3`;
}
