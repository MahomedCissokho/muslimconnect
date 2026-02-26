import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../src/constants/colors";
import { FONTS, FONT_SIZES } from "../../src/constants/fonts";
import { BORDER_RADIUS, SPACING } from "../../src/constants/spacing";
import type {
    AyahBookmark,
    Bookmark,
    DuaBookmark,
    HadithBookmark,
} from "../../src/services/bookmarks";
import { bookmarkService } from "../../src/services/bookmarks";

// ─── Filter Tab ───────────────────────────────────────────────────────────────

type Filter = "all" | "ayah" | "hadith" | "dua";

function FilterTab({
  label,
  icon,
  active,
  count,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  count: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <LinearGradient
        colors={
          active
            ? ["rgba(249,189,100,0.22)", "rgba(249,189,100,0.10)"]
            : [COLORS.secondary, COLORS.secondary]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.filterTab, active && styles.filterTabActive]}
      >
        <Ionicons
          name={icon as any}
          size={15}
          color={active ? COLORS.gold : COLORS.gray500}
        />
        <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
          {label}
        </Text>
        {count > 0 && (
          <View
            style={[
              styles.filterCount,
              active && { backgroundColor: "rgba(249,189,100,0.25)" },
            ]}
          >
            <Text
              style={[styles.filterCountText, active && { color: COLORS.gold }]}
            >
              {count}
            </Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

// ─── Ayah Card ────────────────────────────────────────────────────────────────

function AyahCard({
  item,
  onRemove,
  onPress,
}: {
  item: AyahBookmark;
  onRemove: () => void;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.cardTypeRow}>
        <View style={styles.cardTypePill}>
          <Ionicons name="book-outline" size={11} color={COLORS.gold} />
          <Text style={styles.cardTypeText}>
            {item.surahName} • {item.ayahNumberInSurah}
          </Text>
        </View>
        <Pressable onPress={onRemove} style={styles.removeBtn} hitSlop={8}>
          <Ionicons name="bookmark" size={16} color={COLORS.gold} />
        </Pressable>
      </View>
      <View style={styles.arabicStage}>
        <Text style={styles.arabicText}>{item.textAr}</Text>
        {item.transliteration ? (
          <Text style={styles.phoneticText}>{item.transliteration}</Text>
        ) : null}
      </View>
      {item.translationFr ? (
        <View style={styles.translationWrap}>
          <Text style={styles.translationText} numberOfLines={3}>
            {item.translationFr}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

// ─── Hadith Card ──────────────────────────────────────────────────────────────

function HadithCard({
  item,
  onRemove,
  lang,
}: {
  item: HadithBookmark;
  onRemove: () => void;
  lang: string;
}) {
  const collectionName =
    lang === "fr" ? item.collectionNameFr : item.collectionNameEn;
  const text = lang === "fr" ? item.textFr : item.textEn;
  const narrator = lang === "fr" ? item.narratorFr : item.narratorEn;

  return (
    <View style={styles.card}>
      <View style={styles.cardTypeRow}>
        <View
          style={[
            styles.cardTypePill,
            { backgroundColor: "rgba(129,140,248,0.12)" },
          ]}
        >
          <Ionicons name="library-outline" size={11} color="#818CF8" />
          <Text style={[styles.cardTypeText, { color: "#818CF8" }]}>
            {collectionName} • {item.hadithNumber}
          </Text>
        </View>
        <Pressable onPress={onRemove} style={styles.removeBtn} hitSlop={8}>
          <Ionicons name="bookmark" size={16} color={COLORS.gold} />
        </Pressable>
      </View>
      <View style={styles.arabicStage}>
        <Text style={styles.arabicText}>{item.textAr}</Text>
      </View>
      <View style={styles.translationWrap}>
        <Text style={styles.translationText} numberOfLines={4}>
          {text}
        </Text>
        {narrator ? (
          <Text style={styles.narratorText}>— {narrator}</Text>
        ) : null}
      </View>
    </View>
  );
}

// ─── Dua Card ─────────────────────────────────────────────────────────────────

function DuaCard({
  item,
  onRemove,
  lang,
}: {
  item: DuaBookmark;
  onRemove: () => void;
  lang: string;
}) {
  const title = lang === "fr" ? item.titleFr : item.titleEn;
  const text = lang === "fr" ? item.textFr : item.textEn;
  const ref = lang === "fr" ? item.referenceFr : item.referenceEn;

  return (
    <View style={styles.card}>
      <View style={styles.cardTypeRow}>
        <View
          style={[
            styles.cardTypePill,
            { backgroundColor: "rgba(52,211,153,0.12)" },
          ]}
        >
          <Ionicons name="hand-left-outline" size={11} color="#34D399" />
          <Text style={[styles.cardTypeText, { color: "#34D399" }]}>
            {title}
          </Text>
        </View>
        <Pressable onPress={onRemove} style={styles.removeBtn} hitSlop={8}>
          <Ionicons name="bookmark" size={16} color={COLORS.gold} />
        </Pressable>
      </View>
      <View style={styles.arabicStage}>
        <Text style={styles.arabicText}>{item.textAr}</Text>
      </View>
      <View style={styles.translationWrap}>
        <Text style={styles.translationText} numberOfLines={3}>
          {text}
        </Text>
        <Text style={styles.narratorText}>— {ref}</Text>
      </View>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: Filter }) {
  const labels: Record<Filter, { icon: string; text: string }> = {
    all: {
      icon: "bookmark-outline",
      text: "Appuie sur l'icône signet dans les versets, hadiths ou duas pour les retrouver ici.",
    },
    ayah: {
      icon: "book-outline",
      text: "Aucun verset sauvegardé. Ouvre une sourate et appuie sur le signet d'un verset.",
    },
    hadith: {
      icon: "library-outline",
      text: "Aucun hadith sauvegardé. Appuie sur le signet dans l'onglet Hadiths.",
    },
    dua: {
      icon: "hand-left-outline",
      text: "Aucune dua sauvegardée. Appuie sur le signet dans l'onglet Duas.",
    },
  };
  const { icon, text } = labels[filter];
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name={icon as any} size={40} color="rgba(249,189,100,0.35)" />
      </View>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BookmarkScreen() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const reload = useCallback(async () => {
    const all = await bookmarkService.getAll();
    setBookmarks(all);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleRemove = useCallback(async (id: string) => {
    await bookmarkService.remove(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const filtered =
    filter === "all" ? bookmarks : bookmarks.filter((b) => b.type === filter);

  const counts = {
    ayah: bookmarks.filter((b) => b.type === "ayah").length,
    hadith: bookmarks.filter((b) => b.type === "hadith").length,
    dua: bookmarks.filter((b) => b.type === "dua").length,
  };

  const renderItem = useCallback(
    ({ item }: { item: Bookmark }) => {
      if (item.type === "ayah") {
        return (
          <AyahCard
            item={item}
            onRemove={() => handleRemove(item.id)}
            onPress={() =>
              router.push({
                pathname: "/surah/[id]",
                params: {
                  id: String(item.surahNumber),
                  fromAyah: String(item.ayahNumberInSurah),
                  toAyah: String(item.ayahNumberInSurah),
                },
              } as any)
            }
          />
        );
      }
      if (item.type === "hadith") {
        return (
          <HadithCard
            item={item}
            onRemove={() => handleRemove(item.id)}
            lang={lang}
          />
        );
      }
      return (
        <DuaCard
          item={item}
          onRemove={() => handleRemove(item.id)}
          lang={lang}
        />
      );
    },
    [handleRemove, lang, router],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id + item.savedAt}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            {/* ── Hero */}
            <LinearGradient
              colors={[COLORS.secondary, COLORS.primary]}
              style={styles.hero}
            >
              <View style={styles.heroCircleL} />
              <View style={styles.heroCircleS} />
              <Ionicons name="bookmark" size={32} color={COLORS.gold} />
              <Text style={styles.heroTitle}>Mes Favoris</Text>
              <Text style={styles.heroSubtitle}>
                {bookmarks.length === 0
                  ? "Aucun élément sauvegardé"
                  : `${bookmarks.length} élément${bookmarks.length > 1 ? "s" : ""} sauvegardé${bookmarks.length > 1 ? "s" : ""}`}
              </Text>
              <View style={styles.heroLine} />
            </LinearGradient>

            {/* ── Filter tabs */}
            <View style={styles.filtersRow}>
              <FilterTab
                label="Tout"
                icon="albums-outline"
                active={filter === "all"}
                count={bookmarks.length}
                onPress={() => setFilter("all")}
              />
              <FilterTab
                label="Versets"
                icon="book-outline"
                active={filter === "ayah"}
                count={counts.ayah}
                onPress={() => setFilter("ayah")}
              />
              <FilterTab
                label="Hadiths"
                icon="library-outline"
                active={filter === "hadith"}
                count={counts.hadith}
                onPress={() => setFilter("hadith")}
              />
              <FilterTab
                label="Duas"
                icon="hand-left-outline"
                active={filter === "dua"}
                count={counts.dua}
                onPress={() => setFilter("dua")}
              />
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState filter={filter} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  listContent: { paddingBottom: 100 },
  headerWrap: { marginBottom: SPACING.md },

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
  heroTitle: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.white,
    textAlign: "center",
    marginTop: SPACING.sm,
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

  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    flexWrap: "wrap",
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.15)",
  },
  filterTabActive: { borderColor: "rgba(249,189,100,0.45)" },
  filterLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  filterLabelActive: { color: COLORS.gold },
  filterCount: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BORDER_RADIUS.full,
  },
  filterCountText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.gray500,
  },

  card: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.12)",
    overflow: "hidden",
  },
  cardTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  cardTypePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(249,189,100,0.1)",
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  cardTypeText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(249,189,100,0.08)",
  },

  arabicStage: {
    borderTopWidth: 1,
    borderTopColor: "rgba(249,189,100,0.1)",
    backgroundColor: "rgba(249,189,100,0.03)",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  arabicText: {
    fontFamily: FONTS.arabic,
    fontSize: 20,
    color: COLORS.gold,
    lineHeight: 38,
    textAlign: "right",
  },
  phoneticText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    fontStyle: "italic",
    marginTop: SPACING.xs,
  },

  translationWrap: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  translationText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.whiteAlpha70,
    lineHeight: 24,
  },
  narratorText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },

  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING["3xl"],
    paddingTop: SPACING["3xl"],
    gap: SPACING.lg,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(249,189,100,0.06)",
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray500,
    textAlign: "center",
    lineHeight: 24,
  },
});
