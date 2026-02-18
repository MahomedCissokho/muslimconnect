import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../../assets/images/back.png";
import { QuranGroupDetail } from "../../src/components/QuranGroupDetail";
import { COLORS, FONTS, SPACING } from "../../src/constants";
import { useAudio } from "../../src/contexts/AudioContext";
import {
  getSurahsInRange,
  getSurahTransliteration,
  PAGES,
  SURAHS,
} from "../../src/data";

export default function PageDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const pageNumber = id ? parseInt(id, 10) : null;
  const { playbackState, stop } = useAudio();

  const pageIndex = useMemo(
    () => PAGES.findIndex((p) => p.number === pageNumber),
    [pageNumber],
  );

  const page = pageIndex >= 0 ? PAGES[pageIndex] : null;
  const nextPage = pageIndex >= 0 ? PAGES[pageIndex + 1] : null;

  const range = useMemo(() => {
    if (!page) return null;
    if (nextPage) {
      const endSurah =
        nextPage.startAyah === 1
          ? nextPage.startSurah - 1
          : nextPage.startSurah;
      const endAyah =
        nextPage.startAyah === 1
          ? (SURAHS.find((s) => s.number === nextPage.startSurah - 1)
              ?.numberOfAyahs ?? 1)
          : nextPage.startAyah - 1;
      return {
        startSurah: page.startSurah,
        startAyah: page.startAyah,
        endSurah,
        endAyah,
      };
    }
    // Last page → Surah 114 end
    return {
      startSurah: page.startSurah,
      startAyah: page.startAyah,
      endSurah: 114,
      endAyah: 6,
    };
  }, [page, nextPage]);

  const surahs = useMemo(() => {
    if (!range) return [];
    return getSurahsInRange(
      range.startSurah,
      range.startAyah,
      range.endSurah,
      range.endAyah,
    );
  }, [range]);

  const totalVerses = useMemo(
    () => surahs.reduce((sum, s) => sum + (s.toAyah - s.fromAyah + 1), 0),
    [surahs],
  );

  const subtitle = useMemo(() => {
    if (!range) return "";
    const from = getSurahTransliteration(range.startSurah);
    const to = getSurahTransliteration(range.endSurah);
    return from === to ? from : `${from}  →  ${to}`;
  }, [range]);

  // ── Derive audio state ────────────────────────
  const isPlayingAll =
    (playbackState.isPlaying || playbackState.isLoading) &&
    playbackState.currentTrack?.origin?.type === "page" &&
    playbackState.currentTrack?.origin?.id === pageNumber;

  const isLoadingPlayAll =
    playbackState.isLoading &&
    playbackState.currentTrack?.origin?.type === "page" &&
    playbackState.currentTrack?.origin?.id === pageNumber;

  const currentPlayingSurahNumber = isPlayingAll
    ? playbackState.currentTrack?.surahNumber
    : undefined;

  // Navigate to surah screen with autoPlay + origin params for the first surah
  const handlePlayAll = () => {
    if (surahs.length === 0) return;
    if (isPlayingAll) {
      stop();
      return;
    }
    const first = surahs[0];
    router.push(
      `/surah/${first.number}?fromAyah=${first.fromAyah}&toAyah=${first.toAyah}&autoPlay=1&originType=page&originId=${pageNumber}` as any,
    );
  };

  if (!page || !range) return null;

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
        <Text style={styles.headerTitle}>
          {t("quran.page")} {page.number}
        </Text>
        <TouchableOpacity onPress={() => router.push("/settings" as any)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <QuranGroupDetail
        title={`${t("quran.page")} ${page.number}`}
        subtitle={subtitle}
        icon="document-text-outline"
        surahs={surahs}
        totalVerses={totalVerses}
        badgeLabel={`${t("quran.juzz")} ${page.juz}`}
        onSurahPress={(num, from, to) =>
          router.push(`/surah/${num}?fromAyah=${from}&toAyah=${to}` as any)
        }
        onPlayAll={handlePlayAll}
        isPlayingAll={isPlayingAll}
        isLoadingPlayAll={isLoadingPlayAll}
        currentPlayingSurahNumber={currentPlayingSurahNumber}
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
});
