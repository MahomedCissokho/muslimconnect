import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../assets/images/back.png";
import numberBg from "../assets/images/number.png";
import shareIcon from "../assets/images/share.png";
import { LoadingIndicator } from "../src/components";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../src/constants";
import { useAudio } from "../src/contexts/AudioContext";
import { useSettings } from "../src/contexts/SettingsContext";
import {
    getHizbRange,
    getSurahsInRange,
    getSurahTransliteration,
    JUZ_LIST,
    PAGES,
    SURAHS,
} from "../src/data";
import { RECITERS } from "../src/data/reciters";
import type { AudioOrigin, AudioTrack } from "../src/services/audio";
import type { AyahBookmark } from "../src/services/bookmarks";
import { bookmarkService } from "../src/services/bookmarks";
import { lastReadService } from "../src/services/lastRead";
import { quranService } from "../src/services/quran";
import type { Ayah, SurahInGroup } from "../src/types";
import { buildAudioUrl, buildEveryayahAudioUrl } from "../src/utils/audioUrl";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

interface AyahWithExtra extends Ayah {
  translation?: string;
  transliteration?: string;
  audioUrl?: string;
}

/** A row in the list — either a surah separator or an ayah */
type ListItem =
  | { kind: "header"; surah: SurahInGroup; key: string }
  | {
      kind: "ayah";
      ayah: AyahWithExtra;
      surahNumber: number;
      indexInPlaylist: number;
      key: string;
    };

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────

export default function ReadingScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const {
    type: typeParam,
    id: idParam,
    autoPlay: autoPlayParam,
  } = useLocalSearchParams<{
    type: string; // "juz" | "hizb" | "page"
    id: string;
    autoPlay?: string;
  }>();

  const groupType = typeParam as "juz" | "hizb" | "page";
  const groupId = idParam ? parseInt(idParam, 10) : null;
  const shouldAutoPlay = autoPlayParam === "1";

  const { reciterId, displayOptions } = useSettings();
  const { playbackState, loadPlaylist, pause, resume, stop } = useAudio();


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<string>>(
    new Set(),
  );

  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayFired = useRef(false);

  // ── Derive origin for audio tagging ───────────
  const audioOrigin: AudioOrigin = useMemo(
    () => ({ type: groupType, id: groupId ?? 1 }),
    [groupType, groupId],
  );

  // ── Determine surah range for this group ──────
  const surahs = useMemo((): SurahInGroup[] => {
    if (!groupId) return [];

    if (groupType === "juz") {
      const juz = JUZ_LIST.find((j) => j.number === groupId);
      if (!juz) return [];
      return getSurahsInRange(
        juz.startSurah,
        juz.startAyah,
        juz.endSurah,
        juz.endAyah,
      );
    }

    if (groupType === "hizb") {
      const range = getHizbRange(groupId);
      return getSurahsInRange(
        range.startSurah,
        range.startAyah,
        range.endSurah,
        range.endAyah,
      );
    }

    if (groupType === "page") {
      const pageIndex = PAGES.findIndex((p) => p.number === groupId);
      if (pageIndex < 0) return [];
      const page = PAGES[pageIndex];
      const nextPage = PAGES[pageIndex + 1];
      let endSurah: number;
      let endAyah: number;
      if (nextPage) {
        endSurah =
          nextPage.startAyah === 1
            ? nextPage.startSurah - 1
            : nextPage.startSurah;
        endAyah =
          nextPage.startAyah === 1
            ? (SURAHS.find((s) => s.number === nextPage.startSurah - 1)
                ?.numberOfAyahs ?? 1)
            : nextPage.startAyah - 1;
      } else {
        endSurah = 114;
        endAyah = 6;
      }
      return getSurahsInRange(
        page.startSurah,
        page.startAyah,
        endSurah,
        endAyah,
      );
    }

    return [];
  }, [groupType, groupId]);

  // ── Title for header ──────────────────────────
  const headerTitle = useMemo(() => {
    if (!groupId) return "";
    if (groupType === "juz") return `${t("quran.juzz")} ${groupId}`;
    if (groupType === "hizb") return `${t("quran.hizb")} ${groupId}`;
    if (groupType === "page") return `${t("quran.page")} ${groupId}`;
    return "";
  }, [groupType, groupId, t]);

  const subtitle = useMemo(() => {
    if (surahs.length === 0) return "";
    const from = getSurahTransliteration(surahs[0].number);
    const to = getSurahTransliteration(surahs[surahs.length - 1].number);
    return from === to ? from : `${from}  →  ${to}`;
  }, [surahs]);

  const totalVerses = useMemo(
    () => surahs.reduce((sum, s) => sum + (s.toAyah - s.fromAyah + 1), 0),
    [surahs],
  );

  // ── Load bookmarks ────────────────────────────
  useEffect(() => {
    bookmarkService.getAll().then((all) => {
      const ids = new Set(
        all.filter((b) => b.type === "ayah").map((b) => b.id),
      );
      setBookmarkedAyahs(ids);
    });
  }, []);

  // ── Fetch all data ────────────────────────────
  const fetchData = useCallback(async () => {
    if (surahs.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const translationEdition =
        i18n.language === "fr" ? "fr.hamidullah" : "en.sahih";

      const everyayahFolder = RECITERS.find(
        (r) => r.id === reciterId,
      )?.everyayahFolder;

      const items: ListItem[] = [];
      const tracks: AudioTrack[] = [];
      let playlistIndex = 0;

      // Fetch each surah in parallel
      const fetches = surahs.map(async (surahGroup) => {
        const surahNumber = surahGroup.number;
        const [arabicData, translationData, transliterationData, audioData] =
          await Promise.all([
            quranService.getSurah(surahNumber),
            quranService.getSurahWithTranslation(
              surahNumber,
              translationEdition,
            ),
            quranService
              .getSurahWithTranslation(surahNumber, "en.transliteration")
              .catch(() => null),
            everyayahFolder
              ? Promise.resolve(null)
              : quranService.getSurahWithAudio(surahNumber, reciterId),
          ]);

        const merged: AyahWithExtra[] = arabicData.ayahs.map((ayah, idx) => ({
          ...ayah,
          translation: translationData.ayahs[idx]?.text || "",
          transliteration: transliterationData?.ayahs[idx]?.text || "",
          audioUrl: everyayahFolder
            ? buildEveryayahAudioUrl(
                everyayahFolder,
                surahNumber,
                ayah.numberInSurah,
              )
            : audioData?.ayahs[idx]?.audio ||
              buildAudioUrl(reciterId, ayah.number),
        }));

        // Filter to range
        const filtered = merged.filter((a) => {
          const n = a.numberInSurah;
          return n >= surahGroup.fromAyah && n <= surahGroup.toAyah;
        });

        return { surahGroup, filtered };
      });

      const results = await Promise.all(fetches);

      // Build the flat list in order
      for (const { surahGroup, filtered } of results) {
        items.push({
          kind: "header",
          surah: surahGroup,
          key: `header_${surahGroup.number}`,
        });

        for (const ayah of filtered) {
          items.push({
            kind: "ayah",
            ayah,
            surahNumber: surahGroup.number,
            indexInPlaylist: playlistIndex,
            key: `ayah_${ayah.number}`,
          });

          tracks.push({
            globalAyahNumber: ayah.number,
            surahNumber: surahGroup.number,
            ayahNumberInSurah: ayah.numberInSurah,
            audioUrl: ayah.audioUrl || buildAudioUrl(reciterId, ayah.number),
            origin: audioOrigin,
          });

          playlistIndex++;
        }
      }

      setListItems(items);
      setPlaylist(tracks);

      // Save last read
      if (results.length > 0 && results[0].filtered.length > 0) {
        const first = results[0].filtered[0];
        lastReadService
          .set({
            surahNumber: results[0].surahGroup.number,
            ayahNumber: first.numberInSurah,
            origin: groupType,
            juz: first.juz,
            page: first.page,
            hizb: Math.ceil(first.hizbQuarter / 4),
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error("[Reading] Error fetching data:", err);
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }, [surahs, i18n.language, reciterId, audioOrigin, groupType, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Auto-play on mount when requested ─────────
  useEffect(() => {
    if (
      shouldAutoPlay &&
      !autoPlayFired.current &&
      playlist.length > 0 &&
      !loading
    ) {
      autoPlayFired.current = true;
      loadPlaylist(playlist, 0);
    }
  }, [shouldAutoPlay, playlist, loading, loadPlaylist]);

  // ── Determine if this group is currently playing ──
  const isThisGroupActive =
    playbackState.currentTrack?.origin?.type === groupType &&
    playbackState.currentTrack?.origin?.id === groupId;

  const isPlayingAll =
    (playbackState.isPlaying ||
      playbackState.isPaused ||
      playbackState.isLoading) &&
    isThisGroupActive;

  const isPausedAll = playbackState.isPaused && isThisGroupActive;

  // ── Auto-scroll: store y positions from onLayout, scroll on track change ────
  const ayahPositions = useRef<Record<number, number>>({});
  const lastScrolledTrack = useRef<number | null>(null);

  const handleAyahLayout = useCallback((globalAyahNumber: number, y: number) => {
    ayahPositions.current[globalAyahNumber] = y;
  }, []);

  useEffect(() => {
    const track = playbackState.currentTrack;
    if (!track || !isThisGroupActive) return;
    if (lastScrolledTrack.current === track.globalAyahNumber) return;

    const y = ayahPositions.current[track.globalAyahNumber];
    if (y !== undefined) {
      lastScrolledTrack.current = track.globalAyahNumber;
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, y - 120),
        animated: true,
      });
    }
  }, [playbackState.currentTrack, isThisGroupActive]);

  // ── Playback handlers ─────────────────────────
  const handlePlayAll = async () => {
    if (isPlayingAll && !isPausedAll) {
      await pause();
      return;
    }
    if (isPausedAll) {
      await resume();
      return;
    }
    if (playlist.length > 0) {
      await loadPlaylist(playlist, 0);
    }
  };

  const handleStopAll = async () => {
    await stop();
  };

  const handlePlayAyah = async (item: ListItem) => {
    if (item.kind !== "ayah") return;
    const { ayah } = item;
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

    // Load the full playlist starting from this ayah
    const startIndex = item.indexInPlaylist;
    await loadPlaylist(playlist, startIndex);
  };

  const handleShareAyah = async (ayah: AyahWithExtra, surahNum: number) => {
    try {
      const surahStatic = SURAHS.find((s) => s.number === surahNum);
      const name = surahStatic?.englishName ?? "";
      const message = `${ayah.text}\n\n${ayah.translation}\n\n- ${name} (${ayah.numberInSurah})`;
      await Share.share({ message });
    } catch (err) {
      console.error("[Reading] Error sharing:", err);
    }
  };

  const handleBookmarkAyah = useCallback(
    async (ayah: AyahWithExtra, surahNum: number) => {
      const bmId = `ayah_${surahNum}_${ayah.numberInSurah}`;
      const surahStatic = SURAHS.find((s) => s.number === surahNum);
      const bm: AyahBookmark = {
        type: "ayah",
        id: bmId,
        surahNumber: surahNum,
        surahName: surahStatic?.englishName ?? "",
        surahNameAr: surahStatic?.name ?? "",
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
        if (added) next.add(bmId);
        else next.delete(bmId);
        return next;
      });
    },
    [],
  );

  // ── Icon for group type ───────────────────────
  const groupIcon = useMemo(() => {
    if (groupType === "juz") return "book-outline";
    if (groupType === "hizb") return "layers-outline";
    return "document-text-outline";
  }, [groupType]);

  // ── Render ────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={backIcon}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <View style={{ width: 24 }} />
        </View>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={backIcon}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <TouchableOpacity onPress={() => router.push("/settings" as any)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        contentContainerStyle={styles.listPadding}
      >
        {/* ── Hero card ── */}
        <View style={styles.heroOuter}>
          <LinearGradient
            colors={["#863AE8", "#672CBC", "#4A1D96"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.deco1} />
            <View style={styles.deco2} />
            <View style={styles.deco3} />

            <View style={styles.heroContent}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={groupIcon as any}
                  size={26}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.heroTitle}>{headerTitle}</Text>
              <Text style={styles.heroSubtitle}>{subtitle}</Text>

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
              </View>

              <View style={styles.playAllRow}>
                <TouchableOpacity
                  style={[
                    styles.playAllButton,
                    isPlayingAll &&
                      !playbackState.isLoading &&
                      styles.playAllButtonActive,
                  ]}
                  onPress={handlePlayAll}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={
                      playbackState.isLoading && isThisGroupActive
                        ? "hourglass-outline"
                        : isPlayingAll && !isPausedAll
                          ? "pause"
                          : "play"
                    }
                    size={20}
                    color={
                      isPlayingAll && !playbackState.isLoading
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />
                  <Text
                    style={[
                      styles.playAllText,
                      isPlayingAll &&
                        !playbackState.isLoading &&
                        styles.playAllTextActive,
                    ]}
                  >
                    {playbackState.isLoading && isThisGroupActive
                      ? t("common.loading")
                      : isPlayingAll && !isPausedAll
                        ? t("audio.pause")
                        : isPausedAll
                          ? t("audio.resume")
                          : t("quran.playAll")}
                  </Text>
                </TouchableOpacity>

                {isPlayingAll &&
                  !(playbackState.isLoading && isThisGroupActive) && (
                    <TouchableOpacity
                      style={styles.stopButton}
                      onPress={handleStopAll}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="stop" size={18} color="#FF6B6B" />
                      <Text style={styles.stopText}>
                        {t("audio.stopAudio")}
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ── List items ── */}
        {listItems.map((item) => {
          if (item.kind === "header") {
            const surah = item.surah;
            const isComplete =
              surah.fromAyah === 1 && surah.toAyah === surah.numberOfAyahs;
            const surahStatic = SURAHS.find((s) => s.number === surah.number);
            const nameTranslation =
              i18n.language === "fr"
                ? (surahStatic?.frenchNameTranslation ??
                  surahStatic?.englishNameTranslation ??
                  "")
                : (surahStatic?.englishNameTranslation ?? "");

            return (
              <TouchableOpacity
                key={item.key}
                style={styles.surahSeparator}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/surah/[id]",
                    params: { id: String(surah.number) },
                  } as any)
                }
              >
                <Text style={styles.surahSepArabic}>{surah.name}</Text>
                <Text style={styles.surahSepName}>{surah.transliteration}</Text>
                <Text style={styles.surahSepTranslation}>
                  {nameTranslation}
                </Text>
                <Text style={styles.surahSepInfo}>
                  {isComplete
                    ? `${surah.numberOfAyahs} ${t("common.verses")}`
                    : `${t("quran.verse")} ${surah.fromAyah} → ${surah.toAyah}`}
                </Text>
                <View style={styles.viewFullRow}>
                  <Ionicons name="open-outline" size={14} color={COLORS.gold} />
                  <Text style={styles.viewFullText}>
                    {i18n.language === "fr"
                      ? "Voir la sourate complète"
                      : "View full surah"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          // kind === "ayah"
          const { ayah, surahNumber: itemSurahNumber } = item;
          const isPlayingThis =
            playbackState.currentTrack?.globalAyahNumber === ayah.number;
          const bmId = `ayah_${itemSurahNumber}_${ayah.numberInSurah}`;
          const isBookmarked = bookmarkedAyahs.has(bmId);

          return (
            <View
              key={item.key}
              onLayout={(e) => handleAyahLayout(ayah.number, e.nativeEvent.layout.y)}
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
                    onPress={() => handleShareAyah(ayah, itemSurahNumber)}
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
                    onPress={() => handleBookmarkAyah(ayah, itemSurahNumber)}
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
                    onPress={() => handlePlayAyah(item)}
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
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// ────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────

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
  playAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    gap: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  playAllButtonActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    shadowOpacity: 0,
    elevation: 0,
  },
  playAllText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  playAllTextActive: {
    color: COLORS.white,
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,107,107,0.15)",
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: 6,
  },
  stopText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },

  // ── Surah separator ───────────────────────────
  surahSeparator: {
    backgroundColor: COLORS.purple,
    marginHorizontal: SPACING["2xl"],
    marginBottom: SPACING["2xl"],
    borderRadius: BORDER_RADIUS["2xl"],
    padding: SPACING["2xl"],
    alignItems: "center",
  },
  surahSepArabic: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: FONTS.arabic,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  surahSepName: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  surahSepTranslation: {
    color: COLORS.whiteAlpha70,
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.sm,
  },
  surahSepInfo: {
    color: COLORS.gray300,
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.sm,
  },
  viewFullRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  viewFullText: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },

  // ── Ayah card ─────────────────────────────────
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
    fontSize: 26,
    fontFamily: FONTS.arabicBold,
    textAlign: "right",
    lineHeight: 48,
    marginBottom: SPACING.lg,
  },
  ayahTransliteration: {
    color: COLORS.gold,
    fontSize: 15,
    fontFamily: FONTS.regular,
    lineHeight: 24,
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
