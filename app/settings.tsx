import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    InteractionManager,
    Modal,
    Pressable,
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

  const [localLang, setLocalLang] = useState(language);
  const [reciterModalVisible, setReciterModalVisible] = useState(false);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS,
  );
  const [morningTime, setMorningTime] = useState({ hour: 6, minute: 30 });
  const [eveningTime, setEveningTime] = useState({ hour: 20, minute: 30 });
  const [timePickerTarget, setTimePickerTarget] = useState<"morning" | "evening" | null>(null);
  const [pickerHour, setPickerHour] = useState(6);
  const [pickerMinute, setPickerMinute] = useState(30);

  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  useEffect(() => {
    notificationService.getSettings().then(setNotifSettings);
    notificationService.getMorningAdhkarTime().then(setMorningTime);
    notificationService.getEveningAdhkarTime().then(setEveningTime);
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

  const handleLanguageChange = (newLang: "fr" | "en") => {
    setLocalLang(newLang);
    InteractionManager.runAfterInteractions(() => {
      setLanguage(newLang);
    });
  };

  const formatTime = (h: number, m: number) =>
    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

  const openTimePicker = (target: "morning" | "evening") => {
    const time = target === "morning" ? morningTime : eveningTime;
    setPickerHour(time.hour);
    setPickerMinute(time.minute);
    setTimePickerTarget(target);
  };

  const confirmTimePicker = () => {
    if (!timePickerTarget) return;
    const newTime = { hour: pickerHour, minute: pickerMinute };
    if (timePickerTarget === "morning") {
      setMorningTime(newTime);
      if (notifSettings.morningAdhkar) {
        notificationService.scheduleMorningAdhkar(lang, pickerHour, pickerMinute);
      } else {
        notificationService.setMorningAdhkarTime(pickerHour, pickerMinute);
      }
    } else {
      setEveningTime(newTime);
      if (notifSettings.eveningAdhkar) {
        notificationService.scheduleEveningAdhkar(lang, pickerHour, pickerMinute);
      } else {
        notificationService.setEveningAdhkarTime(pickerHour, pickerMinute);
      }
    }
    setTimePickerTarget(null);
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
            value={notifSettings.morningAdhkar}
            onToggle={handleToggleMorningAdhkar}
          />
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => openTimePicker("morning")}
          >
            <Text style={styles.timeLabel}>{t("settings.notificationTime")}</Text>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={14} color={COLORS.gold} />
              <Text style={styles.timeValue}>
                {formatTime(morningTime.hour, morningTime.minute)}
              </Text>
            </View>
          </TouchableOpacity>
          <ToggleSwitch
            label={t("settings.eveningAdhkar")}
            value={notifSettings.eveningAdhkar}
            onToggle={handleToggleEveningAdhkar}
          />
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => openTimePicker("evening")}
          >
            <Text style={styles.timeLabel}>{t("settings.notificationTime")}</Text>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={14} color={COLORS.gold} />
              <Text style={styles.timeValue}>
                {formatTime(eveningTime.hour, eveningTime.minute)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Language section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.language")}</Text>

          <View style={styles.languageRow}>
            <Pressable
              style={[
                styles.langBtn,
                localLang === "fr" && styles.langBtnActive,
              ]}
              onPress={() => handleLanguageChange("fr")}
            >
              <Text
                style={[
                  styles.langText,
                  localLang === "fr" && styles.langTextActive,
                ]}
              >
                Français
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.langBtn,
                localLang === "en" && styles.langBtnActive,
              ]}
              onPress={() => handleLanguageChange("en")}
            >
              <Text
                style={[
                  styles.langText,
                  localLang === "en" && styles.langTextActive,
                ]}
              >
                English
              </Text>
            </Pressable>
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

      {/* Time picker modal */}
      <Modal
        visible={timePickerTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {timePickerTarget === "morning"
                ? t("settings.morningAdhkar")
                : t("settings.eveningAdhkar")}
            </Text>

            <View style={styles.pickerRow}>
              {/* Hour */}
              <View style={styles.pickerCol}>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setPickerHour((h) => (h + 1) % 24)}
                >
                  <Ionicons name="chevron-up" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.pickerValue}>
                  {pickerHour.toString().padStart(2, "0")}
                </Text>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setPickerHour((h) => (h - 1 + 24) % 24)}
                >
                  <Ionicons name="chevron-down" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.pickerUnit}>{t("settings.hours")}</Text>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              {/* Minute */}
              <View style={styles.pickerCol}>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setPickerMinute((m) => (m + 5) % 60)}
                >
                  <Ionicons name="chevron-up" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.pickerValue}>
                  {pickerMinute.toString().padStart(2, "0")}
                </Text>
                <TouchableOpacity
                  style={styles.pickerBtn}
                  onPress={() => setPickerMinute((m) => (m - 5 + 60) % 60)}
                >
                  <Ionicons name="chevron-down" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.pickerUnit}>{t("settings.minutes")}</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setTimePickerTarget(null)}
              >
                <Text style={styles.modalBtnCancelText}>{t("settings.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={confirmTimePicker}
              >
                <Text style={styles.modalBtnConfirmText}>{t("settings.confirm")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

  // Time picker row
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING["2xl"],
    paddingLeft: SPACING["2xl"] + 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timeLabel: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 13,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeValue: {
    color: COLORS.gold,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },

  // Time picker modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING["2xl"],
    width: "80%",
    maxWidth: 320,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 17,
    marginBottom: SPACING.xl,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  pickerCol: {
    alignItems: "center",
  },
  pickerBtn: {
    padding: SPACING.sm,
  },
  pickerValue: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 36,
    minWidth: 60,
    textAlign: "center",
  },
  pickerUnit: {
    color: COLORS.gray400,
    fontFamily: FONTS.regular,
    fontSize: 11,
    marginTop: 2,
  },
  pickerSeparator: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 36,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.md,
    width: "100%",
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalBtnCancelText: {
    color: COLORS.gray400,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.gold,
    alignItems: "center",
  },
  modalBtnConfirmText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
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
