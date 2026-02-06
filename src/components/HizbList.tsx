import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import numberBg from '../../assets/images/number.png';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants';
import { useHizbList } from '../hooks/useQuran';
import { SkeletonLoader } from './SkeletonLoader';

interface HizbListProps {
  onHizbPress?: (hizbQuarter: number) => void;
}

export const HizbList: React.FC<HizbListProps> = ({ onHizbPress }) => {
  const { t } = useTranslation();
  const { data: hizbList, loading, error } = useHizbList();

  useEffect(() => {
    console.log('[HizbList] Component mounted');
    console.log('[HizbList] Hizb quarters count:', hizbList.length);
  }, [hizbList]);

  const handleHizbPress = (hizbQuarter: number) => {
    console.log('[HizbList] Hizb quarter pressed:', hizbQuarter);
    onHizbPress?.(hizbQuarter);
  };

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
      {hizbList.map((hizb) => (
        <TouchableOpacity
          key={hizb.hizbQuarter}
          style={styles.hizbItem}
          onPress={() => handleHizbPress(hizb.hizbQuarter)}
          activeOpacity={0.7}
        >
          <View style={styles.hizbLeft}>
            <View style={styles.numberContainer}>
              <Image source={numberBg} style={styles.numberBg} resizeMode="contain" />
              <Text style={styles.numberText}>{hizb.hizbQuarter}</Text>
            </View>

            <View style={styles.hizbInfo}>
              <Text style={styles.hizbName}>{t('quran.hizb')} {hizb.hizbQuarter}</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.surahRange}>
                  <Text style={styles.surahName}>{hizb.startSurahName}</Text>
                  <Text style={styles.ayahNumber}>{t('quran.verse')} {hizb.startAyah}</Text>
                </View>
                <View style={styles.separator}>
                  <View style={styles.separatorLine} />
                  <View style={styles.separatorDot} />
                  <View style={styles.separatorLine} />
                </View>
                <View style={styles.surahRange}>
                  <Text style={styles.surahName}>{hizb.endSurahName}</Text>
                  <Text style={styles.ayahNumber}>{t('quran.verse')} {hizb.endAyah}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.juzBadge}>
            <Text style={styles.juzBadgeText}>{t('quran.juzz')} {hizb.juz}</Text>
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
  hizbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hizbLeft: {
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
    fontSize: 13,
  },
  hizbInfo: {
    flex: 1,
  },
  hizbName: {
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
  juzBadge: {
    backgroundColor: COLORS.whiteAlpha15,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  juzBadgeText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
});
