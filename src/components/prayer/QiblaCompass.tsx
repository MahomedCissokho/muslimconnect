import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../../constants';
import { QIBLA_THRESHOLD } from './types';
import { angleDifference } from './utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COMPASS_SIZE = Math.min(SCREEN_WIDTH * 0.55, 220);

/** Threshold (degrees) below which we show "almost there" instead of turn direction */
const ALMOST_THRESHOLD = 15;

interface QiblaCompassProps {
  qiblaBearing: number;
  qiblaLabel: string;
  bearingLabel: string;
  unavailableLabel: string;
  alignedLabel: string;
  turnLabel: string;
  /** New i18n props for degree-based guidance */
  turnRightLabel?: string;
  turnLeftLabel?: string;
  degreesAwayLabel?: (degrees: number) => string;
  almostThereLabel?: string;
  /** When false, the heading subscription and haptics are paused (e.g. tab lost focus). */
  isActive?: boolean;
}

/**
 * Compute signed angular difference: positive = turn right, negative = turn left.
 * Result is in [-180, 180].
 */
function signedAngleDifference(currentHeading: number, targetBearing: number): number {
  let diff = targetBearing - currentHeading;
  // Normalize to [-180, 180]
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  qiblaBearing,
  qiblaLabel,
  bearingLabel,
  unavailableLabel,
  alignedLabel,
  turnLabel,
  turnRightLabel,
  turnLeftLabel,
  degreesAwayLabel,
  almostThereLabel,
  isActive = true,
}) => {
  const [heading, setHeading] = useState(0);
  const [sensorAvailable, setSensorAvailable] = useState(true);
  const [isAligned, setIsAligned] = useState(false);
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const prevTarget = useRef(0);
  const lastHapticTime = useRef(0);
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Track whether the sensor hardware is available (checked once on mount).
  const [sensorChecked, setSensorChecked] = useState(false);
  const sensorAvailableRef = useRef(true);

  // One-time check: does the device have a magnetometer?
  useEffect(() => {
    (async () => {
      try {
        const hasMag = await Magnetometer.isAvailableAsync();
        if (!hasMag) {
          setSensorAvailable(false);
          sensorAvailableRef.current = false;
        }
      } catch {
        setSensorAvailable(false);
        sensorAvailableRef.current = false;
      } finally {
        setSensorChecked(true);
      }
    })();
  }, []);

  // Start / stop the heading subscription based on isActive + sensor availability.
  // This ensures the subscription is removed when the tab loses focus and
  // re-created when it regains focus.
  useEffect(() => {
    if (!sensorChecked || !sensorAvailableRef.current || !isActive) return;

    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setSensorAvailable(false);
          sensorAvailableRef.current = false;
          return;
        }

        if (cancelled) return;

        sub = await Location.watchHeadingAsync((data) => {
          const h = data.trueHeading >= 0 ? data.trueHeading : data.magHeading;
          setHeading(h);
        });
      } catch {
        setSensorAvailable(false);
        sensorAvailableRef.current = false;
      }
    };

    start();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [isActive, sensorChecked]);

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
      if (isActive) {
        const now = Date.now();
        if (now - lastHapticTime.current > 1000) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          lastHapticTime.current = now;
        }
      }
      Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    } else if (!aligned && isAligned) {
      setIsAligned(false);
      Animated.timing(glowAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    }
  }, [heading, qiblaBearing, animatedRotation, isAligned, glowAnim, isActive]);

  // Compute guidance info
  const guidanceInfo = useMemo(() => {
    if (isAligned) {
      return { type: 'aligned' as const, degrees: 0, direction: null };
    }
    const signed = signedAngleDifference(heading, qiblaBearing);
    const absDeg = Math.round(Math.abs(signed));
    if (absDeg <= ALMOST_THRESHOLD) {
      return { type: 'almost' as const, degrees: absDeg, direction: signed > 0 ? 'right' : 'left' };
    }
    return {
      type: 'turn' as const,
      degrees: absDeg,
      direction: signed > 0 ? ('right' as const) : ('left' as const),
    };
  }, [heading, qiblaBearing, isAligned]);

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

  /** Render the guidance section above the compass */
  const renderGuidance = () => {
    if (isAligned) {
      return (
        <View style={styles.guidanceContainer}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <Text style={[styles.guidanceText, styles.guidanceAligned]}>
            {alignedLabel}
          </Text>
        </View>
      );
    }

    const { degrees, direction, type } = guidanceInfo;

    // Determine direction label and icon
    const dirLabel =
      direction === 'right'
        ? turnRightLabel || 'Turn right'
        : turnLeftLabel || 'Turn left';
    const arrowIcon = direction === 'right' ? 'arrow-redo' : 'arrow-undo';

    if (type === 'almost') {
      return (
        <View style={styles.guidanceContainer}>
          <Ionicons name={arrowIcon as any} size={20} color={COLORS.warning} />
          <Text style={[styles.guidanceText, styles.guidanceAlmost]}>
            {almostThereLabel || 'Almost there!'}{' '}
            <Text style={styles.degreesText}>{degrees}°</Text>
          </Text>
        </View>
      );
    }

    // Normal turn guidance with degrees
    const degreesText = degreesAwayLabel
      ? degreesAwayLabel(degrees)
      : `${degrees}° remaining`;

    return (
      <View style={styles.guidanceContainer}>
        <View style={styles.directionRow}>
          <Ionicons name={arrowIcon as any} size={22} color={COLORS.gold} />
          <Text style={styles.guidanceText}>{dirLabel}</Text>
        </View>
        <Text style={styles.degreesRemainingText}>{degreesText}</Text>
      </View>
    );
  };

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

      {/* Guidance text - degree-based with direction */}
      {renderGuidance()}

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
  guidanceContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: 4,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guidanceText: {
    color: COLORS.gray400,
    fontFamily: FONTS.medium,
    fontSize: 15,
    textAlign: 'center',
  },
  guidanceAligned: {
    color: COLORS.success,
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginTop: 2,
  },
  guidanceAlmost: {
    color: COLORS.warning,
    fontFamily: FONTS.semiBold,
  },
  degreesText: {
    fontFamily: FONTS.bold,
    color: COLORS.warning,
  },
  degreesRemainingText: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 2,
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
