import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import backIcon from '../../assets/images/back.png';
import numberBg from '../../assets/images/number.png';
import shareIcon from '../../assets/images/share.png';
import { LoadingIndicator } from '../../src/components';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../../src/constants';
import { useAudio } from '../../src/contexts/AudioContext';
import { useSettings } from '../../src/contexts/SettingsContext';
import { buildAudioUrl } from '../../src/utils/audioUrl';
import { quranService } from '../../src/services/quran';
import type { AudioTrack } from '../../src/services/audio';
import type { SurahData, Ayah } from '../../src/types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface AyahWithExtra extends Ayah {
  translation?: string;
  transliteration?: string;
  audioUrl?: string;
}

export default function SurahDetailsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = id ? parseInt(id, 10) : null;

  const { reciterId, displayOptions } = useSettings();
  const { playbackState, loadPlaylist, playTrack, pause, resume, stop } = useAudio();

  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [ayahs, setAyahs] = useState<AyahWithExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Play All state
  const [playAllActive, setPlayAllActive] = useState(false);

  // Scroll refs
  const scrollViewRef = useRef<ScrollView>(null);
  const ayahRefs = useRef<Record<number, View | null>>({});
  const currentScrollY = useRef(0);
  const lastScrolledAyah = useRef<number | null>(null);

  // Track if the current audio belongs to THIS surah
  const isThisSurahPlaying =
    playbackState.currentTrack?.surahNumber === surahNumber &&
    (playbackState.isPlaying || playbackState.isPaused || playbackState.isLoading);

  // Reset playAllActive only when audio truly stops
  useEffect(() => {
    if (!playbackState.currentTrack && !playbackState.isLoading) {
      setPlayAllActive(false);
    }
  }, [playbackState.currentTrack, playbackState.isLoading]);

  // Track scroll position
  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    currentScrollY.current = e.nativeEvent.contentOffset.y;
  }, []);

  // Scroll an ayah to center of screen using measure()
  const scrollToAyah = useCallback((globalNumber: number) => {
    const ayahView = ayahRefs.current[globalNumber];
    if (!ayahView || !scrollViewRef.current) return;

    ayahView.measure((_x, _y, _w, h, _pageX, pageY) => {
      // pageY = ayah's current position on screen
      // We want the ayah centered vertically
      const ayahCenter = pageY + h / 2;
      const screenCenter = SCREEN_HEIGHT / 2;
      const scrollDelta = ayahCenter - screenCenter;
      const targetY = currentScrollY.current + scrollDelta;
      scrollViewRef.current?.scrollTo({ y: Math.max(0, targetY), animated: true });
    });
  }, []);

  // Auto-scroll to current playing ayah
  useEffect(() => {
    const currentGlobal = playbackState.currentTrack?.globalAyahNumber;
    if (
      currentGlobal &&
      playbackState.currentTrack?.surahNumber === surahNumber &&
      (playbackState.isPlaying || playbackState.isLoading) &&
      currentGlobal !== lastScrolledAyah.current
    ) {
      lastScrolledAyah.current = currentGlobal;
      // Small delay so the View is mounted and measurable
      setTimeout(() => scrollToAyah(currentGlobal), 200);
    }
  }, [playbackState.currentTrack?.globalAyahNumber, playbackState.currentTrack?.surahNumber, playbackState.isPlaying, playbackState.isLoading, surahNumber, scrollToAyah]);

  const fetchSurahData = useCallback(async () => {
    if (!surahNumber) return;

    try {
      setLoading(true);
      setError(null);

      const translationEdition = i18n.language === 'fr' ? 'fr.hamidullah' : 'en.sahih';

      const [arabicData, translationData, transliterationData, audioData] = await Promise.all([
        quranService.getSurah(surahNumber),
        quranService.getSurahWithTranslation(surahNumber, translationEdition),
        quranService.getSurahWithTranslation(surahNumber, 'en.transliteration').catch(() => null),
        quranService.getSurahWithAudio(surahNumber, reciterId),
      ]);

      setSurahData(arabicData);

      const merged: AyahWithExtra[] = arabicData.ayahs.map((ayah, index) => ({
        ...ayah,
        translation: translationData.ayahs[index]?.text || '',
        transliteration: transliterationData?.ayahs[index]?.text || '',
        audioUrl: audioData.ayahs[index]?.audio || buildAudioUrl(reciterId, ayah.number),
      }));

      setAyahs(merged);
    } catch (err) {
      console.error('[SurahDetails] Error fetching surah:', err);
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [surahNumber, t, i18n.language, reciterId]);

  useEffect(() => {
    fetchSurahData();
  }, [fetchSurahData]);

  const buildFullPlaylist = (): AudioTrack[] => {
    return ayahs.map((ayah) => ({
      globalAyahNumber: ayah.number,
      surahNumber: surahNumber!,
      ayahNumberInSurah: ayah.numberInSurah,
      audioUrl: ayah.audioUrl || buildAudioUrl(reciterId, ayah.number),
    }));
  };

  const handlePlayAll = async () => {
    if (playAllActive && isThisSurahPlaying) {
      if (playbackState.isPlaying) {
        await pause();
      } else {
        await resume();
      }
      return;
    }

    const playlist = buildFullPlaylist();
    if (playlist.length > 0) {
      setPlayAllActive(true);
      await loadPlaylist(playlist, 0);
    }
  };

  const handleStopAll = async () => {
    setPlayAllActive(false);
    await stop();
  };

  const handlePlayAyah = async (ayahIndex: number) => {
    const ayah = ayahs[ayahIndex];
    const currentTrack = playbackState.currentTrack;

    if (currentTrack?.globalAyahNumber === ayah.number && playbackState.isPlaying) {
      await pause();
      return;
    }
    if (currentTrack?.globalAyahNumber === ayah.number && playbackState.isPaused) {
      await resume();
      return;
    }

    setPlayAllActive(false);
    await playTrack({
      globalAyahNumber: ayah.number,
      surahNumber: surahNumber!,
      ayahNumberInSurah: ayah.numberInSurah,
      audioUrl: ayah.audioUrl || buildAudioUrl(reciterId, ayah.number),
    });
  };

  const handleShareAyah = async (ayah: AyahWithExtra) => {
    try {
      const message = `${ayah.text}\n\n${ayah.translation}\n\n- ${surahData?.englishName} (${ayah.numberInSurah})`;
      await Share.share({ message });
    } catch (err) {
      console.error('[SurahDetails] Error sharing:', err);
    }
  };

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
          <Text style={styles.errorText}>{error || t('errors.loadFailed')}</Text>
          <TouchableOpacity onPress={fetchSurahData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { englishName, englishNameTranslation, revelationType, numberOfAyahs } = surahData;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={backIcon} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{englishName}</Text>
        <TouchableOpacity onPress={() => router.push('/settings' as any)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Surah Card */}
        <View style={styles.surahCard}>
          <Text style={styles.surahName}>{englishName}</Text>
          <Text style={styles.surahTranslation}>{englishNameTranslation}</Text>
          <View style={styles.divider} />
          <Text style={styles.surahInfo}>
            {t(`quran.${revelationType.toLowerCase()}`)} • {numberOfAyahs} {t('common.verses')}
          </Text>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>

          {playAllActive && isThisSurahPlaying ? (
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.playAllBtn, { backgroundColor: COLORS.whiteAlpha15 }]}
                onPress={playbackState.isPlaying ? pause : resume}
              >
                <Ionicons
                  name={playbackState.isPlaying ? 'pause' : 'play'}
                  size={18}
                  color={COLORS.white}
                />
                <Text style={[styles.playAllText, { color: COLORS.white }]}>
                  {playbackState.isPlaying ? 'Pause' : t('quran.playAll')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopBtn} onPress={handleStopAll}>
                <Ionicons name="stop" size={18} color={COLORS.error} />
                <Text style={[styles.playAllText, { color: COLORS.error }]}>
                  {t('audio.stopAudio')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.playAllBtnFull} onPress={handlePlayAll}>
              <Ionicons name="play" size={18} color={COLORS.primary} />
              <Text style={styles.playAllText}>{t('quran.playAll')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ayahs */}
        {ayahs.map((ayah, index) => {
          const isPlayingThis = playbackState.currentTrack?.globalAyahNumber === ayah.number;

          return (
            <View
              key={ayah.number}
              ref={(ref) => { ayahRefs.current[ayah.number] = ref; }}
              style={[styles.ayahContainer, isPlayingThis && styles.ayahContainerActive]}
            >
              <View style={styles.ayahHeader}>
                <View style={styles.ayahNumberContainer}>
                  <Image source={numberBg} style={styles.ayahNumberBg} resizeMode="contain" />
                  <Text style={styles.ayahNumberText}>{ayah.numberInSurah}</Text>
                </View>
                <View style={styles.ayahActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShareAyah(ayah)}
                  >
                    <Image source={shareIcon} style={styles.actionIcon} resizeMode="contain" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, isPlayingThis && styles.actionButtonActive]}
                    onPress={() => handlePlayAyah(index)}
                  >
                    <Ionicons
                      name={isPlayingThis && playbackState.isPlaying ? 'pause' : 'play'}
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
                <Text style={styles.ayahTransliteration}>{ayah.transliteration}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING['2xl'],
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
  scrollView: {
    flex: 1,
  },
  surahCard: {
    backgroundColor: COLORS.purple,
    marginHorizontal: SPACING['2xl'],
    marginTop: SPACING.lg,
    marginBottom: SPACING['2xl'],
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING['2xl'],
    alignItems: 'center',
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
    width: '100%',
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
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  playAllBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  playAllBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
  },
  stopBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginHorizontal: SPACING['2xl'],
    marginBottom: SPACING['2xl'],
    padding: SPACING.lg,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ayahContainerActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(249, 189, 100, 0.08)',
  },
  ayahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  ayahNumberContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahNumberBg: {
    width: 36,
    height: 36,
    position: 'absolute',
    tintColor: COLORS.gold,
  },
  ayahNumberText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  ayahActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'right',
    lineHeight: 36,
    marginBottom: SPACING.lg,
  },
  ayahTransliteration: {
    color: COLORS.gold,
    fontSize: 14,
    fontFamily: FONTS.medium,
    fontStyle: 'italic',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING['3xl'],
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
});
