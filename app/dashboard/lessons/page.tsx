"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCourses } from "../../lib/courses";
import { getStoredUser } from "../../lib/auth";
import { useProgress } from "../../lib/progress";
import ZookoLoader from "../../components/ZookoLoader";
import {
  BookOpen,
  Loader2,
  Inbox,
  ArrowRight,
  GraduationCap,
  Layers,
  User,
  CheckCircle2,
  Search,
} from "lucide-react";

export default function CoursesPage() {
  const [userGrade, setUserGrade] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user?.grade) setUserGrade(user.grade);
  }, []);

  // Build array of all grades up to and including current grade
  const gradesList = useMemo(() => {
    if (!userGrade) return undefined;
    const num = parseInt(userGrade);
    if (isNaN(num)) return [userGrade];
    const list: string[] = [];
    for (let i = 1; i <= num; i++) list.push(String(i));
    return list;
  }, [userGrade]);

  const { data: courses, isLoading } = useCourses("", gradesList);
  const { data: progress } = useProgress();

  const filtered = courses?.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getProgress = (courseId: string, totalLessons: number) => {
    if (!progress || totalLessons === 0) return 0;
    const done = progress.lessonsCompleted?.filter((lc: any) => lc.courseId === courseId).length || 0;
    return Math.round((done / totalLessons) * 100);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1
            className="text-[24px] md:text-[28px] font-bold text-[var(--foreground)] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kurslarim
          </h1>
          <p className="text-[14px] md:text-[15px] text-[var(--foreground)]/50 mt-1.5">
            {userGrade ? `${userGrade}-sinf uchun kurslar` : "Barcha mavjud kurslar"}
            {courses && <span className="ml-1 font-semibold text-[var(--green-600)]">· {courses.length} ta</span>}
          </p>
        </div>

        {/* Search */}
        {courses && courses.length > 0 && (
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kurs qidirish..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[#73E2A7]/40 focus:border-[#73E2A7]/50 transition-all"
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <ZookoLoader text="Kurslar yuklanmoqda…" />
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="bg-[var(--card-bg)] rounded-2xl p-16 text-center shadow-sm border border-[var(--card-border)]">
          <div className="w-16 h-16 rounded-2xl bg-[var(--green-50)] flex items-center justify-center mx-auto mb-5">
            <Inbox size={28} className="text-[var(--green-600)]" />
          </div>
          <h3 className="text-[17px] font-bold text-[var(--foreground)] mb-1.5">
            {search ? "Hech narsa topilmadi" : "Hali kurslar yo'q"}
          </h3>
          <p className="text-[14px] text-[var(--foreground)]/40 max-w-xs mx-auto leading-relaxed">
            {search ? "Boshqa kalit so'z bilan qidirib ko'ring." : "O'qituvchingiz hali kurs qo'shmagan. Tez orada tekshirib ko'ring!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course, i) => {
            const pct = getProgress(course._id, course.lessons.length);
            const isComplete = pct === 100 && course.lessons.length > 0;

            return (
              <Link
                key={course._id}
                href={`/dashboard/lessons/${course._id}`}
                className={`group relative bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 animate-fade-in-up ${
                  isComplete
                    ? "border-[#73E2A7]/40 hover:border-[#73E2A7]/60"
                    : "border-[var(--card-border)] hover:border-[#73E2A7]/25"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Completed badge */}
                {isComplete && (
                  <div className="absolute top-5 right-5">
                    <div className="w-8 h-8 rounded-full bg-[#1C7C54] flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  </div>
                )}

                {/* Icon + grade */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-50)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen size={21} className="text-[var(--green-600)]" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-lg ${
                      course.grade === "all" ? "bg-blue-50 text-blue-500" : "bg-[var(--green-50)] text-[var(--green-600)]"
                    }`}>
                      {course.grade === "all" ? "Barchasi" : `${course.grade}-sinf`}
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--foreground)]/40">
                      <Layers size={13} /> {course.lessons.length} dars
                    </span>
                  </div>
                </div>

                {/* Title + description */}
                <h3 className="text-[17px] font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--green-600)] transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="text-[14px] text-[var(--foreground)]/45 line-clamp-2 leading-relaxed mb-5">
                  {course.description}
                </p>

                {/* Progress bar */}
                {course.lessons.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-semibold text-[var(--foreground)]/40">Progress</span>
                      <span className="text-[12px] font-bold text-[var(--green-600)] tabular-nums">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--green-50)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#73E2A7] to-[#1C7C54] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
                  <span className="flex items-center gap-1.5 text-[13px] text-[var(--foreground)]/40">
                    <User size={14} />
                    {course.createdBy?.firstName} {course.createdBy?.lastName}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--green-600)] group-hover:translate-x-0.5 transition-transform">
                    Ochish <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
