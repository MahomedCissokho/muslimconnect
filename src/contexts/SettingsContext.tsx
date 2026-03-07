import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useTranslation } from "react-i18next";

import { DEFAULT_RECITER_ID } from "../data/reciters";
import {
    DEFAULT_NOTIFICATION_SETTINGS,
    notificationService,
    type NotificationSettings,
} from "../services/notifications";
import {
    DEFAULT_DISPLAY_OPTIONS,
    DEFAULT_LANGUAGE,
    settingsService,
    type AppLanguage,
    type DisplayOptions,
} from "../services/settings";

interface SettingsContextValue {
  reciterId: string;
  setReciterId: (id: string) => void;
  displayOptions: DisplayOptions;
  updateDisplayOption: (key: keyof DisplayOptions, value: boolean) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  notificationSettings: NotificationSettings;
  updateNotificationSetting: (
    key: keyof NotificationSettings,
    value: boolean,
  ) => Promise<boolean>;
  playerPosition: number;
  setPlayerPosition: (position: number) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  const [reciterId, setReciterIdState] = useState<string>(DEFAULT_RECITER_ID);
  const [displayOptions, setDisplayOptionsState] = useState<DisplayOptions>(
    DEFAULT_DISPLAY_OPTIONS,
  );
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [notificationSettings, setNotificationSettingsState] =
    useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [playerPosition, setPlayerPositionState] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load all settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [
          savedReciterId,
          savedDisplayOptions,
          savedLanguage,
          savedNotifSettings,
          savedPlayerPosition,
        ] = await Promise.all([
          settingsService.getReciterId(),
          settingsService.getDisplayOptions(),
          settingsService.getLanguage(),
          notificationService.getSettings(),
          settingsService.getPlayerPosition(),
        ]);

        setReciterIdState(savedReciterId);
        setDisplayOptionsState(savedDisplayOptions);
        setLanguageState(savedLanguage);
        setNotificationSettingsState(savedNotifSettings);
        setPlayerPositionState(savedPlayerPosition);

        // Sync i18n language with saved preference
        if (i18n.language !== savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.warn("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [i18n]);

  const setReciterId = useCallback((id: string) => {
    setReciterIdState(id);
    settingsService
      .setReciterId(id)
      .catch((err) => console.warn("Failed to persist reciterId:", err));
  }, []);

  const updateDisplayOption = useCallback(
    (key: keyof DisplayOptions, value: boolean) => {
      setDisplayOptionsState((prev) => {
        const updated = { ...prev, [key]: value };
        settingsService
          .setDisplayOptions(updated)
          .catch((err) =>
            console.warn("Failed to persist displayOptions:", err),
          );
        return updated;
      });
    },
    [],
  );

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      setLanguageState(lang);
      i18n.changeLanguage(lang);
      settingsService
        .setLanguage(lang)
        .catch((err) => console.warn("Failed to persist language:", err));
    },
    [i18n],
  );

  const setPlayerPosition = useCallback((position: number) => {
    setPlayerPositionState(position);
    settingsService
      .setPlayerPosition(position)
      .catch((err) => console.warn("Failed to persist playerPosition:", err));
  }, []);

  const updateNotificationSetting = useCallback(
    async (
      key: keyof NotificationSettings,
      value: boolean,
    ): Promise<boolean> => {
      const lang = (i18n.language as AppLanguage) || "fr";

      // Optimistic update: show the change immediately
      setNotificationSettingsState((prev) => ({ ...prev, [key]: value }));

      try {
        let success = false;

        switch (key) {
          case "prayerNotifications":
            success = await notificationService.togglePrayerNotifications(
              value,
              undefined,
              lang,
            );
            break;
          case "morningAdhkar":
            success = await notificationService.toggleMorningAdhkar(
              value,
              lang,
            );
            break;
          case "eveningAdhkar":
            success = await notificationService.toggleEveningAdhkar(
              value,
              lang,
            );
            break;
        }

        // Revert if the operation failed
        if (!success) {
          setNotificationSettingsState((prev) => ({ ...prev, [key]: !value }));
        }
        return success;
      } catch (error) {
        // Revert on error
        setNotificationSettingsState((prev) => ({ ...prev, [key]: !value }));
        console.warn(
          `[Settings] Failed to update notification setting ${key}:`,
          error,
        );
        return false;
      }
    },
    [i18n],
  );

  const contextValue = useMemo(
    () => ({
      reciterId,
      setReciterId,
      displayOptions,
      updateDisplayOption,
      language,
      setLanguage,
      notificationSettings,
      updateNotificationSetting,
      playerPosition,
      setPlayerPosition,
      isLoading,
    }),
    [
      reciterId,
      setReciterId,
      displayOptions,
      updateDisplayOption,
      language,
      setLanguage,
      notificationSettings,
      updateNotificationSetting,
      playerPosition,
      setPlayerPosition,
      isLoading,
    ],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
