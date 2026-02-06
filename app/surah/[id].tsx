import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import backIcon from '../../assets/images/back.png';
import numberBg from '../../assets/images/number.png';
import playIcon from '../../assets/images/play.png';
import shareIcon from '../../assets/images/share.png';
import { LoadingIndicator } from '../../src/components';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../../src/constants';
import { quranService } from '../../src/services/quran';
import type { SurahData, Ayah } from '../../src/types';

interface AyahWithTranslation extends Ayah {
  translation?: string;
  audioUrl?: string;
}

export default function SurahDetailsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = id ? parseInt(id, 10) : null;

  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [ayahsWithTranslation, setAyahsWithTranslation] = useState<AyahWithTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);

  const fetchSurahData = useCallback(async () => {
    if (!surahNumber) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch Arabic, translation, and audio in parallel
      const translationEdition = i18n.language === 'fr' ? 'fr.hamidullah' : 'en.sahih';

      const [arabicData, translationData, audioData] = await Promise.all([
        quranService.getSurah(surahNumber),
        quranService.getSurahWithTranslation(surahNumber, translationEdition),
        quranService.getSurahWithAudio(surahNumber, 'ar.alafasy'),
      ]);

      setSurahData(arabicData);

      // Merge Arabic ayahs with translations and audio
      const merged: AyahWithTranslation[] = arabicData.ayahs.map((ayah, index) => ({
        ...ayah,
        translation: translationData.ayahs[index]?.text || '',
        audioUrl: audioData.ayahs[index]?.audio || '',
      }));

      setAyahsWithTranslation(merged);
    } catch (err) {
      console.error('[SurahDetails] Error fetching surah:', err);
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }, [surahNumber, t, i18n.language]);

  useEffect(() => {
    fetchSurahData();
  }, [fetchSurahData]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePlayAudio = async (ayahNumber: number, audioUrl?: string) => {
    if (!audioUrl) {
      Alert.alert(t('errors.generic'), t('errors.audioNotAvailable'));
      return;
    }

    try {
      // Stop current audio if playing
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setPlayingAyahNumber(null);
      }

      // If same ayah, just stop
      if (playingAyahNumber === ayahNumber) {
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Load and play new audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingAyahNumber(ayahNumber);

      // Handle playback status
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingAyahNumber(null);
        }
      });
    } catch (err) {
      console.error('[SurahDetails] Error playing audio:', err);
      Alert.alert(t('errors.generic'), t('errors.audioPlaybackFailed'));
    }
  };

  const handleShareAyah = async (ayah: AyahWithTranslation) => {
    try {
      const message = `${ayah.text}\n\n${ayah.translation}\n\n- ${surahData?.englishName} (${ayah.numberInSurah})`;

      await Share.share({
        message,
      });
    } catch (err) {
      console.error('[SurahDetails] Error sharing ayah:', err);
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('common.retry')}</Text>
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
        <TouchableOpacity>
          <Image source={shareIcon} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Surah Card */}
        <View style={styles.surahCard}>
          <Text style={styles.surahName}>{englishName}</Text>
          <Text style={styles.surahTranslation}>{englishNameTranslation}</Text>
          <View style={styles.divider} />
          <Text style={styles.surahInfo}>
            {t(`quran.${revelationType.toLowerCase()}`)} • {numberOfAyahs} {t('common.verses')}
          </Text>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </View>

        {/* Ayahs */}
        {ayahsWithTranslation.map((ayah) => (
          <View key={ayah.number} style={styles.ayahContainer}>
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
                  style={[
                    styles.actionButton,
                    playingAyahNumber === ayah.number && styles.actionButtonActive
                  ]}
                  onPress={() => handlePlayAudio(ayah.number, ayah.audioUrl)}
                >
                  <Image
                    source={playIcon}
                    style={[
                      styles.actionIcon,
                      playingAyahNumber === ayah.number && styles.actionIconActive
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.ayahArabic}>{ayah.text}</Text>

            {ayah.translation && (
              <Text style={styles.ayahTranslation}>{ayah.translation}</Text>
            )}
          </View>
        ))}
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
  actionIconActive: {
    tintColor: COLORS.primary,
  },
  ayahArabic: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.arabic,
    textAlign: 'right',
    lineHeight: 36,
    marginBottom: SPACING.lg,
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
  backButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  backButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
});
