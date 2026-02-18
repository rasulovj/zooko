"use client";

import { useMemo } from "react";
import ZookoLoader from "../../components/ZookoLoader";
import type { LucideIcon } from "lucide-react";
import {
  Award, Lock, BookOpen, Brain, Flame, Gem, Trophy,
  Target, GraduationCap, Crown, CircleHelp, Zap,
  Star, Diamond, CheckCircle2, Sparkles,
} from "lucide-react";
import { useProgress } from "../../lib/progress";
import { formatDateLong, formatDate } from "../../lib/dateUtils";

/* ─── Badge definitions ─── */
const ALL_BADGES: {
  key: string; title: string; description: string;
  Icon: LucideIcon; iconColor: string; iconBg: string;
  earnedGradient: string;
  category: "lessons" | "quizzes" | "streak" | "xp";
  requirement: (p: any) => number; target: number; unit: string;
}[] = [
  {
    key: "first_lesson", title: "Birinchi qadam", description: "Birinchi darsni yakunlang",
    Icon: Target, iconColor: "text-emerald-500", iconBg: "bg-emerald-50",
    earnedGradient: "from-emerald-500 to-green-600",
    category: "lessons",
    requirement: (p: any) => p.lessonsCompleted?.length || 0,
    target: 1, unit: "dars",
  },
  {
    key: "five_lessons", title: "Tez o'rganuvchi", description: "5 ta darsni yakunlang",
    Icon: BookOpen, iconColor: "text-emerald-500", iconBg: "bg-emerald-50",
    earnedGradient: "from-emerald-500 to-teal-600",
    category: "lessons",
    requirement: (p: any) => p.lessonsCompleted?.length || 0,
    target: 5, unit: "dars",
  },
  {
    key: "ten_lessons", title: "Dars ustasi", description: "10 ta darsni yakunlang",
    Icon: GraduationCap, iconColor: "text-emerald-600", iconBg: "bg-emerald-50",
    earnedGradient: "from-green-600 to-emerald-700",
    category: "lessons",
    requirement: (p: any) => p.lessonsCompleted?.length || 0,
    target: 10, unit: "dars",
  },
  {
    key: "first_quiz", title: "Birinchi test", description: "Birinchi testni yeching",
    Icon: CircleHelp, iconColor: "text-blue-500", iconBg: "bg-blue-50",
    earnedGradient: "from-blue-500 to-indigo-600",
    category: "quizzes",
    requirement: (p: any) => p.quizScores?.length || 0,
    target: 1, unit: "test",
  },
  {
    key: "five_quizzes", title: "Test ustasi", description: "5 ta testni to'g'ri yeching",
    Icon: Brain, iconColor: "text-blue-600", iconBg: "bg-blue-50",
    earnedGradient: "from-indigo-500 to-blue-700",
    category: "quizzes",
    requirement: (p: any) => p.quizScores?.filter((q: any) => q.correct).length || 0,
    target: 5, unit: "to'g'ri test",
  },
  {
    key: "streak_3", title: "Yonib turibdi", description: "3 kunlik davomiylik",
    Icon: Flame, iconColor: "text-orange-500", iconBg: "bg-orange-50",
    earnedGradient: "from-orange-400 to-red-500",
    category: "streak",
    requirement: (p: any) => p.streak || 0,
    target: 3, unit: "kun",
  },
  {
    key: "streak_7", title: "To'xtovsiz", description: "7 kunlik davomiylik",
    Icon: Zap, iconColor: "text-orange-600", iconBg: "bg-orange-50",
    earnedGradient: "from-red-500 to-orange-600",
    category: "streak",
    requirement: (p: any) => p.streak || 0,
    target: 7, unit: "kun",
  },
  {
    key: "xp_100", title: "Ko'tarilayotgan yulduz", description: "100 ZC to'plang",
    Icon: Star, iconColor: "text-amber-500", iconBg: "bg-amber-50",
    earnedGradient: "from-amber-400 to-yellow-500",
    category: "xp",
    requirement: (p: any) => p.totalXP || 0,
    target: 100, unit: "ZC",
  },
  {
    key: "xp_500", title: "ZC ovchisi", description: "500 ZC to'plang",
    Icon: Diamond, iconColor: "text-amber-600", iconBg: "bg-amber-50",
    earnedGradient: "from-yellow-500 to-amber-600",
    category: "xp",
    requirement: (p: any) => p.totalXP || 0,
    target: 500, unit: "ZC",
  },
  {
    key: "xp_1000", title: "Legenda", description: "1000 ZC to'plang",
    Icon: Crown, iconColor: "text-amber-600", iconBg: "bg-amber-50",
    earnedGradient: "from-amber-500 to-orange-600",
    category: "xp",
    requirement: (p: any) => p.totalXP || 0,
    target: 1000, unit: "ZC",
  },
];

const CATEGORIES = [
  { key: "lessons", label: "Darslar", Icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50", ringColor: "ring-emerald-200" },
  { key: "quizzes", label: "Testlar", Icon: Brain, color: "text-blue-500", bg: "bg-blue-50", ringColor: "ring-blue-200" },
  { key: "streak", label: "Davomiylik", Icon: Flame, color: "text-orange-500", bg: "bg-orange-50", ringColor: "ring-orange-200" },
  { key: "xp", label: "ZC to'plash", Icon: Gem, color: "text-amber-500", bg: "bg-amber-50", ringColor: "ring-amber-200" },
] as const;

/* ─── Hero: Latest Badge ─── */
function LatestBadgeHero({ badge }: { badge: { Icon: LucideIcon; iconColor: string; iconBg: string; earnedGradient: string; title: string; description: string; earnedAt: string } }) {
  const BadgeIcon = badge.Icon;
  return (
    <div className="bg-gradient-to-br from-[#1B512D] via-[#1C7C54] to-[#1B512D] rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden animate-fade-in-up delay-100 h-full">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#73E2A7]/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#73E2A7]/6 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none">
        <BadgeIcon size={180} strokeWidth={0.8} />
      </div>
      <div className="relative flex flex-col justify-center h-full gap-5">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#73E2A7]/70" />
          <p className="text-[11px] font-semibold text-[#73E2A7]/60 uppercase tracking-wider">So&apos;nggi yutuq</p>
        </div>
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl bg-gradient-to-br ${badge.earnedGradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <BadgeIcon size={30} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>{badge.title}</h2>
            <p className="text-[13px] text-white/45 mt-1.5">{badge.description}</p>
            <p className="text-[11px] text-[#73E2A7]/40 mt-2.5 flex items-center gap-1.5">
              <CheckCircle2 size={11} />
              {formatDateLong(badge.earnedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stats Summary ─── */
function BadgeStats({ earned, total, earnedMap }: { earned: number; total: number; earnedMap: Map<string, any> }) {
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (circumference * pct) / 100;

  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 md:p-6 shadow-sm border border-[var(--card-border)] animate-fade-in-up delay-200 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
          <Trophy size={16} className="text-purple-500" />
        </div>
        <h3 className="text-[15px] font-bold text-[var(--foreground)]">Umumiy natija</h3>
      </div>

      <div className="flex items-center gap-5 flex-1">
        <div className="relative flex-shrink-0">
          <svg width="108" height="108" viewBox="0 0 108 108" className="transform -rotate-90">
            <circle cx="54" cy="54" r="42" fill="none" stroke="var(--green-50)" strokeWidth="7" />
            <circle
              cx="54" cy="54" r="42" fill="none"
              stroke="#1C7C54" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>{earned}</span>
            <span className="text-[10px] font-medium text-[var(--foreground)]/35">/ {total}</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {CATEGORIES.map((cat) => {
            const catBadges = ALL_BADGES.filter((b) => b.category === cat.key);
            const catEarned = catBadges.filter((b) => earnedMap.has(b.key)).length;
            const catPct = catBadges.length > 0 ? Math.round((catEarned / catBadges.length) * 100) : 0;
            return (
              <div key={cat.key}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 rounded-md ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                    <cat.Icon size={10} className={cat.color} />
                  </div>
                  <span className="text-[11px] font-medium text-[var(--foreground)]/55 flex-1">{cat.label}</span>
                  <span className="text-[11px] font-bold text-[var(--foreground)]/70 tabular-nums">{catEarned}/{catBadges.length}</span>
                </div>
                <div className="w-full h-1 bg-[var(--green-50)] rounded-full overflow-hidden ml-7">
                  <div className="h-full bg-[var(--green-300)] rounded-full transition-all duration-700" style={{ width: `${catPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Badge Card ─── */
function BadgeCard({ badge, earnedBadge, progress, index }: {
  badge: typeof ALL_BADGES[0];
  earnedBadge: any | null;
  progress: any;
  index: number;
}) {
  const isEarned = !!earnedBadge;
  const current = badge.requirement(progress);
  const pct = Math.min(Math.round((current / badge.target) * 100), 100);
  const BadgeIcon = badge.Icon;

  return (
    <div
      className={`group bg-[var(--card-bg)] rounded-2xl shadow-sm border transition-all duration-300 relative overflow-hidden ${
        isEarned
          ? "border-[#73E2A7]/25 hover:shadow-lg hover:border-[#73E2A7]/40 hover:-translate-y-1"
          : "border-[var(--card-border)] hover:shadow-md hover:border-[var(--card-border)]"
      } animate-fade-in-up`}
      style={{ animationDelay: `${0.06 * index}s` }}
    >
      {/* Earned glow */}
      {isEarned && (
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#73E2A7]/6 rounded-full blur-2xl group-hover:bg-[#73E2A7]/12 transition-all duration-500" />
      )}

      {/* Top colored bar */}
      <div className={`h-1 w-full ${isEarned ? `bg-gradient-to-r ${badge.earnedGradient}` : "bg-[var(--card-border)]"}`} />

      <div className="relative p-5">
        {/* Icon + Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
            isEarned
              ? `bg-gradient-to-br ${badge.earnedGradient} shadow-md`
              : "bg-[var(--hover-bg)] border border-[var(--card-border)]"
          }`}>
            {isEarned ? (
              <BadgeIcon size={24} className="text-white" strokeWidth={1.5} />
            ) : (
              <BadgeIcon size={22} className="text-[var(--foreground)]/15" strokeWidth={1.5} />
            )}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h4 className={`text-[15px] font-bold leading-snug ${isEarned ? "text-[var(--foreground)]" : "text-[var(--foreground)]/45"}`}>
              {badge.title}
            </h4>
            <p className={`text-[12px] mt-1 leading-relaxed ${isEarned ? "text-[var(--foreground)]/50" : "text-[var(--foreground)]/25"}`}>
              {badge.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        {isEarned ? (
          <div className="flex items-center justify-between pt-3.5 border-t border-[var(--card-border)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--green-600)]" />
              <span className="text-[12px] font-semibold text-[var(--green-600)]">Yutilgan</span>
            </div>
            <span className="text-[11px] font-medium text-[var(--foreground)]/25">
              {formatDate(earnedBadge.earnedAt)}
            </span>
          </div>
        ) : (
          <div className="pt-3.5 border-t border-[var(--card-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-[var(--foreground)]/35">
                {current} / {badge.target} {badge.unit}
              </span>
              <span className={`text-[11px] font-bold tabular-nums ${pct >= 75 ? "text-[var(--green-600)]" : "text-[var(--foreground)]/40"}`}>
                {pct}%
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--green-50)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? "bg-[var(--green-600)]" : "bg-[var(--green-300)]"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Category Section ─── */
function CategorySection({ cat, earnedMap, progress }: {
  cat: typeof CATEGORIES[number] & { badges: typeof ALL_BADGES };
  earnedMap: Map<string, any>;
  progress: any;
}) {
  const earnedInCat = cat.badges.filter((b) => earnedMap.has(b.key)).length;

  return (
    <div className="animate-fade-in-up delay-300">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center ring-1 ${cat.ringColor}`}>
          <cat.Icon size={17} className={cat.color} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-[var(--foreground)] leading-tight">{cat.label}</h3>
          <p className="text-[11px] text-[var(--foreground)]/35 mt-0.5">{earnedInCat} / {cat.badges.length} yutilgan</p>
        </div>
        {/* Mini progress dots */}
        <div className="ml-auto flex items-center gap-1.5">
          {cat.badges.map((b) => (
            <div
              key={b.key}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${earnedMap.has(b.key) ? "bg-[var(--green-600)]" : "bg-[var(--foreground)]/8"}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {cat.badges.map((badge, i) => (
          <BadgeCard
            key={badge.key}
            badge={badge}
            earnedBadge={earnedMap.get(badge.key) || null}
            progress={progress}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ─── Main Page ─── */
/* ═══════════════════════════════════════════ */
export default function BadgesPage() {
  const { data: progress, isLoading } = useProgress();

  const { earnedMap, earnedCount, latestBadge, categorized } = useMemo(() => {
    if (!progress) return { earnedMap: new Map(), earnedCount: 0, latestBadge: null, categorized: [] };

    const map = new Map<string, any>();
    let latest: any = null;

    for (const b of progress.badges || []) {
      map.set(b.key, b);
      if (!latest || new Date(b.earnedAt) > new Date(latest.earnedAt)) {
        latest = b;
      }
    }

    if (latest) {
      const def = ALL_BADGES.find((d) => d.key === latest.key);
      if (def) latest = { ...latest, Icon: def.Icon, iconColor: def.iconColor, iconBg: def.iconBg, earnedGradient: def.earnedGradient };
    }

    const cats = CATEGORIES.map((cat) => ({
      ...cat,
      badges: ALL_BADGES.filter((b) => b.category === cat.key),
    }));

    return { earnedMap: map, earnedCount: map.size, latestBadge: latest, categorized: cats };
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
    <div className="space-y-7 w-full">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-[22px] md:text-[28px] font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Nishonlar
        </h1>
        <p className="text-[13px] md:text-[15px] text-[var(--foreground)]/55 mt-1">
          Yutuqlaringiz va maqsadlaringiz — har bir nishon sizning sa&apos;y-harakatingiz belgisi.
        </p>
      </div>

      {/* Hero + Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          {latestBadge ? (
            <LatestBadgeHero badge={latestBadge} />
          ) : (
            <div className="bg-gradient-to-br from-[#1B512D] via-[#1C7C54] to-[#1B512D] rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden animate-fade-in-up delay-100 h-full flex items-center">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#73E2A7]/8 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-[0.04] pointer-events-none">
                <Award size={160} strokeWidth={0.8} />
              </div>
              <div className="relative flex items-center gap-5">
                <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl bg-white/8 backdrop-blur-sm flex items-center justify-center border border-white/10 flex-shrink-0">
                  <Award size={30} className="text-[#73E2A7]/40" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Birinchi nishonni yuting!</h2>
                  <p className="text-[13px] text-white/40 mt-1.5">Darslarni bajaring va nishonlar to&apos;plang.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="xl:col-span-2">
          <BadgeStats earned={earnedCount} total={ALL_BADGES.length} earnedMap={earnedMap} />
        </div>
      </div>

      {/* Badge categories */}
      {categorized.map((cat) => (
        <CategorySection key={cat.key} cat={cat} earnedMap={earnedMap} progress={progress} />
      ))}
    </div>
  );
}
