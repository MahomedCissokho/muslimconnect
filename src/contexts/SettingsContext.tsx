import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_RECITER_ID } from '../data/reciters';
import {
  settingsService,
  DEFAULT_DISPLAY_OPTIONS,
  DEFAULT_LANGUAGE,
  type DisplayOptions,
  type AppLanguage,
} from '../services/settings';

interface SettingsContextValue {
  reciterId: string;
  setReciterId: (id: string) => void;
  displayOptions: DisplayOptions;
  updateDisplayOption: (key: keyof DisplayOptions, value: boolean) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  const [reciterId, setReciterIdState] = useState<string>(DEFAULT_RECITER_ID);
  const [displayOptions, setDisplayOptionsState] = useState<DisplayOptions>(DEFAULT_DISPLAY_OPTIONS);
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Load all settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedReciterId, savedDisplayOptions, savedLanguage] = await Promise.all([
          settingsService.getReciterId(),
          settingsService.getDisplayOptions(),
          settingsService.getLanguage(),
        ]);

        setReciterIdState(savedReciterId);
        setDisplayOptionsState(savedDisplayOptions);
        setLanguageState(savedLanguage);

        // Sync i18n language with saved preference
        if (i18n.language !== savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.warn('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const setReciterId = useCallback((id: string) => {
    setReciterIdState(id);
    settingsService.setReciterId(id).catch((err) =>
      console.warn('Failed to persist reciterId:', err)
    );
  }, []);

  const updateDisplayOption = useCallback(
    (key: keyof DisplayOptions, value: boolean) => {
      setDisplayOptionsState((prev) => {
        const updated = { ...prev, [key]: value };
        settingsService.setDisplayOptions(updated).catch((err) =>
          console.warn('Failed to persist displayOptions:', err)
        );
        return updated;
      });
    },
    []
  );

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      setLanguageState(lang);
      i18n.changeLanguage(lang);
      settingsService.setLanguage(lang).catch((err) =>
        console.warn('Failed to persist language:', err)
      );
    },
    [i18n]
  );

  return (
    <SettingsContext.Provider
      value={{
        reciterId,
        setReciterId,
        displayOptions,
        updateDisplayOption,
        language,
        setLanguage,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
