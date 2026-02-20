import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export type MyExam = {
  _id: string;
  title: string;
  description: string;
  assignmentType: string;
  questions: any[];
  totalPoints: number;
  settings: {
    startTime: string;
    endTime: string;
    shuffleQuestions: boolean;
    showResults: boolean;
    maxAttempts: number;
    passingScore: number;
  };
  status: string;
  myResult: {
    _id: string;
    status: "in_progress" | "submitted" | "graded";
    totalScore: number;
    percentage: number;
  } | null;
};

export type ExamData = {
  exam: {
    _id: string;
    title: string;
    questions: any[];
    totalPoints: number;
    settings: any;
  };
  result: {
    _id: string;
    status: string;
    answers: any[];
  };
};

export function useMyExams() {
  return useQuery<MyExam[]>({
    queryKey: ["my-exams"],
    queryFn: async () => {
      const { data } = await api.get("/nazorat-ishi/student/my-exams");
      return data;
    },
  });
}

export function useStartExam() {
  return useMutation({
    mutationFn: async (examId: string) => {
      const { data } = await api.post(`/nazorat-ishi/student/${examId}/start`);
      return data as ExamData;
    },
  });
}

export function useSubmitExam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ examId, answers }: { examId: string; answers: { questionId: string; answer: any }[] }) => {
      const { data } = await api.post(`/nazorat-ishi/student/${examId}/submit`, { answers });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-exams"] }),
  });
}

export function useReportViolation() {
  return useMutation({
    mutationFn: async ({ examId, type, details }: { examId: string; type: string; details?: string }) => {
      const { data } = await api.post(`/nazorat-ishi/student/${examId}/violation`, { type, details });
      return data;
    },
  });
}

export function useMyResult(examId: string | null) {
  return useQuery({
    queryKey: ["my-result", examId],
    queryFn: async () => {
      const { data } = await api.get(`/nazorat-ishi/student/${examId}/my-result`);
      return data;
    },
    enabled: !!examId,
  });
}
