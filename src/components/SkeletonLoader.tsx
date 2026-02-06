import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { COLORS, SPACING } from '../constants';

interface SkeletonLoaderProps {
  itemCount?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ itemCount = 8 }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerValue]);

  const opacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.leftSection}>
            <Animated.View style={[styles.circle, { opacity }]} />
            <View style={styles.textSection}>
              <Animated.View style={[styles.titleBar, { opacity }]} />
              <View style={styles.detailsRow}>
                <Animated.View style={[styles.detailBar, { opacity }]} />
                <Animated.View style={[styles.dot, { opacity }]} />
                <Animated.View style={[styles.detailBar, { opacity }]} />
              </View>
            </View>
          </View>
          <Animated.View style={[styles.badge, { opacity }]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.gray700,
    marginRight: SPACING.lg,
  },
  textSection: {
    flex: 1,
  },
  titleBar: {
    height: 16,
    width: '40%',
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailBar: {
    height: 12,
    width: 80,
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gray700,
    marginHorizontal: SPACING.md,
  },
  badge: {
    width: 60,
    height: 24,
    backgroundColor: COLORS.gray700,
    borderRadius: 12,
  },
});
