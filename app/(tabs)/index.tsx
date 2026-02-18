import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import menuIcon from "../../assets/images/menu.png";
import quranImage from "../../assets/images/quran.png";
import searchIcon from "../../assets/images/search-bar.png";
import { HizbList, JuzList, PageList, SurahList } from "../../src/components";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import {
    HIZB_QUARTERS,
    SURAHS,
    TOTAL_AYAHS,
    TOTAL_SURAHS,
} from "../../src/data";
import {
    lastReadService,
    type LastReadData,
} from "../../src/services/lastRead";

type TabType = "surah" | "page" | "juzz" | "hizb";

export default function QuranScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("surah");
  const [lastRead, setLastRead] = useState<LastReadData | null>(null);

  // Reload last read every time screen gets focus
  useFocusEffect(
    useCallback(() => {
      lastReadService
        .get()
        .then(setLastRead)
        .catch(() => {});
    }, []),
  );

  // Derive display info from lastRead
  const lastReadSurah = lastRead
    ? SURAHS.find((s) => s.number === lastRead.surahNumber)
    : null;

  const tabs: { key: TabType; label: string }[] = [
    { key: "surah", label: t("quran.surah") },
    { key: "page", label: t("quran.page") },
    { key: "juzz", label: t("quran.juzz") },
    { key: "hizb", label: t("quran.hizb") },
  ];

  const handleSurahPress = (surahNumber: number) => {
    router.push(`/surah/${surahNumber}` as any);
  };

  const handleJuzPress = (juzNumber: number) => {
    router.push(`/juz/${juzNumber}` as any);
  };

  const handlePagePress = (pageNumber: number) => {
    router.push(`/page/${pageNumber}` as any);
  };

  const handleHizbPress = (hizbQuarter: number) => {
    // Find the hizb number for this quarter and navigate to its detail
    const quarter = HIZB_QUARTERS.find((q) => q.quarter === hizbQuarter);
    if (quarter) {
      router.push(`/hizb/${quarter.hizb}` as any);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "surah":
        return <SurahList surahs={SURAHS} onSurahPress={handleSurahPress} />;
      case "juzz":
        return <JuzList onJuzPress={handleJuzPress} />;
      case "page":
        return <PageList onPagePress={handlePagePress} />;
      case "hizb":
        return <HizbList onHizbPress={handleHizbPress} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push("/settings" as any)}>
            <Image
              source={menuIcon}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("common.appName")}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/search" as any)}>
          <Image
            source={searchIcon}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSubtext}>{t("home.greeting")}</Text>
          <Text style={styles.greetingName}>Mahomed Cissokho</Text>
        </View>

        {/* Last Read Card */}
        <TouchableOpacity
          style={styles.cardContainer}
          activeOpacity={0.85}
          onPress={() => {
            if (lastRead) {
              router.push(`/surah/${lastRead.surahNumber}` as any);
            }
          }}
        >
          <View style={styles.lastReadCard}>
            <View style={styles.lastReadContent}>
              <View style={styles.lastReadHeader}>
                <View style={styles.lastReadBadge}>
                  <Text style={styles.lastReadIcon}>📖</Text>
                  <Text style={styles.lastReadLabel}>{t("home.lastRead")}</Text>
                </View>
              </View>
              <Text style={styles.lastReadTitle}>
                {lastReadSurah
                  ? lastReadSurah.transliteration
                  : t("home.noLastRead")}
              </Text>
              {lastRead && lastReadSurah ? (
                <>
                  <Text style={styles.lastReadSubtitle}>
                    {t("home.ayahNo")}: {lastRead.ayahNumber}
                  </Text>
                  <View style={styles.lastReadMeta}>
                    {lastRead.juz != null && (
                      <Text style={styles.lastReadMetaText}>
                        {t("quran.juzz")} {lastRead.juz}
                      </Text>
                    )}
                    {lastRead.page != null && (
                      <Text style={styles.lastReadMetaText}>
                        {t("quran.page")} {lastRead.page}
                      </Text>
                    )}
                    {lastRead.hizb != null && (
                      <Text style={styles.lastReadMetaText}>
                        {t("quran.hizb")} {lastRead.hizb}
                      </Text>
                    )}
                  </View>
                </>
              ) : null}
            </View>
            <Image
              source={quranImage}
              style={styles.quranImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const buttonStyle = isActive
              ? styles.activeTab
              : styles.inactiveTab;
            const textStyle = isActive
              ? styles.activeTabText
              : styles.inactiveTabText;

            return (
              <TouchableOpacity
                key={tab.key}
                style={buttonStyle}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={1}
              >
                <Text style={textStyle}>{tab.label}</Text>
                {isActive && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        {renderContent()}

        {/* Footer */}
        {activeTab === "surah" && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t("common.total")}: {TOTAL_SURAHS} {t("common.surahs")} •{" "}
              {TOTAL_AYAHS} {t("common.verses")}
            </Text>
          </View>
        )}
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: SPACING.lg,
  },
  scrollView: {
    flex: 1,
  },
  greetingSection: {
    paddingHorizontal: SPACING["2xl"],
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  greetingSubtext: {
    color: COLORS.gray400,
    fontSize: 14,
    marginBottom: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  greetingName: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  cardContainer: {
    marginHorizontal: SPACING["2xl"],
    marginBottom: SPACING["2xl"],
  },
  lastReadCard: {
    backgroundColor: COLORS.purple,
    borderRadius: BORDER_RADIUS["2xl"],
    padding: SPACING.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    minHeight: 140,
  },
  lastReadContent: {
    flex: 1,
    zIndex: 1,
  },
  lastReadHeader: {
    marginBottom: SPACING.lg,
  },
  lastReadBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.whiteAlpha15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS["2xl"],
    alignSelf: "flex-start",
  },
  lastReadIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  lastReadLabel: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  lastReadTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginBottom: 6,
  },
  lastReadSubtitle: {
    color: COLORS.whiteAlpha70,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  lastReadMeta: {
    flexDirection: "row",
    marginTop: 6,
    gap: 10,
  },
  lastReadMetaText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  quranImage: {
    width: 140,
    height: 140,
    position: "absolute",
    right: -10,
    bottom: -10,
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: SPACING["2xl"],
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 0,
  },
  activeTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginRight: SPACING["2xl"],
    position: "relative",
  },
  activeTabText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.gold,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  inactiveTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginRight: SPACING.lg,
  },
  inactiveTabText: {
    color: COLORS.gray400,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  footer: {
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING["2xl"],
  },
  footerText: {
    textAlign: "center",
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
});
