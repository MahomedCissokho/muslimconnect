import {
    Amiri_400Regular,
    Amiri_700Bold,
    useFonts as useAmiri,
} from "@expo-google-fonts/amiri";
import {
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts as usePoppins,
} from "@expo-google-fonts/poppins";
import * as Linking from "expo-linking";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";
import { AudioPlayerBar } from "../src/components";
import { supabase } from "../src/services/supabase";
import { COLORS } from "../src/constants";
import { AudioProvider } from "../src/contexts/AudioContext";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { DownloadProvider } from "../src/contexts/DownloadContext";
import { SettingsProvider } from "../src/contexts/SettingsContext";
import "../src/i18n";

SplashScreen.preventAutoHideAsync();

// ─── Auth-aware navigator ──────────────────────────────────────────────────

function AuthGate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!fontsLoaded || authLoading) return;

    const inTabs = segments[0] === "(tabs)";
    const inAuth = segments[0] === "auth";

    if (
      session &&
      (inAuth || segments[0] === undefined || (segments[0] as string) === "index")
    ) {
      router.replace("/(tabs)");
    } else if (!session && inTabs) {
      router.replace("/auth");
    }
  }, [session, authLoading, fontsLoaded, segments, router]);

  return null;
}

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

  // ─── Deep link handler (email confirmation) ────────────────────────────────
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      // Supabase puts tokens in the URL fragment: #access_token=...&refresh_token=...
      const fragment = url.split("#")[1];
      if (!fragment) return;
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    };

    // App en foreground : lien reçu pendant que l'app tourne
    const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));

    // App ouverte depuis un cold start via le lien
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SettingsProvider>
          <AudioProvider>
            <DownloadProvider>
              <AuthGate fontsLoaded={fontsLoaded} />
              <View style={styles.appContainer}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="auth" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="settings" />
                </Stack>
                <AudioPlayerBar />
              </View>
              <StatusBar style="light" backgroundColor={COLORS.primary} />
            </DownloadProvider>
          </AudioProvider>
        </SettingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  appContainer: {
    flex: 1,
  },
});
