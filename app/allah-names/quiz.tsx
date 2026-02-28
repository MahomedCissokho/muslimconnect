import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import backIcon from "../../assets/images/back.png";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../../src/constants";
import { ALLAH_NAMES } from "../../src/data/allahNames";
import { allahNamesService } from "../../src/services/allahNamesProgress";

interface QuizOption {
  number: number;
  name: string;
  transliteration: string;
}

interface Question {
  correctNumber: number;
  questionText: string;
  options: QuizOption[];
}

const QUESTIONS_PER_ROUND = 10;

function generateQuestions(lang: "en" | "fr"): Question[] {
  const shuffled = [...ALLAH_NAMES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, QUESTIONS_PER_ROUND);

  return selected.map((name) => {
    const distractors = ALLAH_NAMES.filter((n) => n.number !== name.number)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options: QuizOption[] = [...distractors, name]
      .map((o) => ({
        number: o.number,
        name: o.name,
        transliteration: o.transliteration,
      }))
      .sort(() => Math.random() - 0.5);

    return {
      correctNumber: name.number,
      questionText: name[lang].meaning,
      options,
    };
  });
}

export default function QuizScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";

  const [questions, setQuestions] = useState<Question[]>(() =>
    generateQuestions(lang as "en" | "fr"),
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const starScale = useRef(new Animated.Value(0)).current;

  const question = questions[currentQ];
  const isCorrect = selectedAnswer === question?.correctNumber;
  const hasAnswered = selectedAnswer !== null;

  const handleAnswer = (optionNumber: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(optionNumber);

    const correct = optionNumber === question.correctNumber;
    if (correct) {
      setCorrectCount((c) => c + 1);
    }

    // Auto-advance after delay
    setTimeout(() => {
      setCurrentQ((prevQ) => {
        if (prevQ < questions.length - 1) {
          setSelectedAnswer(null);
          return prevQ + 1;
        }
        // Quiz finished
        setCorrectCount((prevCorrect) => {
          const finalScore = correct ? prevCorrect : prevCorrect;
          allahNamesService.saveQuizScore({
            timestamp: Date.now(),
            correct: finalScore,
            total: QUESTIONS_PER_ROUND,
          });
          if (finalScore >= 8) {
            Animated.spring(starScale, {
              toValue: 1,
              friction: 4,
              tension: 80,
              useNativeDriver: true,
            }).start();
          }
          return prevCorrect;
        });
        setFinished(true);
        return prevQ;
      });
    }, correct ? 800 : 1500);
  };

  const handleRestart = () => {
    setQuestions(generateQuestions(lang as "en" | "fr"));
    setCurrentQ(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
    setFinished(false);
    starScale.setValue(0);
  };

  const getOptionStyle = (optionNumber: number) => {
    if (!hasAnswered) return styles.optionDefault;
    if (optionNumber === question.correctNumber) return styles.optionCorrect;
    if (optionNumber === selectedAnswer) return styles.optionWrong;
    return styles.optionDefault;
  };

  const getOptionTextColor = (optionNumber: number) => {
    if (!hasAnswered) return COLORS.white;
    if (optionNumber === question.correctNumber) return "#059669";
    if (optionNumber === selectedAnswer) return "#DC2626";
    return COLORS.gray600;
  };

  // Finished screen
  if (finished) {
    const finalScore = correctCount;
    const isGreat = finalScore >= 8;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={backIcon} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t("allahNames.quiz", { defaultValue: "Quiz" })}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.finishedContainer}>
          {isGreat && (
            <Animated.View style={{ transform: [{ scale: starScale }] }}>
              <Ionicons name="star" size={80} color={COLORS.gold} />
            </Animated.View>
          )}

          <Text style={styles.finishedScore}>
            {t("allahNames.quizScore", {
              defaultValue: "{{correct}}/{{total}} correct",
              correct: finalScore,
              total: QUESTIONS_PER_ROUND,
            })}
          </Text>

          <Text style={styles.finishedMessage}>
            {isGreat
              ? lang === "fr"
                ? "Excellent ! MashaAllah !"
                : "Excellent! MashaAllah!"
              : lang === "fr"
                ? "Continuez à apprendre, vous progressez !"
                : "Keep learning, you're progressing!"}
          </Text>

          <View style={styles.finishedActions}>
            <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
              <LinearGradient
                colors={["#7C3AED", "#A855F7"]}
                style={styles.restartGradient}
              >
                <Ionicons name="refresh" size={20} color={COLORS.white} />
                <Text style={styles.restartText}>
                  {t("allahNames.tryAgain", { defaultValue: "Réessayer" })}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.backBtnText}>
                {t("allahNames.backToNames", { defaultValue: "Retour aux Noms" })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={backIcon} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("allahNames.quiz", { defaultValue: "Quiz" })}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress */}
      <View style={styles.quizProgress}>
        <Text style={styles.quizCounter}>
          {currentQ + 1} / {QUESTIONS_PER_ROUND}
        </Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((currentQ + 1) / QUESTIONS_PER_ROUND) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionArea}>
        <Text style={styles.questionLabel}>
          {t("allahNames.whichNameMeans", { defaultValue: "Quel nom signifie :" })}
        </Text>
        <Text style={styles.questionText}>« {question.questionText} »</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option) => (
            <TouchableOpacity
              key={option.number}
              style={[styles.optionBtn, getOptionStyle(option.number)]}
              onPress={() => handleAnswer(option.number)}
              disabled={hasAnswered}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionArabic,
                  { color: getOptionTextColor(option.number) },
                ]}
              >
                {option.name}
              </Text>
              <Text
                style={[
                  styles.optionTranslit,
                  {
                    color: hasAnswered
                      ? getOptionTextColor(option.number)
                      : COLORS.gray400,
                  },
                ]}
              >
                {option.transliteration}
              </Text>

              {hasAnswered && option.number === question.correctNumber && (
                <View style={styles.optionIcon}>
                  <Ionicons name="checkmark-circle" size={22} color="#059669" />
                </View>
              )}
              {hasAnswered &&
                option.number === selectedAnswer &&
                option.number !== question.correctNumber && (
                  <View style={styles.optionIcon}>
                    <Ionicons name="close-circle" size={22} color="#DC2626" />
                  </View>
                )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        {hasAnswered && (
          <Text style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            {isCorrect
              ? t("allahNames.correct", { defaultValue: "Correct !" })
              : t("allahNames.wrong", { defaultValue: "Faux !" })}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },

  // Progress
  quizProgress: {
    paddingHorizontal: SPACING["2xl"],
    marginBottom: SPACING.xl,
  },
  quizCounter: {
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },

  // Question
  questionArea: {
    flex: 1,
    paddingHorizontal: SPACING["2xl"],
  },
  questionLabel: {
    color: COLORS.gray400,
    fontSize: 14,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  questionText: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: SPACING["3xl"],
    lineHeight: 32,
  },

  // Options
  optionsContainer: {
    gap: SPACING.md,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  optionDefault: {
    borderColor: COLORS.border,
  },
  optionCorrect: {
    borderColor: "#059669",
    backgroundColor: "rgba(5,150,105,0.1)",
  },
  optionWrong: {
    borderColor: "#DC2626",
    backgroundColor: "rgba(220,38,38,0.1)",
  },
  optionArabic: {
    fontSize: 22,
    fontFamily: FONTS.arabicBold,
    flex: 0,
  },
  optionTranslit: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  optionIcon: {
    marginLeft: "auto",
  },

  // Feedback
  feedback: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginTop: SPACING.xl,
  },
  feedbackCorrect: {
    color: "#059669",
  },
  feedbackWrong: {
    color: "#DC2626",
  },

  // Finished
  finishedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING["3xl"],
  },
  finishedScore: {
    color: COLORS.white,
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  finishedMessage: {
    color: COLORS.gray400,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: SPACING["3xl"],
  },
  finishedActions: {
    gap: SPACING.md,
    width: "100%",
  },
  restartBtn: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
  },
  restartGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  restartText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  backBtn: {
    borderWidth: 2,
    borderColor: COLORS.gray600,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  backBtnText: {
    color: COLORS.gray400,
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
});
