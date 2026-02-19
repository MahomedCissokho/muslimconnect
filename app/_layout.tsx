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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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
      <View style={styles.splash}>
        <LinearGradient
          colors={["#040C23", "#0D1535", "#121A3A"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Glow effects */}
        <View style={[styles.splashGlow, { top: -80, right: -60, width: 280, backgroundColor: "rgba(103,44,188,0.18)" }]} />
        <View style={[styles.splashGlow, { bottom: 60, left: -80, width: 220, backgroundColor: "rgba(249,189,100,0.06)" }]} />

        {/* Center content */}
        <View style={styles.splashCenter}>
          {/* Icon circle */}
          <LinearGradient
            colors={["#A855F7", "#7C3AED", "#672CBC"]}
            style={styles.splashIconCircle}
          >
            <Ionicons name="moon" size={38} color="#fff" />
          </LinearGradient>

          {/* App name */}
          <Text style={styles.splashName}>MUSLIM UNIVERSE</Text>
          <Text style={styles.splashTagline}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
        </View>

        {/* Loader */}
        <ActivityIndicator
          size="small"
          color={COLORS.gold}
          style={styles.splashLoader}
        />
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
  // ── Splash screen ──────────────────────────────────────────────────────────
  splash: {
    flex: 1,
    backgroundColor: "#040C23",
    alignItems: "center",
    justifyContent: "center",
  },
  splashGlow: {
    position: "absolute",
    borderRadius: 999,
    aspectRatio: 1,
  },
  splashCenter: {
    alignItems: "center",
    gap: 20,
  },
  splashIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 14,
    marginBottom: 4,
  },
  splashName: {
    color: "#F9BD64",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 4,
    textAlign: "center",
  },
  splashTagline: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 15,
    textAlign: "center",
  },
  splashLoader: {
    position: "absolute",
    bottom: 60,
  },

  // ── App container ───────────────────────────────────────────────────────────
  appContainer: {
    flex: 1,
  },
});
