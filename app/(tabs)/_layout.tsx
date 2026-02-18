import { Tabs } from 'expo-router';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import bookmarkIcon from '../../assets/images/bookmark.png';
import duasIcon from '../../assets/images/duas.png';
import hadithIcon from '../../assets/images/hadith.png';
import prayerIcon from '../../assets/images/prayer.png';
import quranIcon from '../../assets/images/quran-tab.png';

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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tertiary,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.grayInactive,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Quran',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={quranIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={prayerIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="hadith"
        options={{
          title: 'Hadith',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={hadithIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: 'Duas',
          tabBarIcon: ({ focused }) => (
            <TabIcon source={duasIcon} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmark',
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
    width: 24,
    height: 24,
  },
});