import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../../assets/images/back.png";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import { ALLAH_NAMES, parseQuranRefs } from "../../src/data/allahNames";
import { allahNamesService } from "../../src/services/allahNamesProgress";

export default function AllahNameDetailScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const nameNumber = parseInt(id ?? "1", 10);
  const lang = i18n.language === "fr" ? "fr" : "en";

  const name = useMemo(
    () => ALLAH_NAMES.find((n) => n.number === nameNumber) ?? ALLAH_NAMES[0],
    [nameNumber],
  );

  const quranRefs = useMemo(() => parseQuranRefs(name.found), [name]);
  const [isLearned, setIsLearned] = useState(false);

  const loadLearned = useCallback(async () => {
    const learned = await allahNamesService.isLearned(name.number);
    setIsLearned(learned);
  }, [name.number]);

  useEffect(() => {
    loadLearned();
  }, [loadLearned]);

  const toggleLearned = async () => {
    if (isLearned) {
      await allahNamesService.unmarkLearned(name.number);
    } else {
      await allahNamesService.markLearned(name.number);
    }
    setIsLearned(!isLearned);
  };

  const goToName = (num: number) => {
    router.replace({
      pathname: "/allah-names/[id]",
      params: { id: String(num) },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={backIcon}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("allahNames.detail", { defaultValue: "Nom d'Allah" })}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.numberPill}>
            <Text style={styles.numberPillText}>#{name.number}</Text>
          </View>
          <Text style={styles.arabicNameLarge}>{name.name}</Text>
          <Text style={styles.transliterationLarge}>
            {name.transliteration}
          </Text>
        </View>

        {/* Meaning Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={["#672CBC", "#4A1D96"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.meaningGradient}
          >
            <Text style={styles.cardLabel}>
              {t("allahNames.meaning", { defaultValue: "Signification" })}
            </Text>
            <Text style={styles.meaningText}>{name[lang].meaning}</Text>
          </LinearGradient>
        </View>

        {/* Description Card */}
        <View style={styles.descCard}>
          <Text style={styles.cardLabel}>
            {t("allahNames.description", { defaultValue: "Description" })}
          </Text>
          <Text style={styles.descText}>{name[lang].desc}</Text>
        </View>

        {/* Quran References */}
        {quranRefs.length > 0 && (
          <View style={styles.refsSection}>
            <Text style={styles.cardLabel}>
              {t("allahNames.quranRefs", {
                defaultValue: "Trouvé dans le Coran",
              })}
            </Text>
            <View style={styles.refsRow}>
              {quranRefs.map((ref, i) => (
                <TouchableOpacity
                  key={`${ref.surah}-${ref.ayah}-${i}`}
                  style={styles.refChip}
                  onPress={() =>
                    router.push({
                      pathname: "/surah/[id]",
                      params: { id: String(ref.surah) },
                    } as any)
                  }
                >
                  <Ionicons name="book-outline" size={12} color={COLORS.gold} />
                  <Text style={styles.refChipText}>
                    {ref.surah}:{ref.ayah}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Mark as Learned */}
        <Pressable
          style={[
            styles.learnedButton,
            isLearned && styles.learnedButtonActive,
          ]}
          onPress={toggleLearned}
        >
          <Ionicons
            name={isLearned ? "checkmark-circle" : "checkmark-circle-outline"}
            size={22}
            color={isLearned ? COLORS.primary : COLORS.gold}
          />
          <Text
            style={[
              styles.learnedButtonText,
              isLearned && styles.learnedButtonTextActive,
            ]}
          >
            {isLearned
              ? t("allahNames.learned", { defaultValue: "Appris" })
              : t("allahNames.markLearned", {
                  defaultValue: "Marquer comme appris",
                })}
          </Text>
        </Pressable>

        {/* Prev / Next Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navButton,
              nameNumber <= 1 && styles.navButtonDisabled,
            ]}
            onPress={() => nameNumber > 1 && goToName(nameNumber - 1)}
            disabled={nameNumber <= 1}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={nameNumber > 1 ? COLORS.white : COLORS.gray600}
            />
            <Text
              style={[
                styles.navText,
                nameNumber <= 1 && styles.navTextDisabled,
              ]}
            >
              {t("allahNames.previous", { defaultValue: "Précédent" })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              nameNumber >= 99 && styles.navButtonDisabled,
            ]}
            onPress={() => nameNumber < 99 && goToName(nameNumber + 1)}
            disabled={nameNumber >= 99}
          >
            <Text
              style={[
                styles.navText,
                nameNumber >= 99 && styles.navTextDisabled,
              ]}
            >
              {t("allahNames.next", { defaultValue: "Suivant" })}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={nameNumber < 99 ? COLORS.white : COLORS.gray600}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  scrollContent: {
    paddingHorizontal: SPACING["2xl"],
    paddingBottom: SPACING["4xl"],
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginBottom: SPACING["2xl"],
    paddingTop: SPACING.xl,
  },
  numberPill: {
    backgroundColor: "rgba(249,189,100,0.15)",
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  numberPillText: {
    color: COLORS.gold,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  arabicNameLarge: {
    color: COLORS.gold,
    fontSize: 52,
    fontFamily: FONTS.arabicBold,
    textAlign: "center",
    marginBottom: SPACING.md,
    lineHeight: 82,
    paddingTop: 10,
  },
  transliterationLarge: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.semiBold,
    textAlign: "center",
  },

  // Meaning Card
  card: {
    borderRadius: BORDER_RADIUS["2xl"],
    overflow: "hidden",
    marginBottom: SPACING.xl,
  },
  meaningGradient: {
    padding: SPACING["2xl"],
    alignItems: "center",
  },
  cardLabel: {
    color: COLORS.gray400,
    fontSize: 12,
    fontFamily: FONTS.medium,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  meaningText: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: FONTS.bold,
    textAlign: "center",
  },

  // Description Card
  descCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS["2xl"],
    padding: SPACING["2xl"],
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  descText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontFamily: FONTS.regular,
    lineHeight: 24,
  },

  // Quran Refs
  refsSection: {
    marginBottom: SPACING.xl,
  },
  refsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  refChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(249,189,100,0.1)",
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  refChipText: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },

  // Learned Button
  learnedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING["2xl"],
  },
  learnedButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  learnedButtonText: {
    color: COLORS.gold,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  learnedButtonTextActive: {
    color: COLORS.primary,
  },

  // Navigation
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  navTextDisabled: {
    color: COLORS.gray600,
  },
});
