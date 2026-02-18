import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import numberBg from "../../assets/images/number.png";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../constants";
import type { SurahInGroup } from "../types";

export interface QuranGroupDetailProps {
  /** e.g. "Juz 1", "Hizb 5" */
  title: string;
  /** e.g. "Al-Fâtiha → Al-Baqara" */
  subtitle: string;
  /** Ionicons name for the header icon */
  icon: keyof typeof Ionicons.glyphMap;
  /** surahs with ayah ranges inside this group */
  surahs: SurahInGroup[];
  /** Total verses in this group */
  totalVerses: number;
  /** Optional extra badge (e.g. "Juz 3") */
  badgeLabel?: string;
  /** Called when the user taps a surah */
  onSurahPress: (surahNumber: number, fromAyah: number, toAyah: number) => void;
  /** Called when the user taps "Play All" — plays all ayahs in the group */
  onPlayAll?: () => void;
  /** Whether the group is currently loading audio for play all */
  isLoadingPlayAll?: boolean;
  /** Whether audio is currently playing for this group */
  isPlayingAll?: boolean;
  /** Surah number currently being played (used for auto-scroll) */
  currentPlayingSurahNumber?: number;
}

// ────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────

export const QuranGroupDetail: React.FC<QuranGroupDetailProps> = ({
  title,
  subtitle,
  icon,
  surahs,
  totalVerses,
  badgeLabel,
  onSurahPress,
  onPlayAll,
  isLoadingPlayAll,
  isPlayingAll,
  currentPlayingSurahNumber,
}) => {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList<SurahInGroup>>(null);

  // ── Auto-scroll to the currently playing surah ──
  useEffect(() => {
    if (!currentPlayingSurahNumber) return;
    const index = surahs.findIndex(
      (s) => s.number === currentPlayingSurahNumber,
    );
    if (index < 0) return;
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.4,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPlayingSurahNumber, surahs]);

  // ─── Section label ────────────────────────────
  const sectionLabel = useMemo(() => {
    if (surahs.length === 1) return t("quran.surah");
    return t("common.surahs");
  }, [surahs.length, t]);

  // ─── Render helpers ───────────────────────────
  const renderSurahCard = useCallback(
    ({ item: surah }: { item: SurahInGroup }) => {
      const isComplete =
        surah.fromAyah === 1 && surah.toAyah === surah.numberOfAyahs;
      const ayahCount = surah.toAyah - surah.fromAyah + 1;
      const progress = ayahCount / surah.numberOfAyahs;

      return (
        <TouchableOpacity
          style={styles.surahCard}
          onPress={() =>
            onSurahPress(surah.number, surah.fromAyah, surah.toAyah)
          }
          activeOpacity={0.75}
        >
          {/* Left: Number */}
          <View style={styles.numberWrap}>
            <Image
              source={numberBg}
              style={styles.numberBg}
              resizeMode="contain"
            />
            <Text style={styles.numberText}>{surah.number}</Text>
          </View>

          {/* Center: Info */}
          <View style={styles.infoWrap}>
            <View style={styles.nameRow}>
              <Text style={styles.transliteration} numberOfLines={1}>
                {surah.transliteration}
              </Text>
              <Text style={styles.arabicName}>{surah.name}</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {surah.revelationType === "Meccan"
                    ? t("quran.meccan")
                    : t("quran.medinan")}
                </Text>
              </View>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.ayahRangeText}>
                {isComplete
                  ? `${surah.numberOfAyahs} ${t("common.verses")}`
                  : `${t("quran.verse")} ${surah.fromAyah} → ${surah.toAyah}`}
              </Text>
            </View>

            {/* Progress bar for partial surahs */}
            {!isComplete && (
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.round(progress * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressLabel}>
                  {ayahCount}/{surah.numberOfAyahs}
                </Text>
              </View>
            )}
          </View>

          {/* Right: Chevron */}
          <Ionicons name="chevron-forward" size={18} color={COLORS.gray500} />
        </TouchableOpacity>
      );
    },
    [onSurahPress, t],
  );

  const keyExtractor = useCallback(
    (item: SurahInGroup) => String(item.number),
    [],
  );

  // ─── List header (beautiful card) ─────────────
  const ListHeader = useCallback(
    () => (
      <>
        {/* ── Hero card ── */}
        <View style={styles.heroOuter}>
          <LinearGradient
            colors={["#863AE8", "#672CBC", "#4A1D96"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Decorative shapes */}
            <View style={styles.deco1} />
            <View style={styles.deco2} />
            <View style={styles.deco3} />

            <View style={styles.heroContent}>
              {/* Icon */}
              <View style={styles.iconCircle}>
                <Ionicons name={icon as any} size={26} color={COLORS.primary} />
              </View>

              <Text style={styles.heroTitle}>{title}</Text>
              <Text style={styles.heroSubtitle}>{subtitle}</Text>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{surahs.length}</Text>
                  <Text style={styles.statLabel}>{t("common.surahs")}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{totalVerses}</Text>
                  <Text style={styles.statLabel}>{t("common.verses")}</Text>
                </View>
                {badgeLabel && (
                  <>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                      <Text style={[styles.statValue, { color: COLORS.gold }]}>
                        {badgeLabel}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* Play All Button */}
              {onPlayAll && (
                <TouchableOpacity
                  style={styles.playAllButton}
                  onPress={onPlayAll}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={
                      isLoadingPlayAll
                        ? "hourglass-outline"
                        : isPlayingAll
                          ? "pause-circle"
                          : "play-circle"
                    }
                    size={22}
                    color={COLORS.primary}
                  />
                  <Text style={styles.playAllText}>
                    {isLoadingPlayAll
                      ? t("common.loading")
                      : isPlayingAll
                        ? t("audio.stopAudio")
                        : t("quran.playAll")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* ── Section title ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>{sectionLabel}</Text>
        </View>
      </>
    ),
    [
      title,
      subtitle,
      icon,
      surahs.length,
      totalVerses,
      badgeLabel,
      sectionLabel,
      onPlayAll,
      isLoadingPlayAll,
      isPlayingAll,
      t,
    ],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={surahs}
      keyExtractor={keyExtractor}
      renderItem={renderSurahCard}
      ListHeaderComponent={<ListHeader />}
      style={styles.list}
      contentContainerStyle={styles.listPadding}
      showsVerticalScrollIndicator={false}
      onScrollToIndexFailed={() => {}} // graceful fallback
    />
  );
};

// ────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listPadding: {
    paddingBottom: SPACING["4xl"],
  },

  // ── Hero card ─────────────────────────────────
  heroOuter: {
    marginHorizontal: SPACING["2xl"],
    marginTop: SPACING.lg,
    marginBottom: SPACING["2xl"],
    borderRadius: BORDER_RADIUS["2xl"],
    overflow: "hidden",
    // shadow
    shadowColor: "#672CBC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  heroGradient: {
    padding: SPACING["2xl"],
    paddingTop: SPACING["3xl"],
    paddingBottom: SPACING["3xl"],
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    alignItems: "center",
    zIndex: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    // shadow
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },

  // decorative circles
  deco1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  deco2: {
    position: "absolute",
    bottom: -40,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  deco3: {
    position: "absolute",
    top: 20,
    left: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  statBox: {
    alignItems: "center",
    paddingHorizontal: SPACING.md,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  statLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // ── Section header ────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING["2xl"],
    marginBottom: SPACING.lg,
  },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
    textTransform: "capitalize",
  },

  // ── Surah card ────────────────────────────────
  surahCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    marginHorizontal: SPACING["2xl"],
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numberWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.lg,
  },
  numberBg: {
    width: 44,
    height: 44,
    position: "absolute",
    tintColor: COLORS.gold,
  },
  numberText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  infoWrap: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  transliteration: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    flex: 1,
    marginRight: SPACING.sm,
  },
  arabicName: {
    color: COLORS.gold,
    fontSize: 20,
    fontFamily: FONTS.arabic,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeBadge: {
    backgroundColor: COLORS.whiteAlpha15,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeBadgeText: {
    color: COLORS.gray300,
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.5,
  },
  dot: {
    color: COLORS.gray500,
    marginHorizontal: 6,
    fontSize: 10,
  },
  ayahRangeText: {
    color: COLORS.gray400,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },

  // progress bar
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.whiteAlpha15,
    borderRadius: 2,
    overflow: "hidden",
    marginRight: SPACING.sm,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
  progressLabel: {
    color: COLORS.gray400,
    fontSize: 11,
    fontFamily: FONTS.medium,
    minWidth: 50,
    textAlign: "right",
  },

  // Play All button
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    gap: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  playAllText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});
