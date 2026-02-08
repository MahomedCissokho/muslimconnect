import {
  Amiri_400Regular,
  Amiri_700Bold,
  useFonts as useAmiri,
} from '@expo-google-fonts/amiri';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts as usePoppins,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';
import { AudioPlayerBar } from '../src/components';
import { COLORS } from '../src/constants';
import { AudioProvider } from '../src/contexts/AudioContext';
import { DownloadProvider } from '../src/contexts/DownloadContext';
import { SettingsProvider } from '../src/contexts/SettingsContext';
import '../src/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [poppinsLoaded] = usePoppins({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [amiriLoaded] = useAmiri({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const fontsLoaded = poppinsLoaded && amiriLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AudioProvider>
          <DownloadProvider>
            <View style={styles.appContainer}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="settings" />
              </Stack>
              <AudioPlayerBar />
            </View>
            <StatusBar style="light" backgroundColor={COLORS.primary} />
          </DownloadProvider>
        </AudioProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  appContainer: {
    flex: 1,
  },
});
