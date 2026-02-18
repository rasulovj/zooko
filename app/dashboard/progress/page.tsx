"use client";

import { useMemo } from "react";
import ZookoLoader from "../../components/ZookoLoader";
import {
  BookOpen,
  Flame,
  CheckCircle2,
  Trophy,
  Target,
  TrendingUp,
  Award,
  BarChart3,
  Zap,
  User,
  Calendar,
} from "lucide-react";
import { useProgress, useLeaderboard, getLevelInfo } from "../../lib/progress";
import { useCourses } from "../../lib/courses";
import { getStoredUser } from "../../lib/auth";
import ZCIcon from "../../components/ZCIcon";
import { getMonthName, getWeekdayShort, formatDate } from "../../lib/dateUtils";

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, iconBg, iconColor, value, label, suffix, delay }: {
  icon: any; iconBg: string; iconColor: string; value: string | number; label: string; suffix?: string; delay: string;
}) {
  return (
    <div className={`group bg-[var(--card-bg)] rounded-2xl p-4 md:p-5 shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-[#73E2A7]/25 transition-all duration-300 animate-fade-in-up ${delay}`}>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={18} className={iconColor} strokeWidth={2} />
      </div>
      <p className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        {value}{suffix && <span className="text-sm font-semibold text-[var(--foreground)]/40 ml-1">{suffix}</span>}
      </p>
      <p className="text-[12px] md:text-[13px] font-medium text-[var(--foreground)]/50 mt-0.5">{label}</p>
    </div>
  );
}

/* ─── Level Progress ─── */
function LevelProgress({ progress }: { progress: any }) {
  const levelInfo = getLevelInfo(progress.totalXP);

  return (
    <div className="bg-gradient-to-br from-[#1B512D] to-[#1C7C54] rounded-2xl p-5 md:p-6 shadow-lg relative overflow-hidden animate-fade-in-up delay-300 h-full flex flex-col justify-center">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#73E2A7]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#73E2A7]/8 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <TrendingUp size={22} className="text-[#73E2A7]" />
            </div>
            <div>
              <p className="text-[12px] font-medium text-white/50">Sizning darajangiz</p>
              <p className="text-[20px] font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{levelInfo.level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[28px] font-bold text-[#73E2A7]" style={{ fontFamily: "var(--font-display)" }}>{Math.round(levelInfo.progress * 100)}%</p>
          </div>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#73E2A7] to-[#DEF4C6] rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(levelInfo.progress * 100, 100)}%` }}
          />
        </div>
        <p className="text-[13px] text-white/50">
          {levelInfo.nextLevel
            ? <>{levelInfo.xpToNext} ZC qoldi <span className="font-semibold text-[#73E2A7]">&ldquo;{levelInfo.nextLevel}&rdquo;</span> darajasiga</>
            : <span className="font-semibold text-[#73E2A7]">Maksimal daraja erishildi! 🎉</span>
          }
        </p>
      </div>
    </div>
  );
}

/* ─── Quiz Accuracy ─── */
function QuizAccuracy({ progress }: { progress: any }) {
  const { correct, total, pct } = useMemo(() => {
    const scores = progress.quizScores || [];
    const c = scores.filter((q: any) => q.correct).length;
    const t = scores.length;
    return { correct: c, total: t, pct: t > 0 ? Math.round((c / t) * 100) : 0 };
  }, [progress.quizScores]);

  const wrong = total - correct;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (circumference * pct) / 100;

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 md:p-6 shadow-sm border border-[var(--card-border)] animate-fade-in-up delay-400 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Target size={16} className="text-emerald-500" />
        </div>
        <h3 className="text-[15px] font-bold text-[var(--foreground)]">Quiz natijalari</h3>
      </div>

      {total === 0 ? (
        <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
          <Target size={28} className="text-[var(--foreground)]/15 mx-auto mb-2" />
          <p className="text-[13px] text-[var(--foreground)]/40">Hali quiz yechilmagan</p>
        </div>
      ) : (
        <div className="flex items-center gap-6 flex-1">
          {/* Ring chart */}
          <div className="relative flex-shrink-0">
            <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
              <circle cx="64" cy="64" r="54" fill="none" stroke="var(--green-50)" strokeWidth="10" />
              <circle
                cx="64" cy="64" r="54" fill="none"
                stroke="#1C7C54" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>{pct}%</span>
              <span className="text-[10px] font-medium text-[var(--foreground)]/40">aniqlik</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1C7C54]" />
                <span className="text-[13px] font-medium text-[var(--foreground)]/70">To&apos;g&apos;ri</span>
              </div>
              <span className="text-[14px] font-bold text-[var(--foreground)]">{correct}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-[13px] font-medium text-[var(--foreground)]/70">Noto&apos;g&apos;ri</span>
              </div>
              <span className="text-[14px] font-bold text-[var(--foreground)]">{wrong}</span>
            </div>
            <div className="pt-2 border-t border-[var(--card-border)]">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[var(--foreground)]/70">Jami</span>
                <span className="text-[14px] font-bold text-[var(--foreground)]">{total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Course Progress ─── */
function CourseProgressSection({ progress, courses }: { progress: any; courses: any[] }) {
  const courseStats = useMemo(() => {
    if (!courses) return [];
    return courses.map((course, idx) => {
      const completedLessons = progress.lessonsCompleted?.filter(
        (lc: any) => lc.courseId === course._id
      ).length || 0;
      const totalLessons = course.lessons.length;
      const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const courseQuizzes = progress.quizScores?.filter((q: any) => q.courseId === course._id) || [];
      const correctQuizzes = courseQuizzes.filter((q: any) => q.correct).length;
      const xpEarned = (progress.lessonsCompleted?.filter((lc: any) => lc.courseId === course._id) || [])
        .reduce((sum: number, lc: any) => sum + (lc.xpEarned || 0), 0)
        + courseQuizzes.reduce((sum: number, q: any) => sum + (q.xpEarned || 0), 0);
      return { course, completedLessons, totalLessons, pct, correctQuizzes, totalQuizzes: courseQuizzes.length, xpEarned, idx };
    });
  }, [courses, progress]);

  const colors = [
    { gradient: "from-emerald-500 to-green-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    { gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-600" },
    { gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", text: "text-amber-600" },
    { gradient: "from-purple-500 to-violet-600", bg: "bg-purple-50", text: "text-purple-600" },
    { gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50", text: "text-pink-600" },
    { gradient: "from-cyan-500 to-teal-600", bg: "bg-cyan-50", text: "text-cyan-600" },
  ];

  return (
    <div className="animate-fade-in-up delay-500">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <BookOpen size={16} className="text-blue-500" />
        </div>
        <h3 className="text-[17px] font-bold text-[var(--foreground)]">Kurs bo&apos;yicha natijalar</h3>
      </div>

      {courseStats.length === 0 ? (
        <div className="bg-[var(--card-bg)] rounded-2xl p-10 text-center shadow-sm border border-[var(--card-border)]">
          <BookOpen size={28} className="text-[var(--foreground)]/15 mx-auto mb-2" />
          <p className="text-[13px] text-[var(--foreground)]/40">Hali kurslar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {courseStats.map(({ course, completedLessons, totalLessons, pct, correctQuizzes, totalQuizzes, xpEarned, idx }) => {
            const c = colors[idx % colors.length];
            return (
              <div
                key={course._id}
                className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-[#73E2A7]/25 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-[var(--foreground)] leading-snug line-clamp-2">{course.title}</h4>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5 ${c.bg} ${c.text}`}>
                      {course.grade === "all" ? "Barchasi" : `${course.grade}-sinf`}
                    </span>
                  </div>
                  <span className="text-[20px] font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-[var(--green-50)] rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full bg-gradient-to-r ${c.gradient} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-xl bg-[var(--hover-bg)]">
                    <p className="text-[14px] font-bold text-[var(--foreground)]">{completedLessons}/{totalLessons}</p>
                    <p className="text-[10px] font-medium text-[var(--foreground)]/40 mt-0.5">Darslar</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[var(--hover-bg)]">
                    <p className="text-[14px] font-bold text-[var(--foreground)]">{correctQuizzes}/{totalQuizzes}</p>
                    <p className="text-[10px] font-medium text-[var(--foreground)]/40 mt-0.5">Quizlar</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[var(--hover-bg)]">
                    <p className="text-[14px] font-bold text-[var(--foreground)] flex items-center justify-center gap-0.5"><ZCIcon size={12} />{xpEarned}</p>
                    <p className="text-[10px] font-medium text-[var(--foreground)]/40 mt-0.5">ZC</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Activity Heatmap ─── */
function ActivityHeatmap({ progress }: { progress: any }) {
  const { weeks, monthLabels, totalActiveDays, maxCount } = useMemo(() => {
    const today = new Date();
    const dayMap = new Map<string, number>();

    const toLocalKey = (d: Date | string) => {
      const dt = new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    };

    for (const lc of progress.lessonsCompleted || []) {
      const key = toLocalKey(lc.completedAt);
      dayMap.set(key, (dayMap.get(key) || 0) + 1);
    }
    for (const qs of progress.quizScores || []) {
      const key = toLocalKey(qs.answeredAt);
      dayMap.set(key, (dayMap.get(key) || 0) + 1);
    }

    const todayKey = toLocalKey(today);
    const totalWeeks = 20;
    const weeksArr: { date: Date; count: number; key: string }[][] = [];
    const mLabels: { label: string; col: number }[] = [];
    const seenMonths = new Set<string>();
    let activeDays = 0;
    let maxC = 0;

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (totalWeeks * 7 - 1) - startDate.getDay());

    for (let w = 0; w < totalWeeks; w++) {
      const week: { date: Date; count: number; key: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);
        const key = toLocalKey(date);
        const count = dayMap.get(key) || 0;
        if (count > 0 && key <= todayKey) activeDays++;
        if (count > maxC) maxC = count;
        week.push({ date, count, key });

        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!seenMonths.has(monthKey) && d === 0) {
          seenMonths.add(monthKey);
          mLabels.push({
            label: getMonthName(date, true),
            col: w,
          });
        }
      }
      weeksArr.push(week);
    }

    return { weeks: weeksArr, monthLabels: mLabels, totalActiveDays: activeDays, maxCount: maxC };
  }, [progress]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-[var(--green-50)]/50";
    if (count === 1) return "bg-[#73E2A7]/35";
    if (count <= 3) return "bg-[#73E2A7]/65";
    return "bg-[#1C7C54]";
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 md:p-6 shadow-sm border border-[var(--card-border)] animate-fade-in-up delay-500 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--green-50)] flex items-center justify-center">
          <Calendar size={16} className="text-[var(--green-600)]" />
        </div>
        <h3 className="text-[15px] font-bold text-[var(--foreground)]">Faollik xaritasi</h3>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px] font-bold text-[var(--green-600)]">{totalActiveDays} faol kun</span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto scrollbar-hide">
        {/* Month labels row */}
        <div className="grid gap-[3px] mb-1.5" style={{ gridTemplateColumns: `20px repeat(${weeks.length}, 1fr)` }}>
          <div />
          {weeks.map((week, wi) => {
            const ml = monthLabels.find((m) => m.col === wi);
            return (
              <div key={wi} className="text-[10px] font-medium text-[var(--foreground)]/35 truncate">
                {ml ? ml.label : ""}
              </div>
            );
          })}
        </div>

        {/* Heatmap grid */}
        {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
          <div key={dayIdx} className="grid gap-[3px] mb-[3px]" style={{ gridTemplateColumns: `20px repeat(${weeks.length}, 1fr)` }}>
            <div className="text-[9px] font-medium text-[var(--foreground)]/30 flex items-center justify-end pr-1">
              {dayIdx === 1 ? "Du" : dayIdx === 3 ? "Ch" : dayIdx === 5 ? "Ju" : ""}
            </div>
            {weeks.map((week, wi) => {
              const day = week[dayIdx];
              if (!day) return <div key={wi} />;
              const now = new Date();
              const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
              const isToday = day.key === todayKey;
              const isFuture = day.key > todayKey;
              return (
                <div
                  key={wi}
                  className={`aspect-square rounded-[3px] transition-colors min-h-[10px] max-h-[18px] ${
                    isFuture ? "bg-transparent" : getColor(day.count)
                  } ${isToday ? "ring-[1.5px] ring-[var(--green-600)] ring-offset-1 ring-offset-[var(--card-bg)]" : ""}`}
                  title={`${day.key}: ${day.count} faoliyat`}
                />
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--card-border)]">
          <span className="text-[10px] font-medium text-[var(--foreground)]/30">So&apos;nggi 20 hafta</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-[var(--foreground)]/30">Kam</span>
            {[0, 1, 2, 4].map((c) => (
              <div key={c} className={`w-[11px] h-[11px] rounded-[3px] ${getColor(c)}`} />
            ))}
            <span className="text-[10px] font-medium text-[var(--foreground)]/30">Ko&apos;p</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Streak Tracker ─── */
function StreakTracker({ progress }: { progress: any }) {
  const streakDays = useMemo(() => {
    const today = new Date();
    const days: { label: string; active: boolean; isToday: boolean }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayLabel = getWeekdayShort(d);
      const dateStr = d.toISOString().split("T")[0];

      const hasActivity =
        (progress.lessonsCompleted || []).some((lc: any) => new Date(lc.completedAt).toISOString().split("T")[0] === dateStr) ||
        (progress.quizScores || []).some((q: any) => new Date(q.answeredAt).toISOString().split("T")[0] === dateStr) ||
        progress.lastLoginDate === dateStr;

      days.push({ label: dayLabel, active: hasActivity, isToday: i === 0 });
    }
    return days;
  }, [progress]);

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)] animate-fade-in-up delay-400 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
          <Flame size={16} className="text-orange-500" />
        </div>
        <h3 className="text-[15px] font-bold text-[var(--foreground)]">Davomiylik</h3>
        <div className="ml-auto flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl">
          <Flame size={14} className="text-orange-500" />
          <span className="text-[15px] font-bold text-orange-600" style={{ fontFamily: "var(--font-display)" }}>{progress.streak || 0}</span>
          <span className="text-[11px] font-medium text-orange-400">kun</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-1">
        {streakDays.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2.5 flex-1">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all ${day.active
                ? "bg-gradient-to-br from-orange-400 to-amber-500 shadow-md shadow-orange-200/50"
                : day.isToday
                  ? "bg-[var(--green-50)] border-2 border-dashed border-[var(--green-300)]"
                  : "bg-[var(--hover-bg)] border border-[var(--card-border)]"
              }`}>
              {day.active ? (
                <Flame size={18} className="text-white" />
              ) : day.isToday ? (
                <Zap size={16} className="text-[var(--green-600)]" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[var(--foreground)]/8" />
              )}
            </div>
            <span className={`text-[10px] font-semibold ${day.isToday ? "text-[var(--green-600)]" : "text-[var(--foreground)]/35"
              }`}>{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Leaderboard ─── */
function LeaderboardSection() {
  const { data: leaders } = useLeaderboard();
  const user = getStoredUser();

  const rankColors = [
    "bg-amber-50 text-amber-600 ring-amber-200",
    "bg-slate-50 text-slate-500 ring-slate-200",
    "bg-orange-50 text-orange-500 ring-orange-200",
  ];

  const userRank = useMemo(() => {
    if (!leaders || !user) return null;
    const idx = leaders.findIndex((e) => e.userId?._id === user._id);
    return idx >= 0 ? idx + 1 : null;
  }, [leaders, user]);

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 md:p-6 shadow-sm border border-[var(--card-border)] animate-fade-in-up delay-600 h-full">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Trophy size={16} className="text-amber-500" />
        </div>
        <h3 className="text-[15px] font-bold text-[var(--foreground)]">Sinf reytingi</h3>
        {userRank && (
          <span className="ml-auto text-[12px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
            #{userRank} o&apos;rin
          </span>
        )}
      </div>

      <div className="space-y-1">
        {leaders && leaders.length > 0 ? leaders.slice(0, 10).map((entry, i) => {
          const isYou = entry.userId?._id === user?._id;
          return (
            <div
              key={entry._id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isYou
                  ? "bg-[var(--green-50)]/60 ring-1 ring-[#73E2A7]/30"
                  : "hover:bg-[var(--hover-bg)]"
                }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${i < 3 ? `ring-1 ${rankColors[i]}` : "bg-[var(--hover-bg)] text-[var(--foreground)]/40"
                }`}>
                {i + 1}
              </div>
              <div className="w-7 h-7 rounded-full bg-[var(--green-50)] flex items-center justify-center flex-shrink-0">
                <User size={13} className="text-[var(--green-600)]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[13px] truncate block ${isYou ? "font-bold text-[var(--green-600)]" : "font-medium text-[var(--foreground)]/75"}`}>
                  {entry.userId?.firstName} {entry.userId?.lastName}
                  {isYou && <span className="text-[11px] text-[var(--green-600)]/60 ml-1">(Siz)</span>}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[12px] font-bold text-[var(--foreground)]/45 tabular-nums flex-shrink-0">
                <ZCIcon size={12} />{entry.totalXP.toLocaleString()}
              </span>
            </div>
          );
        }) : (
          <div className="text-center py-8">
            <Trophy size={24} className="text-[var(--foreground)]/15 mx-auto mb-2" />
            <p className="text-[13px] text-[var(--foreground)]/40">Reyting mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Badges ─── */
function BadgesSection({ progress }: { progress: any }) {
  return (
    <div className="animate-fade-in-up delay-600 h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <Award size={16} className="text-purple-500" />
        </div>
        <h3 className="text-[17px] font-bold text-[var(--foreground)]">Nishonlar</h3>
        {progress.badges?.length > 0 && (
          <span className="ml-auto text-[12px] font-bold text-purple-500 bg-purple-50 px-2.5 py-1 rounded-lg">
            {progress.badges.length} ta
          </span>
        )}
      </div>
      {!progress.badges || progress.badges.length === 0 ? (
        <div className="bg-[var(--card-bg)] rounded-2xl p-10 text-center shadow-sm border border-[var(--card-border)] h-[calc(100%-44px)] flex flex-col items-center justify-center">
          <Award size={28} className="text-[var(--foreground)]/15 mx-auto mb-2" />
          <p className="text-[13px] text-[var(--foreground)]/40">Hali nishon yo&apos;q</p>
          <p className="text-[11px] text-[var(--foreground)]/25 mt-1">Darslarni bajaring va nishonlar yutib oling!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {progress.badges.map((badge: any) => (
            <div
              key={badge.key}
              className="bg-[var(--card-bg)] rounded-2xl p-4 text-center shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-purple-200/50 hover:scale-[1.02] transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100 to-violet-50 flex items-center justify-center mx-auto mb-2.5">
                <Award size={20} className="text-purple-500" />
              </div>
              <p className="text-[13px] font-bold text-[var(--foreground)]">{badge.title}</p>
              <p className="text-[11px] text-[var(--foreground)]/40 mt-0.5 leading-snug">{badge.description}</p>
              <p className="text-[10px] text-[var(--foreground)]/25 mt-1.5">
                {formatDate(badge.earnedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Activity Timeline ─── */
function ActivityTimeline({ progress, courses }: { progress: any; courses: any[] }) {
  const activities = useMemo(() => {
    const items: { type: "lesson" | "quiz"; courseId: string; date: string; xp: number; correct?: boolean }[] = [];

    for (const lc of progress.lessonsCompleted || []) {
      items.push({ type: "lesson", courseId: lc.courseId, date: lc.completedAt, xp: lc.xpEarned || 0 });
    }
    for (const qs of progress.quizScores || []) {
      items.push({ type: "quiz", courseId: qs.courseId, date: qs.answeredAt, xp: qs.xpEarned || 0, correct: qs.correct });
    }

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return items.slice(0, 15);
  }, [progress]);

  const getCourseTitle = (courseId: string) => courses?.find((c) => c._id === courseId)?.title || "";

  if (activities.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] rounded-2xl p-10 text-center shadow-sm border border-[var(--card-border)] animate-fade-in-up delay-700">
        <Target size={28} className="text-[var(--foreground)]/15 mx-auto mb-2" />
        <p className="text-[13px] text-[var(--foreground)]/40">Hali faoliyat yo&apos;q. O&apos;rganishni boshlang!</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up delay-700">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[var(--green-50)] flex items-center justify-center">
          <BarChart3 size={16} className="text-[var(--green-600)]" />
        </div>
        <h3 className="text-[17px] font-bold text-[var(--foreground)]">So&apos;nggi faoliyat</h3>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--card-border)] divide-y divide-[var(--card-border)]">
        {activities.map((act, i) => {
          const courseTitle = getCourseTitle(act.courseId);
          return (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--hover-bg)] transition-colors">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${act.type === "lesson"
                  ? "bg-emerald-50"
                  : act.correct ? "bg-green-50" : "bg-red-50"
                }`}>
                {act.type === "lesson" ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : act.correct ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Target size={16} className="text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[var(--foreground)]">
                  <span className="font-semibold">
                    {act.type === "lesson" ? "Dars yakunlandi" : act.correct ? "Quiz to'g'ri" : "Quiz noto'g'ri"}
                  </span>
                  {courseTitle && <span className="text-[var(--foreground)]/40"> · {courseTitle}</span>}
                </p>
                <p className="text-[11px] text-[var(--foreground)]/30 mt-0.5">
                  {formatDate(act.date, true)}
                </p>
              </div>
              {act.xp > 0 && (
                <span className="flex items-center gap-1 text-[12px] font-bold text-[var(--green-600)] bg-[var(--green-50)] px-2.5 py-1 rounded-lg flex-shrink-0 tabular-nums">
                  +{act.xp} ZC
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ─── Main Page ─── */
/* ═══════════════════════════════════════════ */
export default function ProgressPage() {
  const user = getStoredUser();
  const { data: progress, isLoading } = useProgress();
  const { data: courses } = useCourses(user?.grade || "");

  const { completedCount, correctQuizzes, totalQuizzes, quizPct } = useMemo(() => {
    if (!progress) return { completedCount: 0, correctQuizzes: 0, totalQuizzes: 0, quizPct: 0 };
    const cc = progress.lessonsCompleted?.length || 0;
    const cq = progress.quizScores?.filter((q) => q.correct).length || 0;
    const tq = progress.quizScores?.length || 0;
    return { completedCount: cc, correctQuizzes: cq, totalQuizzes: tq, quizPct: tq > 0 ? Math.round((cq / tq) * 100) : 0 };
  }, [progress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ZookoLoader text="Yuklanmoqda…" />
      </div>
    );
  }

  if (!progress) return null;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-[22px] md:text-[28px] font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Natijalar
        </h1>
        <p className="text-[13px] md:text-[15px] text-[var(--foreground)]/55 mt-1">
          O&apos;rganish natijalaringiz va yutuqlaringiz.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={BookOpen} iconBg="bg-[var(--green-50)]" iconColor="text-[var(--green-600)]" value={completedCount} label="Bajarilgan darslar" delay="delay-100" />
        <StatCard icon={Flame} iconBg="bg-orange-50" iconColor="text-orange-500" value={progress.streak || 0} label="Davomiylik" suffix="kun" delay="delay-200" />
        <StatCard icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-500" value={`${quizPct}%`} label="Quiz aniqligi" delay="delay-300" />
        <div className="group bg-[var(--card-bg)] rounded-2xl p-4 md:p-5 shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-[#73E2A7]/25 transition-all duration-300 animate-fade-in-up delay-400">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <ZCIcon size={22} />
          </div>
          <p className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {(progress.totalXP || 0).toLocaleString()}
          </p>
          <p className="text-[12px] md:text-[13px] font-medium text-[var(--foreground)]/50 mt-0.5">Jami ZC</p>
        </div>
      </div>

      {/* Level + Streak row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <LevelProgress progress={progress} />
        </div>
        <div className="xl:col-span-2">
          <StreakTracker progress={progress} />
        </div>
      </div>

      {/* Heatmap + Quiz row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ActivityHeatmap progress={progress} />
        </div>
        <div className="xl:col-span-2">
          <QuizAccuracy progress={progress} />
        </div>
      </div>

      {/* Course progress - full width */}
      <CourseProgressSection progress={progress} courses={courses || []} />

      {/* Leaderboard + Badges row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2">
          <LeaderboardSection />
        </div>
        <div className="xl:col-span-3">
          <BadgesSection progress={progress} />
        </div>
      </div>

      {/* Activity timeline - full width */}
      <ActivityTimeline progress={progress} courses={courses || []} />
    </div>
  );
}
