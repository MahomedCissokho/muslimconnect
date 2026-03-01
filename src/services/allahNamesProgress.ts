import AsyncStorage from "@react-native-async-storage/async-storage";

export interface QuizScore {
  timestamp: number;
  correct: number;
  total: number;
}

export interface AllahNamesProgress {
  learnedIds: number[];
  quizScores: QuizScore[];
}

const KEY = "@app/allah_names_progress";

const defaultProgress: AllahNamesProgress = {
  learnedIds: [],
  quizScores: [],
};

export const allahNamesService = {
  getProgress: async (): Promise<AllahNamesProgress> => {
    try {
      const json = await AsyncStorage.getItem(KEY);
      return json ? { ...defaultProgress, ...JSON.parse(json) } : { ...defaultProgress };
    } catch (e) {
      console.error("Failed to get allah names progress", e);
      return { ...defaultProgress };
    }
  },

  markLearned: async (nameNumber: number): Promise<void> => {
    try {
      const progress = await allahNamesService.getProgress();
      if (!progress.learnedIds.includes(nameNumber)) {
        progress.learnedIds.push(nameNumber);
        await AsyncStorage.setItem(KEY, JSON.stringify(progress));
      }
    } catch (e) {
      console.error("Failed to mark name as learned", e);
    }
  },

  unmarkLearned: async (nameNumber: number): Promise<void> => {
    try {
      const progress = await allahNamesService.getProgress();
      progress.learnedIds = progress.learnedIds.filter((id) => id !== nameNumber);
      await AsyncStorage.setItem(KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to unmark name", e);
    }
  },

  isLearned: async (nameNumber: number): Promise<boolean> => {
    const progress = await allahNamesService.getProgress();
    return progress.learnedIds.includes(nameNumber);
  },

  saveQuizScore: async (score: QuizScore): Promise<void> => {
    try {
      const progress = await allahNamesService.getProgress();
      progress.quizScores.push(score);
      // Keep only last 20 scores
      if (progress.quizScores.length > 20) {
        progress.quizScores = progress.quizScores.slice(-20);
      }
      await AsyncStorage.setItem(KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save quiz score", e);
    }
  },

  resetProgress: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (e) {
      console.error("Failed to reset progress", e);
    }
  },
};
