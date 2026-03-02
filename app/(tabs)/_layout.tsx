import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import bookmarkIcon from '../../assets/images/bookmark.png';
import duasIcon from '../../assets/images/duas.png';
import hadithIcon from '../../assets/images/hadith.png';
import prayerIcon from '../../assets/images/prayer.png';
import quranIcon from '../../assets/images/quran-tab.png';
import { FONTS } from '../../src/constants';

const COLORS = {
  primary: '#040C23',
  gold: '#F9BD64',
  grayInactive: '#6B7280',
  border: '#1F2937',
  tertiary: '#121931',
};

interface TabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

const TabIcon = ({ source, focused }: TabIconProps) => (
  <View style={styles.iconContainer}>
    <Image
      source={source}
      style={[
        styles.icon,
        { tintColor: focused ? COLORS.gold : COLORS.grayInactive }
      ]}
      resizeMode="contain"
    />
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tertiary,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 70 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.grayInactive,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={quranIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: t('tabs.prayer'),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={prayerIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="hadith"
        options={{
          title: t('tabs.hadith'),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={hadithIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: t('tabs.duas'),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={duasIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: t('tabs.bookmark'),
          tabBarIcon: ({ focused }) => (
            <TabIcon source={bookmarkIcon} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  icon: {
    width: 22,
    height: 22,
  },
});