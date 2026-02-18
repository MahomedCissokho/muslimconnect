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
    JUZ_LIST,
} from "../../src/data";

export default function JuzDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const juzNumber = id ? parseInt(id, 10) : null;
  const { playbackState, stop } = useAudio();

  const juz = useMemo(
    () => JUZ_LIST.find((j) => j.number === juzNumber),
    [juzNumber],
  );

  const surahs = useMemo(() => {
    if (!juz) return [];
    return getSurahsInRange(
      juz.startSurah,
      juz.startAyah,
      juz.endSurah,
      juz.endAyah,
    );
  }, [juz]);

  const totalVerses = useMemo(
    () => surahs.reduce((sum, s) => sum + (s.toAyah - s.fromAyah + 1), 0),
    [surahs],
  );

  const subtitle = useMemo(() => {
    if (!juz) return "";
    const from = getSurahTransliteration(juz.startSurah);
    const to = getSurahTransliteration(juz.endSurah);
    return from === to ? from : `${from}  →  ${to}`;
  }, [juz]);

  if (!juz) return null;

  // ── Derive audio state ────────────────────────
  const isPlayingAll =
    (playbackState.isPlaying || playbackState.isLoading) &&
    playbackState.currentTrack?.origin?.type === "juz" &&
    playbackState.currentTrack?.origin?.id === juzNumber;

  const isLoadingPlayAll =
    playbackState.isLoading &&
    playbackState.currentTrack?.origin?.type === "juz" &&
    playbackState.currentTrack?.origin?.id === juzNumber;

  const currentPlayingSurahNumber = isPlayingAll
    ? playbackState.currentTrack?.surahNumber
    : undefined;

  // Navigate to surah screen with autoPlay + origin params for the first surah
  const handlePlayAll = () => {
    if (surahs.length === 0) return;
    // Toggle: stop if already playing this juz
    if (isPlayingAll) {
      stop();
      return;
    }
    const first = surahs[0];
    router.push(
      `/surah/${first.number}?fromAyah=${first.fromAyah}&toAyah=${first.toAyah}&autoPlay=1&originType=juz&originId=${juzNumber}` as any,
    );
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
          {t("quran.juzz")} {juz.number}
        </Text>
        <TouchableOpacity onPress={() => router.push("/settings" as any)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <QuranGroupDetail
        title={`${t("quran.juzz")} ${juz.number}`}
        subtitle={subtitle}
        icon="book-outline"
        surahs={surahs}
        totalVerses={totalVerses}
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
