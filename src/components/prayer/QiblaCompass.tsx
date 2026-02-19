import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../../constants';
import { QIBLA_THRESHOLD } from './types';
import { angleDifference } from './utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COMPASS_SIZE = Math.min(SCREEN_WIDTH * 0.55, 220);

interface QiblaCompassProps {
  qiblaBearing: number;
  qiblaLabel: string;
  bearingLabel: string;
  unavailableLabel: string;
  alignedLabel: string;
  turnLabel: string;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  qiblaBearing,
  qiblaLabel,
  bearingLabel,
  unavailableLabel,
  alignedLabel,
  turnLabel,
}) => {
  const [heading, setHeading] = useState(0);
  const [sensorAvailable, setSensorAvailable] = useState(true);
  const [isAligned, setIsAligned] = useState(false);
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const prevTarget = useRef(0);
  const lastHapticTime = useRef(0);
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Use Location.watchHeadingAsync — gives the correct compass heading on both platforms.
  // Prefer trueHeading (GPS-calibrated) when available, fall back to magHeading.
  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    const start = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setSensorAvailable(false);
          return;
        }

        sub = await Location.watchHeadingAsync((data) => {
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          setHeading(h);
        });
      } catch {
        setSensorAvailable(false);
      }
    };

    start();
    return () => {
      sub?.remove();
    };
  }, []);

  // Animate needle + check alignment + haptics
  useEffect(() => {
    const targetRotation = qiblaBearing - heading;

    // Shortest angular path for smooth animation
    let diff = targetRotation - prevTarget.current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const newTarget = prevTarget.current + diff;
    prevTarget.current = newTarget;

    Animated.spring(animatedRotation, {
      toValue: newTarget,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();

    // Check if phone is aligned with Qibla
    const deviation = angleDifference(heading, qiblaBearing);
    const aligned = deviation <= QIBLA_THRESHOLD;

    if (aligned && !isAligned) {
      setIsAligned(true);
      const now = Date.now();
      if (now - lastHapticTime.current > 1000) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        lastHapticTime.current = now;
      }
      Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    } else if (!aligned && isAligned) {
      setIsAligned(false);
      Animated.timing(glowAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    }
  }, [heading, qiblaBearing, animatedRotation, isAligned, glowAnim]);

  const rotateInterpolation = animatedRotation.interpolate({
    inputRange: [-3600, 3600],
    outputRange: ['-3600deg', '3600deg'],
  });

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.gold],
  });

  const bgColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.tertiary, 'rgba(249, 189, 100, 0.1)'],
  });

  if (!sensorAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{qiblaLabel}</Text>
        <View style={styles.fallbackBox}>
          <Ionicons name="compass-outline" size={48} color={COLORS.gray400} />
          <Text style={styles.fallbackText}>{unavailableLabel}</Text>
          <Text style={styles.bearingText}>{bearingLabel}: {Math.round(qiblaBearing)}°</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{qiblaLabel}</Text>

      {/* Guidance text */}
      <Text style={[styles.guidanceText, isAligned && styles.guidanceAligned]}>
        {isAligned ? alignedLabel : turnLabel}
      </Text>

      {/* Compass */}
      <Animated.View style={[styles.compassOuter, { borderColor, backgroundColor: bgColor }]}>
        {/* Kaaba icon at top (fixed) - represents Qibla target */}
        <View style={styles.kaabaTop}>
          <Text style={styles.kaabaEmoji}>🕋</Text>
        </View>

        {/* Rotating compass ring with needle */}
        <Animated.View
          style={[
            styles.compassRing,
            { transform: [{ rotate: rotateInterpolation }] },
          ]}
        >
          {/* Needle pointing up = toward Qibla when aligned */}
          <View style={styles.needleUp}>
            <View style={[styles.needle, isAligned && styles.needleAligned]} />
            <View style={[styles.needleDot, isAligned && styles.needleDotAligned]} />
          </View>
        </Animated.View>

        {/* Center dot */}
        <View style={[styles.centerDot, isAligned && styles.centerDotAligned]} />
      </Animated.View>

      <Text style={styles.bearingText}>
        {bearingLabel}: {Math.round(qiblaBearing)}°
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING['2xl'],
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    marginBottom: SPACING.sm,
    alignSelf: 'flex-start',
  },
  guidanceText: {
    color: COLORS.gray400,
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  guidanceAligned: {
    color: COLORS.success,
    fontFamily: FONTS.bold,
  },
  compassOuter: {
    width: COMPASS_SIZE + 40,
    height: COMPASS_SIZE + 40,
    borderRadius: (COMPASS_SIZE + 40) / 2,
    borderWidth: 3,
    borderColor: COLORS.border,
    backgroundColor: COLORS.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kaabaTop: {
    position: 'absolute',
    top: -5,
    zIndex: 10,
  },
  kaabaEmoji: {
    fontSize: 28,
  },
  compassRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  needleUp: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
  },
  needle: {
    width: 4,
    height: COMPASS_SIZE / 2 - 20,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  needleAligned: {
    backgroundColor: COLORS.success,
  },
  needleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
    marginTop: -2,
  },
  needleDotAligned: {
    backgroundColor: COLORS.success,
  },
  centerDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.gold,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  centerDotAligned: {
    backgroundColor: COLORS.success,
  },
  bearingText: {
    color: COLORS.gray400,
    fontFamily: FONTS.medium,
    fontSize: 13,
    marginTop: SPACING.md,
  },
  fallbackBox: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    gap: SPACING.sm,
  },
  fallbackText: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});
