import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import backIcon from '../assets/images/back.png';
import { ReciterSelector, ToggleSwitch } from '../src/components';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../src/constants';
import { RECITERS } from '../src/data/reciters';
import { useSettings } from '../src/contexts/SettingsContext';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const {
    reciterId,
    setReciterId,
    displayOptions,
    updateDisplayOption,
    language,
    setLanguage,
  } = useSettings();

  const [reciterModalVisible, setReciterModalVisible] = useState(false);

  const currentReciter = RECITERS.find((r) => r.id === reciterId);
  const reciterName = currentReciter
    ? i18n.language === 'fr'
      ? currentReciter.nameFr
      : currentReciter.nameEn
    : '';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={backIcon} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Display section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.display')}</Text>

          <ToggleSwitch
            label={t('settings.showArabic')}
            value={displayOptions.showArabic}
            onToggle={(v) => updateDisplayOption('showArabic', v)}
          />
          <ToggleSwitch
            label={t('settings.showTransliteration')}
            value={displayOptions.showTransliteration}
            onToggle={(v) => updateDisplayOption('showTransliteration', v)}
          />
          <ToggleSwitch
            label={t('settings.showTranslation')}
            value={displayOptions.showTranslation}
            onToggle={(v) => updateDisplayOption('showTranslation', v)}
          />
        </View>

        {/* Audio section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.audio')}</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setReciterModalVisible(true)}
          >
            <View>
              <Text style={styles.settingLabel}>{t('settings.reciter')}</Text>
              <Text style={styles.settingValue}>{reciterName}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        </View>

        {/* Language section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>

          <View style={styles.languageRow}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'fr' && styles.langBtnActive]}
              onPress={() => setLanguage('fr')}
            >
              <Text style={[styles.langText, language === 'fr' && styles.langTextActive]}>
                Français
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t('settings.version')}</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING['2xl'],
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
    marginTop: SPACING['2xl'],
  },
  sectionTitle: {
    color: COLORS.gold,
    fontFamily: FONTS.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: SPACING['2xl'],
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING['2xl'],
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
    flexDirection: 'row',
    paddingHorizontal: SPACING['2xl'],
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
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING['2xl'],
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
});
