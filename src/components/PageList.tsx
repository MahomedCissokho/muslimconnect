import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import numberBg from '../../assets/images/number.png';
import { COLORS, FONTS, SPACING } from '../constants';
import { getSurahName } from '../data';
import { PAGES } from '../data/pages';

interface PageListProps {
  onPagePress?: (pageNumber: number) => void;
}

export const PageList: React.FC<PageListProps> = ({ onPagePress }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {PAGES.map((page) => (
        <TouchableOpacity
          key={page.number}
          style={styles.pageItem}
          onPress={() => onPagePress?.(page.number)}
          activeOpacity={0.7}
        >
          <View style={styles.pageLeft}>
            <View style={styles.numberContainer}>
              <Image source={numberBg} style={styles.numberBg} resizeMode="contain" />
              <Text style={styles.numberText}>{page.number}</Text>
            </View>

            <View style={styles.pageInfo}>
              <Text style={styles.pageName}>{t('quran.page')} {page.number}</Text>
              <Text style={styles.surahName}>{getSurahName(page.startSurah)} - {t('quran.verse')} {page.startAyah}</Text>
            </View>
          </View>

          <View style={styles.juzBadge}>
            <Text style={styles.juzBadgeText}>{t('quran.juzz')} {page.juz}</Text>
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
  pageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageLeft: {
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
  pageInfo: {
    flex: 1,
  },
  pageName: {
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
