import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import bgOnboarding from '../assets/images/bgonboarding.png';
import quranImage from '../assets/images/quran.png';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../src/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { t } = useTranslation();

  const handleGetStarted = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('common.appName')}</Text>
            <Text style={styles.description}>{t('onboarding.description')}</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image source={bgOnboarding} style={styles.bgImage} resizeMode="contain" />
            <Image source={quranImage} style={styles.quranImage} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleGetStarted}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{t('common.continue')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING['3xl'],
    justifyContent: 'space-between',
  },
  mainSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: SPACING['3xl'],
  },
  title: {
    color: COLORS.purple,
    fontSize: 32,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  description: {
    color: COLORS.gray300,
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING['3xl'],
  },
  bgImage: {
    width: Math.min(screenWidth * 1.2, 350),
    height: Math.min(screenHeight * 0.4, 350),
    borderRadius: BORDER_RADIUS.xl,
  },
  quranImage: {
    position: 'absolute',
    width: Math.min(screenWidth * 0.6, 200),
    height: Math.min(screenHeight * 0.25, 200),
    borderRadius: BORDER_RADIUS.xl,
    bottom: '2%',
  },
  buttonContainer: {
    paddingBottom: SPACING['3xl'],
  },
  button: {
    backgroundColor: COLORS.gold,
    marginHorizontal: SPACING['3xl'],
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.purple,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },
});