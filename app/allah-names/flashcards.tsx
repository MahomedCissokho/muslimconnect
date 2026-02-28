import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../../assets/images/back.png";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import { ALLAH_NAMES } from "../../src/data/allahNames";
import type { AllahName } from "../../src/data/allahNames";
import { allahNamesService } from "../../src/services/allahNamesProgress";

export default function FlashcardsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";

  const [learnedIds, setLearnedIds] = useState<number[]>([]);
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const loadProgress = useCallback(async () => {
    const progress = await allahNamesService.getProgress();
    setLearnedIds(progress.learnedIds);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const deck: AllahName[] = useMemo(() => {
    if (showUnlearnedOnly) {
      return ALLAH_NAMES.filter((n) => !learnedIds.includes(n.number));
    }
    return [...ALLAH_NAMES];
  }, [showUnlearnedOnly, learnedIds]);

  const currentName = deck[currentIndex] ?? deck[0];
  const isCurrentLearned = currentName ? learnedIds.includes(currentName.number) : false;

  const handleReveal = () => {
    if (!revealed) {
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        friction: 6,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }).start();
      });
      setRevealed(true);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= deck.length - 1) return prev;
      return prev + 1;
    });
    setRevealed(false);
    scaleAnim.setValue(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
    setRevealed(false);
    scaleAnim.setValue(1);
  };

  const handleKnowThis = async () => {
    if (currentName && !isCurrentLearned) {
      await allahNamesService.markLearned(currentName.number);
      setLearnedIds((prev) => [...prev, currentName.number]);
    }
    handleNext();
  };

  const handleStillLearning = () => {
    handleNext();
  };

  const toggleFilter = () => {
    setShowUnlearnedOnly(!showUnlearnedOnly);
    setCurrentIndex(0);
    setRevealed(false);
  };

  if (deck.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={backIcon} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("allahNames.flashcards", { defaultValue: "Flashcards" })}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle" size={64} color={COLORS.success} />
          <Text style={styles.emptyTitle}>
            {lang === "fr" ? "Bravo ! Tous appris !" : "Great! All learned!"}
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={toggleFilter}>
            <Text style={styles.emptyButtonText}>
              {t("allahNames.allNames", { defaultValue: "Voir tous" })}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={backIcon} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("allahNames.flashcards", { defaultValue: "Flashcards" })}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter toggle */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, !showUnlearnedOnly && styles.filterBtnActive]}
          onPress={() => { setShowUnlearnedOnly(false); setCurrentIndex(0); setRevealed(false); }}
        >
          <Text style={[styles.filterText, !showUnlearnedOnly && styles.filterTextActive]}>
            {t("allahNames.allNames", { defaultValue: "Tous" })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, showUnlearnedOnly && styles.filterBtnActive]}
          onPress={() => { setShowUnlearnedOnly(true); setCurrentIndex(0); setRevealed(false); }}
        >
          <Text style={[styles.filterText, showUnlearnedOnly && styles.filterTextActive]}>
            {t("allahNames.unlearnedOnly", { defaultValue: "Non appris" })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <Text style={styles.counter}>
        {currentIndex + 1} / {deck.length}
      </Text>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((currentIndex + 1) / deck.length) * 100}%` },
          ]}
        />
      </View>

      {/* Card */}
      <View style={styles.cardArea}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleReveal}
            style={styles.cardTouchable}
          >
            <LinearGradient
              colors={revealed ? ["#4A1D96", "#672CBC"] : ["#121A3A", "#1a2550"]}
              style={styles.cardGradient}
            >
              {/* Number */}
              <View style={styles.cardNumberBadge}>
                <Text style={styles.cardNumberText}>#{currentName.number}</Text>
              </View>

              {/* Arabic */}
              <Text style={styles.cardArabic}>{currentName.name}</Text>
              <Text style={styles.cardTransliteration}>
                {currentName.transliteration}
              </Text>

              {revealed ? (
                <View style={styles.revealedContent}>
                  <View style={styles.divider} />
                  <Text style={styles.cardMeaning}>
                    {currentName[lang].meaning}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={4}>
                    {currentName[lang].desc}
                  </Text>
                </View>
              ) : (
                <View style={styles.tapHint}>
                  <Ionicons name="eye-outline" size={20} color={COLORS.gray500} />
                  <Text style={styles.tapHintText}>
                    {t("allahNames.tapToReveal", { defaultValue: "Appuyez pour révéler" })}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {revealed ? (
          <>
            <TouchableOpacity
              style={styles.stillLearningBtn}
              onPress={handleStillLearning}
            >
              <Text style={styles.stillLearningText}>
                {t("allahNames.stillLearning", { defaultValue: "En cours" })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.knowThisBtn} onPress={handleKnowThis}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.knowThisGradient}
              >
                <Ionicons name="checkmark" size={20} color={COLORS.white} />
                <Text style={styles.knowThisText}>
                  {t("allahNames.iKnowThis", { defaultValue: "Je connais" })}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.navArrows}>
            <TouchableOpacity
              style={[styles.arrowBtn, currentIndex === 0 && styles.arrowBtnDisabled]}
              onPress={handlePrev}
              disabled={currentIndex === 0}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={currentIndex > 0 ? COLORS.white : COLORS.gray600}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.arrowBtn, currentIndex >= deck.length - 1 && styles.arrowBtnDisabled]}
              onPress={handleNext}
              disabled={currentIndex >= deck.length - 1}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={currentIndex < deck.length - 1 ? COLORS.white : COLORS.gray600}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },

  // Filter
  filterRow: {
    flexDirection: "row",
    marginHorizontal: SPACING["2xl"],
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    borderRadius: BORDER_RADIUS.md,
  },
  filterBtnActive: {
    backgroundColor: COLORS.gold,
  },
  filterText: {
    color: COLORS.gray400,
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  filterTextActive: {
    color: COLORS.primary,
  },

  // Progress
  counter: {
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: SPACING["3xl"],
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: SPACING.xl,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },

  // Card
  cardArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING["2xl"],
  },
  card: {
    borderRadius: BORDER_RADIUS["2xl"],
    overflow: "hidden",
    shadowColor: "#672CBC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTouchable: {
    borderRadius: BORDER_RADIUS["2xl"],
    overflow: "hidden",
  },
  cardGradient: {
    padding: SPACING["3xl"],
    alignItems: "center",
    minHeight: 320,
    justifyContent: "center",
  },
  cardNumberBadge: {
    backgroundColor: "rgba(249,189,100,0.15)",
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  cardNumberText: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  cardArabic: {
    color: COLORS.gold,
    fontSize: 52,
    fontFamily: FONTS.arabicBold,
    textAlign: "center",
    lineHeight: 72,
    marginBottom: SPACING.md,
  },
  cardTransliteration: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  tapHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.xl,
  },
  tapHintText: {
    color: COLORS.gray500,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  revealedContent: {
    alignItems: "center",
    width: "100%",
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: "rgba(249,189,100,0.3)",
    marginBottom: SPACING.xl,
  },
  cardMeaning: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: "center",
    lineHeight: 22,
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING["2xl"],
    paddingBottom: SPACING["4xl"],
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },
  stillLearningBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.gray600,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  stillLearningText: {
    color: COLORS.gray400,
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
  knowThisBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
  },
  knowThisGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  knowThisText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  navArrows: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING["3xl"],
  },
  arrowBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowBtnDisabled: {
    opacity: 0.4,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING["3xl"],
  },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING["2xl"],
  },
  emptyButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});
