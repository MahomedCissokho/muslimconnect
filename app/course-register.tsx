import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../assets/images/back.png";
import {
  COLORS,
  COURSE_REGISTRATION_EMAIL,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  FONTS,
  SPACING,
} from "../src/constants";
import { useAuth } from "../src/contexts/AuthContext";

// ─── Data ───────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "+221", flag: "🇸🇳", name: "Sénégal" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+212", flag: "🇲🇦", name: "Maroc" },
  { code: "+213", flag: "🇩🇿", name: "Algérie" },
  { code: "+216", flag: "🇹🇳", name: "Tunisie" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+224", flag: "🇬🇳", name: "Guinée" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+229", flag: "🇧🇯", name: "Bénin" },
  { code: "+237", flag: "🇨🇲", name: "Cameroun" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+243", flag: "🇨🇩", name: "RD Congo" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+32", flag: "🇧🇪", name: "Belgique" },
  { code: "+41", flag: "🇨🇭", name: "Suisse" },
  { code: "+49", flag: "🇩🇪", name: "Allemagne" },
  { code: "+39", flag: "🇮🇹", name: "Italie" },
  { code: "+34", flag: "🇪🇸", name: "Espagne" },
  { code: "+90", flag: "🇹🇷", name: "Turquie" },
  { code: "+966", flag: "🇸🇦", name: "Arabie Saoudite" },
  { code: "+971", flag: "🇦🇪", name: "Émirats" },
  { code: "+20", flag: "🇪🇬", name: "Égypte" },
  { code: "+962", flag: "🇯🇴", name: "Jordanie" },
  { code: "+60", flag: "🇲🇾", name: "Malaisie" },
  { code: "+62", flag: "🇮🇩", name: "Indonésie" },
];

const SUBJECTS: { key: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "arabic", icon: "globe" },
  { key: "fiqh", icon: "scale" },
  { key: "hadith", icon: "book" },
  { key: "quran", icon: "reader" },
  { key: "aqida", icon: "diamond" },
  { key: "sira", icon: "time" },
];

const FORMATS = ["formatInPerson", "formatOnline", "formatBoth"] as const;
const LEVELS = ["levelBeginner", "levelIntermediate", "levelAdvanced"] as const;

const FORMAT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  formatInPerson: "people",
  formatOnline: "videocam",
  formatBoth: "apps",
};
const LEVEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  levelBeginner: "leaf",
  levelIntermediate: "trending-up",
  levelAdvanced: "rocket",
};

/** International phone regex (E.164-like): 6-15 digits */
const PHONE_REGEX = /^\d{6,15}$/;

// ─── Component ──────────────────────────────────────────────────────────────

export default function CourseRegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const confirmScale = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep] = useState(1);

  // Step 1 — pre-fill from profile
  const [fullName, setFullName] = useState(
    () => (user?.user_metadata?.full_name as string) ?? ""
  );
  const [countryCode, setCountryCode] = useState("+221");
  const [countryFlag, setCountryFlag] = useState("🇸🇳");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(() => user?.email ?? "");

  // Step 2
  const [locationText, setLocationText] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  // Step 3
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [format, setFormat] = useState("");
  const [level, setLevel] = useState("");

  // UI
  const [focused, setFocused] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const filteredCountries = countrySearch
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.includes(countrySearch)
      )
    : COUNTRIES;

  // ── Validation helpers ──

  const isStep1Valid =
    fullName.trim().length > 0 &&
    PHONE_REGEX.test(phone.replace(/\s/g, "")) &&
    email.trim().length > 0;

  const isStep2Valid = locationText.trim().length > 0;

  const isStep3Valid =
    selectedSubjects.length > 0 && format !== "" && level !== "";

  const isCurrentStepValid =
    step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : isStep3Valid;

  // ── Navigation ──

  const goToStep = (next: number) => {
    setStep(next);
    setError(null);
    setFieldErrors({});
  };

  const handleBack = () => {
    if (step === 1) router.back();
    else goToStep(step - 1);
  };

  const handleNext = () => {
    Keyboard.dismiss();
    setError(null);

    if (step === 1) {
      const errs: Record<string, boolean> = {};
      if (!fullName.trim()) errs.name = true;
      if (!PHONE_REGEX.test(phone.replace(/\s/g, ""))) errs.phone = true;
      if (!email.trim()) errs.email = true;
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return;
      }
    }
    if (step === 2) {
      if (!locationText.trim()) {
        setFieldErrors({ location: true });
        return;
      }
    }
    setFieldErrors({});
    goToStep(step + 1);
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError(null);
    if (!isStep3Valid) {
      setError(t("courseRegister.errorRequired"));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setSubmitting(true);
    try {
      const subjectLabels = selectedSubjects
        .map(
          (k) =>
            t(`courseRegister.subject${k.charAt(0).toUpperCase() + k.slice(1)}`)
        )
        .join(", ");

      const payload = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: COURSE_REGISTRATION_EMAIL,
          full_name: fullName,
          phone: `${countryCode} ${phone}`,
          email,
          location: locationText,
          subjects: subjectLabels,
          format: t(`courseRegister.${format}`),
          level: t(`courseRegister.${level}`),
          registration_date: new Date().toLocaleString("fr-FR", {
            dateStyle: "full",
            timeStyle: "short",
          }),
        },
      };

      console.log("📧 [EmailJS] Sending with payload:", JSON.stringify(payload, null, 2));

      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://localhost",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      console.log("📧 [EmailJS] Status:", res.status);
      console.log("📧 [EmailJS] Response:", responseText);

      if (!res.ok) {
        console.error("📧 [EmailJS] FAILED —", res.status, responseText);
        throw new Error(`EmailJS ${res.status}: ${responseText}`);
      }

      console.log("📧 [EmailJS] SUCCESS ✅");
      setConfirmed(true);
      Animated.spring(confirmScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } catch (err: any) {
      console.error("📧 [EmailJS] CATCH error:", err?.message || err);
      setError(t("courseRegister.errorSubmit"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseLocation = async () => {
    setDetectingLocation(true);
    setError(null);
    setFieldErrors({});
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(t("courseRegister.errorLocation"));
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const [geo] = await Location.reverseGeocodeAsync(loc.coords);
      if (geo) {
        setLocationText(
          [geo.subregion, geo.city, geo.region, geo.country]
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i) // dedupe
            .join(", ")
        );
        setLocationDetected(true);
      }
    } catch {
      setError(t("courseRegister.errorLocation"));
    } finally {
      setDetectingLocation(false);
    }
  };

  // ─── Confirmation ─────────────────────────────────────────────────────────

  if (confirmed) {
    const subjectLabels = selectedSubjects
      .map(
        (k) =>
          t(`courseRegister.subject${k.charAt(0).toUpperCase() + k.slice(1)}`)
      )
      .join(", ");

    const timelineSteps = [
      { icon: "person-outline" as const, text: t("courseRegister.confirmStep1") },
      { icon: "document-text-outline" as const, text: t("courseRegister.confirmStep2") },
      { icon: "calendar-outline" as const, text: t("courseRegister.confirmStep3") },
    ];

    return (
      <SafeAreaView style={$.root}>
        <LinearGradient
          colors={[COLORS.primary, "#080F28"]}
          style={StyleSheet.absoluteFillObject}
        />
        <ScrollView
          contentContainerStyle={$.confirmScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Success icon ── */}
          <Animated.View
            style={[$.confirmIcon, { transform: [{ scale: confirmScale }] }]}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={$.confirmIconGrad}
            >
              <Ionicons name="checkmark" size={56} color="#fff" />
            </LinearGradient>
          </Animated.View>
          <Text style={$.confirmTitle}>{t("courseRegister.confirmation")}</Text>
          <Text style={$.confirmMsg}>
            {t("courseRegister.confirmationMessage")}
          </Text>

          {/* ── Summary card ── */}
          <View style={$.confirmCard}>
            <Text style={$.confirmCardTitle}>
              {t("courseRegister.confirmSummaryTitle")}
            </Text>
            <View style={$.confirmRow}>
              <Text style={$.confirmLabel}>
                {t("courseRegister.confirmSummarySubjects")}
              </Text>
              <Text style={$.confirmValue}>{subjectLabels}</Text>
            </View>
            <View style={$.confirmRow}>
              <Text style={$.confirmLabel}>
                {t("courseRegister.confirmSummaryFormat")}
              </Text>
              <Text style={$.confirmValue}>
                {t(`courseRegister.${format}`)}
              </Text>
            </View>
            <View style={$.confirmRow}>
              <Text style={$.confirmLabel}>
                {t("courseRegister.confirmSummaryLevel")}
              </Text>
              <Text style={$.confirmValue}>
                {t(`courseRegister.${level}`)}
              </Text>
            </View>
          </View>

          {/* ── Timeline ── */}
          <View style={$.confirmCard}>
            <Text style={$.confirmCardTitle}>
              {t("courseRegister.confirmTimeline")}
            </Text>
            {timelineSteps.map((s, i) => (
              <View key={i} style={$.timelineRow}>
                <View style={$.timelineDot}>
                  <Ionicons name={s.icon} size={16} color={COLORS.gold} />
                </View>
                {i < timelineSteps.length - 1 && (
                  <View style={$.timelineLine} />
                )}
                <Text style={$.timelineText}>{s.text}</Text>
              </View>
            ))}
          </View>

          {/* ── WhatsApp pill ── */}
          <View style={$.confirmPill}>
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            <Text style={$.confirmPillText}>WhatsApp / Email</Text>
          </View>

          {/* ── CTAs ── */}
          <View style={$.confirmActions}>
            <Pressable
              style={{ width: "100%", borderRadius: 20, overflow: "hidden" }}
              onPress={() => router.replace("/(tabs)" as any)}
            >
              <LinearGradient
                colors={[COLORS.gold, "#F59E0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={$.confirmCta}
              >
                <Ionicons name="book-outline" size={20} color={COLORS.primary} />
                <Text style={$.confirmCtaText}>
                  {t("courseRegister.confirmExplore")}
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/(tabs)" as any)}
              style={$.confirmSecondary}
            >
              <Ionicons name="home-outline" size={18} color={COLORS.gray400} />
              <Text style={$.confirmSecondaryText}>
                {t("courseRegister.backToHome")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={$.root}>
      <LinearGradient
        colors={[COLORS.primary, "#080F28"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={$.header}>
        <Pressable onPress={handleBack} style={$.headerBack}>
          <Image source={backIcon} style={$.headerBackIcon} resizeMode="contain" />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={$.headerTitle}>{t("courseRegister.screenTitle")}</Text>
          <Text style={$.headerSub}>
            {t("courseRegister.step", { current: step, total: 3 })}
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Progress bar */}
      <View style={$.progressBg}>
        <View style={[$.progressFill, { width: `${(step / 3) * 100}%` }]} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={$.scrollPad}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Error banner (only for step 3 / submit errors) */}
            {!!error && (
              <View style={$.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#F87171" />
                <Text style={$.errorBannerText}>{error}</Text>
              </View>
            )}

            {/* ═══ STEP 1 ═══ */}
            {step === 1 && (
              <>
                {/* Hero */}
                <View style={$.hero}>
                  <View style={$.heroGlow} />
                  <View style={$.heroIconBg}>
                    <Ionicons name="school" size={36} color={COLORS.gold} />
                  </View>
                  <Text style={$.heroTitle}>
                    {t("courseRegister.heroTitle")}
                  </Text>
                  <Text style={$.heroDesc}>
                    {t("courseRegister.heroSubtitle")}
                  </Text>
                  <View style={$.heroPill}>
                    <Ionicons name="star" size={13} color={COLORS.gold} />
                    <Text style={$.heroPillText}>
                      {t("courseRegister.paidNotice")}
                    </Text>
                  </View>
                </View>

                <Text style={$.sectionHead}>
                  {t("courseRegister.personalInfo")}
                </Text>

                {/* Name */}
                <View style={$.fieldGroup}>
                  <Text style={$.label}>{t("courseRegister.fullName")}</Text>
                  <View
                    style={[
                      $.fieldBox,
                      focused === "n" && $.fieldBoxFocus,
                      fieldErrors.name && $.fieldBoxError,
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={18}
                      color={
                        fieldErrors.name
                          ? "#F87171"
                          : focused === "n"
                            ? COLORS.gold
                            : "#555"
                      }
                    />
                    <TextInput
                      style={$.fieldText}
                      placeholder="Mohamed Cissokho"
                      placeholderTextColor="#3a3f52"
                      value={fullName}
                      onChangeText={(v) => {
                        setFullName(v);
                        if (fieldErrors.name)
                          setFieldErrors((p) => ({ ...p, name: false }));
                      }}
                      autoCapitalize="words"
                      onFocus={() => setFocused("n")}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                  {fieldErrors.name && (
                    <Text style={$.fieldErr}>
                      {t("courseRegister.errorRequired")}
                    </Text>
                  )}
                </View>

                {/* Phone */}
                <View style={$.fieldGroup}>
                  <Text style={$.label}>{t("courseRegister.phoneNumber")}</Text>
                  <View style={$.phoneWrap}>
                    <Pressable
                      style={[
                        $.phoneCC,
                        focused === "p" && $.fieldBoxFocus,
                        fieldErrors.phone && $.fieldBoxError,
                      ]}
                      onPress={() => {
                        setCountrySearch("");
                        setShowCountryPicker(true);
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{countryFlag}</Text>
                      <Text style={$.phoneCCText}>{countryCode}</Text>
                      <Ionicons name="caret-down" size={12} color="#666" />
                    </Pressable>
                    <View
                      style={[
                        $.fieldBox,
                        $.phoneNum,
                        focused === "p" && $.fieldBoxFocus,
                        fieldErrors.phone && $.fieldBoxError,
                      ]}
                    >
                      <TextInput
                        style={$.fieldText}
                        placeholder="77 123 45 67"
                        placeholderTextColor="#3a3f52"
                        value={phone}
                        onChangeText={(v) => {
                          setPhone(v);
                          if (fieldErrors.phone)
                            setFieldErrors((p) => ({ ...p, phone: false }));
                        }}
                        keyboardType="phone-pad"
                        onFocus={() => setFocused("p")}
                        onBlur={() => setFocused(null)}
                      />
                    </View>
                  </View>
                  {fieldErrors.phone && (
                    <Text style={$.fieldErr}>
                      {t("courseRegister.errorPhone")}
                    </Text>
                  )}
                </View>

                {/* Email */}
                <View style={$.fieldGroup}>
                  <Text style={$.label}>{t("courseRegister.email")}</Text>
                  <View
                    style={[
                      $.fieldBox,
                      focused === "e" && $.fieldBoxFocus,
                      fieldErrors.email && $.fieldBoxError,
                    ]}
                  >
                    <Ionicons
                      name="mail"
                      size={18}
                      color={
                        fieldErrors.email
                          ? "#F87171"
                          : focused === "e"
                            ? COLORS.gold
                            : "#555"
                      }
                    />
                    <TextInput
                      style={$.fieldText}
                      placeholder="email@example.com"
                      placeholderTextColor="#3a3f52"
                      value={email}
                      onChangeText={(v) => {
                        setEmail(v);
                        if (fieldErrors.email)
                          setFieldErrors((p) => ({ ...p, email: false }));
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocused("e")}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                  {fieldErrors.email && (
                    <Text style={$.fieldErr}>
                      {t("courseRegister.errorRequired")}
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* ═══ STEP 2 ═══ */}
            {step === 2 && (
              <>
                <Text style={$.sectionHead}>{t("courseRegister.location")}</Text>

                <Pressable
                  onPress={handleUseLocation}
                  disabled={detectingLocation}
                >
                  <View style={[$.locCard, locationDetected && $.locCardDone]}>
                    <View
                      style={[
                        $.locCircle,
                        locationDetected && {
                          backgroundColor: "rgba(16,185,129,0.12)",
                        },
                      ]}
                    >
                      {detectingLocation ? (
                        <ActivityIndicator size="small" color={COLORS.gold} />
                      ) : (
                        <Ionicons
                          name={
                            locationDetected ? "checkmark-circle" : "navigate"
                          }
                          size={28}
                          color={
                            locationDetected ? "#10B981" : COLORS.purpleLight
                          }
                        />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={$.locLabel}>
                        {detectingLocation
                          ? t("courseRegister.detectingLocation")
                          : locationDetected
                            ? t("courseRegister.locationDetected")
                            : t("courseRegister.useMyLocation")}
                      </Text>
                      {locationDetected && locationText ? (
                        <Text style={$.locSub}>{locationText}</Text>
                      ) : null}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#444" />
                  </View>
                </Pressable>

                <View style={$.divRow}>
                  <View style={$.divLine} />
                  <Text style={$.divText}>
                    {t("courseRegister.orEnterManually")}
                  </Text>
                  <View style={$.divLine} />
                </View>

                <View style={$.fieldGroup}>
                  <Text style={$.label}>{t("courseRegister.cityAddress")}</Text>
                  <View
                    style={[
                      $.fieldBox,
                      focused === "l" && $.fieldBoxFocus,
                      fieldErrors.location && $.fieldBoxError,
                    ]}
                  >
                    <Ionicons
                      name="location"
                      size={18}
                      color={
                        fieldErrors.location
                          ? "#F87171"
                          : focused === "l"
                            ? COLORS.gold
                            : "#555"
                      }
                    />
                    <TextInput
                      style={$.fieldText}
                      placeholder="Dakar, Sénégal"
                      placeholderTextColor="#3a3f52"
                      value={locationText}
                      onChangeText={(v) => {
                        setLocationText(v);
                        setLocationDetected(false);
                        if (fieldErrors.location)
                          setFieldErrors((p) => ({ ...p, location: false }));
                      }}
                      onFocus={() => setFocused("l")}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                  {fieldErrors.location && (
                    <Text style={$.fieldErr}>
                      {t("courseRegister.errorRequired")}
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* ═══ STEP 3 ═══ */}
            {step === 3 && (
              <>
                <Text style={$.sectionHead}>
                  {t("courseRegister.preferences")}
                </Text>

                <Text style={$.subHead}>
                  {t("courseRegister.subjectOfInterest")}
                </Text>
                <View style={$.grid}>
                  {SUBJECTS.map((sub) => {
                    const on = selectedSubjects.includes(sub.key);
                    return (
                      <Pressable
                        key={sub.key}
                        style={[$.gridItem, on && $.gridItemOn]}
                        onPress={() =>
                          setSelectedSubjects((p) =>
                            p.includes(sub.key)
                              ? p.filter((x) => x !== sub.key)
                              : [...p, sub.key]
                          )
                        }
                      >
                        {on && (
                          <View style={$.gridCheck}>
                            <Ionicons
                              name="checkmark"
                              size={11}
                              color="#fff"
                            />
                          </View>
                        )}
                        <View style={[$.gridIconBg, on && $.gridIconBgOn]}>
                          <Ionicons
                            name={sub.icon}
                            size={24}
                            color={on ? COLORS.gold : COLORS.gray500}
                          />
                        </View>
                        <Text
                          style={[$.gridLabel, on && $.gridLabelOn]}
                          numberOfLines={2}
                        >
                          {t(
                            `courseRegister.subject${sub.key.charAt(0).toUpperCase() + sub.key.slice(1)}`
                          )}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={$.subHead}>{t("courseRegister.format")}</Text>
                <View style={$.pills}>
                  {FORMATS.map((f) => {
                    const on = format === f;
                    return (
                      <Pressable
                        key={f}
                        style={[$.pill, on && $.pillOn]}
                        onPress={() => setFormat(f)}
                      >
                        <Ionicons
                          name={FORMAT_ICONS[f]}
                          size={22}
                          color={on ? COLORS.gold : "#555"}
                        />
                        <Text style={[$.pillText, on && $.pillTextOn]}>
                          {t(`courseRegister.${f}`)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={$.subHead}>{t("courseRegister.level")}</Text>
                <View style={$.pills}>
                  {LEVELS.map((l) => {
                    const on = level === l;
                    return (
                      <Pressable
                        key={l}
                        style={[$.pill, on && $.pillOn]}
                        onPress={() => setLevel(l)}
                      >
                        <Ionicons
                          name={LEVEL_ICONS[l]}
                          size={22}
                          color={on ? COLORS.gold : "#555"}
                        />
                        <Text style={[$.pillText, on && $.pillTextOn]}>
                          {t(`courseRegister.${l}`)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom */}
      <View style={$.bottom}>
        {step > 1 && (
          <Pressable style={$.bottomBack} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
        )}
        <Pressable
          style={[$.bottomNext, !isCurrentStepValid && $.bottomNextDisabled]}
          onPress={step === 3 ? handleSubmit : handleNext}
          disabled={submitting}
        >
          <LinearGradient
            colors={
              submitting || !isCurrentStepValid
                ? ["#2a2a2a", "#333"]
                : [COLORS.gold, "#F59E0B"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={$.bottomNextGrad}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#999" />
            ) : (
              <>
                <Text
                  style={[
                    $.bottomNextText,
                    !isCurrentStepValid && $.bottomNextTextDim,
                  ]}
                >
                  {step === 3
                    ? t("courseRegister.submit")
                    : t("courseRegister.next")}
                </Text>
                <Ionicons
                  name={step === 3 ? "send" : "arrow-forward"}
                  size={18}
                  color={isCurrentStepValid ? COLORS.primary : "#666"}
                />
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>

      {/* Country Picker */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <Pressable
          style={$.mOverlay}
          onPress={() => setShowCountryPicker(false)}
        >
          <Pressable style={$.mSheet} onPress={() => {}}>
            <View style={$.mHandle} />
            <Text style={$.mTitle}>Select country</Text>
            <View style={$.mSearch}>
              <Ionicons name="search" size={18} color="#666" />
              <TextInput
                style={$.mSearchInput}
                placeholder="Search..."
                placeholderTextColor="#555"
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={filteredCountries}
              keyExtractor={(i) => i.code + i.name}
              renderItem={({ item }) => {
                const sel = item.code === countryCode;
                return (
                  <Pressable
                    style={[$.mRow, sel && $.mRowSel]}
                    onPress={() => {
                      setCountryCode(item.code);
                      setCountryFlag(item.flag);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                    <Text style={$.mName}>{item.name}</Text>
                    <Text style={$.mCode}>{item.code}</Text>
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
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const GLASS = "rgba(255,255,255,0.035)";
const GLASS_FOCUS = "rgba(249,189,100,0.07)";
const GLASS_ERROR = "rgba(248,113,113,0.08)";

const $ = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerBack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GLASS,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackIcon: { width: 18, height: 18, tintColor: "#fff" },
  headerTitle: { color: "#fff", fontSize: 18, fontFamily: FONTS.bold },
  headerSub: {
    color: COLORS.gray500,
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 1,
  },

  // Progress
  progressBg: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },

  // Scroll
  scrollPad: { paddingHorizontal: 20, paddingBottom: 30 },

  // Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: GLASS_ERROR,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  errorBannerText: {
    flex: 1,
    color: "#F87171",
    fontFamily: FONTS.medium,
    fontSize: 14,
  },

  // Hero
  hero: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderRadius: 24,
    backgroundColor: GLASS,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(249,189,100,0.04)",
  },
  heroIconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(249,189,100,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: 8,
  },
  heroDesc: {
    color: COLORS.gray400,
    fontSize: 15,
    fontFamily: FONTS.regular,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(249,189,100,0.07)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroPillText: {
    color: COLORS.gold,
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },

  // Sections
  sectionHead: {
    color: "#fff",
    fontSize: 26,
    fontFamily: FONTS.bold,
    marginBottom: 22,
  },
  subHead: {
    color: COLORS.gray300,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    marginBottom: 14,
  },

  // Fields
  fieldGroup: { marginBottom: 6 },
  label: {
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginBottom: 8,
    marginLeft: 4,
  },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    height: 58,
    borderRadius: 18,
    backgroundColor: GLASS,
    paddingHorizontal: 18,
  },
  fieldBoxFocus: { backgroundColor: GLASS_FOCUS },
  fieldBoxError: { backgroundColor: GLASS_ERROR },
  fieldText: {
    flex: 1,
    color: "#fff",
    fontFamily: FONTS.regular,
    fontSize: 16,
    paddingVertical: 0,
  },
  fieldErr: {
    color: "#F87171",
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 6,
    marginLeft: 4,
    marginBottom: 10,
  },

  // Phone
  phoneWrap: { flexDirection: "row", gap: 10 },
  phoneCC: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 58,
    borderRadius: 18,
    backgroundColor: GLASS,
    paddingHorizontal: 14,
  },
  phoneCCText: { color: "#fff", fontFamily: FONTS.semiBold, fontSize: 16 },
  phoneNum: { flex: 1 },

  // Location
  locCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: GLASS,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  locCardDone: { backgroundColor: "rgba(16,185,129,0.05)" },
  locCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(152,121,233,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  locLabel: { color: "#fff", fontSize: 16, fontFamily: FONTS.semiBold },
  locSub: {
    color: "#10B981",
    fontSize: 13,
    fontFamily: FONTS.regular,
    marginTop: 3,
  },

  divRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  divText: { color: "#555", fontSize: 13, fontFamily: FONTS.medium },

  // Grid (subjects)
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 26,
  },
  gridItem: {
    width: "47.5%" as any,
    backgroundColor: GLASS,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 10,
  },
  gridItemOn: {
    backgroundColor: GLASS_FOCUS,
    borderWidth: 1.5,
    borderColor: "rgba(249,189,100,0.35)",
  },
  gridCheck: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  gridIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  gridIconBgOn: {
    backgroundColor: "rgba(249,189,100,0.1)",
  },
  gridLabel: {
    color: COLORS.gray400,
    fontSize: 13,
    fontFamily: FONTS.medium,
    textAlign: "center",
    lineHeight: 18,
  },
  gridLabelOn: { color: COLORS.gold },

  // Pills (format / level)
  pills: { flexDirection: "row", gap: 10, marginBottom: 24 },
  pill: {
    flex: 1,
    backgroundColor: GLASS,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  pillOn: {
    backgroundColor: GLASS_FOCUS,
    borderWidth: 1.5,
    borderColor: "rgba(249,189,100,0.35)",
  },
  pillText: {
    color: COLORS.gray400,
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  pillTextOn: { color: COLORS.gold },

  // Bottom
  bottom: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  bottomBack: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: GLASS,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNext: { flex: 1, borderRadius: 20, overflow: "hidden" },
  bottomNextDisabled: { opacity: 0.5 },
  bottomNextGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
  },
  bottomNextText: {
    color: COLORS.primary,
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  bottomNextTextDim: { color: "#666" },

  // Confirm
  confirmScroll: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  confirmIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 14,
  },
  confirmIconGrad: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmTitle: {
    color: "#fff",
    fontSize: 26,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: 10,
  },
  confirmMsg: {
    color: COLORS.gray400,
    fontSize: 15,
    fontFamily: FONTS.regular,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  confirmCard: {
    width: "100%",
    backgroundColor: GLASS,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  confirmCardTitle: {
    color: COLORS.gold,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  confirmLabel: {
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.regular,
    flex: 1,
  },
  confirmValue: {
    color: "#fff",
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    flex: 2,
    textAlign: "right",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },
  timelineDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(249,189,100,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    position: "absolute",
    left: 17,
    top: 46,
    width: 2,
    height: 20,
    backgroundColor: "rgba(249,189,100,0.12)",
    borderRadius: 1,
  },
  timelineText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: FONTS.regular,
    flex: 1,
  },
  confirmPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(37,211,102,0.06)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 24,
  },
  confirmPillText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
  confirmActions: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  confirmCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
  },
  confirmCtaText: {
    color: COLORS.primary,
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  confirmSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  confirmSecondaryText: {
    color: COLORS.gray400,
    fontSize: 15,
    fontFamily: FONTS.regular,
  },

  // Modal
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
    paddingBottom: 34,
    maxHeight: "65%",
  },
  mHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
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
