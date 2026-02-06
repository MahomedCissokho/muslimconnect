import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import numberBg from '../../assets/images/number.png';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants';
import { useJuzList } from '../hooks/useQuran';
import { SkeletonLoader } from './SkeletonLoader';

interface JuzListProps {
  onJuzPress?: (juzNumber: number) => void;
}

export const JuzList: React.FC<JuzListProps> = ({ onJuzPress }) => {
  const { t } = useTranslation();
  const { data: juzList, loading, error } = useJuzList();

  if (loading) {
    return <SkeletonLoader itemCount={10} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {juzList.map((juz) => (
        <TouchableOpacity
          key={juz.number}
          style={styles.juzItem}
          onPress={() => onJuzPress?.(juz.number)}
          activeOpacity={0.7}
        >
          <View style={styles.juzLeft}>
            <View style={styles.numberContainer}>
              <Image source={numberBg} style={styles.numberBg} resizeMode="contain" />
              <Text style={styles.numberText}>{juz.number}</Text>
            </View>

            <View style={styles.juzInfo}>
              <Text style={styles.juzName}>{t('quran.juzz')} {juz.number}</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.surahRange}>
                  <Text style={styles.surahName}>{juz.startSurah}</Text>
                  <Text style={styles.ayahNumber}>{t('quran.verse')} {juz.startAyah}</Text>
                </View>
                <View style={styles.separator}>
                  <View style={styles.separatorLine} />
                  <View style={styles.separatorDot} />
                  <View style={styles.separatorLine} />
                </View>
                <View style={styles.surahRange}>
                  <Text style={styles.surahName}>{juz.endSurah}</Text>
                  <Text style={styles.ayahNumber}>{t('quran.verse')} {juz.endAyah}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
  },
  errorContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  juzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  juzLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberContainer: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  numberBg: {
    width: 45,
    height: 45,
    position: 'absolute',
    tintColor: COLORS.gold,
  },
  numberText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  juzInfo: {
    flex: 1,
  },
  juzName: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    marginBottom: SPACING.sm,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahRange: {
    flexDirection: 'column',
  },
  surahName: {
    color: COLORS.gray300,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  ayahNumber: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    width: 40,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray600,
  },
  separatorDot: {
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gold,
    marginHorizontal: 3,
  },
});
