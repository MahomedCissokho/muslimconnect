import { Ionicons } from "@expo/vector-icons";
import * as isoCountries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";
import enLocale from "i18n-iso-countries/langs/en.json";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

isoCountries.registerLocale(frLocale);
isoCountries.registerLocale(enLocale);
import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../../constants";

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface CountryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  countryCode: string;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSelect: (code: string, flag: string) => void;
}

const GLASS = "rgba(255,255,255,0.035)";

export function CountryPickerModal({
  visible,
  onClose,
  countryCode,
  searchQuery,
  onSearchChange,
  onSelect,
}: CountryPickerModalProps) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const currentLang = typeof i18n.language === 'string' && i18n.language.startsWith("ar")
    ? "ar"
    : typeof i18n.language === 'string' && i18n.language.startsWith("en")
      ? "en"
      : "fr";

  // Swipe-to-dismiss
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) {
          Animated.timing(translateY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const ALL_COUNTRIES = useMemo(() => {
    return getCountries()
      .map((isoCode) => {
        const callingCode = getCountryCallingCode(isoCode);
        const iso3 = isoCountries.alpha2ToAlpha3(isoCode) || "";
        return {
          isoCode,
          iso3,
          code: `+${callingCode}`,
          flag: getFlagEmoji(isoCode),
          name: isoCountries.getName(isoCode, currentLang) || isoCode,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [currentLang]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return ALL_COUNTRIES;
    const lowerSearch = searchQuery
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    return ALL_COUNTRIES.filter((c) => {
      const lowerName = c.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return (
        lowerName.includes(lowerSearch) ||
        c.code.includes(lowerSearch) ||
        c.isoCode.toLowerCase() === lowerSearch ||
        c.iso3.toLowerCase() === lowerSearch
      );
    });
  }, [ALL_COUNTRIES, searchQuery]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable style={s.mOverlay} onPress={onClose}>
          <Animated.View
            style={[
              s.mSheet,
              { paddingBottom: 34 + insets.bottom, transform: [{ translateY }] },
            ]}
            {...panResponder.panHandlers}
          >
            <Pressable onPress={() => {}}>
              <View style={s.mHandle} />
              <Text style={s.mTitle}>
                {t("courseRegister.selectCountry") || "Select country"}
              </Text>
              <View style={s.mSearch}>
                <Ionicons name="search" size={18} color="#666" />
                <TextInput
                  style={s.mSearchInput}
                  placeholder={t("courseRegister.search") || "Search..."}
                  placeholderTextColor="#555"
                  value={searchQuery}
                  onChangeText={onSearchChange}
                  autoCorrect={false}
                />
              </View>
              <FlatList
                data={filteredCountries}
                keyExtractor={(i) => i.isoCode}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const sel = item.code === countryCode;
                  return (
                    <Pressable
                      style={[s.mRow, sel && s.mRowSel]}
                      onPress={() => onSelect(item.code, item.flag)}
                    >
                      <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                      <Text style={s.mName} numberOfLines={1}>{item.name}</Text>
                      <Text style={s.mCode}>{item.code}</Text>
                      {sel && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.gold}
                        />
                      )}
                    </Pressable>
                  );
                }}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 340 }}
              />
            </Pressable>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  mOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  mSheet: {
    backgroundColor: "#0D1429",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 20,
    maxHeight: "65%",
  },
  mHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#555",
    alignSelf: "center",
    marginBottom: 18,
  },
  mTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 16,
  },
  mSearch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: GLASS,
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  mSearchInput: {
    flex: 1,
    color: "#fff",
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  mRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.03)",
  },
  mRowSel: {
    backgroundColor: "rgba(249,189,100,0.05)",
    borderRadius: 14,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  mName: { flex: 1, color: "#fff", fontSize: 16, fontFamily: FONTS.medium },
  mCode: { color: "#777", fontSize: 15, fontFamily: FONTS.medium },
});
