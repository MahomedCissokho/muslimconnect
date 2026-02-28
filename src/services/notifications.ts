import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// --- Storage keys ---
const KEYS = {
  PRAYER_NOTIFICATIONS: "@settings/prayerNotifications",
  MORNING_ADHKAR: "@settings/morningAdhkar",
  EVENING_ADHKAR: "@settings/eveningAdhkar",
  MORNING_ADHKAR_TIME: "@settings/morningAdhkarTime",
  EVENING_ADHKAR_TIME: "@settings/eveningAdhkarTime",
} as const;

// --- Types ---
export interface NotificationSettings {
  prayerNotifications: boolean;
  morningAdhkar: boolean;
  eveningAdhkar: boolean;
}

export interface PrayerTimeEntry {
  key: string;
  arabicName: string;
  time: string; // "HH:mm"
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  prayerNotifications: false,
  morningAdhkar: false,
  eveningAdhkar: false,
};

// Default times for adhkar reminders
const DEFAULT_MORNING_HOUR = 6;
const DEFAULT_MORNING_MINUTE = 30;
const DEFAULT_EVENING_HOUR = 20;
const DEFAULT_EVENING_MINUTE = 30;

// --- Notification channel identifiers ---
const PRAYER_CATEGORY = "prayer-time";
const MORNING_ADHKAR_CATEGORY = "morning-adhkar";
const EVENING_ADHKAR_CATEGORY = "evening-adhkar";

// --- Morning & Evening adhkar content ---
const MORNING_ADHKAR_MESSAGES = {
  fr: {
    title: "🌅 Adhkar du matin",
    body: "N'oubliez pas vos invocations du matin. Commencez votre journée avec le rappel d'Allah.",
  },
  en: {
    title: "🌅 Morning Adhkar",
    body: "Don't forget your morning supplications. Start your day with the remembrance of Allah.",
  },
};

const EVENING_ADHKAR_MESSAGES = {
  fr: {
    title: "🌙 Adhkar du soir",
    body: "N'oubliez pas vos invocations du soir avant de dormir. Terminez votre journée avec le rappel d'Allah.",
  },
  en: {
    title: "🌙 Evening Adhkar",
    body: "Don't forget your evening supplications before sleeping. End your day with the remembrance of Allah.",
  },
};

const PRAYER_MESSAGES: Record<string, { fr: string; en: string }> = {
  Fajr: {
    fr: "🕌 L'heure de la prière du Fajr (الفجر) est arrivée",
    en: "🕌 It's time for Fajr prayer (الفجر)",
  },
  Sunrise: {
    fr: "☀️ Le soleil se lève (الشروق)",
    en: "☀️ Sunrise (الشروق)",
  },
  Dhuhr: {
    fr: "🕌 L'heure de la prière du Dhuhr (الظهر) est arrivée",
    en: "🕌 It's time for Dhuhr prayer (الظهر)",
  },
  Asr: {
    fr: "🕌 L'heure de la prière de l'Asr (العصر) est arrivée",
    en: "🕌 It's time for Asr prayer (العصر)",
  },
  Maghrib: {
    fr: "🕌 L'heure de la prière du Maghrib (المغرب) est arrivée",
    en: "🕌 It's time for Maghrib prayer (المغرب)",
  },
  Isha: {
    fr: "🕌 L'heure de la prière de l'Isha (العشاء) est arrivée",
    en: "🕌 It's time for Isha prayer (العشاء)",
  },
};

// --- Configure notification handler ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// --- Service ---
export const notificationService = {
  // ---- Permissions ----
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("[Notifications] Permission not granted");
      return false;
    }

    // Android channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Muslim Universe",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });
    }

    return true;
  },

  // ---- Settings persistence ----
  async getSettings(): Promise<NotificationSettings> {
    try {
      const [prayer, morning, evening] = await Promise.all([
        AsyncStorage.getItem(KEYS.PRAYER_NOTIFICATIONS),
        AsyncStorage.getItem(KEYS.MORNING_ADHKAR),
        AsyncStorage.getItem(KEYS.EVENING_ADHKAR),
      ]);
      return {
        prayerNotifications: prayer === "true",
        morningAdhkar: morning === "true",
        eveningAdhkar: evening === "true",
      };
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  },

  async setPrayerNotifications(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.PRAYER_NOTIFICATIONS, enabled.toString());
  },

  async setMorningAdhkar(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.MORNING_ADHKAR, enabled.toString());
  },

  async setEveningAdhkar(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.EVENING_ADHKAR, enabled.toString());
  },

  // ---- Cancel helpers ----
  async cancelAllPrayerNotifications(): Promise<void> {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const prayerIds = all
      .filter((n) => n.content.categoryIdentifier === PRAYER_CATEGORY)
      .map((n) => n.identifier);
    await Promise.all(
      prayerIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
    );
  },

  async cancelMorningAdhkar(): Promise<void> {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const ids = all
      .filter((n) => n.content.categoryIdentifier === MORNING_ADHKAR_CATEGORY)
      .map((n) => n.identifier);
    await Promise.all(
      ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
    );
  },

  async cancelEveningAdhkar(): Promise<void> {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const ids = all
      .filter((n) => n.content.categoryIdentifier === EVENING_ADHKAR_CATEGORY)
      .map((n) => n.identifier);
    await Promise.all(
      ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
    );
  },

  // ---- Schedule prayer time notifications ----
  async schedulePrayerNotifications(
    prayers: PrayerTimeEntry[],
    lang: "fr" | "en" = "fr",
  ): Promise<void> {
    // First cancel existing prayer notifications
    await this.cancelAllPrayerNotifications();

    const now = new Date();

    for (const prayer of prayers) {
      const [hourStr, minStr] = prayer.time.split(":");
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minStr, 10);

      // Create trigger date for today
      const triggerDate = new Date();
      triggerDate.setHours(hour, minute, 0, 0);

      // Skip if time has already passed today
      if (triggerDate <= now) continue;

      const message = PRAYER_MESSAGES[prayer.key];
      if (!message) continue;

      const secondsUntil = Math.floor(
        (triggerDate.getTime() - now.getTime()) / 1000,
      );

      if (secondsUntil <= 0) continue;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Muslim Universe",
          body: message[lang],
          categoryIdentifier: PRAYER_CATEGORY,
          sound: "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntil,
          repeats: false,
        },
      });
    }

  },

  // ---- Schedule morning adhkar ----
  async scheduleMorningAdhkar(lang: "fr" | "en" = "fr"): Promise<void> {
    await this.cancelMorningAdhkar();

    const messages = MORNING_ADHKAR_MESSAGES[lang];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: messages.title,
        body: messages.body,
        categoryIdentifier: MORNING_ADHKAR_CATEGORY,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: DEFAULT_MORNING_HOUR,
        minute: DEFAULT_MORNING_MINUTE,
      },
    });

  },

  // ---- Schedule evening adhkar ----
  async scheduleEveningAdhkar(lang: "fr" | "en" = "fr"): Promise<void> {
    await this.cancelEveningAdhkar();

    const messages = EVENING_ADHKAR_MESSAGES[lang];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: messages.title,
        body: messages.body,
        categoryIdentifier: EVENING_ADHKAR_CATEGORY,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: DEFAULT_EVENING_HOUR,
        minute: DEFAULT_EVENING_MINUTE,
      },
    });

  },

  // ---- Master setup: call after prayer times are fetched ----
  async setupAllNotifications(
    prayers: PrayerTimeEntry[],
    lang: "fr" | "en" = "fr",
  ): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    const settings = await this.getSettings();

    if (settings.prayerNotifications) {
      await this.schedulePrayerNotifications(prayers, lang);
    }
    if (settings.morningAdhkar) {
      await this.scheduleMorningAdhkar(lang);
    }
    if (settings.eveningAdhkar) {
      await this.scheduleEveningAdhkar(lang);
    }
  },

  // ---- Toggle individual notification types ----
  async togglePrayerNotifications(
    enabled: boolean,
    prayers?: PrayerTimeEntry[],
    lang: "fr" | "en" = "fr",
  ): Promise<boolean> {
    if (enabled) {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;

      if (prayers) {
        await this.schedulePrayerNotifications(prayers, lang);
      }
    } else {
      await this.cancelAllPrayerNotifications();
    }
    await this.setPrayerNotifications(enabled);
    return true;
  },

  async toggleMorningAdhkar(
    enabled: boolean,
    lang: "fr" | "en" = "fr",
  ): Promise<boolean> {
    if (enabled) {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;
      await this.scheduleMorningAdhkar(lang);
    } else {
      await this.cancelMorningAdhkar();
    }
    await this.setMorningAdhkar(enabled);
    return true;
  },

  async toggleEveningAdhkar(
    enabled: boolean,
    lang: "fr" | "en" = "fr",
  ): Promise<boolean> {
    if (enabled) {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return false;
      await this.scheduleEveningAdhkar(lang);
    } else {
      await this.cancelEveningAdhkar();
    }
    await this.setEveningAdhkar(enabled);
    return true;
  },
};
