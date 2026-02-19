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
  HIZB_QUARTERS,
  getHizbRange,
  getSurahTransliteration,
  getSurahsInRange,
} from "../../src/data";

export default function HizbDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const hizbNumber = id ? parseInt(id, 10) : null;
  const { playbackState, stop, pause, resume } = useAudio();

  const quarters = useMemo(
    () => HIZB_QUARTERS.filter((q) => q.hizb === hizbNumber),
    [hizbNumber],
  );

  const juzNumber = quarters.length > 0 ? quarters[0].juz : null;

  const range = useMemo(() => {
    if (!hizbNumber) return null;
    return getHizbRange(hizbNumber);
  }, [hizbNumber]);

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

  if (!hizbNumber || !range) return null;

  // ── Derive audio state ────────────────────────
  const isThisGroupActive =
    playbackState.currentTrack?.origin?.type === "hizb" &&
    playbackState.currentTrack?.origin?.id === hizbNumber;

  const isPlayingAll =
    (playbackState.isPlaying ||
      playbackState.isPaused ||
      playbackState.isLoading) &&
    isThisGroupActive;

  const isPausedAll = playbackState.isPaused && isThisGroupActive;

  const isLoadingPlayAll = playbackState.isLoading && isThisGroupActive;

  const currentPlayingSurahNumber = isPlayingAll
    ? playbackState.currentTrack?.surahNumber
    : undefined;

  // Navigate to surah screen with autoPlay + origin params for the first surah
  const handlePlayAll = () => {
    if (surahs.length === 0) return;
    if (isPlayingAll && !isPausedAll) {
      pause();
      return;
    }
    if (isPausedAll) {
      resume();
      return;
    }
    router.push(`/reading?type=hizb&id=${hizbNumber}&autoPlay=1` as any);
  };

  const handleStopAll = () => {
    stop();
  };

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
          {t("quran.hizb")} {hizbNumber}
        </Text>
        <TouchableOpacity onPress={() => router.push("/settings" as any)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <QuranGroupDetail
        title={`${t("quran.hizb")} ${hizbNumber}`}
        subtitle={subtitle}
        icon="layers-outline"
        surahs={surahs}
        totalVerses={totalVerses}
        badgeLabel={juzNumber ? `${t("quran.juzz")} ${juzNumber}` : undefined}
        onSurahPress={(num, from, to) =>
          router.push(
            `/surah/${num}?fromAyah=${from}&toAyah=${to}&originType=hizb&originId=${hizbNumber}` as any,
          )
        }
        onHeroPress={() => {
          if (surahs.length === 0) return;
          router.push(`/reading?type=hizb&id=${hizbNumber}` as any);
        }}
        onPlayAll={handlePlayAll}
        onStopAll={handleStopAll}
        isPlayingAll={isPlayingAll}
        isPausedAll={isPausedAll}
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
