import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../../constants';
import type { PrayerInfo } from './types';

interface PrayerCardProps {
  prayer: PrayerInfo;
  isNext: boolean;
  nextLabel: string;
  displayName: string;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, isNext, nextLabel, displayName }) => {
  const isSunrise = prayer.key === 'Sunrise';

  return (
    <View style={[styles.card, isNext && styles.cardActive, isSunrise && styles.cardSunrise]}>
      <View style={[styles.iconContainer, isNext && styles.iconActive]}>
        <Ionicons name={prayer.icon} size={22} color={isNext ? COLORS.primary : COLORS.gold} />
      </View>

      <View style={styles.nameContainer}>
        <Text style={[styles.name, isNext && styles.nameActive]}>{displayName}</Text>
        <Text style={styles.arabicName}>{prayer.arabicName}</Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={[styles.time, isNext && styles.timeActive]}>{prayer.time}</Text>
        {isNext && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{nextLabel}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.tertiary,
  },
  cardSunrise: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.whiteAlpha15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconActive: {
    backgroundColor: COLORS.gold,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  nameActive: {
    color: COLORS.gold,
  },
  arabicName: {
    color: COLORS.gray400,
    fontFamily: FONTS.arabic,
    fontSize: 14,
    marginTop: 1,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  timeActive: {
    color: COLORS.gold,
  },
  badge: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginTop: 4,
  },
  badgeText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
