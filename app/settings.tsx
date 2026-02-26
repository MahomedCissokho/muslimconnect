import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

import backIcon from "../assets/images/back.png";
import { ReciterSelector, ToggleSwitch } from "../src/components";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../src/constants";
import { useAuth } from "../src/contexts/AuthContext";
import { useSettings } from "../src/contexts/SettingsContext";
import { RECITERS } from "../src/data/reciters";
import {
    DEFAULT_NOTIFICATION_SETTINGS,
    type NotificationSettings,
    notificationService,
} from "../src/services/notifications";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const {
    reciterId,
    setReciterId,
    displayOptions,
    updateDisplayOption,
    language,
    setLanguage,
  } = useSettings();

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const userEmail = user?.email || "";
  const initials =
    userName
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth" as any);
  };

  const [reciterModalVisible, setReciterModalVisible] = useState(false);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS,
  );

  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  useEffect(() => {
    notificationService.getSettings().then(setNotifSettings);
  }, []);

  const handleTogglePrayerNotif = (enabled: boolean) => {
    setNotifSettings((prev) => ({ ...prev, prayerNotifications: enabled }));
    notificationService
      .togglePrayerNotifications(enabled, undefined, lang)
      .then((ok) => {
        if (!ok) console.warn("[Settings] Prayer notif: permission denied");
      });
  };

  const handleToggleMorningAdhkar = (enabled: boolean) => {
    setNotifSettings((prev) => ({ ...prev, morningAdhkar: enabled }));
    notificationService
      .toggleMorningAdhkar(enabled, lang)
      .then((ok) => {
        if (!ok) console.warn("[Settings] Morning adhkar: permission denied");
      });
  };

  const handleToggleEveningAdhkar = (enabled: boolean) => {
    setNotifSettings((prev) => ({ ...prev, eveningAdhkar: enabled }));
    notificationService
      .toggleEveningAdhkar(enabled, lang)
      .then((ok) => {
        if (!ok) console.warn("[Settings] Evening adhkar: permission denied");
      });
  };

  const currentReciter = RECITERS.find((r) => r.id === reciterId);
  const reciterName = currentReciter
    ? i18n.language === "fr"
      ? currentReciter.nameFr
      : currentReciter.nameEn
    : "";

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
        <Text style={styles.headerTitle}>{t("settings.title")}</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Profile section ── */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Display section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.display")}</Text>

          <ToggleSwitch
            label={t("settings.showArabic")}
            value={displayOptions.showArabic}
            onToggle={(v) => updateDisplayOption("showArabic", v)}
          />
          <ToggleSwitch
            label={t("settings.showTransliteration")}
            value={displayOptions.showTransliteration}
            onToggle={(v) => updateDisplayOption("showTransliteration", v)}
          />
          <ToggleSwitch
            label={t("settings.showTranslation")}
            value={displayOptions.showTranslation}
            onToggle={(v) => updateDisplayOption("showTranslation", v)}
          />
        </View>

        {/* Audio section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.audio")}</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setReciterModalVisible(true)}
          >
            <View>
              <Text style={styles.settingLabel}>{t("settings.reciter")}</Text>
              <Text style={styles.settingValue}>{reciterName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        </View>

        {/* Notifications section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.notifications")}</Text>
          <ToggleSwitch
            label={t("settings.prayerNotifications")}
            description={t("settings.prayerNotificationsDesc")}
            value={notifSettings.prayerNotifications}
            onToggle={handleTogglePrayerNotif}
          />
          <ToggleSwitch
            label={t("settings.morningAdhkar")}
            description={t("settings.morningAdhkarDesc")}
            value={notifSettings.morningAdhkar}
            onToggle={handleToggleMorningAdhkar}
          />
          <ToggleSwitch
            label={t("settings.eveningAdhkar")}
            description={t("settings.eveningAdhkarDesc")}
            value={notifSettings.eveningAdhkar}
            onToggle={handleToggleEveningAdhkar}
          />
        </View>

        {/* Language section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.language")}</Text>

          <View style={styles.languageRow}>
            <TouchableOpacity
              style={[
                styles.langBtn,
                language === "fr" && styles.langBtnActive,
              ]}
              onPress={() => setLanguage("fr")}
            >
              <Text
                style={[
                  styles.langText,
                  language === "fr" && styles.langTextActive,
                ]}
              >
                Français
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langBtn,
                language === "en" && styles.langBtnActive,
              ]}
              onPress={() => setLanguage("en")}
            >
              <Text
                style={[
                  styles.langText,
                  language === "en" && styles.langTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.about")}</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t("settings.version")}</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
        {/* Sign out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutRow}
            onPress={handleSignOut}
            activeOpacity={0.75}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.signOutText}>{t("settings.signOut")}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING["2xl"] }} />
      </ScrollView>

      <ReciterSelector
        visible={reciterModalVisible}
        selectedId={reciterId}
        onSelect={setReciterId}
        onClose={() => setReciterModalVisible(false)}
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
  section: {
    marginTop: SPACING["2xl"],
  },
  sectionTitle: {
    color: COLORS.gold,
    fontFamily: FONTS.bold,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: SPACING["2xl"],
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLabel: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  settingValue: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 2,
  },
  languageRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  langBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  langBtnActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  langText: {
    color: COLORS.gray400,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  langTextActive: {
    color: COLORS.primary,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  aboutLabel: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  aboutValue: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },

  // Profile
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  profileEmail: {
    color: COLORS.gray500,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },

  // Sign out
  signOutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
  },
  signOutText: {
    color: COLORS.error,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
});
