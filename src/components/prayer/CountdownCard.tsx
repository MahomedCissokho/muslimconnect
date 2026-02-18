import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../../constants';
import type { PrayerInfo } from './types';

interface CountdownCardProps {
  nextPrayer: PrayerInfo | null;
  nextPrayerLabel: string;
  countdown: string;
  labelText: string;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  nextPrayer,
  nextPrayerLabel,
  countdown,
  labelText,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  if (!nextPrayer) return null;

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.glow} />
      <Text style={styles.label}>{labelText}</Text>
      <Text style={styles.prayerName}>{nextPrayerLabel}</Text>
      <Text style={styles.arabicName}>{nextPrayer.arabicName}</Text>
      <Text style={styles.timer}>{countdown}</Text>
      <Text style={styles.timeSub}>{nextPrayer.time}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING['2xl'],
    marginBottom: SPACING['2xl'],
    backgroundColor: COLORS.purple,
    borderRadius: BORDER_RADIUS['2xl'],
    paddingVertical: SPACING['2xl'],
    paddingHorizontal: SPACING['2xl'],
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: COLORS.purple, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 },
      android: { elevation: 12 },
    }),
  },
  glow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(249, 189, 100, 0.12)',
  },
  label: {
    color: COLORS.whiteAlpha70,
    fontFamily: FONTS.medium,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  prayerName: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 22,
  },
  arabicName: {
    color: COLORS.gold,
    fontFamily: FONTS.arabic,
    fontSize: 20,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  timer: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 40,
    letterSpacing: 2,
  },
  timeSub: {
    color: COLORS.whiteAlpha70,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginTop: SPACING.xs,
  },
});
