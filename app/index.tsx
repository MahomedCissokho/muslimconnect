import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import quranImage from "../assets/images/quran.png";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../src/constants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
}

const FeatureItem = ({ icon, title, desc }: FeatureItemProps) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={20} color={COLORS.gold} />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </View>
);

export default function OnboardingScreen() {
  const { t } = useTranslation();

  const handleGetStarted = () => {
    router.replace("/auth");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ─── Top Section: Hero ─── */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={["#863AE8", "#672CBC", "#4A1D96"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              {/* Decorative circles */}
              <View style={styles.deco1} />
              <View style={styles.deco2} />
              <View style={styles.deco3} />

              <Image
                source={quranImage}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          {/* ─── Content ─── */}
          <View style={styles.contentSection}>
            {/* Bismillah */}
            <Text style={styles.bismillah}>﷽</Text>

            {/* Title */}
            <Text style={styles.title}>{t("common.appName")}</Text>

            {/* Description */}
            <Text style={styles.description}>
              {t("onboarding.description")}
            </Text>

            {/* Features */}
            <View style={styles.featuresGrid}>
              <FeatureItem
                icon="book-outline"
                title={t("onboarding.featureQuran")}
                desc={t("onboarding.featureQuranDesc")}
              />
              <FeatureItem
                icon="time-outline"
                title={t("onboarding.featurePrayer")}
                desc={t("onboarding.featurePrayerDesc")}
              />
              <FeatureItem
                icon="headset-outline"
                title={t("onboarding.featureAudio")}
                desc={t("onboarding.featureAudioDesc")}
              />
              <FeatureItem
                icon="compass-outline"
                title={t("onboarding.featureQibla")}
                desc={t("onboarding.featureQiblaDesc")}
              />
            </View>
          </View>
        </ScrollView>

        {/* CTA — pinned outside ScrollView, always visible */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            onPress={handleGetStarted}
            activeOpacity={0.85}
            style={styles.ctaButton}
          >
            <LinearGradient
              colors={["#F9BD64", "#E8A84C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>{t("onboarding.getStarted")}</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
            </LinearGradient>
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
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },

  // ─── Hero ───────────────────────────────
  heroSection: {
    height: screenHeight * 0.32,
    marginHorizontal: SPACING["2xl"],
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS["2xl"],
    overflow: "hidden",
  },
  heroGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heroImage: {
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
    zIndex: 2,
  },
  deco1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  deco2: {
    position: "absolute",
    bottom: -40,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  deco3: {
    position: "absolute",
    top: 30,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  // ─── Content ───────────────────────────
  contentSection: {
    paddingHorizontal: SPACING["2xl"],
    paddingTop: SPACING.xl,
    alignItems: "center",
  },
  contentTop: {},
  bismillah: {
    fontSize: 32,
    color: COLORS.gold,
    fontFamily: FONTS.arabic,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  description: {
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },

  // ─── Features ───────────────────────────
  featuresGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.xl,
  },
  featureItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(249,189,100,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
  },
  featureDesc: {
    color: COLORS.gray500,
    fontSize: 11,
    fontFamily: FONTS.regular,
    lineHeight: 15,
  },

  // ─── CTA ────────────────────────────────
  ctaWrap: {
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  ctaButton: {
    width: "100%",
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    gap: 10,
  },
  ctaText: {
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
});
