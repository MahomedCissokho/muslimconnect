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
import { DUA_CATEGORIES, getDuasByCategory } from "../../src/data/duas";
import type { DuaBookmark } from "../../src/services/bookmarks";
import { bookmarkService } from "../../src/services/bookmarks";
import type { Dua, DuaCategory } from "../../src/types";

// ─── Category Pill (horizontal scroll) ──────────────────────────────────────

function CategoryPill({
  category,
  count,
  selected,
  onPress,
  lang,
}: {
  category: DuaCategory;
  count: number;
  selected: boolean;
  onPress: () => void;
  lang: string;
}) {
  const name = lang === "fr" ? category.nameFr : category.nameEn;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]}
    >
      <LinearGradient
        colors={
          selected
            ? (category.gradient as [string, string])
            : [COLORS.secondary, COLORS.secondary]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.catPill, selected && styles.catPillSelected]}
      >
        {/* Icon bubble */}
        <View
          style={[
            styles.catPillIcon,
            selected
              ? { backgroundColor: "rgba(255,255,255,0.22)" }
              : { backgroundColor: "rgba(249,189,100,0.1)" },
          ]}
        >
          <Ionicons
            name={category.icon as any}
            size={18}
            color={selected ? COLORS.white : COLORS.gold}
          />
        </View>

        {/* Name */}
        <Text style={[styles.catPillName, selected && styles.catPillNameSel]}>
          {name}
        </Text>

        {/* Count chip */}
        <View
          style={[
            styles.catPillCount,
            selected
              ? { backgroundColor: "rgba(255,255,255,0.22)" }
              : { backgroundColor: "rgba(249,189,100,0.1)" },
          ]}
        >
          <Text
            style={[
              styles.catPillCountText,
              selected && { color: COLORS.white },
            ]}
          >
            {count}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── Dua Card ─────────────────────────────────────────────────────────────────

function DuaCard({
  dua,
  index,
  lang,
}: {
  dua: Dua;
  index: number;
  lang: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedMark, setSavedMark] = useState(false);

  const bookmarkId = `dua_${dua.id}`;

  useEffect(() => {
    bookmarkService.isBookmarked(bookmarkId).then(setSavedMark);
  }, [bookmarkId]);

  const title = lang === "fr" ? dua.titleFr : dua.titleEn;
  const text = lang === "fr" ? dua.textFr : dua.textEn;
  const ref = lang === "fr" ? dua.referenceFr : dua.referenceEn;

  const handleCopy = useCallback(async () => {
    const fullText = `${dua.textAr}\n\n${text}\n\n— ${ref}`;
    await Clipboard.setStringAsync(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [dua.textAr, text, ref]);

  const handleShare = useCallback(async () => {
    const fullText = `${dua.textAr}\n\n${text}\n\n— ${ref}`;
    await Share.share({ message: fullText });
  }, [dua.textAr, text, ref]);

  const handleBookmark = useCallback(async () => {
    const bm: DuaBookmark = {
      type: "dua",
      id: bookmarkId,
      duaId: dua.id,
      categoryId: dua.categoryId,
      titleFr: dua.titleFr,
      titleEn: dua.titleEn,
      textAr: dua.textAr,
      textFr: dua.textFr,
      textEn: dua.textEn,
      referenceFr: dua.referenceFr,
      referenceEn: dua.referenceEn,
      savedAt: new Date().toISOString(),
    };
    const added = await bookmarkService.toggle(bm);
    setSavedMark(added);
  }, [bookmarkId, dua]);

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.94 }]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.numBadge}>
          <Text style={styles.numText}>
            {String(index + 1).padStart(2, "0")}
          </Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.cardSub} numberOfLines={1}>
            {ref}
          </Text>
        </View>
        <View style={[styles.chevronWrap, expanded && styles.chevronOpen]}>
          <Ionicons name="chevron-down" size={14} color={COLORS.gold} />
        </View>
      </View>

      {/* Arabic stage */}
      <View style={styles.arabicStage}>
        <Text style={styles.arabicText}>{dua.textAr}</Text>
        {dua.phonetic ? (
          <Text style={styles.phoneticText}>{dua.phonetic}</Text>
        ) : null}
      </View>

      {/* Expanded */}
      {expanded && (
        <View style={styles.expandedArea}>
          <Text style={styles.translationText}>{text}</Text>
          <View style={styles.actionRow}>
            <Pressable onPress={handleCopy} style={styles.actionBtn}>
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
            <Pressable onPress={handleShare} style={styles.actionBtn}>
              <Ionicons
                name="share-social-outline"
                size={15}
                color={COLORS.gold}
              />
              <Text style={styles.actionLabel}>Partager</Text>
            </Pressable>
            <Pressable onPress={handleBookmark} style={styles.actionBtn}>
              <Ionicons
                name={savedMark ? "bookmark" : "bookmark-outline"}
                size={15}
                color={COLORS.gold}
              />
              <Text style={styles.actionLabel}>
                {savedMark ? "Sauvegardé" : "Sauvegarder"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DuasScreen() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [selectedId, setSelectedId] = useState(DUA_CATEGORIES[0].id);
  const flatListRef = useRef<FlatList>(null);

  const selectedCategory = useMemo(
    () => DUA_CATEGORIES.find((c) => c.id === selectedId)!,
    [selectedId],
  );

  const duas = useMemo(() => getDuasByCategory(selectedId), [selectedId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 100);
  }, []);

  const renderDua = useCallback(
    ({ item, index }: { item: Dua; index: number }) => (
      <DuaCard dua={item} index={index} lang={lang} />
    ),
    [lang],
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerWrap}>
        {/* ── Hero ─────────────────────────────────────────── */}
        <LinearGradient
          colors={[COLORS.secondary, COLORS.primary]}
          style={styles.hero}
        >
          <View style={styles.heroCircleL} />
          <View style={styles.heroCircleS} />
          <Text style={styles.heroBismillah}>﷽</Text>
          <Text style={styles.heroTitle}>{t("duas.title")}</Text>
          <Text style={styles.heroSubtitle}>
            {lang === "fr"
              ? "Invocations & Rappels"
              : "Supplications & Remembrance"}
          </Text>
          <View style={styles.heroLine} />
        </LinearGradient>

        {/* ── Category horizontal scroll ─────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsContent}
          style={styles.pillsScroll}
        >
          {DUA_CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat}
              count={getDuasByCategory(cat.id).length}
              selected={cat.id === selectedId}
              onPress={() => handleSelect(cat.id)}
              lang={lang}
            />
          ))}
        </ScrollView>

        {/* Section label */}
        <View style={styles.sectionRow}>
          <Ionicons
            name={selectedCategory.icon as any}
            size={16}
            color={COLORS.gold}
          />
          <Text style={styles.sectionTitle}>
            {lang === "fr" ? selectedCategory.nameFr : selectedCategory.nameEn}
          </Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{duas.length}</Text>
          </View>
        </View>
      </View>
    ),
    [t, lang, selectedId, selectedCategory, duas.length, handleSelect],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        ref={flatListRef}
        data={duas}
        renderItem={renderDua}
        keyExtractor={(item) => String(item.id)}
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

  // ── Header
  headerWrap: {
    marginBottom: SPACING.md,
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
  heroBismillah: {
    fontFamily: FONTS.arabic,
    fontSize: 34,
    color: COLORS.gold,
    marginBottom: SPACING.sm,
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

  // ── Category horizontal scroll
  pillsScroll: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  pillsContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
  },

  catPill: {
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
  catPillSelected: {
    borderColor: "rgba(255,255,255,0.25)",
  },
  catPillIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  catPillName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray400,
  },
  catPillNameSel: {
    color: COLORS.white,
  },
  catPillCount: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    marginLeft: 2,
  },
  catPillCountText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.gold,
  },

  // ── Section label
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionBadgeText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
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
