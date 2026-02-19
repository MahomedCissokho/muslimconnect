import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS, FONTS, SPACING } from "../constants";
import { useAudio } from "../contexts/AudioContext";
import { getSurahName } from "../data";

export const AudioPlayerBar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { playbackState, pause, resume, stop, next, previous } = useAudio();

  const { currentTrack, isPlaying, isLoading } = playbackState;

  if (!currentTrack) return null;

  const surahName = getSurahName(currentTrack.surahNumber);
  const progress =
    playbackState.durationMs > 0
      ? playbackState.positionMs / playbackState.durationMs
      : 0;

  const navigateToOrigin = () => {
    if (!currentTrack) return;
    const origin = currentTrack.origin;
    if (origin) {
      switch (origin.type) {
        case "juz":
          router.push(`/juz/${origin.id}` as any);
          return;
        case "hizb":
          router.push(`/hizb/${origin.id}` as any);
          return;
        case "page":
          router.push(`/page/${origin.id}` as any);
          return;
        default:
          break;
      }
    }
    // fallback → surah screen
    router.push(`/surah/${currentTrack.surahNumber}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.content}>
        {/* Tap track info to navigate to surah */}
        <TouchableOpacity
          style={styles.trackInfo}
          onPress={navigateToOrigin}
          activeOpacity={0.7}
        >
          <Text style={styles.surahName} numberOfLines={1}>
            {surahName}
          </Text>
          <Text style={styles.ayahNumber}>
            {t("quran.verse")} {currentTrack.ayahNumberInSurah}
          </Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity onPress={previous} style={styles.controlBtn}>
            <Ionicons name="play-skip-back" size={18} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPlaying ? pause : resume}
            style={styles.playBtn}
          >
            {isLoading ? (
              <Ionicons name="hourglass" size={20} color={COLORS.primary} />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color={COLORS.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={next} style={styles.controlBtn}>
            <Ionicons name="play-skip-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity onPress={stop} style={styles.controlBtn}>
            <Ionicons name="close" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    zIndex: 100,
    elevation: 20,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.gold,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  trackInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  surahName: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  ayahNumber: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  controlBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
});
