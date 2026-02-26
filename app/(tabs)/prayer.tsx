import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    CountdownCard,
    PrayerCard,
    QiblaCompass,
    calculateQiblaBearing,
    formatCountdown,
    timeToMinutes,
    type AladhanResponse,
    type PrayerInfo,
} from "../../src/components/prayer";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import { notificationService } from "../../src/services/notifications";

const PRAYER_DEFINITIONS: Omit<PrayerInfo, "time">[] = [
  {
    key: "Fajr",
    translationKey: "prayer.fajr",
    arabicName: "الفجر",
    icon: "cloudy-night-outline",
  },
  {
    key: "Sunrise",
    translationKey: "prayer.sunrise",
    arabicName: "الشروق",
    icon: "sunny-outline",
  },
  {
    key: "Dhuhr",
    translationKey: "prayer.dhuhr",
    arabicName: "الظهر",
    icon: "sunny",
  },
  {
    key: "Asr",
    translationKey: "prayer.asr",
    arabicName: "العصر",
    icon: "partly-sunny-outline",
  },
  {
    key: "Maghrib",
    translationKey: "prayer.maghrib",
    arabicName: "المغرب",
    icon: "sunny-outline",
  },
  {
    key: "Isha",
    translationKey: "prayer.isha",
    arabicName: "العشاء",
    icon: "moon-outline",
  },
];

export default function PrayerScreen() {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");
  const [prayers, setPrayers] = useState<PrayerInfo[]>([]);
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [countdown, setCountdown] = useState("00:00:00");
  const [qiblaBearing, setQiblaBearing] = useState(0);
  const [hasLocation, setHasLocation] = useState(false);

  const fetchPrayerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("permission_denied");
        setLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      setHasLocation(true);

      // Reverse geocode
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo.length > 0) {
        setCityName(geo[0].city || geo[0].region || geo[0].country || "");
      }

      // Qibla
      setQiblaBearing(calculateQiblaBearing(latitude, longitude));

      // Prayer times
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`,
      );
      const json: AladhanResponse = await res.json();
      const { timings, date } = json.data;

      setGregorianDate(date.readable);
      const h = date.hijri;
      setHijriDate(
        `${h.day} ${h.month.en} ${h.year} ${h.designation.abbreviated}`,
      );

      const prayerList: PrayerInfo[] = PRAYER_DEFINITIONS.map((def) => ({
        ...def,
        time: timings[def.key].split(" ")[0],
      }));

      setPrayers(prayerList);
      setLoading(false);

      // Schedule prayer notifications in background
      const lang = (t("common.appName") ? i18n.language : "fr") as "fr" | "en";
      notificationService
        .setupAllNotifications(
          prayerList.map((p) => ({
            key: p.key,
            arabicName: p.arabicName,
            time: p.time,
          })),
          lang === "en" ? "en" : "fr",
        )
        .catch((err) =>
          console.warn("[Prayer] Notification scheduling failed:", err),
        );
    } catch (err) {
      console.error("[Prayer] Fetch error:", err);
      setError("fetch_failed");
      setLoading(false);
    }
  }, [t, i18n]);

  useEffect(() => {
    fetchPrayerData();
  }, [fetchPrayerData]);

  // Countdown timer
  useEffect(() => {
    if (prayers.length === 0) return;

    const update = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const currentSeconds =
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      let nextIdx = prayers.findIndex(
        (p) => timeToMinutes(p.time) > currentMinutes,
      );
      if (nextIdx === -1) nextIdx = 0;

      setNextPrayerIndex(nextIdx);

      let diff = timeToMinutes(prayers[nextIdx].time) * 60 - currentSeconds;
      if (diff < 0) diff += 86400;
      setCountdown(formatCountdown(diff));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayers]);

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          <Text style={styles.loadingText}>{t("prayer.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error
  if (error) {
    const isPermission = error === "permission_denied";
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons
            name={isPermission ? "location-outline" : "alert-circle-outline"}
            size={64}
            color={COLORS.gold}
          />
          <Text style={styles.errorTitle}>
            {isPermission
              ? t("prayer.locationRequired")
              : t("prayer.fetchError")}
          </Text>
          <Text style={styles.errorMsg}>
            {isPermission ? t("prayer.enableLocation") : t("prayer.tryAgain")}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchPrayerData}>
            <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
            <Text style={styles.retryText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{t("prayer.title")}</Text>
        </View>

        {/* Location & Date */}
        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.gold} />
            <Text style={styles.cityName}>{cityName}</Text>
          </View>
          <Text style={styles.dateGregorian}>{gregorianDate}</Text>
          <Text style={styles.dateHijri}>{hijriDate}</Text>
        </View>

        {/* Countdown */}
        <CountdownCard
          nextPrayer={prayers[nextPrayerIndex] ?? null}
          nextPrayerLabel={
            prayers[nextPrayerIndex]
              ? t(prayers[nextPrayerIndex].translationKey)
              : ""
          }
          countdown={countdown}
          labelText={t("prayer.nextPrayer")}
        />

        {/* Prayer Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("prayer.todaySchedule")}</Text>
          {prayers.map((prayer, index) => (
            <PrayerCard
              key={prayer.key}
              prayer={prayer}
              isNext={index === nextPrayerIndex}
              nextLabel={t("prayer.next")}
              displayName={t(prayer.translationKey)}
            />
          ))}
        </View>

        {/* Qibla */}
        {hasLocation && (
          <QiblaCompass
            qiblaBearing={qiblaBearing}
            qiblaLabel={t("prayer.qibla")}
            bearingLabel={t("prayer.qiblaBearing")}
            unavailableLabel={t("prayer.compassUnavailable")}
            alignedLabel={t("prayer.qiblaAligned")}
            turnLabel={t("prayer.turnToQibla")}
          />
        )}

        <View style={{ height: SPACING["3xl"] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { paddingBottom: SPACING["4xl"] },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.lg,
    paddingHorizontal: SPACING["3xl"],
  },
  loadingText: {
    color: COLORS.gray400,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  errorTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 20,
    textAlign: "center",
  },
  errorMsg: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  retryText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  header: {
    paddingHorizontal: SPACING["2xl"],
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  pageTitle: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 24 },
  locationSection: {
    paddingHorizontal: SPACING["2xl"],
    paddingBottom: SPACING.xl,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  cityName: { color: COLORS.gold, fontFamily: FONTS.semiBold, fontSize: 16 },
  dateGregorian: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 2,
  },
  dateHijri: {
    color: COLORS.whiteAlpha70,
    fontFamily: FONTS.medium,
    fontSize: 13,
    marginTop: 2,
  },
  section: { paddingHorizontal: SPACING["2xl"], marginBottom: SPACING["2xl"] },
  sectionTitle: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 18,
    marginBottom: SPACING.lg,
  },
});
