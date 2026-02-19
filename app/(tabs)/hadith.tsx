import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/colors";
import { FONTS, FONT_SIZES } from "../../src/constants/fonts";
import { BORDER_RADIUS, SPACING } from "../../src/constants/spacing";
import {
    HADITH_COLLECTIONS,
    getHadithsByCollection,
} from "../../src/data/hadiths";
import type { HadithBookmark } from "../../src/services/bookmarks";
import { bookmarkService } from "../../src/services/bookmarks";
import type {
    HadeethCategory,
    HadeethListItem,
} from "../../src/services/hadithApi";
import {
    fetchHadeethCategories,
    fetchHadeethDetail,
    fetchHadeethList,
} from "../../src/services/hadithApi";
import type { Hadith, HadithCollection } from "../../src/types";

// ─── Unified display type ────────────────────────────────────────────────────

type Mode = "api" | "local";

// ─── Category Pill (API mode only) ──────────────────────────────────────────────

function Pill({
  label,
  count,
  selected,
  onPress,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected && styles.pillSelected,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
        {label}
      </Text>
      {count !== undefined && (
        <View style={[styles.pillBadge, selected && styles.pillBadgeSelected]}>
          <Text
            style={[
              styles.pillBadgeText,
              selected && styles.pillBadgeTextSelected,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

// ─── Collection Pill (local mode — horizontal scroll) ───────────────────────────

function CollectionPill({
  collection,
  selected,
  onPress,
  lang,
}: {
  collection: HadithCollection;
  selected: boolean;
  onPress: () => void;
  lang: string;
}) {
  const name = lang === "fr" ? collection.nameFr : collection.nameEn;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]}
    >
      <LinearGradient
        colors={
          selected
            ? (collection.gradient as [string, string])
            : [COLORS.secondary, COLORS.secondary]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.collPill, selected && styles.collPillSelected]}
      >
        {/* Arabic letter bubble */}
        <View
          style={[
            styles.collPillIcon,
            selected
              ? { backgroundColor: "rgba(255,255,255,0.22)" }
              : { backgroundColor: "rgba(249,189,100,0.1)" },
          ]}
        >
          <Text
            style={[styles.collPillAr, selected && { color: COLORS.white }]}
          >
            {collection.nameAr.charAt(0)}
          </Text>
        </View>

        {/* Name */}
        <Text style={[styles.collPillName, selected && styles.collPillNameSel]}>
          {name}
        </Text>

        {/* Count chip */}
        <View
          style={[
            styles.collPillCount,
            selected
              ? { backgroundColor: "rgba(255,255,255,0.22)" }
              : { backgroundColor: "rgba(249,189,100,0.1)" },
          ]}
        >
          <Text
            style={[
              styles.collPillCountText,
              selected && { color: COLORS.white },
            ]}
          >
            {collection.totalHadiths}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Shared Card Shell ────────────────────────────────────────────────────────

function HadithCardShell({
  num,
  title,
  meta,
  arabic,
  phonetic,
  expanded,
  onPress,
  copied,
  onCopy,
  onShare,
  loading,
  translation,
  narrator,
  isBookmarked,
  onBookmark,
}: {
  num: string | number;
  title: string;
  meta: string;
  arabic: string;
  phonetic?: string | null;
  expanded: boolean;
  onPress: () => void;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
  loading?: boolean;
  translation?: string | null;
  narrator?: string;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}) {
  const paddedNum = String(num).padStart(2, "0");
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.94 }]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.numBadge}>
          <Text style={styles.numText}>{paddedNum}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          {meta ? (
            <Text style={styles.cardSub} numberOfLines={1}>
              {meta}
            </Text>
          ) : null}
        </View>
        <View style={[styles.chevronWrap, expanded && styles.chevronOpen]}>
          <Ionicons name="chevron-down" size={14} color={COLORS.gold} />
        </View>
      </View>

      {/* Arabic stage */}
      <View style={styles.arabicStage}>
        <Text style={styles.arabicText}>{arabic}</Text>
        {phonetic ? <Text style={styles.phoneticText}>{phonetic}</Text> : null}
      </View>

      {/* Expanded */}
      {expanded && (
        <View style={styles.expandedArea}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.gold}
              style={{ marginVertical: 12 }}
            />
          ) : (
            <>
              {translation ? (
                <Text style={styles.translationText}>{translation}</Text>
              ) : null}
              {narrator ? (
                <Text style={styles.narratorText}>— {narrator}</Text>
              ) : null}
              <View style={styles.actionRow}>
                <Pressable onPress={onCopy} style={styles.actionBtn}>
                  <Ionicons
                    name={copied ? "checkmark" : "copy-outline"}
                    size={15}
                    color={copied ? COLORS.success : COLORS.gold}
                  />
                  <Text
                    style={[
                      styles.actionLabel,
                      copied && { color: COLORS.success },
                    ]}
                  >
                    {copied ? "Copié" : "Copier"}
                  </Text>
                </Pressable>
                <Pressable onPress={onShare} style={styles.actionBtn}>
                  <Ionicons
                    name="share-social-outline"
                    size={15}
                    color={COLORS.gold}
                  />
                  <Text style={styles.actionLabel}>Partager</Text>
                </Pressable>
                {onBookmark && (
                  <Pressable onPress={onBookmark} style={styles.actionBtn}>
                    <Ionicons
                      name={isBookmarked ? "bookmark" : "bookmark-outline"}
                      size={15}
                      color={COLORS.gold}
                    />
                    <Text style={styles.actionLabel}>
                      {isBookmarked ? "Sauvegardé" : "Sauvegarder"}
                    </Text>
                  </Pressable>
                )}
              </View>
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}

// ─── API Hadith Card ──────────────────────────────────────────────────────────

function ApiHadithCard({
  item,
  index,
  lang,
}: {
  item: HadeethListItem;
  index: number;
  lang: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loadingBody, setLoadingBody] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedMark, setSavedMark] = useState(false);

  const bookmarkId = `hadith_api_${item.id}`;

  useEffect(() => {
    bookmarkService.isBookmarked(bookmarkId).then(setSavedMark);
  }, [bookmarkId]);

  const handleExpand = useCallback(async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && translation === null) {
      setLoadingBody(true);
      try {
        const detail = await fetchHadeethDetail(item.id, lang);
        setTranslation(detail.body ?? "");
      } catch {
        setTranslation("");
      } finally {
        setLoadingBody(false);
      }
    }
  }, [expanded, translation, item.id, lang]);

  const handleCopy = useCallback(async () => {
    const text = `${item.hadeeth}\n\n${translation ?? ""}\n\n— ${item.attribution}`;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [item, translation]);

  const handleShare = useCallback(async () => {
    const text = `${item.hadeeth}\n\n${translation ?? ""}\n\n— ${item.attribution}`;
    await Share.share({ message: text });
  }, [item, translation]);

  const handleBookmark = useCallback(async () => {
    const bm: HadithBookmark = {
      type: "hadith",
      id: bookmarkId,
      collectionId: "hadeethenc",
      collectionNameFr: "HadeethEnc",
      collectionNameEn: "HadeethEnc",
      hadithNumber: index + 1,
      textAr: item.hadeeth,
      textFr: translation ?? item.title,
      textEn: translation ?? item.title,
      narratorFr: item.attribution,
      narratorEn: item.attribution,
      reference: item.grade || item.attribution,
      savedAt: new Date().toISOString(),
    };
    const added = await bookmarkService.toggle(bm);
    setSavedMark(added);
  }, [bookmarkId, item, index, translation]);

  return (
    <HadithCardShell
      num={index + 1}
      title={item.title}
      meta={
        item.grade ? `${item.attribution}  ·  ${item.grade}` : item.attribution
      }
      arabic={item.hadeeth}
      expanded={expanded}
      onPress={handleExpand}
      copied={copied}
      onCopy={handleCopy}
      onShare={handleShare}
      loading={loadingBody}
      translation={translation}
      isBookmarked={savedMark}
      onBookmark={handleBookmark}
    />
  );
}

// ─── Local Hadith Card ────────────────────────────────────────────────────────

function LocalHadithCard({ hadith, lang }: { hadith: Hadith; lang: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedMark, setSavedMark] = useState(false);

  const bookmarkId = `hadith_${hadith.collectionId}_${hadith.number}`;

  useEffect(() => {
    bookmarkService.isBookmarked(bookmarkId).then(setSavedMark);
  }, [bookmarkId]);

  const chapter = lang === "fr" ? hadith.chapterFr : hadith.chapterEn;
  const text = lang === "fr" ? hadith.textFr : hadith.textEn;
  const narrator = lang === "fr" ? hadith.narratorFr : hadith.narratorEn;

  const handleCopy = useCallback(async () => {
    const fullText = `${hadith.textAr}\n\n${text}\n\n— ${narrator}\n(${hadith.reference})`;
    await Clipboard.setStringAsync(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [hadith, text, narrator]);

  const handleShare = useCallback(async () => {
    const fullText = `${hadith.textAr}\n\n${text}\n\n— ${narrator}\n(${hadith.reference})`;
    await Share.share({ message: fullText });
  }, [hadith, text, narrator]);

  const handleBookmark = useCallback(async () => {
    const col = HADITH_COLLECTIONS.find((c) => c.id === hadith.collectionId);
    const bm: HadithBookmark = {
      type: "hadith",
      id: bookmarkId,
      collectionId: hadith.collectionId,
      collectionNameFr: col?.nameFr ?? hadith.collectionId,
      collectionNameEn: col?.nameEn ?? hadith.collectionId,
      hadithNumber: hadith.number,
      textAr: hadith.textAr,
      textFr: hadith.textFr,
      textEn: hadith.textEn,
      narratorFr: hadith.narratorFr,
      narratorEn: hadith.narratorEn,
      reference: hadith.reference,
      savedAt: new Date().toISOString(),
    };
    const added = await bookmarkService.toggle(bm);
    setSavedMark(added);
  }, [bookmarkId, hadith]);

  return (
    <HadithCardShell
      num={hadith.number}
      title={chapter}
      meta={hadith.reference}
      arabic={hadith.textAr}
      phonetic={hadith.phonetic}
      expanded={expanded}
      onPress={() => setExpanded((v) => !v)}
      copied={copied}
      onCopy={handleCopy}
      onShare={handleShare}
      translation={text}
      narrator={narrator}
      isBookmarked={savedMark}
      onBookmark={handleBookmark}
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HadithScreen() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const flatListRef = useRef<FlatList>(null);

  // Mode: api (HadeethEnc) or local (static data fallback)
  const [mode, setMode] = useState<Mode>("api");

  // API state
  const [apiCategories, setApiCategories] = useState<HadeethCategory[]>([]);
  const [apiHadiths, setApiHadiths] = useState<HadeethListItem[]>([]);
  const [selectedApiCatId, setSelectedApiCatId] = useState<string>("");
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingHadiths, setLoadingHadiths] = useState(false);

  // Local state
  const [selectedLocalId, setSelectedLocalId] = useState(
    HADITH_COLLECTIONS[0].id,
  );

  // ── Load categories on mount
  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchHadeethCategories(lang);
        if (cats && cats.length > 0) {
          setApiCategories(cats);
          setSelectedApiCatId(cats[0].id);
          setMode("api");
        } else {
          setMode("local");
        }
      } catch {
        setMode("local");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, [lang]);

  // ── Load hadiths when API category changes
  useEffect(() => {
    if (mode !== "api" || !selectedApiCatId) return;
    setLoadingHadiths(true);
    setApiHadiths([]);
    (async () => {
      try {
        const { items } = await fetchHadeethList(selectedApiCatId, lang);
        setApiHadiths(items);
      } catch {
        setMode("local");
      } finally {
        setLoadingHadiths(false);
      }
    })();
  }, [mode, selectedApiCatId, lang]);

  const localHadiths = useMemo(
    () => getHadithsByCollection(selectedLocalId),
    [selectedLocalId],
  );

  const handleSelectApiCat = useCallback((id: string) => {
    setSelectedApiCatId(id);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  const handleSelectLocal = useCallback((id: string) => {
    setSelectedLocalId(id);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  // ── Render items
  const renderApiHadith = useCallback(
    ({ item, index }: { item: HadeethListItem; index: number }) => (
      <ApiHadithCard item={item} index={index} lang={lang} />
    ),
    [lang],
  );

  const renderLocalHadith = useCallback(
    ({ item }: { item: Hadith }) => (
      <LocalHadithCard hadith={item} lang={lang} />
    ),
    [lang],
  );

  // ── List header
  const ListHeader = useMemo(() => {
    if (loadingCats) {
      return (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={COLORS.gold} />
        </View>
      );
    }

    return (
      <View style={styles.headerWrap}>
        {/* ── Hero ─────────────────────────────────────────── */}
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          style={styles.hero}
        >
          <View style={styles.heroCircleL} />
          <View style={styles.heroCircleS} />
          <Text style={styles.heroQuote}>قَالَ رَسُولُ اللَّهِ ﷺ</Text>
          <Text style={styles.heroTitle}>{t("hadith.title")}</Text>
          <Text style={styles.heroSubtitle}>
            {lang === "fr" ? "Paroles du Prophète ﷺ" : "Words of the Prophet ﷺ"}
          </Text>
          <View style={styles.heroLine} />
        </LinearGradient>

        {/* ── Collections / Categories ──────────────────────── */}
        {mode === "api" ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContent}
            style={styles.pillsScroll}
          >
            {apiCategories.map((cat) => (
              <Pill
                key={cat.id}
                label={cat.title}
                count={cat.hadeeths_count}
                selected={cat.id === selectedApiCatId}
                onPress={() => handleSelectApiCat(cat.id)}
              />
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContent}
            style={styles.pillsScroll}
          >
            {HADITH_COLLECTIONS.map((col) => (
              <CollectionPill
                key={col.id}
                collection={col}
                selected={col.id === selectedLocalId}
                onPress={() => handleSelectLocal(col.id)}
                lang={lang}
              />
            ))}
          </ScrollView>
        )}

        {/* Loading hadiths */}
        {loadingHadiths && (
          <ActivityIndicator
            size="small"
            color={COLORS.gold}
            style={{ marginTop: SPACING.xl }}
          />
        )}
      </View>
    );
  }, [
    t,
    lang,
    mode,
    loadingCats,
    loadingHadiths,
    apiCategories,
    selectedApiCatId,
    selectedLocalId,
    handleSelectApiCat,
    handleSelectLocal,
  ]);

  const data = mode === "api" ? apiHadiths : localHadiths;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        ref={flatListRef}
        data={loadingHadiths ? [] : (data as any[])}
        renderItem={
          mode === "api" ? (renderApiHadith as any) : (renderLocalHadith as any)
        }
        keyExtractor={(item: any) => String(item.id)}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  listContent: {
    paddingBottom: 100,
  },
  loadingWrap: {
    paddingTop: 80,
    alignItems: "center",
  },

  // ── Header
  headerWrap: {
    marginBottom: SPACING.lg,
  },

  // ── Hero
  hero: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING["2xl"],
    borderRadius: BORDER_RADIUS["2xl"],
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING["3xl"],
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.15)",
    alignItems: "center",
  },
  heroCircleL: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(249,189,100,0.04)",
    top: -70,
    right: -70,
  },
  heroCircleS: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(249,189,100,0.05)",
    bottom: -35,
    left: 10,
  },
  heroQuote: {
    fontFamily: FONTS.arabic,
    fontSize: 18,
    color: COLORS.gold,
    textAlign: "center",
    marginBottom: SPACING.sm,
    opacity: 0.85,
  },
  heroTitle: {
    fontFamily: FONTS.bold,
    fontSize: 30,
    color: COLORS.white,
    textAlign: "center",
  },
  heroSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray400,
    textAlign: "center",
    marginTop: 6,
  },
  heroLine: {
    height: 1,
    width: 48,
    backgroundColor: "rgba(249,189,100,0.4)",
    marginTop: SPACING.lg,
  },

  // ── Mode badge
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  modeBadgeText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.gray500,
  },

  // ── Pills
  pillsScroll: {
    marginBottom: SPACING.lg,
  },
  pillsContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    gap: 6,
  },
  pillSelected: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(249,189,100,0.1)",
  },
  pillText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray400,
  },
  pillTextSelected: {
    color: COLORS.gold,
  },
  pillBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.full,
  },
  pillBadgeSelected: {
    backgroundColor: "rgba(249,189,100,0.2)",
  },
  pillBadgeText: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.gray500,
  },
  pillBadgeTextSelected: {
    color: COLORS.gold,
  },

  // ── Dead styles (kept for TS compat)
  infoStrip: { display: "none" },
  infoStripRow: { display: "none" },
  infoStripTitle: { display: "none" },
  infoStripAuthor: { display: "none" },
  infoStripDesc: { display: "none" },
  collCardsWrap: {},
  collCard: {},
  collCardSelected: {},
  collCardCircle: {},
  collCardAr: {},
  collCardLine: {},
  collCardRow: {},
  collCardLeft: {},
  collCardName: {},
  collCardAuthor: {},
  collCardBadge: {},
  collCardCount: {},
  collCardCountLabel: {},

  // ── Collection Pills (local mode — mirrors CategoryPill)
  collPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.18)",
    overflow: "hidden",
  },
  collPillSelected: {
    borderColor: "rgba(255,255,255,0.25)",
  },
  collPillIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  collPillAr: {
    fontFamily: FONTS.arabic,
    fontSize: 18,
    color: COLORS.gold,
  },
  collPillName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray400,
  },
  collPillNameSel: {
    color: COLORS.white,
  },
  collPillCount: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    marginLeft: 2,
  },
  collPillCountText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.gold,
  },

  // ── New premium card
  card: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.15)",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.md,
  },
  numBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.4)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(249,189,100,0.06)",
  },
  numText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gold,
  },
  cardMeta: { flex: 1 },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
  cardSub: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    marginTop: 2,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(249,189,100,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronOpen: {
    backgroundColor: "rgba(249,189,100,0.14)",
    transform: [{ rotate: "180deg" }],
  },

  // ── Arabic stage
  arabicStage: {
    borderTopWidth: 1,
    borderTopColor: "rgba(249,189,100,0.12)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(249,189,100,0.12)",
    backgroundColor: "rgba(249,189,100,0.03)",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  arabicText: {
    fontFamily: FONTS.arabic,
    fontSize: 22,
    color: COLORS.gold,
    lineHeight: 40,
    textAlign: "right",
  },
  phoneticText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    fontStyle: "italic",
    marginTop: SPACING.sm,
  },

  // ── Expanded
  expandedArea: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  translationText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.whiteAlpha70,
    lineHeight: 26,
  },
  narratorText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray400,
    marginTop: SPACING.sm,
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.25)",
    backgroundColor: "rgba(249,189,100,0.07)",
  },
  actionLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
  },
});
