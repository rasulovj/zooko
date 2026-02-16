"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCourses } from "../lib/courses";
import { getStoredUser } from "../lib/auth";
import { useProgress, useClaimDailyLogin, useLeaderboard, getLevelInfo } from "../lib/progress";
import {
  BookOpen,
  Flame,
  CheckCircle2,
  Trophy,
  CalendarDays,
  Lightbulb,
  Bug,
  Binary,
  KeyRound,
  FileEdit,
  Globe,
  RefreshCw,
  Package,
  ArrowRight,
  Award,
  Clock,
  User,
  TrendingUp,
  Target,
} from "lucide-react";
import ZCIcon from "../components/ZCIcon";

/* ─── Mini Calendar ─── */
function MiniCalendar({ progress }: { progress: any }) {
  const [currentDate] = useState(new Date());
  const today = currentDate.getDate();
  const month = currentDate.toLocaleString("uz-UZ", { month: "long" });
  const year = currentDate.getFullYear();

  const firstDay = new Date(year, currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  const activeDays = useMemo(() => {
    if (!progress) return new Set<number>();
    const days = new Set<number>();
    const cm = currentDate.getMonth();
    const cy = currentDate.getFullYear();
    for (const lc of progress.lessonsCompleted || []) {
      const d = new Date(lc.completedAt);
      if (d.getMonth() === cm && d.getFullYear() === cy) days.add(d.getDate());
    }
    for (const qs of progress.quizScores || []) {
      const d = new Date(qs.answeredAt);
      if (d.getMonth() === cm && d.getFullYear() === cy) days.add(d.getDate());
    }
    if (progress.lastLoginDate) {
      const d = new Date(progress.lastLoginDate);
      if (d.getMonth() === cm && d.getFullYear() === cy) days.add(d.getDate());
    }
    return days;
  }, [progress, currentDate]);

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--green-50)] flex items-center justify-center">
            <CalendarDays size={16} className="text-[var(--green-600)]" />
          </div>
          <h3 className="text-[15px] font-bold text-[var(--foreground)]">{month} {year}</h3>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"].map((d) => (
          <div key={d} className="text-[11px] font-semibold text-[var(--foreground)]/35 pb-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }, (_, i) => <div key={`b-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = day === today;
          const isActive = activeDays.has(day);
          return (
            <div
              key={day}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-all ${
                isToday
                  ? "bg-[#1C7C54] text-white shadow-md shadow-[#1C7C54]/25"
                  : isActive
                    ? "bg-[var(--green-50)] text-[var(--green-600)] ring-1 ring-[#73E2A7]/40"
                    : day < today ? "text-[var(--foreground)]/25" : "text-[var(--foreground)]/50"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--card-border)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1C7C54]" />
            <span className="text-[11px] font-medium text-[var(--foreground)]/40">Bugun</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--green-50)] ring-1 ring-[#73E2A7]/50" />
            <span className="text-[11px] font-medium text-[var(--foreground)]/40">Faol</span>
          </div>
        </div>
        <span className="text-[12px] font-bold text-[var(--green-600)]">{activeDays.size} kun</span>
      </div>
    </div>
  );
}

/* ─── Leaderboard ─── */
function Leaderboard() {
  const { data: leaders } = useLeaderboard();
  const user = getStoredUser();

  const rankColors = [
    "bg-amber-50 text-amber-600 ring-amber-200",
    "bg-slate-50 text-slate-500 ring-slate-200",
    "bg-orange-50 text-orange-500 ring-orange-200",
  ];

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)]">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Trophy size={16} className="text-amber-500" />
        </div>
        <h3 className="text-[15px] font-bold text-[var(--foreground)]">Sinf reytingi</h3>
      </div>

      <div className="space-y-1.5">
        {leaders && leaders.length > 0 ? leaders.slice(0, 5).map((entry, i) => {
          const isYou = entry.userId?._id === user?._id;
          return (
            <div
              key={entry._id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isYou
                  ? "bg-[var(--green-50)]/60 ring-1 ring-[#73E2A7]/30"
                  : "hover:bg-[var(--hover-bg)]"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${
                i < 3 ? `ring-1 ${rankColors[i]}` : "bg-gray-50 text-[var(--foreground)]/40"
              }`}>
                {i + 1}
              </div>
              <div className="w-7 h-7 rounded-full bg-[var(--green-50)] flex items-center justify-center flex-shrink-0">
                <User size={13} className="text-[var(--green-600)]" />
              </div>
              <span className={`text-[13px] flex-1 truncate ${isYou ? "font-bold text-[var(--green-600)]" : "font-medium text-[var(--foreground)]/75"}`}>
                {entry.userId?.firstName}{isYou && <span className="text-[11px] text-[var(--green-600)]/60 ml-1">(Siz)</span>}
              </span>
              <span className="flex items-center gap-1 text-[12px] font-bold text-[var(--foreground)]/45 tabular-nums"><ZCIcon size={12} />{entry.totalXP.toLocaleString()}</span>
            </div>
          );
        }) : (
          <div className="text-center py-6">
            <Target size={20} className="text-[var(--foreground)]/20 mx-auto mb-2" />
            <p className="text-[13px] text-[var(--foreground)]/40">O'rganishni boshlang!</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Daily Tip ─── */
function DailyTip() {
  const tips = [
    { tip: "Algoritm — bu muammoni hal qilish uchun bosqichma-bosqich ko'rsatmalar to'plami, xuddi retsept kabi!", Icon: Lightbulb },
    { tip: "Dasturlashda xato qilish — bu o'rganishning eng yaxshi usuli. Har bir xato sizni yanada kuchli qiladi!", Icon: Bug },
    { tip: "Kompyuter faqat 0 va 1 ni tushunadi. Bu ikkilik tizim deb ataladi!", Icon: Binary },
    { tip: "Har kuni ozgina o'rgansangiz, katta natijalarga erishasiz. Izchillik — muvaffaqiyat kaliti!", Icon: KeyRound },
    { tip: "Kodni yozishdan oldin rejalashtirish juda muhim. Avval o'ylab, keyin yozing!", Icon: FileEdit },
    { tip: "Dasturlash tillarining ko'pchiligi ingliz tiliga asoslangan. Ingliz tilini ham o'rganing!", Icon: Globe },
    { tip: "Loop (tsikl) — bir xil ishni ko'p marta bajarish uchun ishlatiladi. Vaqtingizni tejaydi!", Icon: RefreshCw },
    { tip: "O'zgaruvchi — bu ma'lumotni saqlash uchun quticha. Unga nom berib, ichiga qiymat qo'yish mumkin!", Icon: Package },
  ];
  const today = new Date();
  const t = tips[(today.getDate() + today.getMonth()) % tips.length];
  const TipIcon = t.Icon;

  return (
    <div className="bg-[#1B512D] rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#1C7C54]/15 rounded-full blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#73E2A7]/10 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#1C7C54]/30 flex items-center justify-center">
            <TipIcon size={16} className="text-[#73E2A7]" />
          </div>
          <h3 className="text-[14px] font-bold text-white/90">Kunlik maslahat</h3>
        </div>
        <p className="text-[14px] text-[#73E2A7]/75 leading-relaxed">{t.tip}</p>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, iconBg, iconColor, value, label, delay }: {
  icon: any; iconBg: string; iconColor: string; value: string; label: string; delay: string;
}) {
  return (
    <div className={`group bg-[var(--card-bg)] rounded-2xl p-4 md:p-5 shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-[#73E2A7]/25 transition-all duration-300 animate-fade-in-up ${delay}`}>
      <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl ${iconBg} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={18} className={iconColor} strokeWidth={2} />
      </div>
      <p className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className="text-[12px] md:text-[13px] font-medium text-[var(--foreground)]/50 mt-0.5">{label}</p>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function DashboardHome() {
  const [userName, setUserName] = useState("there");
  const [userGrade, setUserGrade] = useState("");

  const { data: progress } = useProgress();
  const claimDaily = useClaimDailyLogin();
  const [dailyClaimed, setDailyClaimed] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setUserName(user.firstName);
      if (user.grade) setUserGrade(user.grade);
    }
  }, []);

  useEffect(() => {
    if (progress && !dailyClaimed) {
      const today = new Date().toISOString().split("T")[0];
      if (progress.lastLoginDate !== today) {
        claimDaily.mutate(undefined, { onSuccess: () => setDailyClaimed(true) });
      } else {
        setDailyClaimed(true);
      }
    }
  }, [progress]);

  const { data: courses } = useCourses(userGrade || "");
  const levelInfo = progress ? getLevelInfo(progress.totalXP) : null;

  const completedCount = progress?.lessonsCompleted?.length || 0;
  const correctQuizzes = progress?.quizScores?.filter((q: any) => q.correct).length || 0;

  return (
    <div className="flex flex-col xl:flex-row gap-5 xl:gap-7">
      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-5 md:space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in-up">
          <h1
            className="text-[22px] md:text-[28px] font-bold text-[var(--foreground)] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Salom, {userName}
          </h1>
          <p className="text-[13px] md:text-[15px] text-[var(--foreground)]/55 mt-1">
            O'rganish sayohatingizni davom ettirishga tayyormisiz?
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={BookOpen} iconBg="bg-[var(--green-50)]" iconColor="text-[var(--green-600)]" value={String(completedCount)} label="Bajarilgan darslar" delay="delay-100" />
          <StatCard icon={Flame} iconBg="bg-orange-50" iconColor="text-orange-500" value={`${progress?.streak || 0} kun`} label="Davomiylik" delay="delay-200" />
          <StatCard icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-500" value={String(correctQuizzes)} label="To'g'ri javoblar" delay="delay-300" />
          <div className="group bg-[var(--card-bg)] rounded-2xl p-4 md:p-5 shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-[#73E2A7]/25 transition-all duration-300 animate-fade-in-up delay-400">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
              <ZCIcon size={22} />
            </div>
            <p className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {(progress?.totalXP || 0).toLocaleString()}
            </p>
            <p className="text-[12px] md:text-[13px] font-medium text-[var(--foreground)]/50 mt-0.5">Jami ZC</p>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="animate-fade-in-up delay-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-bold text-[var(--foreground)]">So'nggi kurslar</h2>
            <Link href="/dashboard/lessons" className="flex items-center gap-1 text-[13px] font-semibold text-[var(--green-600)] hover:text-[var(--foreground)] transition-colors">
              Hammasini ko'rish <ArrowRight size={14} />
            </Link>
          </div>

          {!courses || courses.length === 0 ? (
            <div className="bg-[var(--card-bg)] rounded-2xl p-10 text-center shadow-sm border border-[var(--card-border)]">
              <BookOpen size={28} className="text-[var(--foreground)]/15 mx-auto mb-3" />
              <p className="text-[14px] text-[var(--foreground)]/40">Hali kurslar qo'shilmagan.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {courses.slice(0, 4).map((course) => {
                const completedLessons = progress?.lessonsCompleted?.filter(
                  (lc: any) => lc.courseId === course._id
                ).length || 0;
                const totalLessons = course.lessons.length;
                const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                return (
                  <Link
                    key={course._id}
                    href={`/dashboard/lessons/${course._id}`}
                    className="group flex items-center gap-4 bg-[var(--card-bg)] rounded-2xl p-4 shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-[#73E2A7]/25 transition-all duration-200"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--green-50)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen size={18} className="text-[var(--green-600)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-[var(--foreground)] group-hover:text-[var(--green-600)] transition-colors truncate">{course.title}</h3>
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          course.grade === "all" ? "bg-blue-50 text-blue-500" : "bg-[var(--green-50)] text-[var(--green-600)]"
                        }`}>
                          {course.grade === "all" ? "Barchasi" : `${course.grade}-sinf`}
                        </span>
                        <span className="text-[12px] text-[var(--foreground)]/35 font-medium">{totalLessons} dars</span>
                      </div>
                      {totalLessons > 0 && (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-1.5 bg-[var(--green-50)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#73E2A7] to-[#1C7C54] rounded-full transition-all duration-700"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[var(--green-600)] tabular-nums w-8 text-right">{progressPct}%</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Level Progress */}
        {levelInfo && (
          <div className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)] animate-fade-in-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#73E2A7] to-[#1C7C54] flex items-center justify-center shadow-sm">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <h2 className="text-[16px] font-bold text-[var(--foreground)]">Sizning darajangiz</h2>
              </div>
              <span className="text-[12px] font-bold text-[var(--green-600)] bg-[var(--green-50)] px-3 py-1.5 rounded-lg tracking-wide uppercase">
                {levelInfo.level}
              </span>
            </div>
            <div className="w-full h-3 bg-[var(--green-50)] rounded-full overflow-hidden mb-2.5">
              <div
                className="h-full bg-gradient-to-r from-[#73E2A7] to-[#1C7C54] rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(levelInfo.progress * 100, 100)}%` }}
              />
            </div>
            <p className="text-[13px] text-[var(--foreground)]/45">
              {levelInfo.nextLevel
                ? <>{levelInfo.xpToNext} ZC qoldi <span className="font-semibold text-[var(--green-600)]">&ldquo;{levelInfo.nextLevel}&rdquo;</span> darajasiga</>
                : <span className="font-semibold text-[var(--green-600)]">Maksimal daraja erishildi!</span>
              }
            </p>
          </div>
        )}

        {/* Badges */}
        {progress && progress.badges.length > 0 && (
          <div className="animate-fade-in-up delay-500">
            <div className="flex items-center gap-2.5 mb-4">
              <Award size={18} className="text-[var(--green-600)]" />
              <h2 className="text-[17px] font-bold text-[var(--foreground)]">Sizning nishonlaringiz</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {progress.badges.map((badge: any) => (
                <div
                  key={badge.key}
                  className="bg-[var(--card-bg)] rounded-2xl p-4 text-center shadow-sm border border-[var(--card-border)] hover:shadow-md hover:border-[#73E2A7]/25 hover:scale-[1.03] transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--green-50)] flex items-center justify-center mx-auto mb-2.5">
                    <Award size={18} className="text-[var(--green-600)]" />
                  </div>
                  <p className="text-[13px] font-bold text-[var(--foreground)]">{badge.title}</p>
                  <p className="text-[11px] text-[var(--foreground)]/40 mt-0.5 leading-snug">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="animate-fade-in-up delay-500">
          <div className="flex items-center gap-2.5 mb-4">
            <Clock size={18} className="text-[var(--green-600)]" />
            <h2 className="text-[17px] font-bold text-[var(--foreground)]">So'nggi faoliyat</h2>
          </div>
          <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--card-border)] divide-y divide-[var(--card-border)]">
            {progress && progress.lessonsCompleted.length > 0 ? (
              progress.lessonsCompleted.slice(-5).reverse().map((lc: any, i: number) => {
                const courseTitle = courses?.find((c: any) => c._id === lc.courseId)?.title;
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--hover-bg)] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-[var(--foreground)]">
                        <span className="font-semibold">Dars yakunlandi</span>
                        {courseTitle && <span className="text-[var(--foreground)]/40"> · {courseTitle}</span>}
                      </p>
                    </div>
                    <span className="text-[12px] font-bold text-[var(--green-600)] bg-[var(--green-50)] px-2.5 py-1 rounded-lg flex-shrink-0 tabular-nums">
                      +{lc.xpEarned} ZC
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-10 text-center">
                <Target size={24} className="text-[var(--foreground)]/15 mx-auto mb-2" />
                <p className="text-[14px] text-[var(--foreground)]/40">Hali faoliyat yo'q. O'rganishni boshlang!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="xl:w-[300px] flex-shrink-0 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5">
          <MiniCalendar progress={progress} />
          <Leaderboard />
        </div>
        <DailyTip />
      </div>
    </div>
  );
}
