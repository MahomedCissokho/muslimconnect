import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../../constants";

interface Props {
  selectedSubjects: string[];
  format: string;
  level: string;
}

export function CourseRegistrationSuccess(_props: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={$.root}>
      <LinearGradient
        colors={[COLORS.primary, "#0A1230", "#080F28"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative glows */}
      <View style={$.glowTop} />
      <View style={$.glowBottom} />

      <View style={$.content}>
        {/* Success icon */}
        <View style={$.iconWrap}>
          <View style={$.iconOuterRing}>
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={$.iconGradient}
            >
              <Ionicons name="checkmark" size={52} color="#fff" />
            </LinearGradient>
          </View>
        </View>

        {/* Title */}
        <Text style={$.title}>
          {t("courseRegister.confirmTitle", {
            defaultValue: "Demande enregistrée",
          })}
        </Text>

        {/* Divider */}
        <View style={$.divider}>
          <View style={$.dividerLine} />
          <View style={$.dividerDiamond} />
          <View style={$.dividerLine} />
        </View>

        {/* Subtitle in a glass card */}
        <View style={$.subtitleCard}>
          <Text style={$.subtitle}>
            {t("courseRegister.confirmSubtitle", {
              defaultValue:
                "Nous vous contacterons très prochainement par WhatsApp / Téléphone pour finaliser votre inscription.",
            })}
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={$.actions}>
        <Pressable
          style={{ width: "100%", borderRadius: 20, overflow: "hidden" }}
          onPress={() => router.replace("/(tabs)" as any)}
        >
          <LinearGradient
            colors={[COLORS.gold, "#F59E0B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={$.cta}
          >
            <Ionicons name="home-outline" size={20} color={COLORS.primary} />
            <Text style={$.ctaText}>{t("courseRegister.backToHome")}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const $ = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },

  glowTop: {
    position: "absolute",
    top: -60,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(16,185,129,0.06)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -40,
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(249,189,100,0.04)",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  iconWrap: {
    marginBottom: 28,
  },
  iconOuterRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "rgba(16,185,129,0.25)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(16,185,129,0.05)",
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: 16,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(249,189,100,0.25)",
  },
  dividerDiamond: {
    width: 5,
    height: 5,
    borderRadius: 1,
    backgroundColor: "rgba(249,189,100,0.6)",
    transform: [{ rotate: "45deg" }],
  },

  subtitleCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    paddingVertical: 22,
    paddingHorizontal: 24,
  },
  subtitle: {
    color: COLORS.gray300,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: "justify",
    lineHeight: 26,
  },

  actions: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
  },
  ctaText: {
    color: COLORS.primary,
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
});
