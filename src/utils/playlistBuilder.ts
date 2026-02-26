import { HIZB_QUARTERS, JUZ_LIST, PAGES, SURAHS } from '../data';
import { RECITERS } from '../data/reciters';
import type { AudioOrigin, AudioTrack } from '../services/audio';
import { buildAudioUrl, buildEveryayahAudioUrl } from './audioUrl';

// Pre-compute the global ayah number where each surah starts (1-based)
const surahGlobalStart: Record<number, number> = {};
let _cumulative = 1;
for (const s of [...SURAHS].sort((a, b) => a.number - b.number)) {
  surahGlobalStart[s.number] = _cumulative;
  _cumulative += s.numberOfAyahs;
}

function globalAyah(surahNumber: number, ayahInSurah: number): number {
  return (surahGlobalStart[surahNumber] ?? 1) + ayahInSurah - 1;
}

function trackUrl(
  reciterId: string,
  globalAyahNum: number,
  surahNumber: number,
  ayahInSurah: number,
): string {
  const reciter = RECITERS.find((r) => r.id === reciterId);
  if (reciter?.everyayahFolder) {
    return buildEveryayahAudioUrl(reciter.everyayahFolder, surahNumber, ayahInSurah);
  }
  return buildAudioUrl(reciterId, globalAyahNum);
}

function makeTrack(
  surahNumber: number,
  ayahInSurah: number,
  reciterId: string,
  origin: AudioOrigin,
): AudioTrack {
  const g = globalAyah(surahNumber, ayahInSurah);
  return {
    globalAyahNumber: g,
    surahNumber,
    ayahNumberInSurah: ayahInSurah,
    audioUrl: trackUrl(reciterId, g, surahNumber, ayahInSurah),
    origin,
  };
}

/** Build ayahs between two positions (inclusive) across multiple surahs */
function buildRangePlaylist(
  startSurah: number,
  startAyah: number,
  endSurah: number,
  endAyah: number,
  reciterId: string,
  origin: AudioOrigin,
): AudioTrack[] {
  const tracks: AudioTrack[] = [];
  for (let s = startSurah; s <= endSurah; s++) {
    const surah = SURAHS.find((x) => x.number === s);
    if (!surah) continue;
    const from = s === startSurah ? startAyah : 1;
    const to = s === endSurah ? endAyah : surah.numberOfAyahs;
    for (let a = from; a <= to; a++) {
      tracks.push(makeTrack(s, a, reciterId, origin));
    }
  }
  return tracks;
}

// ─── Public builders ──────────────────────────────────────────────────────────

export function buildSurahPlaylist(surahNumber: number, reciterId: string): AudioTrack[] {
  if (surahNumber < 1 || surahNumber > 114) return [];
  const surah = SURAHS.find((s) => s.number === surahNumber);
  if (!surah) return [];
  const origin: AudioOrigin = { type: 'surah', id: surahNumber };
  const tracks: AudioTrack[] = [];
  for (let a = 1; a <= surah.numberOfAyahs; a++) {
    tracks.push(makeTrack(surahNumber, a, reciterId, origin));
  }
  return tracks;
}

export function buildJuzPlaylist(juzNumber: number, reciterId: string): AudioTrack[] {
  if (juzNumber < 1 || juzNumber > 30) return [];
  const juz = JUZ_LIST.find((j) => j.number === juzNumber);
  if (!juz) return [];
  return buildRangePlaylist(
    juz.startSurah, juz.startAyah,
    juz.endSurah, juz.endAyah,
    reciterId,
    { type: 'juz', id: juzNumber },
  );
}

export function buildPagePlaylist(pageNumber: number, reciterId: string): AudioTrack[] {
  if (pageNumber < 1 || pageNumber > 604) return [];
  const idx = PAGES.findIndex((p) => p.number === pageNumber);
  if (idx === -1) return [];
  const page = PAGES[idx];
  const nextPage = PAGES[idx + 1];

  let endSurah: number;
  let endAyah: number;
  if (nextPage) {
    if (nextPage.startAyah === 1) {
      const prev = SURAHS.find((s) => s.number === nextPage.startSurah - 1);
      endSurah = prev?.number ?? nextPage.startSurah;
      endAyah = prev?.numberOfAyahs ?? 1;
    } else {
      endSurah = nextPage.startSurah;
      endAyah = nextPage.startAyah - 1;
    }
  } else {
    endSurah = 114;
    endAyah = SURAHS.find((s) => s.number === 114)?.numberOfAyahs ?? 6;
  }

  return buildRangePlaylist(
    page.startSurah, page.startAyah,
    endSurah, endAyah,
    reciterId,
    { type: 'page', id: pageNumber },
  );
}

export function buildHizbPlaylist(hizbNumber: number, reciterId: string): AudioTrack[] {
  if (hizbNumber < 1 || hizbNumber > 60) return [];
  const quarters = HIZB_QUARTERS.filter((q) => q.hizb === hizbNumber)
    .sort((a, b) => a.quarter - b.quarter);
  if (quarters.length === 0) return [];
  const firstQ = quarters[0];

  const nextQuarters = HIZB_QUARTERS.filter((q) => q.hizb === hizbNumber + 1)
    .sort((a, b) => a.quarter - b.quarter);

  let endSurah: number;
  let endAyah: number;
  if (nextQuarters.length > 0) {
    const nextFirst = nextQuarters[0];
    if (nextFirst.startAyah === 1) {
      const prev = SURAHS.find((s) => s.number === nextFirst.startSurah - 1);
      endSurah = prev?.number ?? nextFirst.startSurah;
      endAyah = prev?.numberOfAyahs ?? 1;
    } else {
      endSurah = nextFirst.startSurah;
      endAyah = nextFirst.startAyah - 1;
    }
  } else {
    endSurah = 114;
    endAyah = SURAHS.find((s) => s.number === 114)?.numberOfAyahs ?? 6;
  }

  return buildRangePlaylist(
    firstQ.startSurah, firstQ.startAyah,
    endSurah, endAyah,
    reciterId,
    { type: 'hizb', id: hizbNumber },
  );
}
