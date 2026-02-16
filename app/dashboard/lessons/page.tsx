"use client";

import { useState, useEffect } from "react";
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

  const { data: courses, isLoading } = useCourses(userGrade || "");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1
            className="text-[22px] md:text-[26px] font-bold text-[var(--foreground)] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kurslarim
          </h1>
          <p className="text-[14px] text-[var(--foreground)]/50 mt-1">
            {userGrade ? `${userGrade}-sinf uchun kurslar` : "Barcha mavjud kurslar"}
            {courses && <span className="ml-1 font-semibold text-[var(--green-600)]">· {courses.length} ta</span>}
          </p>
        </div>

        {/* Search */}
        {courses && courses.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kurs qidirish..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[#73E2A7]/40 focus:border-[#73E2A7]/50 transition-all"
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <ZookoLoader text="Kurslar yuklanmoqda…" />
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="bg-[var(--card-bg)] rounded-2xl p-14 text-center shadow-sm border border-[var(--card-border)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--green-50)] flex items-center justify-center mx-auto mb-4">
            <Inbox size={24} className="text-[var(--green-600)]" />
          </div>
          <h3 className="text-[16px] font-bold text-[var(--foreground)] mb-1">
            {search ? "Hech narsa topilmadi" : "Hali kurslar yo'q"}
          </h3>
          <p className="text-[13px] text-[var(--foreground)]/40 max-w-xs mx-auto">
            {search ? "Boshqa kalit so'z bilan qidirib ko'ring." : "O'qituvchingiz hali kurs qo'shmagan. Tez orada tekshirib ko'ring!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((course, i) => {
            const pct = getProgress(course._id, course.lessons.length);
            const isComplete = pct === 100 && course.lessons.length > 0;

            return (
              <Link
                key={course._id}
                href={`/dashboard/lessons/${course._id}`}
                className={`group relative bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 animate-fade-in-up ${
                  isComplete
                    ? "border-[#73E2A7]/40 hover:border-[#73E2A7]/60"
                    : "border-[var(--card-border)] hover:border-[#73E2A7]/25"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Completed badge */}
                {isComplete && (
                  <div className="absolute top-4 right-4">
                    <div className="w-7 h-7 rounded-full bg-[#1C7C54] flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  </div>
                )}

                {/* Icon + grade */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[var(--green-50)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen size={18} className="text-[var(--green-600)]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      course.grade === "all" ? "bg-blue-50 text-blue-500" : "bg-[var(--green-50)] text-[var(--green-600)]"
                    }`}>
                      {course.grade === "all" ? "Barchasi" : `${course.grade}-sinf`}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--foreground)]/35">
                      <Layers size={11} /> {course.lessons.length} dars
                    </span>
                  </div>
                </div>

                {/* Title + description */}
                <h3 className="text-[16px] font-bold text-[var(--foreground)] mb-1.5 group-hover:text-[var(--green-600)] transition-colors leading-snug">
                  {course.title}
                </h3>
                <p className="text-[13px] text-[var(--foreground)]/45 line-clamp-2 leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Progress bar */}
                {course.lessons.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-[var(--foreground)]/40">Progress</span>
                      <span className="text-[11px] font-bold text-[var(--green-600)] tabular-nums">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--green-50)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#73E2A7] to-[#1C7C54] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--card-border)]">
                  <span className="flex items-center gap-1.5 text-[12px] text-[var(--foreground)]/35">
                    <User size={12} />
                    {course.createdBy?.firstName} {course.createdBy?.lastName}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-[var(--green-600)] group-hover:translate-x-0.5 transition-transform">
                    Ochish <ArrowRight size={13} />
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
