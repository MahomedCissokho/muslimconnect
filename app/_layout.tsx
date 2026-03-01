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
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";
import { AudioPlayerBar } from "../src/components";
import { supabase } from "../src/services/supabase";
import { COLORS } from "../src/constants";
import { AudioProvider, useAudio } from "../src/contexts/AudioContext";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { DownloadProvider } from "../src/contexts/DownloadContext";
import { SettingsProvider } from "../src/contexts/SettingsContext";
import "../src/i18n";

SplashScreen.preventAutoHideAsync();

// ─── Navigation content (hides audio bar on auth screen, stops on sign out) ──

function NavigationContent() {
  const { session } = useAuth();
  const { stop } = useAudio();
  const segments = useSegments();

  const isAuthScreen = segments[0] === "auth";

  useEffect(() => {
    if (!session) {
      stop();
    }
  }, [session, stop]);

  return (
    <View style={styles.appContainer}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
      </Stack>
      {!isAuthScreen && <AudioPlayerBar />}
    </View>
  );
}

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
        {/* Background gradient */}
        <LinearGradient
          colors={["#040C23", "#080F28", "#040C23"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Purple glow — top right */}
        <View style={[styles.splashGlow, { top: -110, right: -90, width: 360, backgroundColor: "rgba(124,58,237,0.22)" }]} />
        {/* Gold glow — bottom left */}
        <View style={[styles.splashGlow, { bottom: -80, left: -110, width: 300, backgroundColor: "rgba(249,189,100,0.07)" }]} />
        {/* Soft purple — center */}
        <View style={[styles.splashGlow, { top: 200, left: -60, width: 220, backgroundColor: "rgba(103,44,188,0.09)" }]} />

        {/* Decorative star dots */}
        <View style={[styles.splashDot, { top: 80,  left: 40,  width: 3, height: 3 }]} />
        <View style={[styles.splashDot, { top: 130, right: 55, width: 2, height: 2 }]} />
        <View style={[styles.splashDot, { top: 60,  right: 100,width: 2, height: 2 }]} />
        <View style={[styles.splashDot, { top: 190, left: 28,  width: 2, height: 2 }]} />
        <View style={[styles.splashDot, { bottom: 180, right: 45, width: 3, height: 3 }]} />
        <View style={[styles.splashDot, { bottom: 240, left: 35, width: 2, height: 2 }]} />
        <View style={[styles.splashDot, { bottom: 130, right: 90, width: 2, height: 2 }]} />

        {/* ── Center content ── */}
        <View style={styles.splashCenter}>

          {/* Outer decorative ring */}
          <View style={styles.splashOuterRing}>
            {/* Icon gradient square */}
            <LinearGradient
              colors={["#A855F7", "#7C3AED", "#5B21B6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.splashIconCircle}
            >
              <Image
                source={require("../assets/images/quran.png")}
                style={styles.splashLogo}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          {/* Divider with center diamond */}
          <View style={styles.splashDivider}>
            <View style={styles.splashDividerLine} />
            <View style={styles.splashDividerDiamond} />
            <View style={styles.splashDividerLine} />
          </View>

          {/* App name */}
          <Text style={styles.splashName}>MUSLIM UNIVERSE</Text>

          {/* Arabic Bismillah */}
          <Text style={styles.splashTagline}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>

        </View>

        {/* Bottom loader */}
        <ActivityIndicator size="small" color={COLORS.gold} style={styles.splashLoader} />
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
              <NavigationContent />
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
  splashDot: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  splashCenter: {
    alignItems: "center",
    gap: 22,
  },
  splashOuterRing: {
    width: 120,
    height: 120,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(168,85,247,0.35)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(168,85,247,0.07)",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 14,
  },
  splashIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  splashLogo: {
    width: 60,
    height: 60,
  },
  splashDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  splashDividerLine: {
    width: 44,
    height: 1,
    backgroundColor: "rgba(249,189,100,0.3)",
  },
  splashDividerDiamond: {
    width: 5,
    height: 5,
    borderRadius: 1,
    backgroundColor: "rgba(249,189,100,0.7)",
    transform: [{ rotate: "45deg" }],
  },
  splashName: {
    color: "#F9BD64",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 5,
    textAlign: "center",
  },
  splashTagline: {
    color: "rgba(255,255,255,0.32)",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.5,
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
