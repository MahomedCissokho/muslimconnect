/**
 * Build audio URL for a specific ayah from the Islamic Network CDN.
 *
 * @param reciterId - The reciter identifier (e.g. "ar.alafasy")
 * @param globalAyahNumber - The global ayah number (1-6236)
 * @returns The full URL to the MP3 audio file
 */
export function buildAudioUrl(reciterId: string, globalAyahNumber: number): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyahNumber}.mp3`;
}
