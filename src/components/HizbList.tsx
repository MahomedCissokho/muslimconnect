import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import numberBg from '../../assets/images/number.png';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants';
import { getSurahName } from '../data';
import { HIZB_QUARTERS } from '../data/hizb';

interface HizbListProps {
  onHizbPress?: (hizbQuarter: number) => void;
}

export const HizbList: React.FC<HizbListProps> = ({ onHizbPress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {HIZB_QUARTERS.map((hizb) => (
        <TouchableOpacity
          key={hizb.quarter}
          style={styles.hizbItem}
          onPress={() => onHizbPress?.(hizb.quarter)}
          activeOpacity={0.7}
        >
          <View style={styles.hizbLeft}>
            <View style={styles.numberContainer}>
              <Image source={numberBg} style={styles.numberBg} resizeMode="contain" />
              <Text style={styles.numberText}>{hizb.quarter}</Text>
            </View>

            <View style={styles.hizbInfo}>
              <Text style={styles.hizbName}>{t('quran.hizb')} {hizb.hizb} - Q{((hizb.quarter - 1) % 4) + 1}</Text>
              <Text style={styles.surahName}>{getSurahName(hizb.startSurah)} - {t('quran.verse')} {hizb.startAyah}</Text>
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
  surahName: {
    color: COLORS.gray300,
    fontSize: 13,
    fontFamily: FONTS.medium,
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
