import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import quranImage from "../../assets/images/quran.png";
import { HizbList, JuzList, PageList, SurahList } from "../../src/components";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import { useAuth } from "../../src/contexts/AuthContext";
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

const { width: SW } = Dimensions.get("window");
type TabType = "surah" | "page" | "juzz" | "hizb";

// ─── Floating dot ───────────────────────────────────────────────────────
function Dot({
  delay,
  x,
  color,
  size,
}: {
  delay: number;
  x: number;
  color: string;
  size: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 5000 + Math.random() * 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 5000 + Math.random() * 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: 20 + Math.random() * 100,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.1, 0.5, 0.1],
        }),
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -24],
            }),
          },
        ],
      }}
    />
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Tahajjud Mubarak";
  if (h < 12) return "Sabah Al-Khayr";
  if (h < 17) return "As-Salamu Alaykum";
  if (h < 22) return "Masa' Al-Khayr";
  return "Layla Sa'ida";
}

export default function QuranScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("surah");
  const [lastRead, setLastRead] = useState<LastReadData | null>(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const greetAnim = useRef(new Animated.Value(0)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const tabsAnim = useRef(new Animated.Value(0)).current;

  // Load on mount — ensures data is ready even if useFocusEffect fires in a transitional state
  useEffect(() => {
    lastReadService
      .get()
      .then(setLastRead)
      .catch(() => {});
  }, []);

  // Reload whenever the tab regains focus (e.g. user navigated away and came back)
  useFocusEffect(
    useCallback(() => {
      lastReadService
        .get()
        .then(setLastRead)
        .catch(() => {});
    }, []),
  );

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(greetAnim, {
        toValue: 1,
        tension: 55,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(heroAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(actionsAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(tabsAnim, {
        toValue: 1,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [actionsAnim, greetAnim, headerAnim, heroAnim, statsAnim, tabsAnim]);

  const lastReadSurah = lastRead
    ? SURAHS.find((s) => s.number === lastRead.surahNumber)
    : null;

  const tabs: {
    key: TabType;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: "surah", label: t("quran.surah"), icon: "book-outline" },
    { key: "page", label: t("quran.page"), icon: "document-outline" },
    { key: "juzz", label: t("quran.juzz"), icon: "layers-outline" },
    { key: "hizb", label: t("quran.hizb"), icon: "grid-outline" },
  ];

  const handleSurahPress = (n: number) => router.push(`/surah/${n}` as any);
  const handleJuzPress = (n: number) => router.push(`/juz/${n}` as any);
  const handlePagePress = (n: number) => router.push(`/page/${n}` as any);
  const handleHizbPress = (q: number) => {
    const quarter = HIZB_QUARTERS.find((h) => h.quarter === q);
    if (quarter) router.push(`/hizb/${quarter.hizb}` as any);
  };

  const quickActions = [
    {
      icon: "time-outline" as const,
      label: t("tabs.prayer"),
      route: "/(tabs)/prayer",
      grad: ["#4F46E5", "#7C3AED"] as [string, string],
    },
    {
      icon: "bookmark-outline" as const,
      label: t("tabs.bookmark"),
      route: "/(tabs)/bookmark",
      grad: ["#F9BD64", "#D97706"] as [string, string],
    },
    {
      icon: "heart-outline" as const,
      label: t("tabs.duas"),
      route: "/(tabs)/duas",
      grad: ["#10B981", "#059669"] as [string, string],
    },
    {
      icon: "library-outline" as const,
      label: t("tabs.hadith"),
      route: "/(tabs)/hadith",
      grad: ["#F97316", "#DC2626"] as [string, string],
    },
  ];

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const initials = userName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const entrance = (anim: Animated.Value, dy = 24) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [dy, 0],
        }),
      },
    ],
  });

  const dots = [
    { x: 20, color: "rgba(249,189,100,0.6)", size: 4, delay: 0 },
    { x: SW * 0.25, color: "rgba(255,255,255,0.4)", size: 3, delay: 700 },
    { x: SW * 0.5, color: "rgba(249,189,100,0.4)", size: 5, delay: 1400 },
    { x: SW * 0.72, color: "rgba(255,255,255,0.3)", size: 3, delay: 400 },
    { x: SW * 0.88, color: "rgba(249,189,100,0.5)", size: 4, delay: 1100 },
  ];

  return (
    <SafeAreaView style={styles.root}>
      {/* Background glows */}
      <View
        style={[
          styles.glow,
          {
            top: -120,
            right: -100,
            width: 320,
            backgroundColor: "rgba(124,58,237,0.1)",
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          {
            top: 300,
            left: -80,
            width: 200,
            backgroundColor: "rgba(249,189,100,0.05)",
          },
        ]}
      />
      <View
        style={[
          styles.glow,
          {
            bottom: 80,
            right: -60,
            width: 200,
            backgroundColor: "rgba(103,44,188,0.06)",
          },
        ]}
      />

      <View style={styles.container}>
        {/* ── Header ── */}
        <Animated.View style={[styles.header, entrance(headerAnim, 16)]}>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => router.push("/settings" as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#A855F7", "#7C3AED", "#6D28D9"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initials || "U"}</Text>
            </LinearGradient>
            <View style={styles.onlineDot} />
          </TouchableOpacity>

          <View style={styles.headerMid}>
            <Ionicons name="moon" size={18} color={COLORS.gold} />
            <Text style={styles.headerTitle}>{t("common.appName")}</Text>
          </View>

          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => router.push("/search" as any)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["rgba(249,189,100,0.15)", "rgba(249,189,100,0.05)"]}
              style={styles.searchBtnInner}
            >
              <Ionicons name="search" size={20} color={COLORS.gold} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          {/* ── Greeting ── */}
          <Animated.View
            style={[styles.greetingSection, entrance(greetAnim, 14)]}
          >
            <View>
              <Text style={styles.greetSub}>{getGreeting()} ✨</Text>
              <Text style={styles.greetName}>
                {userName || t("common.welcome")}
              </Text>
            </View>
            <Text style={styles.bismillah}>﷽</Text>
          </Animated.View>

          {/* ── Last Read Hero Card ── */}
          <Animated.View style={[styles.heroPad, entrance(heroAnim, 40)]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                lastRead && router.push(`/surah/${lastRead.surahNumber}` as any)
              }
            >
              <LinearGradient
                colors={["#6D28D9", "#7C3AED", "#8B5CF6", "#A78BFA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGrad}
              >
                {dots.map((d, i) => (
                  <Dot
                    key={i}
                    x={d.x}
                    color={d.color}
                    size={d.size}
                    delay={d.delay}
                  />
                ))}

                {/* Deco rings */}
                <View
                  style={[
                    styles.decoRing,
                    {
                      width: 180,
                      height: 180,
                      top: -60,
                      right: -50,
                      borderColor: "rgba(255,255,255,0.06)",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.decoRing,
                    {
                      width: 120,
                      height: 120,
                      bottom: -30,
                      left: -30,
                      borderColor: "rgba(255,255,255,0.04)",
                    },
                  ]}
                />
                <View style={styles.decoSquare} />

                <View style={styles.heroLeft}>
                  <View style={styles.heroBadge}>
                    <View style={styles.heroDot} />
                    <Text style={styles.heroBadgeText}>
                      {t("home.lastRead")}
                    </Text>
                  </View>
                  <Text style={styles.heroTitle}>
                    {lastReadSurah
                      ? lastReadSurah.transliteration
                      : t("home.noLastRead")}
                  </Text>
                  {lastReadSurah && (
                    <>
                      <Text style={styles.heroAr}>{lastReadSurah.name}</Text>
                      <Text style={styles.heroAyah}>
                        {t("home.ayahNo")}: {lastRead?.ayahNumber}
                      </Text>
                      <View style={styles.heroChips}>
                        {lastRead?.juz != null && (
                          <View style={styles.chip}>
                            <Ionicons
                              name="layers-outline"
                              size={10}
                              color={COLORS.gold}
                            />
                            <Text style={styles.chipTxt}>
                              {t("quran.juzz")} {lastRead.juz}
                            </Text>
                          </View>
                        )}
                        {lastRead?.page != null && (
                          <View style={styles.chip}>
                            <Ionicons
                              name="document-outline"
                              size={10}
                              color={COLORS.gold}
                            />
                            <Text style={styles.chipTxt}>
                              {t("quran.page")} {lastRead.page}
                            </Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.heroCtaWrap}
                        activeOpacity={0.85}
                        onPress={() =>
                          router.push(`/surah/${lastRead?.surahNumber}` as any)
                        }
                      >
                        <LinearGradient
                          colors={["#F9BD64", "#F59E0B"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.heroCta}
                        >
                          <Ionicons
                            name="book"
                            size={13}
                            color={COLORS.primary}
                          />
                          <Text style={styles.heroCtaTxt}>
                            {t("home.continueReading")}
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={13}
                            color={COLORS.primary}
                          />
                        </LinearGradient>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                <Image
                  source={quranImage}
                  style={styles.quranImg}
                  resizeMode="contain"
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Quick Actions Row ── */}
          <Animated.View
            style={[styles.actionsSection, entrance(actionsAnim, 28)]}
          >
            <Text style={styles.sectionLabel}>{t("home.quickAccess")}</Text>
            <View style={styles.actionsRow}>
              {quickActions.map((qa) => (
                <TouchableOpacity
                  key={qa.route}
                  style={styles.actionItem}
                  onPress={() => router.push(qa.route as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={qa.grad}
                    style={styles.actionIconCircle}
                  >
                    <Ionicons name={qa.icon} size={22} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.actionLabel}>{qa.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* ── Stats ── */}
          {/* <Animated.View style={[styles.statsSection, entrance(statsAnim, 20)]}>
            {[
              { icon: "book" as const, val: TOTAL_SURAHS.toString(), lbl: t("common.surahs"), grad: ["#7C3AED", "#A855F7"] as [string, string] },
              { icon: "receipt" as const, val: TOTAL_AYAHS.toLocaleString(), lbl: t("common.verses"), grad: ["#F9BD64", "#F59E0B"] as [string, string] },
              { icon: "layers" as const, val: "30", lbl: t("quran.juzz"), grad: ["#10B981", "#059669"] as [string, string] },
            ].map((s, i) => (
              <React.Fragment key={s.lbl}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <LinearGradient colors={s.grad} style={styles.statIcon}>
                    <Ionicons name={s.icon} size={16} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.statVal}>{s.val}</Text>
                  <Text style={styles.statLbl}>{s.lbl}</Text>
                </View>
              </React.Fragment>
            ))}
          </Animated.View> */}

          {/* ── Tabs ── */}
          <Animated.View style={[styles.tabsSection, entrance(tabsAnim, 16)]}>
            <View style={styles.tabsRow}>
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={styles.tabBtn}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.8}
                  >
                    {active ? (
                      <LinearGradient
                        colors={["#F9BD64", "#F59E0B"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tabActive}
                      >
                        <Ionicons
                          name={tab.icon}
                          size={14}
                          color={COLORS.primary}
                        />
                        <Text style={styles.tabTextActive}>{tab.label}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.tabInactive}>
                        <Ionicons
                          name={tab.icon}
                          size={14}
                          color={COLORS.gray500}
                        />
                        <Text style={styles.tabText}>{tab.label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* ── List content ── */}
          <View>
            {activeTab === "surah" && (
              <SurahList surahs={SURAHS} onSurahPress={handleSurahPress} />
            )}
            {activeTab === "juzz" && <JuzList onJuzPress={handleJuzPress} />}
            {activeTab === "page" && <PageList onPagePress={handlePagePress} />}
            {activeTab === "hizb" && <HizbList onHizbPress={handleHizbPress} />}
          </View>

          {activeTab === "surah" && (
            <View style={styles.footer}>
              <LinearGradient
                colors={["rgba(249,189,100,0.3)", "transparent"]}
                style={styles.footerLine}
              />
              <Text style={styles.footerTxt}>
                {TOTAL_SURAHS} {t("common.surahs")} · {TOTAL_AYAHS}{" "}
                {t("common.verses")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1 },
  glow: {
    position: "absolute",
    borderRadius: 999,
    height: undefined,
    aspectRatio: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.md,
  },
  avatarBtn: { position: "relative" },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: { color: "#fff", fontFamily: FONTS.bold, fontSize: 15 },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  headerMid: { alignItems: "center", gap: 4 },
  headerTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  searchBtn: { borderRadius: 24, overflow: "hidden" },
  searchBtnInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.2)",
  },

  // Greeting
  scroll: { flex: 1 },
  greetingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING["2xl"],
    paddingTop: 4,
    paddingBottom: SPACING.lg,
  },
  greetSub: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginBottom: 3,
  },
  greetName: {
    color: COLORS.white,
    fontSize: 26,
    fontFamily: FONTS.bold,
    letterSpacing: 0.3,
  },
  bismillah: {
    fontSize: 28,
    color: COLORS.gold,
    fontFamily: FONTS.arabic,
    opacity: 0.55,
  },

  // Hero card
  heroPad: { paddingHorizontal: SPACING["2xl"], marginBottom: SPACING.xl },
  heroGrad: {
    borderRadius: 24,
    padding: SPACING.xl,
    paddingRight: 0,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 200,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 16,
  },
  decoRing: { position: "absolute", borderRadius: 999, borderWidth: 1 },
  decoSquare: {
    position: "absolute",
    top: 18,
    right: 110,
    width: 18,
    height: 18,
    backgroundColor: "rgba(249,189,100,0.1)",
    transform: [{ rotate: "45deg" }],
  },
  heroLeft: { flex: 1, zIndex: 2 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(249,189,100,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: "flex-start",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(249,189,100,0.22)",
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
  },
  heroBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  heroAr: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 18,
    fontFamily: FONTS.arabic,
    marginBottom: 4,
  },
  heroAyah: {
    color: COLORS.whiteAlpha70,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.sm,
  },
  heroChips: { flexDirection: "row", gap: 7, marginBottom: SPACING.md },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  chipTxt: { color: COLORS.gold, fontSize: 10, fontFamily: FONTS.semiBold },
  heroCtaWrap: {
    alignSelf: "flex-start",
    borderRadius: BORDER_RADIUS.full,
    overflow: "hidden",
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  heroCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  heroCtaTxt: { color: COLORS.primary, fontSize: 12, fontFamily: FONTS.bold },
  quranImg: {
    width: 150,
    height: 150,
    position: "absolute",
    right: -18,
    bottom: -18,
    opacity: 0.72,
    zIndex: 1,
  },

  // Quick actions
  actionsSection: {
    paddingHorizontal: SPACING["2xl"],
    marginBottom: SPACING["3xl"],
  },
  sectionLabel: {
    color: COLORS.gray400,
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.md,
  },
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  actionItem: { alignItems: "center", flex: 1 },
  actionIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionLabel: {
    color: COLORS.gray400,
    fontSize: 11,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },

  // Stats
  statsSection: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING["2xl"],
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.14)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: { flex: 1, alignItems: "center" },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  statVal: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: 2,
  },
  statLbl: {
    color: COLORS.gray500,
    fontFamily: FONTS.medium,
    fontSize: 10,
    textTransform: "capitalize",
  },
  statDivider: {
    width: 1,
    height: 46,
    backgroundColor: "rgba(124,58,237,0.15)",
  },

  // Tabs
  tabsSection: { paddingHorizontal: SPACING["2xl"], marginBottom: SPACING.lg },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.1)",
  },
  tabBtn: { flex: 1, borderRadius: 14, overflow: "hidden" },
  tabActive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: SPACING.md,
    borderRadius: 14,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  tabInactive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: SPACING.md,
  },
  tabText: { color: COLORS.gray500, fontFamily: FONTS.semiBold, fontSize: 11 },
  tabTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 11,
  },

  // Footer
  footer: {
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING["2xl"],
    alignItems: "center",
  },
  footerLine: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginBottom: SPACING.md,
  },
  footerTxt: {
    textAlign: "center",
    color: COLORS.gray500,
    fontSize: 12,
    fontFamily: FONTS.medium,
    letterSpacing: 0.5,
  },
});
