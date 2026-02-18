// ─── HadeethEnc API Service ──────────────────────────────────────────────────
// API: https://hadeethenc.com/api/v1/
// Free, no API key required. Provides Arabic + multi-language translations.

const BASE_URL = "https://hadeethenc.com/api/v1";

export interface HadeethCategory {
  id: string;
  title: string;
  hadeeths_count: number;
}

export interface HadeethListItem {
  id: string;
  title: string;
  hadeeth: string; // Arabic with tashkeel (diacritics)
  without_tashkeel: string; // Arabic without diacritics
  attribution: string; // Narrator / source
  grade: string; // Authenticity grade
}

export interface HadeethDetail extends HadeethListItem {
  body: string; // Full translation text
  hints: string[];
  words_meanings: { word: string; meaning: string }[];
}

interface ApiListResponse {
  data: HadeethListItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

// ─── Fetch root categories ────────────────────────────────────────────────────

export async function fetchHadeethCategories(
  language: string,
): Promise<HadeethCategory[]> {
  const lang = language === "fr" ? "fr" : "en";
  const res = await fetch(
    `${BASE_URL}/categories/roots/?language=${lang}`,
  );
  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
  return res.json();
}

// ─── Fetch hadiths list for a category ───────────────────────────────────────

export async function fetchHadeethList(
  categoryId: string,
  language: string,
  page = 1,
  perPage = 20,
): Promise<{ items: HadeethListItem[]; hasMore: boolean }> {
  const lang = language === "fr" ? "fr" : "en";
  const res = await fetch(
    `${BASE_URL}/hadiths/list/?language=${lang}&category_id=${categoryId}&page=${page}&per_page=${perPage}`,
  );
  if (!res.ok) throw new Error(`Hadiths fetch failed: ${res.status}`);
  const json: ApiListResponse = await res.json();
  return {
    items: json.data ?? [],
    hasMore: (json.meta?.current_page ?? 1) < (json.meta?.last_page ?? 1),
  };
}

// ─── Fetch single hadith detail ───────────────────────────────────────────────

export async function fetchHadeethDetail(
  id: string,
  language: string,
): Promise<HadeethDetail> {
  const lang = language === "fr" ? "fr" : "en";
  const res = await fetch(
    `${BASE_URL}/hadiths/one/?id=${id}&language=${lang}`,
  );
  if (!res.ok) throw new Error(`Hadith detail fetch failed: ${res.status}`);
  return res.json();
}
