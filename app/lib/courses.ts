import { useQuery } from "@tanstack/react-query";
import api from "./api";

export type ContentBlock = {
  _id: string;
  type: "video" | "image" | "text" | "quiz" | "code_challenge" | "fill_blank" | "match_words" | "scratch_blocks";
  data: string;
  question?: string;
  options?: { _id?: string; text: string }[];
  correctIndex?: number;
  xpReward?: number;
  imageSize?: "small" | "medium" | "large" | "full";
  codeTemplate?: string;
  expectedOutput?: string;
  language?: "javascript" | "python";
  hint?: string;
  blankText?: string;
  blanks?: string[];
  pairs?: { _id?: string; left: string; right: string }[];
  scratchInstruction?: string;
  scratchBlocks?: { _id?: string; text: string; order: number }[];
  order: number;
};

export type Lesson = {
  _id: string;
  title: string;
  description: string;
  content: ContentBlock[];
  order: number;
};

export type Course = {
  _id: string;
  title: string;
  description: string;
  grade: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
};

export function useCourses(grade = "") {
  return useQuery<Course[]>({
    queryKey: ["courses", grade],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (grade) params.grade = grade;
      const { data } = await api.get("/courses", { params });
      return data;
    },
  });
}

export function useCourse(id: string) {
  return useQuery<Course>({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

