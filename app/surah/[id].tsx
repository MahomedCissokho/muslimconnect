import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../../assets/images/back.png";
import numberBg from "../../assets/images/number.png";
import shareIcon from "../../assets/images/share.png";
import { LoadingIndicator } from "../../src/components";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import { useAudio } from "../../src/contexts/AudioContext";
import { useSettings } from "../../src/contexts/SettingsContext";
import { RECITERS } from "../../src/data/reciters";
import { SURAHS } from "../../src/data/surahs";
import type { AudioOrigin, AudioTrack } from "../../src/services/audio";
import type { AyahBookmark } from "../../src/services/bookmarks";
import { bookmarkService } from "../../src/services/bookmarks";
import { lastReadService } from "../../src/services/lastRead";
import { quranService } from "../../src/services/quran";
import type { Ayah, SurahData } from "../../src/types";
import {
  buildAudioUrl,
  buildEveryayahAudioUrl,
} from "../../src/utils/audioUrl";

interface AyahWithExtra extends Ayah {
  translation?: string;
  transliteration?: string;
  audioUrl?: string;
}

export default function SurahDetailsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const {
    id,
    fromAyah: fromParam,
    toAyah: toParam,
    autoPlay: autoPlayParam,
    originType: originTypeParam,
    originId: originIdParam,
  } = useLocalSearchParams<{
    id: string;
    fromAyah?: string;
    toAyah?: string;
    autoPlay?: string;
    originType?: string;
    originId?: string;
  }>();
  const surahNumber = id ? parseInt(id, 10) : null;
  const rangeFrom = fromParam ? parseInt(fromParam, 10) : null;
  const rangeTo = toParam ? parseInt(toParam, 10) : null;
  const isRangeMode = rangeFrom !== null;
  const shouldAutoPlay = autoPlayParam === "1";

  // Build a typed origin object from URL params (used to tag each AudioTrack so
  // the mini-player knows where to navigate back)
  const audioOrigin: AudioOrigin = useMemo(() => {
    const ot = originTypeParam as AudioOrigin["type"] | undefined;
    const oid = originIdParam ? parseInt(originIdParam, 10) : NaN;
    if (ot && (ot === "juz" || ot === "hizb" || ot === "page") && !isNaN(oid)) {
      return { type: ot, id: oid };
    }
    return { type: "surah" as const, id: surahNumber ?? 1 };
  }, [originTypeParam, originIdParam, surahNumber]);

  const { reciterId, displayOptions } = useSettings();
  const { playbackState, loadPlaylist, playTrack, pause, resume, stop } =
    useAudio();

  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [ayahs, setAyahs] = useState<AyahWithExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<string>>(
    new Set(),
  );

  const flatListRef = useRef<FlatList<AyahWithExtra>>(null);
  const scrollRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingScrollIndex = useRef<number>(-1);

  const isThisSurahPlaying =
    playbackState.currentTrack?.surahNumber === surahNumber &&
    (playbackState.isPlaying ||
      playbackState.isPaused ||
      playbackState.isLoading);

  // Load bookmarked ayahs on mount
  useEffect(() => {
    bookmarkService.getAll().then((all) => {
      const ids = new Set(
        all.filter((b) => b.type === "ayah").map((b) => b.id),
      );
      setBookmarkedAyahs(ids);
    });
  }, []);

  // ============ AUTO-SCROLL (robust scrollToIndex + retry) ============
  // scrollToIndex est natif FlatList et sait localiser les items déjà rendus.
  // Si l'item n'est pas encore rendu, onScrollToIndexFailed se déclenche :
  // on scroll d'abord vers l'item mesuré le plus proche (instant, sans animation),
  // puis on retente après un court délai (les items autour sont maintenant rendus).
  // Ce pattern "stepping" converge toujours vers la cible.

  const clearPendingScroll = useCallback(() => {
    if (scrollRetryRef.current) {
      clearTimeout(scrollRetryRef.current);
      scrollRetryRef.current = null;
    }
  }, []);

  const scrollToAyahIndex = useCallback(
    (targetIndex: number) => {
      if (
        !flatListRef.current ||
        targetIndex < 0 ||
        targetIndex >= ayahs.length
      )
        return;

      clearPendingScroll();
      pendingScrollIndex.current = targetIndex;

      flatListRef.current.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.65, // 40% du haut → centré confortablement
      });
    },
    [ayahs.length, clearPendingScroll],
  );

  const onScrollToIndexFailed = useCallback(
    (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
    }) => {
      clearPendingScroll();

      // 1) Jump instantly to the closest measured item
      const safeIndex = Math.max(0, info.highestMeasuredFrameIndex);
      flatListRef.current?.scrollToIndex({
        index: safeIndex,
        animated: false,
      });

      // 2) Wait for FlatList to render items around the new position, then retry
      scrollRetryRef.current = setTimeout(() => {
        if (pendingScrollIndex.current >= 0) {
          flatListRef.current?.scrollToIndex({
            index: pendingScrollIndex.current,
            animated: true,
            viewPosition: 0.4,
          });
        }
      }, 200);
    },
    [clearPendingScroll],
  );

  // Trigger auto-scroll when the currently playing track changes
  useEffect(() => {
    const track = playbackState.currentTrack;
    if (!track || track.surahNumber !== surahNumber) return;

    const index = ayahs.findIndex((a) => a.number === track.globalAyahNumber);
    if (index < 0) return;

    // Small delay to let any pending renders settle
    const timer = setTimeout(() => scrollToAyahIndex(index), 150);
    return () => {
      clearTimeout(timer);
      clearPendingScroll();
    };
  }, [
    playbackState.currentTrack,
    surahNumber,
    ayahs,
    scrollToAyahIndex,
    clearPendingScroll,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPendingScroll();
  }, [clearPendingScroll]);
  // ============ END AUTO-SCROLL ============

  const fetchSurahData = useCallback(async () => {
    if (!surahNumber) return;

    try {
      setLoading(true);
      setError(null);

      const translationEdition =
        i18n.language === "fr" ? "fr.hamidullah" : "en.sahih";

      // Detect everyayah.com reciters — they use a different URL format and
      // are not available on the alquran.cloud API.
      const everyayahFolder = RECITERS.find(
        (r) => r.id === reciterId,
      )?.everyayahFolder;

      const [arabicData, translationData, transliterationData, audioData] =
        await Promise.all([
          quranService.getSurah(surahNumber),
          quranService.getSurahWithTranslation(surahNumber, translationEdition),
          quranService
            .getSurahWithTranslation(surahNumber, "en.transliteration")
            .catch(() => null),
          // Skip the audio API call for everyayah reciters — URLs are built locally
          everyayahFolder
            ? Promise.resolve(null)
            : quranService.getSurahWithAudio(surahNumber, reciterId),
        ]);

      setSurahData(arabicData);

      const merged: AyahWithExtra[] = arabicData.ayahs.map((ayah, index) => ({
        ...ayah,
        translation: translationData.ayahs[index]?.text || "",
        transliteration: transliterationData?.ayahs[index]?.text || "",
        audioUrl: everyayahFolder
          ? buildEveryayahAudioUrl(
              everyayahFolder,
              surahNumber,
              ayah.numberInSurah,
            )
          : audioData?.ayahs[index]?.audio ||
            buildAudioUrl(reciterId, ayah.number),
      }));

      // Filter to the requested ayah range (from Juz/Hizb/Page navigation)
      const filtered = isRangeMode
        ? merged.filter((a) => {
            const n = a.numberInSurah;
            return n >= (rangeFrom ?? 1) && n <= (rangeTo ?? a.numberInSurah);
          })
        : merged;

      setAyahs(filtered);

      // Save as last read position
      const firstAyah = filtered[0];
      if (firstAyah) {
        lastReadService
          .set({
            surahNumber: surahNumber,
            ayahNumber: firstAyah.numberInSurah,
            origin: isRangeMode ? "surah" : "surah",
            juz: firstAyah.juz,
            page: firstAyah.page,
            hizb: Math.ceil(firstAyah.hizbQuarter / 4),
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error("[SurahDetails] Error fetching surah:", err);
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }, [
    surahNumber,
    t,
    i18n.language,
    reciterId,
    isRangeMode,
    rangeFrom,
    rangeTo,
  ]);

  // Track whether we already fired autoPlay
  const autoPlayFired = useRef(false);

  useEffect(() => {
    fetchSurahData();
  }, [fetchSurahData]);

  // Auto-play when navigating from Juz/Hizb/Page with autoPlay=1
  useEffect(() => {
    if (
      shouldAutoPlay &&
      !autoPlayFired.current &&
      ayahs.length > 0 &&
      !loading
    ) {
      autoPlayFired.current = true;
      const playlist = ayahs.map((ayah) => ({
        globalAyahNumber: ayah.number,
        surahNumber: surahNumber!,
        ayahNumberInSurah: ayah.numberInSurah,
        audioUrl: ayah.audioUrl || buildAudioUrl(reciterId, ayah.number),
        origin: audioOrigin,
      }));
      if (playlist.length > 0) {
        loadPlaylist(playlist, 0);
      }
    }
  }, [
    shouldAutoPlay,
    ayahs,
    loading,
    surahNumber,
    reciterId,
    loadPlaylist,
    audioOrigin,
  ]);

  const buildFullPlaylist = (): AudioTrack[] => {
    return ayahs.map((ayah) => ({
      globalAyahNumber: ayah.number,
      surahNumber: surahNumber!,
      ayahNumberInSurah: ayah.numberInSurah,
      audioUrl: ayah.audioUrl || buildAudioUrl(reciterId, ayah.number),
      origin: audioOrigin,
    }));
  };

  const handlePlayAll = async () => {
    // If this surah is already playing/paused, toggle pause/resume
    if (isThisSurahPlaying) {
      if (playbackState.isPlaying) {
        await pause();
      } else {
        await resume();
      }
      return;
    }

    const playlist = buildFullPlaylist();
    if (playlist.length > 0) {
      await loadPlaylist(playlist, 0);
    }
  };

  const handleStopAll = async () => {
    await stop();
  };

  const handlePlayAyah = async (ayahIndex: number) => {
    const ayah = ayahs[ayahIndex];
    const currentTrack = playbackState.currentTrack;

    if (
      currentTrack?.globalAyahNumber === ayah.number &&
      playbackState.isPlaying
    ) {
      await pause();
      return;
    }
    if (
      currentTrack?.globalAyahNumber === ayah.number &&
      playbackState.isPaused
    ) {
      await resume();
      return;
    }

    await playTrack({
      globalAyahNumber: ayah.number,
      surahNumber: surahNumber!,
      ayahNumberInSurah: ayah.numberInSurah,
      audioUrl: ayah.audioUrl || buildAudioUrl(reciterId, ayah.number),
      origin: { type: "surah", id: surahNumber! },
    });

    // Update last read to the ayah being played
    lastReadService
      .set({
        surahNumber: surahNumber!,
        ayahNumber: ayah.numberInSurah,
        origin: "surah",
        juz: ayah.juz,
        page: ayah.page,
        hizb: Math.ceil(ayah.hizbQuarter / 4),
      })
      .catch(() => {});
  };

  const handleShareAyah = async (ayah: AyahWithExtra) => {
    try {
      const message = `${ayah.text}\n\n${ayah.translation}\n\n- ${surahData?.englishName} (${ayah.numberInSurah})`;
      await Share.share({ message });
    } catch (err) {
      console.error("[SurahDetails] Error sharing:", err);
    }
  };

  const handleBookmarkAyah = useCallback(
    async (ayah: AyahWithExtra) => {
      const id = `ayah_${surahNumber}_${ayah.numberInSurah}`;
      const bm: AyahBookmark = {
        type: "ayah",
        id,
        surahNumber: surahNumber!,
        surahName: surahData?.englishName ?? "",
        surahNameAr: surahData?.name ?? "",
        ayahNumberInSurah: ayah.numberInSurah,
        globalAyahNumber: ayah.number,
        textAr: ayah.text,
        transliteration: ayah.transliteration,
        translationFr: ayah.translation,
        savedAt: new Date().toISOString(),
      };
      const added = await bookmarkService.toggle(bm);
      setBookmarkedAyahs((prev) => {
        const next = new Set(prev);
        if (added) next.add(id);
        else next.delete(id);
        return next;
      });
    },
    [surahNumber, surahData],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error || !surahData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || t("errors.loadFailed")}
          </Text>
          <TouchableOpacity onPress={fetchSurahData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    englishName,
    englishNameTranslation,
    revelationType,
    numberOfAyahs,
    name: surahNameAr,
  } = surahData;

  // Pick the translated surah name based on current language
  const surahStatic = SURAHS.find((s) => s.number === surahNumber);
  const nameTranslation =
    i18n.language === "fr"
      ? (surahStatic?.frenchNameTranslation ?? englishNameTranslation)
      : englishNameTranslation;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={backIcon}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{englishName}</Text>
        <TouchableOpacity onPress={() => router.push("/settings" as any)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={ayahs}
        keyExtractor={(item) => String(item.number)}
        extraData={{
          currentTrack: playbackState.currentTrack?.globalAyahNumber,
          bookmarkedAyahs,
        }}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        windowSize={21}
        maxToRenderPerBatch={15}
        initialNumToRender={12}
        onScrollToIndexFailed={onScrollToIndexFailed}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.surahCard}
            activeOpacity={isRangeMode ? 0.7 : 1}
            disabled={!isRangeMode}
            onPress={() =>
              router.push({
                pathname: "/surah/[id]",
                params: { id: String(surahNumber) },
              } as any)
            }
          >
            <Text style={styles.surahName}>{englishName}</Text>
            <Text style={styles.surahTranslation}>{nameTranslation}</Text>
            <View style={styles.divider} />
            <Text style={styles.surahInfo}>
              {t(`quran.${revelationType.toLowerCase()}`)} •{" "}
              {isRangeMode
                ? `${t("quran.verse")} ${rangeFrom}${rangeTo ? ` → ${rangeTo}` : ` → ${numberOfAyahs}`}  (${ayahs.length} ${t("common.verses")})`
                : `${numberOfAyahs} ${t("common.verses")}`}
            </Text>
            {!isRangeMode && (
              <Text style={styles.bismillah}>{surahNameAr}</Text>
            )}
            {isRangeMode && (
              <View style={styles.viewFullRow}>
                <Ionicons name="open-outline" size={14} color={COLORS.gold} />
                <Text style={styles.viewFullText}>
                  {i18n.language === "fr"
                    ? "Voir la sourate complète"
                    : "View full surah"}
                </Text>
              </View>
            )}

            {isThisSurahPlaying ? (
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[
                    styles.playAllBtn,
                    { backgroundColor: COLORS.whiteAlpha15 },
                  ]}
                  onPress={playbackState.isPlaying ? pause : resume}
                >
                  <Ionicons
                    name={playbackState.isPlaying ? "pause" : "play"}
                    size={18}
                    color={COLORS.white}
                  />
                  <Text style={[styles.playAllText, { color: COLORS.white }]}>
                    {playbackState.isPlaying
                      ? t("audio.pause")
                      : t("audio.resume")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stopBtn}
                  onPress={handleStopAll}
                >
                  <Ionicons name="stop" size={18} color={COLORS.error} />
                  <Text style={[styles.playAllText, { color: COLORS.error }]}>
                    {t("audio.stopAudio")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.playAllBtnFull}
                onPress={handlePlayAll}
              >
                <Ionicons name="play" size={18} color={COLORS.primary} />
                <Text style={styles.playAllText}>{t("quran.playAll")}</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        }
        renderItem={({ item: ayah, index }) => {
          const isPlayingThis =
            playbackState.currentTrack?.globalAyahNumber === ayah.number;
          const bmId = `ayah_${surahNumber}_${ayah.numberInSurah}`;
          const isBookmarked = bookmarkedAyahs.has(bmId);

          return (
            <View
              style={[
                styles.ayahContainer,
                isPlayingThis && styles.ayahContainerActive,
              ]}
            >
              <View style={styles.ayahHeader}>
                <View style={styles.ayahNumberContainer}>
                  <Image
                    source={numberBg}
                    style={styles.ayahNumberBg}
                    resizeMode="contain"
                  />
                  <Text style={styles.ayahNumberText}>
                    {ayah.numberInSurah}
                  </Text>
                </View>
                <View style={styles.ayahActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShareAyah(ayah)}
                  >
                    <Image
                      source={shareIcon}
                      style={styles.actionIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      isBookmarked && styles.actionButtonActive,
                    ]}
                    onPress={() => handleBookmarkAyah(ayah)}
                  >
                    <Ionicons
                      name={isBookmarked ? "bookmark" : "bookmark-outline"}
                      size={18}
                      color={isBookmarked ? COLORS.primary : COLORS.gold}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      isPlayingThis && styles.actionButtonActive,
                    ]}
                    onPress={() => handlePlayAyah(index)}
                  >
                    <Ionicons
                      name={
                        isPlayingThis && playbackState.isPlaying
                          ? "pause"
                          : "play"
                      }
                      size={18}
                      color={isPlayingThis ? COLORS.primary : COLORS.gold}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {displayOptions.showArabic && (
                <Text style={styles.ayahArabic}>{ayah.text}</Text>
              )}

              {displayOptions.showTransliteration && ayah.transliteration ? (
                <Text style={styles.ayahTransliteration}>
                  {ayah.transliteration}
                </Text>
              ) : null}

              {displayOptions.showTranslation && ayah.translation ? (
                <Text style={styles.ayahTranslation}>{ayah.translation}</Text>
              ) : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  flatList: {
    flex: 1,
  },
  surahCard: {
    backgroundColor: COLORS.purple,
    marginHorizontal: SPACING["2xl"],
    marginTop: SPACING.lg,
    marginBottom: SPACING["2xl"],
    borderRadius: BORDER_RADIUS["2xl"],
    padding: SPACING["2xl"],
    alignItems: "center",
  },
  surahName: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  surahTranslation: {
    color: COLORS.whiteAlpha70,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.lg,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.whiteAlpha15,
    marginBottom: SPACING.lg,
  },
  surahInfo: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.xl,
  },
  bismillah: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: FONTS.arabic,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  viewFullRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  viewFullText: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  cardActions: {
    flexDirection: "row",
    gap: SPACING.md,
    width: "100%",
  },
  playAllBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  playAllBtnFull: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    width: "100%",
  },
  stopBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.whiteAlpha15,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  playAllText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  ayahContainer: {
    marginHorizontal: SPACING["2xl"],
    marginBottom: SPACING["2xl"],
    padding: SPACING.lg,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ayahContainerActive: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(249, 189, 100, 0.08)",
  },
  ayahHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  ayahNumberContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  ayahNumberBg: {
    width: 36,
    height: 36,
    position: "absolute",
    tintColor: COLORS.gold,
  },
  ayahNumberText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  ayahActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonActive: {
    backgroundColor: COLORS.gold,
    borderRadius: 16,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gold,
  },
  ayahArabic: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.arabic,
    textAlign: "right",
    lineHeight: 36,
    marginBottom: SPACING.lg,
  },
  ayahTransliteration: {
    color: COLORS.gold,
    fontSize: 14,
    fontFamily: FONTS.medium,
    fontStyle: "italic",
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  ayahTranslation: {
    color: COLORS.gray300,
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING["3xl"],
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
});
