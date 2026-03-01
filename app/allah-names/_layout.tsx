import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../src/constants";

export default function AllahNamesLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.gold,
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="flashcards"
        options={{
          title: t("allahNames.flashcards", { defaultValue: "Flashcards" }),
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="quiz"
        options={{
          title: t("allahNames.quiz", { defaultValue: "Quiz" }),
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
