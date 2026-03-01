import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../../assets/images/back.png";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import { ALLAH_NAMES } from "../../src/data/allahNames";
import { allahNamesService } from "../../src/services/allahNamesProgress";

const { width } = Dimensions.get("window");
const GRID_PADDING = SPACING["2xl"];
const GAP = SPACING.md;
const CARD_WIDTH = (width - GRID_PADDING * 2 - GAP * 2) / 3;

export default function AllahNamesScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";

  const [learnedIds, setLearnedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  // Reload progress every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      allahNamesService.getProgress().then((p) => setLearnedIds(p.learnedIds));
    }, []),
  );

  const filteredNames = search.trim()
    ? ALLAH_NAMES.filter(
        (n) =>
          n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
          n[lang].meaning.toLowerCase().includes(search.toLowerCase()) ||
          n.name.includes(search),
      )
    : ALLAH_NAMES;

  const learnedCount = learnedIds.length;
  const progressPercent = (learnedCount / 99) * 100;

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
          {t("allahNames.title", { defaultValue: "99 Noms d'Allah" })}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={filteredNames}
        keyExtractor={(item) => String(item.number)}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              {t("allahNames.subtitle", {
                defaultValue: "Apprenez les plus beaux noms d'Allah",
              })}
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={["#F9BD64", "#F59E0B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${progressPercent}%` as any }]}
                />
              </View>
              <Text style={styles.progressText}>
                {t("allahNames.progress", {
                  defaultValue: "{{count}}/99 appris",
                  count: learnedCount,
                })}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={() => router.push("/allah-names/flashcards" as any)}
              >
                <LinearGradient
                  colors={["#7C3AED", "#A855F7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <Ionicons name="albums-outline" size={22} color={COLORS.white} />
                  <Text style={styles.actionText}>
                    {t("allahNames.flashcards", { defaultValue: "Flashcards" })}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.8}
                onPress={() => router.push("/allah-names/quiz" as any)}
              >
                <LinearGradient
                  colors={["#F9BD64", "#F59E0B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <Ionicons name="help-circle-outline" size={22} color={COLORS.primary} />
                  <Text style={[styles.actionText, { color: COLORS.primary }]}>
                    {t("allahNames.quiz", { defaultValue: "Quiz" })}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color={COLORS.gray500} />
              <TextInput
                style={styles.searchInput}
                placeholder={t("allahNames.searchPlaceholder", {
                  defaultValue: "Rechercher un nom...",
                })}
                placeholderTextColor={COLORS.gray500}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={18} color={COLORS.gray500} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isLearned = learnedIds.includes(item.number);
          return (
            <TouchableOpacity
              style={[styles.nameCard, isLearned && styles.nameCardLearned]}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/allah-names/[id]",
                  params: { id: String(item.number) },
                } as any)
              }
            >
              {/* Number badge */}
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.number}</Text>
              </View>

              {/* Arabic name */}
              <Text style={styles.arabicName} numberOfLines={1}>
                {item.name}
              </Text>

              {/* Transliteration */}
              <Text style={styles.transliteration} numberOfLines={1}>
                {item.transliteration}
              </Text>

              {/* Meaning */}
              <Text style={styles.meaning} numberOfLines={2}>
                {item[lang].meaning}
              </Text>

              {/* Learned checkmark */}
              {isLearned && (
                <View style={styles.learnedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
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
  subtitle: {
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING["2xl"],
  },
  listContent: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: SPACING["4xl"],
  },
  gridRow: {
    gap: GAP,
    marginBottom: GAP,
  },

  // Progress
  progressSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.gray400,
    fontSize: 12,
    fontFamily: FONTS.medium,
    textAlign: "right",
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  actionBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.regular,
    padding: 0,
  },

  // Name Card
  nameCard: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: SPACING.md,
    alignItems: "center",
    position: "relative",
  },
  nameCardLearned: {
    borderColor: "rgba(52,211,153,0.3)",
  },
  numberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(249,189,100,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  numberText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  arabicName: {
    color: COLORS.gold,
    fontSize: 20,
    fontFamily: FONTS.arabicBold,
    textAlign: "center",
    marginBottom: SPACING.xs,
  },
  transliteration: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: 2,
  },
  meaning: {
    color: COLORS.gray400,
    fontSize: 10,
    fontFamily: FONTS.regular,
    textAlign: "center",
    lineHeight: 14,
  },
  learnedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
  },
});
