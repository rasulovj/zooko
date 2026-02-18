"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Zap, Star, TrendingUp, Flame, Sprout, Trophy, Target, Rocket } from "lucide-react";

interface StreakModalProps {
  streak: number;
  xpEarned: number;
  newBadges?: string[];
  onClose: () => void;
}

const BADGE_LABELS: Record<string, { name: string; icon: typeof Flame }> = {
  streak_3: { name: "Yonib turibdi", icon: Flame },
  streak_7: { name: "To'xtovsiz", icon: Zap },
};

const MILESTONES = [3, 7, 14, 30, 60, 100];

const ENCOURAGE_TEXTS = [
  "Ajoyib boshlang'ich!",
  "Zo'r davom etyapsan!",
  "Yoqimli odat!",
  "Hayratlantirasan!",
  "Ajoyib natija!",
  "To'xtamasdan!",
  "Raqobatchi!",
];

function getEncourageText(streak: number) {
  if (streak <= 1) return ENCOURAGE_TEXTS[0];
  if (streak <= 3) return ENCOURAGE_TEXTS[1];
  if (streak <= 7) return ENCOURAGE_TEXTS[2];
  if (streak <= 14) return ENCOURAGE_TEXTS[3];
  if (streak <= 30) return ENCOURAGE_TEXTS[4];
  if (streak <= 60) return ENCOURAGE_TEXTS[5];
  return ENCOURAGE_TEXTS[6];
}

function getNextMilestone(streak: number) {
  return MILESTONES.find((m) => m > streak) || streak + 10;
}

// Sparkle positions around the flame
const SPARKLES = [
  { x: -40, y: -20, delay: 0.3, size: 6 },
  { x: 36, y: -28, delay: 0.5, size: 5 },
  { x: -30, y: -50, delay: 0.7, size: 4 },
  { x: 42, y: -10, delay: 0.4, size: 7 },
  { x: -20, y: 10, delay: 0.6, size: 5 },
  { x: 28, y: 15, delay: 0.8, size: 4 },
  { x: -45, y: -40, delay: 0.35, size: 3 },
  { x: 50, y: -45, delay: 0.55, size: 5 },
];

// Confetti pieces
const CONFETTI = Array.from({ length: 12 }, (_, i) => ({
  x: Math.cos((i / 12) * Math.PI * 2) * (60 + Math.random() * 30),
  y: Math.sin((i / 12) * Math.PI * 2) * (60 + Math.random() * 30),
  delay: 0.2 + Math.random() * 0.4,
  color: ["#fb923c", "#fbbf24", "#34d399", "#f87171", "#a78bfa", "#38bdf8"][i % 6],
  size: 4 + Math.random() * 4,
}));

export default function StreakModal({ streak, xpEarned, newBadges = [], onClose }: StreakModalProps) {
  const [phase, setPhase] = useState(0); // 0=entering, 1=flame, 2=number, 3=details
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const nextMilestone = getNextMilestone(streak);
  const progressPercent = Math.min((streak / nextMilestone) * 100, 100);
  const isNewMilestone = MILESTONES.includes(streak) && streak > 1;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse at center, rgba(251,146,60,0.12) 0%, var(--overlay-bg) 70%)",
          opacity: closing ? 0 : 1,
        }}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[340px] rounded-[28px] border border-[var(--card-border)] overflow-hidden"
        style={{
          background: "var(--card-bg)",
          animation: closing
            ? "fade-in 0.3s ease-out reverse forwards"
            : "streak-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          ...(phase >= 3 ? { animation: `streak-glow 3s ease-in-out infinite, ${closing ? "fade-in 0.3s ease-out reverse forwards" : "streak-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"}` } : {}),
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-[var(--foreground)]/30 hover:text-[var(--foreground)]/60 hover:bg-[var(--hover-bg)] transition-all"
        >
          <X size={16} />
        </button>

        {/* Top glow gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: isNewMilestone
              ? "radial-gradient(ellipse at 50% -20%, rgba(251,146,60,0.2) 0%, rgba(251,191,36,0.08) 50%, transparent 80%)"
              : "radial-gradient(ellipse at 50% -20%, rgba(251,146,60,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative px-7 pt-10 pb-7 flex flex-col items-center">
          {/* Flame area */}
          <div className="relative w-28 h-28 flex items-center justify-center mb-2">
            {/* Expanding rings */}
            {phase >= 1 && (
              <>
                <div
                  className="absolute inset-0 rounded-full border-2 border-orange-300/30"
                  style={{ animation: "streak-ring-expand 1.5s ease-out forwards", animationDelay: "0.1s" }}
                />
                <div
                  className="absolute inset-0 rounded-full border border-amber-300/20"
                  style={{ animation: "streak-ring-expand 1.8s ease-out forwards", animationDelay: "0.3s" }}
                />
              </>
            )}

            {/* Sparkles */}
            {phase >= 2 && SPARKLES.map((s, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-400"
                style={{
                  width: s.size,
                  height: s.size,
                  left: `calc(50% + ${s.x}px)`,
                  top: `calc(50% + ${s.y}px)`,
                  animation: `streak-sparkle 1.2s ease-out forwards`,
                  animationDelay: `${s.delay}s`,
                }}
              />
            ))}

            {/* Confetti for milestones */}
            {isNewMilestone && phase >= 2 && CONFETTI.map((c, i) => (
              <div
                key={`c-${i}`}
                className="absolute rounded-sm"
                style={{
                  width: c.size,
                  height: c.size,
                  background: c.color,
                  left: `calc(50% + ${c.x}px)`,
                  top: `calc(50% + ${c.y}px)`,
                  animation: `streak-confetti 1.5s ease-out forwards`,
                  animationDelay: `${c.delay}s`,
                  borderRadius: i % 3 === 0 ? "50%" : "2px",
                }}
              />
            ))}

            {/* Flame icon */}
            <div
              className="select-none leading-none"
              style={{
                animation: phase >= 1
                  ? "streak-flame-pulse 2s ease-in-out infinite"
                  : "none",
                opacity: phase >= 1 ? 1 : 0,
                transition: "opacity 0.3s ease",
                filter: isNewMilestone ? "drop-shadow(0 4px 20px rgba(251,146,60,0.4))" : "drop-shadow(0 4px 12px rgba(251,146,60,0.25))",
              }}
            >
              <Flame size={56} className="text-orange-500" strokeWidth={1.8} fill="rgba(251,146,60,0.3)" />
            </div>
          </div>

          {/* Streak number */}
          <div className="relative mb-1">
            <span
              className="block text-[52px] font-extrabold tracking-tighter leading-none text-transparent bg-clip-text"
              style={{
                fontFamily: "var(--font-display)",
                backgroundImage: "linear-gradient(135deg, #fb923c 0%, #f59e0b 50%, #ef4444 100%)",
                animation: phase >= 2 ? "streak-number-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : "none",
                opacity: phase >= 2 ? undefined : 0,
              }}
            >
              {streak}
            </span>
          </div>

          <p
            className="text-[15px] font-bold text-[var(--foreground)] tracking-tight mb-1"
            style={{
              fontFamily: "var(--font-display)",
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.4s ease 0.2s",
            }}
          >
            kunlik davomiylik!
          </p>

          <p
            className="text-[13px] text-[var(--foreground)]/50 mb-5"
            style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(6px)",
              transition: "all 0.4s ease",
            }}
          >
            {getEncourageText(streak)}
          </p>

          {/* Progress toward next milestone */}
          <div
            className="w-full mb-5"
            style={{
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease 0.1s",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[var(--foreground)]/40 uppercase tracking-wider">
                Keyingi belgi
              </span>
              <span className="text-[12px] font-bold text-orange-500">
                {streak} / {nextMilestone} kun
              </span>
            </div>
            <div className="h-2.5 bg-[var(--card-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, #fb923c, #f59e0b)",
                  animation: phase >= 3 ? "streak-bar-fill 1s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
                  boxShadow: "0 0 8px rgba(251,146,60,0.3)",
                }}
              />
            </div>
          </div>

          {/* XP earned + badges */}
          <div
            className="flex items-center gap-3 w-full"
            style={{
              opacity: phase >= 3 ? 1 : 0,
              animation: phase >= 3 ? "streak-badge-bounce 0.5s ease-out forwards" : "none",
              animationDelay: "0.15s",
            }}
          >
            {/* XP card */}
            <div className="flex-1 flex items-center gap-2.5 bg-[var(--green-50)]/60 border border-[var(--green-300)]/15 rounded-2xl px-4 py-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--green-600)]/10 flex items-center justify-center">
                <Zap size={16} className="text-[var(--green-600)]" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[var(--green-600)]" style={{ fontFamily: "var(--font-display)" }}>
                  +{xpEarned} ZC
                </p>
                <p className="text-[10px] text-[var(--foreground)]/35 font-medium">Kunlik mukofot</p>
              </div>
            </div>

            {/* Streak fire badge */}
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200/30 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={18} className="text-orange-500 mx-auto" />
                <p className="text-[9px] font-bold text-orange-500/70 mt-0.5">{streak}d</p>
              </div>
            </div>
          </div>

          {/* New badges earned */}
          {newBadges.length > 0 && (
            <div
              className="w-full mt-4 pt-4 border-t border-[var(--divider)]"
              style={{
                opacity: phase >= 3 ? 1 : 0,
                animation: phase >= 3 ? "streak-badge-bounce 0.5s ease-out forwards" : "none",
                animationDelay: "0.3s",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star size={13} className="text-amber-500" />
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Yangi belgi!</span>
              </div>
              {newBadges.map((badge) => {
                const info = BADGE_LABELS[badge];
                if (!info) return null;
                return (
                  <div
                    key={badge}
                    className="flex items-center gap-3 bg-amber-50/50 border border-amber-200/20 rounded-2xl px-4 py-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <info.icon size={22} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>
                        {info.name}
                      </p>
                      <p className="text-[11px] text-[var(--foreground)]/40">
                        {streak} kunlik davomiylik!
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={handleClose}
            className="w-full mt-5 py-3.5 rounded-2xl text-[15px] font-bold text-white tracking-tight active:scale-[0.97] transition-transform"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)",
              boxShadow: "0 4px 20px rgba(251,146,60,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
              opacity: phase >= 3 ? 1 : 0,
              transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s",
            }}
          >
            Davom etamiz! <Rocket size={16} className="inline ml-1 -mt-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
