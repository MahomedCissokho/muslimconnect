import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, FONTS } from "../src/constants";
import { useAuth } from "../src/contexts/AuthContext";

export default function AuthScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const switchMode = (next: "signIn" | "signUp") => {
    setError(null);
    setMode(next);
  };

  const handleSubmit = async () => {
    setError(null);
    Keyboard.dismiss();
    if (mode === "signUp") {
      if (!fullName.trim()) { setError(t("auth.errorNameRequired")); return; }
      if (!email.trim() || !password.trim()) { setError(t("auth.errorFieldsRequired")); return; }
      if (password.length < 6) { setError(t("auth.errorPasswordLength")); return; }
      if (password !== confirmPassword) { setError(t("auth.errorPasswordMatch")); return; }
    } else {
      if (!email.trim() || !password.trim()) { setError(t("auth.errorFieldsRequired")); return; }
    }
    setLoading(true);
    try {
      if (mode === "signIn") {
        const err = await signIn(email, password);
        if (err) {
          setError(t("auth.errorInvalidCredentials"));
        } else {
          router.replace("/(tabs)" as any);
        }
      } else {
        const err = await signUp(email, password, fullName);
        if (err) {
          const lower = err.toLowerCase();
          if (lower.includes("already") || lower.includes("registered") || lower.includes("exists")) {
            setError(t("auth.errorEmailExists"));
          } else {
            setError(err);
          }
        } else {
          router.replace("/(tabs)" as any);
        }
      }
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={s.root}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView style={s.safe}>
          <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
              contentContainerStyle={s.scroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >

              {/* Logo */}
              <View style={s.logoArea}>
                <View style={s.iconWrap}>
                  <Ionicons name="moon" size={30} color={COLORS.white} />
                </View>
                <Text style={s.appName}>{t("common.appName")}</Text>
              </View>

              {/* Title */}
              <Text style={s.title}>
                {mode === "signIn" ? t("auth.signIn") : t("auth.signUp")}
              </Text>
              <Text style={s.subtitle}>
                {mode === "signIn" ? t("auth.signInSubtitle") : t("auth.signUpSubtitle")}
              </Text>

              {/* Error */}
              {!!error && (
                <View style={s.alertBox}>
                  <Ionicons name="alert-circle-outline" size={15} color={COLORS.error} />
                  <Text style={s.alertText}>{error}</Text>
                </View>
              )}

              {/* Fields */}
              {mode === "signUp" && (
                <View style={[s.field, focused === "name" && s.fieldFocused]}>
                  <Ionicons name="person-outline" size={18} color={focused === "name" ? COLORS.gold : COLORS.gray600} />
                  <TextInput
                    style={s.fieldInput}
                    placeholder={t("auth.fullName")}
                    placeholderTextColor={COLORS.gray600}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              )}

              <View style={[s.field, focused === "email" && s.fieldFocused]}>
                <Ionicons name="mail-outline" size={18} color={focused === "email" ? COLORS.gold : COLORS.gray600} />
                <TextInput
                  style={s.fieldInput}
                  placeholder={t("auth.email")}
                  placeholderTextColor={COLORS.gray600}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </View>

              <View style={[s.field, focused === "pwd" && s.fieldFocused]}>
                <Ionicons name="lock-closed-outline" size={18} color={focused === "pwd" ? COLORS.gold : COLORS.gray600} />
                <TextInput
                  style={[s.fieldInput, { flex: 1 }]}
                  placeholder={t("auth.password")}
                  placeholderTextColor={COLORS.gray600}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPwd}
                  textContentType="oneTimeCode"
                  autoComplete="off"
                  onFocus={() => setFocused("pwd")}
                  onBlur={() => setFocused(null)}
                />
                <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
                  <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={18} color={COLORS.gray600} />
                </TouchableOpacity>
              </View>

              {mode === "signUp" && (
                <View style={[s.field, focused === "cpwd" && s.fieldFocused]}>
                  <Ionicons name="lock-closed-outline" size={18} color={focused === "cpwd" ? COLORS.gold : COLORS.gray600} />
                  <TextInput
                    style={[s.fieldInput, { flex: 1 }]}
                    placeholder={t("auth.confirmPassword")}
                    placeholderTextColor={COLORS.gray600}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPwd}
                    textContentType="oneTimeCode"
                    autoComplete="off"
                    onFocus={() => setFocused("cpwd")}
                    onBlur={() => setFocused(null)}
                  />
                  <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
                    <Ionicons name={showPwd ? "eye-off-outline" : "eye-outline"} size={18} color={COLORS.gray600} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Submit */}
              <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85} style={s.btn}>
                <LinearGradient
                  colors={loading ? [COLORS.gray700, COLORS.gray600] : [COLORS.gold, "#F59E0B"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.btnGrad}
                >
                  <Text style={s.btnText}>
                    {loading
                      ? "..."
                      : mode === "signIn" ? t("auth.signIn") : t("auth.createAccount")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {mode === "signUp" && (
                <Text style={s.terms}>{t("auth.terms")}</Text>
              )}

              {/* Switch mode link */}
              <View style={s.switchRow}>
                <Text style={s.switchLabel}>
                  {mode === "signIn" ? t("auth.noAccount") : t("auth.hasAccount")}
                </Text>
                <TouchableOpacity onPress={() => switchMode(mode === "signIn" ? "signUp" : "signIn")} activeOpacity={0.7}>
                  <Text style={s.switchLink}>
                    {mode === "signIn" ? t("auth.createAccount") : t("auth.signIn")}
                  </Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  kav:  { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: "center",
  },

  // Logo
  logoArea: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 22,
    letterSpacing: 0.5,
  },

  // Title
  title: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 26,
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.gray500,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: 28,
  },

  // Alert
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(248,113,113,0.08)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.18)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    color: COLORS.error,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
  },

  // Fields
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  fieldFocused: {
    borderColor: COLORS.gold,
  },
  fieldInput: {
    flex: 1,
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: 15,
  },

  // Submit
  btn: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 8,
  },
  btnGrad: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },

  terms: {
    color: COLORS.gray600,
    fontFamily: FONTS.regular,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 8,
  },

  // Switch
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
  },
  switchLabel: {
    color: COLORS.gray500,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  switchLink: {
    color: COLORS.gold,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
});
