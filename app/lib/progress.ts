import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export type Badge = {
  _id?: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
};

export type LessonCompleted = {
  courseId: string;
  lessonId: string;
  completedAt: string;
  xpEarned: number;
};

export type QuizScore = {
  courseId: string;
  lessonId: string;
  contentId: string;
  correct: boolean;
  xpEarned: number;
  answeredAt: string;
};

export type Progress = {
  _id: string;
  userId: string;
  totalXP: number;
  level: string;
  lessonsCompleted: LessonCompleted[];
  quizScores: QuizScore[];
  badges: Badge[];
  streak: number;
  lastLoginDate: string;
};

export type LeaderboardEntry = {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    grade: string;
  };
  totalXP: number;
  level: string;
};

export const LEVELS = [
  { name: "Boshlang'ich", minXP: 0, maxXP: 99 },
  { name: "Kashfiyotchi", minXP: 100, maxXP: 299 },
  { name: "Dasturchi", minXP: 300, maxXP: 599 },
  { name: "Xaker", minXP: 600, maxXP: 999 },
  { name: "Usta", minXP: 1000, maxXP: Infinity },
];

export function getLevelInfo(xp: number) {
  const level = LEVELS.find((l) => xp >= l.minXP && xp <= l.maxXP) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const progressInLevel = xp - level.minXP;
  const levelRange = (nextLevel ? nextLevel.minXP : level.minXP + 500) - level.minXP;
  return { level: level.name, progress: progressInLevel / levelRange, nextLevel: nextLevel?.name, xpToNext: nextLevel ? nextLevel.minXP - xp : 0 };
}

export function useProgress() {
  return useQuery<Progress>({
    queryKey: ["progress"],
    queryFn: async () => {
      const { data } = await api.get("/progress/me");
      return data;
    },
  });
}

export function useCompleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: string; lessonId: string }) => {
      const { data } = await api.post("/progress/complete-lesson", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useSubmitQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: string; lessonId: string; contentId: string; selectedIndex: number }) => {
      const { data } = await api.post("/progress/submit-quiz", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useSubmitInteractive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: string; lessonId: string; contentId: string; answer: any }) => {
      const { data } = await api.post("/progress/submit-interactive", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useClaimDailyLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/progress/daily-login");
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["progress"] }),
  });
}

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await api.get("/progress/leaderboard");
      return data;
    },
  });
}
