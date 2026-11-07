import { useQuery, useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
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

// The server hides answers until a block is answered; once it is, the submit
// response carries the full block so the lesson can show the correct answer.
function revealAnsweredBlock(
  qc: QueryClient,
  { courseId, lessonId, contentId }: { courseId: string; lessonId: string; contentId: string },
  block: any,
) {
  if (!block) return;
  qc.setQueryData(["course", courseId], (course: any) => course && ({
    ...course,
    lessons: course.lessons.map((l: any) => l._id !== lessonId ? l : ({
      ...l,
      content: l.content.map((c: any) => c._id === contentId ? block : c),
    })),
  }));
}

export function useSubmitQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: string; lessonId: string; contentId: string; selectedIndex: number }) => {
      const { data } = await api.post("/progress/submit-quiz", payload);
      return data;
    },
    onSuccess: (data, vars) => {
      revealAnsweredBlock(qc, vars, data?.block);
      qc.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

export function useSubmitInteractive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { courseId: string; lessonId: string; contentId: string; answer: any }) => {
      const { data } = await api.post("/progress/submit-interactive", payload);
      return data;
    },
    onSuccess: (data, vars) => {
      revealAnsweredBlock(qc, vars, data?.block);
      qc.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

export function useCheckPair() {
  return useMutation({
    mutationFn: async (payload: { courseId: string; lessonId: string; contentId: string; left: string; right: string }) => {
      const { data } = await api.post("/progress/check-pair", payload);
      return data as { correct: boolean };
    },
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
