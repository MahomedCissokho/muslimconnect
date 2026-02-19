import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../src/constants";
import { ALL_DUAS } from "../src/data/duas";
import { ALL_HADITHS } from "../src/data/hadiths";
import type { SurahInfo } from "../src/data/surahs";
import { SURAHS } from "../src/data/surahs";
import type { Dua, Hadith } from "../src/types";

// ─── Types ──────────────────────────────────────

interface SurahResult {
  type: "surah";
  item: SurahInfo;
  id: string;
}
interface HadithResult {
  type: "hadith";
  item: Hadith;
  id: string;
}
interface DuaResult {
  type: "dua";
  item: Dua;
  id: string;
}

// ─── helpers ────────────────────────────────────

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ─── Component ──────────────────────────────────

export default function SearchScreen() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const isFr = i18n.language === "fr";

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const q = normalize(debouncedQuery.trim());

  // ── Search surahs ──────────────────────────────
  const surahResults = useMemo<SurahResult[]>(() => {
    if (!q) return [];
    return SURAHS.filter((s) => {
      const num = String(s.number);
      return (
        normalize(s.englishName).includes(q) ||
        normalize(s.transliteration).includes(q) ||
        normalize(s.englishNameTranslation).includes(q) ||
        normalize(s.frenchNameTranslation).includes(q) ||
        num === q
      );
    })
      .slice(0, 8)
      .map((s) => ({ type: "surah", item: s, id: `surah_${s.number}` }));
  }, [q]);

  // ── Search hadiths ─────────────────────────────
  const hadithResults = useMemo<HadithResult[]>(() => {
    if (q.length < 3) return [];
    return ALL_HADITHS.filter((h) => {
      const text = isFr ? h.textFr : h.textEn;
      const chapter = isFr ? h.chapterFr : h.chapterEn;
      return (
        normalize(text).includes(q) ||
        normalize(chapter).includes(q) ||
        normalize(h.textAr).includes(q)
      );
    })
      .slice(0, 5)
      .map((h) => ({ type: "hadith", item: h, id: `hadith_${h.id}` }));
  }, [q, isFr]);

  // ── Search duas ────────────────────────────────
  const duaResults = useMemo<DuaResult[]>(() => {
    if (q.length < 2) return [];
    return ALL_DUAS.filter((d) => {
      const title = isFr ? d.titleFr : d.titleEn;
      const text = isFr ? d.textFr : d.textEn;
      return (
        normalize(title).includes(q) ||
        normalize(text).includes(q) ||
        normalize(d.textAr).includes(q)
      );
    })
      .slice(0, 5)
      .map((d) => ({ type: "dua", item: d, id: `dua_${d.id}` }));
  }, [q, isFr]);

  const totalResults =
    surahResults.length + hadithResults.length + duaResults.length;
  const hasQuery = q.length > 0;

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // ── Render result items ────────────────────────

  const renderSurahResult = useCallback(
    (result: SurahResult) => {
      const s = result.item;
      return (
        <TouchableOpacity
          key={result.id}
          style={styles.resultCard}
          onPress={() => router.push(`/surah/${s.number}` as any)}
          activeOpacity={0.75}
        >
          <View style={styles.resultLeft}>
            <View style={[styles.typeBadge, { backgroundColor: "#1D3A5F" }]}>
              <Text style={styles.typeBadgeText}>
                {isFr ? "Sourate" : "Surah"}
              </Text>
            </View>
            <Text style={styles.resultTitle}>{s.transliteration}</Text>
            <Text style={styles.resultMeta}>
              {isFr ? s.frenchNameTranslation : s.englishNameTranslation} ·{" "}
              {s.numberOfAyahs} {isFr ? "versets" : "verses"}
            </Text>
          </View>
          <View style={styles.resultRight}>
            <Text style={styles.arabicBadge}>{s.name}</Text>
            <Text style={styles.numberBadge}>#{s.number}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [router, isFr],
  );

  const renderHadithResult = useCallback(
    (result: HadithResult) => {
      const h = result.item;
      const isExpanded = expandedId === result.id;
      const text = isFr ? h.textFr : h.textEn;
      const chapter = isFr ? h.chapterFr : h.chapterEn;
      const narrator = isFr ? h.narratorFr : h.narratorEn;
      const preview = text.length > 120 ? text.slice(0, 120) + "…" : text;

      return (
        <TouchableOpacity
          key={result.id}
          style={styles.resultCard}
          onPress={() => toggleExpand(result.id)}
          activeOpacity={0.75}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.resultRowTop}>
              <View style={[styles.typeBadge, { backgroundColor: "#2D1A4A" }]}>
                <Text style={styles.typeBadgeText}>Hadith</Text>
              </View>
              <Text style={styles.refText}>{h.reference}</Text>
            </View>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {chapter}
            </Text>
            <Text style={styles.resultMeta} numberOfLines={isExpanded ? 0 : 3}>
              {isExpanded ? text : preview}
            </Text>
            {isExpanded && (
              <>
                <Text style={styles.arabicExpanded}>{h.textAr}</Text>
                <Text style={styles.narratorText}>— {narrator}</Text>
              </>
            )}
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={COLORS.gray400}
            style={{ marginLeft: 8, marginTop: 4 }}
          />
        </TouchableOpacity>
      );
    },
    [expandedId, toggleExpand, isFr],
  );

  const renderDuaResult = useCallback(
    (result: DuaResult) => {
      const d = result.item;
      const isExpanded = expandedId === result.id;
      const title = isFr ? d.titleFr : d.titleEn;
      const text = isFr ? d.textFr : d.textEn;
      const ref = isFr ? d.referenceFr : d.referenceEn;

      return (
        <TouchableOpacity
          key={result.id}
          style={styles.resultCard}
          onPress={() => toggleExpand(result.id)}
          activeOpacity={0.75}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.resultRowTop}>
              <View style={[styles.typeBadge, { backgroundColor: "#163320" }]}>
                <Text style={styles.typeBadgeText}>
                  {isFr ? "Invocation" : "Dua"}
                </Text>
              </View>
            </View>
            <Text style={styles.resultTitle}>{title}</Text>
            {isExpanded && (
              <>
                <Text style={styles.arabicExpanded}>{d.textAr}</Text>
                <Text style={styles.resultMeta}>{text}</Text>
                {d.phonetic && (
                  <Text style={styles.phoneticText}>{d.phonetic}</Text>
                )}
                <Text style={styles.refText}>{ref}</Text>
              </>
            )}
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={COLORS.gray400}
            style={{ marginLeft: 8, marginTop: 4 }}
          />
        </TouchableOpacity>
      );
    },
    [expandedId, toggleExpand, isFr],
  );

  // ── Sections ───────────────────────────────────

  const renderSection = (
    label: string,
    count: number,
    children: React.ReactNode,
    color: string,
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: color }]} />
        <Text style={styles.sectionTitle}>{label}</Text>
        <View style={[styles.countPill, { backgroundColor: color + "33" }]}>
          <Text style={[styles.countText, { color }]}>{count}</Text>
        </View>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>

        {/* Search input */}
        <View style={styles.inputWrap}>
          <Ionicons
            name="search"
            size={18}
            color={COLORS.gray400}
            style={styles.inputIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder={
              isFr ? "Sourate, hadith, invocation…" : "Surah, hadith, dua…"
            }
            placeholderTextColor={COLORS.gray500}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.gray500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results count bar */}
      {hasQuery && (
        <View style={styles.countBar}>
          <Text style={styles.countBarText}>
            {debouncedQuery !== query
              ? isFr
                ? "Recherche…"
                : "Searching…"
              : totalResults > 0
                ? `${totalResults} ${isFr ? "résultat(s)" : "result(s)"}`
                : isFr
                  ? "Aucun résultat"
                  : "No results"}
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Empty / initial state */}
        {!hasQuery && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={56} color={COLORS.gray600} />
            <Text style={styles.emptyTitle}>
              {isFr ? "Recherche globale" : "Global search"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isFr
                ? "Cherchez parmi les sourates, hadiths et invocations"
                : "Search across surahs, hadiths and duas"}
            </Text>
            <View style={styles.tipRow}>
              <TipBadge label={isFr ? "Sourates" : "Surahs"} color="#1D3A5F" />
              <TipBadge label="Hadiths" color="#2D1A4A" />
              <TipBadge label={isFr ? "Invocations" : "Duas"} color="#163320" />
            </View>
          </View>
        )}

        {/* No results */}
        {hasQuery && totalResults === 0 && debouncedQuery === query && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.gray600} />
            <Text style={styles.emptyTitle}>
              {isFr ? "Aucun résultat" : "No results"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isFr
                ? `Pas de résultat pour "${query}"`
                : `Nothing found for "${query}"`}
            </Text>
          </View>
        )}

        {/* Surah results */}
        {surahResults.length > 0 &&
          renderSection(
            isFr ? "Sourates" : "Surahs",
            surahResults.length,
            surahResults.map(renderSurahResult),
            COLORS.gold,
          )}

        {/* Hadith results */}
        {hadithResults.length > 0 &&
          renderSection(
            "Hadiths",
            hadithResults.length,
            hadithResults.map(renderHadithResult),
            "#9879E9",
          )}

        {/* Dua results */}
        {duaResults.length > 0 &&
          renderSection(
            isFr ? "Invocations" : "Duas",
            duaResults.length,
            duaResults.map(renderDuaResult),
            "#34D399",
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Small helper ────────────────────────────────

function TipBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.tipBadge, { borderColor: color + "55" }]}>
      <View style={[styles.tipDot, { backgroundColor: color }]} />
      <Text style={[styles.tipLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.whiteAlpha15,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  inputIcon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: 15,
    padding: 0,
  },

  // ── Count bar ──
  countBar: {
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countBarText: {
    color: COLORS.gray400,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },

  // ── Scroll ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING["4xl"],
  },

  // ── Empty ──
  emptyState: {
    alignItems: "center",
    paddingTop: 72,
    paddingHorizontal: SPACING["3xl"],
    gap: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginTop: SPACING.lg,
  },
  emptySubtitle: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  tipRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tipBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: 6,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tipLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },

  // ── Section ──
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionDot: {
    width: 4,
    height: 18,
    borderRadius: 2,
  },
  sectionTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
    flex: 1,
  },
  countPill: {
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },

  // ── Result card ──
  resultCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultLeft: {
    flex: 1,
    gap: 4,
  },
  resultRight: {
    alignItems: "flex-end",
    gap: 4,
    marginLeft: SPACING.md,
  },
  resultRowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  typeBadge: {
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  typeBadgeText: {
    color: COLORS.gray300,
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  resultTitle: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  resultMeta: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  arabicBadge: {
    color: COLORS.gold,
    fontFamily: FONTS.arabic,
    fontSize: 18,
  },
  numberBadge: {
    color: COLORS.gray500,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  arabicExpanded: {
    color: COLORS.gold,
    fontFamily: FONTS.arabic,
    fontSize: 20,
    lineHeight: 36,
    textAlign: "right",
    marginVertical: SPACING.sm,
  },
  narratorText: {
    color: COLORS.gray400,
    fontFamily: FONTS.medium,
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  phoneticText: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 4,
  },
  refText: {
    color: COLORS.gray500,
    fontFamily: FONTS.medium,
    fontSize: 11,
  },
});
