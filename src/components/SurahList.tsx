import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import numberBg from "../../assets/images/number.png";
import { COLORS, FONTS, SPACING } from "../constants";
import type { SurahInfo } from "../data/surahs";

interface SurahListProps {
  surahs: SurahInfo[];
  onSurahPress?: (surahNumber: number) => void;
}

export const SurahList: React.FC<SurahListProps> = ({
  surahs,
  onSurahPress,
}) => {
  const { t } = useTranslation();

  const getRevelationType = (type: string): string => {
    return type.toLowerCase() === "meccan"
      ? t("quran.meccan")
      : t("quran.medinan");
  };

  const renderItem = useCallback(
    ({ item: surah }: { item: SurahInfo }) => (
      <TouchableOpacity
        style={styles.surahItem}
        onPress={() => onSurahPress?.(surah.number)}
        activeOpacity={1}
      >
        <View style={styles.surahLeft}>
          <View style={styles.numberContainer}>
            <Image
              source={numberBg}
              style={styles.numberBg}
              resizeMode="contain"
            />
            <Text style={styles.numberText}>{surah.number}</Text>
          </View>

          <View style={styles.surahInfo}>
            <Text style={styles.surahEnglishName}>{surah.transliteration}</Text>
            <Text style={styles.surahDetails}>
              {getRevelationType(surah.revelationType)} • {surah.numberOfAyahs}{" "}
              {t("common.verses").toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.surahArabicName}>{surah.name}</Text>
      </TouchableOpacity>
    ),
    [onSurahPress, t],
  );

  const keyExtractor = useCallback(
    (item: SurahInfo) => String(item.number),
    [],
  );

  return (
    <FlatList
      data={surahs}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={styles.container}
      scrollEnabled={false}
      initialNumToRender={15}
      maxToRenderPerBatch={20}
      windowSize={5}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
  },
  surahItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  surahLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  numberContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  numberBg: {
    width: 40,
    height: 40,
    position: "absolute",
    tintColor: COLORS.gold,
  },
  numberText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  surahInfo: {
    flex: 1,
  },
  surahEnglishName: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  surahDetails: {
    color: COLORS.gray400,
    fontSize: 12,
    letterSpacing: 0.5,
    fontFamily: FONTS.medium,
  },
  surahArabicName: {
    color: COLORS.gold,
    fontSize: 22,
    fontFamily: FONTS.arabic,
  },
});
