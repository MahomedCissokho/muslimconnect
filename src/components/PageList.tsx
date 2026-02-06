import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import numberBg from '../../assets/images/number.png';
import { COLORS, FONTS, SPACING } from '../constants';
import { usePageList } from '../hooks/useQuran';
import { SkeletonLoader } from './SkeletonLoader';

interface PageListProps {
  onPagePress?: (pageNumber: number) => void;
}

export const PageList: React.FC<PageListProps> = ({ onPagePress }) => {
  const { t } = useTranslation();
  const { data: pageList, loading, error } = usePageList();

  useEffect(() => {
    console.log('[PageList] Component mounted');
    console.log('[PageList] Pages count:', pageList.length);
  }, [pageList]);

  const handlePagePress = (pageNumber: number) => {
    console.log('[PageList] Page pressed:', pageNumber);
    onPagePress?.(pageNumber);
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
      {pageList.map((page) => (
        <TouchableOpacity
          key={page.number}
          style={styles.pageItem}
          onPress={() => handlePagePress(page.number)}
          activeOpacity={0.7}
        >
          <View style={styles.pageLeft}>
            <View style={styles.numberContainer}>
              <Image source={numberBg} style={styles.numberBg} resizeMode="contain" />
              <Text style={styles.numberText}>{page.number}</Text>
            </View>

            <View style={styles.pageInfo}>
              <Text style={styles.pageName}>{t('quran.page')} {page.number}</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.surahRange}>
                  <Text style={styles.surahName}>{page.startSurahName}</Text>
                  <Text style={styles.ayahNumber}>{t('quran.verse')} {page.startAyah}</Text>
                </View>
                <View style={styles.separator}>
                  <View style={styles.separatorLine} />
                  <View style={styles.separatorDot} />
                  <View style={styles.separatorLine} />
                </View>
                <View style={styles.surahRange}>
                  <Text style={styles.surahName}>{page.endSurahName}</Text>
                  <Text style={styles.ayahNumber}>{t('quran.verse')} {page.endAyah}</Text>
                </View>
              </View>
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
    borderRadius: 3,
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
