import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS, FONTS } from "../constants";
import { useAudio } from "../contexts/AudioContext";
import { useSettings } from "../contexts/SettingsContext";
import { getSurahTransliteration, SURAHS } from "../data";
import { RECITERS } from "../data/reciters";

/* ── Spinner for loading state ───────────────────────────────────────────── */
const LoadingSpinner: React.FC = () => {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [spin]);
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Ionicons name="sync" size={20} color={COLORS.primary} />
    </Animated.View>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   AudioPlayerBar — Floating mini-player (Spotify / Apple Music style)
   ═══════════════════════════════════════════════════════════════════════════ */
export const AudioPlayerBar: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { playbackState, pause, resume, stop, next, previous } = useAudio();
  const { reciterId } = useSettings();

  const { currentTrack, isPlaying, isLoading, playlist, currentIndex } =
    playbackState;

  if (!currentTrack) return null;

  // ── Progress ──────────────────────────────────────────────────────────────
  const progress =
    playlist.length > 0 ? (currentIndex + 1) / playlist.length : 0;

  // ── Metadata ──────────────────────────────────────────────────────────────
  const surahName = getSurahTransliteration(currentTrack.surahNumber);
  const surahData = SURAHS.find((s) => s.number === currentTrack.surahNumber);
  const surahAyahCount = surahData?.numberOfAyahs ?? 0;

  const reciter = RECITERS.find((r) => r.id === reciterId);
  const reciterName = reciter?.nameEn ?? reciterId;

  const origin = currentTrack.origin;
  let originLabel = "";
  if (origin?.type === "juz") originLabel = `Juz ${origin.id}`;
  if (origin?.type === "hizb") originLabel = `Hizb ${origin.id}`;
  if (origin?.type === "page") originLabel = `Page ${origin.id}`;

  const verseLabel =
    origin?.type === "surah"
      ? `${t("quran.verse")} ${currentTrack.ayahNumberInSurah}/${surahAyahCount}`
      : `${t("quran.verse")} ${currentIndex + 1}/${playlist.length}${originLabel ? ` · ${originLabel}` : ""}`;

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigateToOrigin = () => {
    if (!currentTrack) return;
    const o = currentTrack.origin;
    if (o) {
      if (o.type === "juz") {
        router.push(`/juz/${o.id}` as any);
        return;
      }
      if (o.type === "hizb") {
        router.push(`/hizb/${o.id}` as any);
        return;
      }
      if (o.type === "page") {
        router.push(`/page/${o.id}` as any);
        return;
      }
    }
    router.push(`/surah/${currentTrack.surahNumber}` as any);
  };

  const CardWrapper = Platform.OS === "ios" ? BlurView : View;
  const cardProps =
    Platform.OS === "ios"
      ? { intensity: 40, tint: "dark" as const, style: styles.card }
      : { style: [styles.card, styles.cardAndroid] };

  return (
    <View style={styles.floatingWrapper}>
      <CardWrapper {...cardProps}>
        {/* ── Inner content with gradient overlay (Android) ────────── */}
        <View style={styles.cardInner}>
          {/* ── Top row: artwork + info + controls ─────────────────── */}
          <View style={styles.row}>
            {/* Artwork */}
            <TouchableOpacity
              onPress={navigateToOrigin}
              activeOpacity={0.85}
              style={styles.artworkWrap}
            >
              <Image
                source={require("../../assets/images/quran.png")}
                style={styles.artwork}
                resizeMode="contain"
              />
              {isPlaying && <View style={styles.playingDot} />}
            </TouchableOpacity>

            {/* Track info — 2 lines only, reciter on line 2 */}
            <TouchableOpacity
              style={styles.info}
              onPress={navigateToOrigin}
              activeOpacity={0.7}
            >
              <Text style={styles.title} numberOfLines={1}>
                {surahName}
                <Text style={styles.titleSep}> · </Text>
                <Text style={styles.titleReciter}>{reciterName}</Text>
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {verseLabel}
              </Text>
            </TouchableOpacity>

            {/* Controls — compact: prev, play, next */}
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={previous}
                style={styles.ctrlBtn}
                hitSlop={12}
              >
                <Ionicons
                  name="play-skip-back"
                  size={18}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={isPlaying ? pause : resume}
                style={styles.playBtn}
                activeOpacity={0.85}
                hitSlop={4}
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={22}
                    color={COLORS.primary}
                    style={!isPlaying ? { marginLeft: 2 } : undefined}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={next}
                style={styles.ctrlBtn}
                hitSlop={12}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={18}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>

            {/* Close */}
            <TouchableOpacity
              onPress={stop}
              style={styles.closeBtn}
              hitSlop={12}
            >
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          </View>

          {/* ── Progress bar (bottom of card) ──────────────────────── */}
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[COLORS.gold, "#E8A838"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>
      </CardWrapper>
    </View>
  );
};

/* ── Styles ──────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  /* Floating container positioned above tab bar */
  floatingWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 78 : 72,
    left: 8,
    right: 8,
    zIndex: 100,
    elevation: 30,
  },

  /* Card shell */
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(249,189,100,0.18)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  cardAndroid: {
    backgroundColor: "rgba(18,26,58,0.97)",
  },
  cardInner: {
    overflow: "hidden",
  },

  /* ── Main row ──────────────────────────────────────────────────────────── */
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 10,
    gap: 10,
  },

  /* ── Artwork ─────────────────────────────────────────────────────────────── */
  artworkWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(249,189,100,0.1)",
  },
  artwork: {
    width: 42,
    height: 42,
  },
  playingDot: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.gold,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },

  /* ── Info (2 lines max) ──────────────────────────────────────────────────── */
  info: {
    flex: 1,
    justifyContent: "center",
    marginRight: 2,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 13.5,
    lineHeight: 18,
  },
  titleSep: {
    color: "rgba(255,255,255,0.25)",
    fontFamily: FONTS.regular,
  },
  titleReciter: {
    color: COLORS.gray300,
    fontFamily: FONTS.regular,
    fontSize: 12.5,
  },
  subtitle: {
    color: COLORS.gold,
    fontFamily: FONTS.medium,
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },

  /* ── Controls ────────────────────────────────────────────────────────────── */
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  ctrlBtn: {
    width: 32,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  closeBtn: {
    width: 28,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Progress bar ────────────────────────────────────────────────────────── */
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  progressFill: {
    height: 3,
    borderTopRightRadius: 1.5,
    borderBottomRightRadius: 1.5,
  },
});
