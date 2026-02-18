"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getStoredUser, useLogout, User as UserType } from "../lib/auth";
import { useProgress, getLevelInfo, LEVELS } from "../lib/progress";
import { Flame, Bell, LogOut, User, Menu, ChevronDown, Zap, Star, Trophy, Lock, CheckCircle2, Calendar, TrendingUp, Target, Info, AlertTriangle, Gift, Search } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { playClick, playPop, playNotification } from "../lib/sounds";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "../lib/notifications";
import ZCIcon from "./ZCIcon";
import GlobalSearch from "./GlobalSearch";
import { useTheme } from "../providers/ThemeProvider";
import ThemeToggle from "./ThemeToggle";
import { formatDate, getWeekdayShort } from "../lib/dateUtils";

/* Level icon/color map */
const LEVEL_META: Record<string, { color: string; icon: typeof Star }> = {
  "Boshlang'ich": { color: "#94a3b8", icon: Star },
  "Kashfiyotchi": { color: "#22c55e", icon: Zap },
  "Dasturchi":    { color: "#3b82f6", icon: Target },
  "Xaker":        { color: "#a855f7", icon: Trophy },
  "Usta":         { color: "#f59e0b", icon: CheckCircle2 },
};

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Hozir";
  if (mins < 60) return `${mins} daqiqa oldin`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} kun oldin`;
  return formatDate(dateStr);
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const logout = useLogout();
  const { data: progress } = useProgress();
  const { toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  const { data: notifs } = useNotifications();
  const markRead = useMarkAsRead();
  const markAllRead = useMarkAllAsRead();
  const unreadCount = notifs?.filter((n) => !n.read).length || 0;

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useClickOutside(dropdownRef, useCallback(() => setShowDropdown(false), []));
  useClickOutside(levelRef, useCallback(() => setShowLevel(false), []));
  useClickOutside(streakRef, useCallback(() => setShowStreak(false), []));
  useClickOutside(notifsRef, useCallback(() => setShowNotifs(false), []));

  const levelInfo = progress ? getLevelInfo(progress.totalXP) : null;

  const handleLevelClick = () => {
    setShowLevel(!showLevel);
    setShowStreak(false);
    setShowDropdown(false);
    setShowNotifs(false);
    playPop();
  };

  const handleStreakClick = () => {
    setShowStreak(!showStreak);
    setShowLevel(false);
    setShowDropdown(false);
    setShowNotifs(false);
    playPop();
  };

  // Build last 7 days for streak calendar
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isToday = i === 6;
    const isPast = i < 6;
    const wasActive = progress ? (isPast && i >= 6 - progress.streak) || (isToday && progress.streak > 0) : false;
    return {
      day: getWeekdayShort(d),
      date: d.getDate(),
      isToday,
      wasActive,
    };
  });

  return (
    <header className="h-14 md:h-16 bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--card-border)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { toggleMobile(); playPop(); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--foreground)]/50 hover:text-[var(--foreground)] hover:bg-[var(--green-50)]/40 transition-all lg:hidden"
        >
          <Menu size={20} />
        </button>
        <p className="text-[14px] font-medium text-[var(--foreground)]/50 hidden md:block">
          Qaytganingizdan xursandmiz{user ? `, ${user.firstName}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Search */}
        <button
          onClick={() => { setShowSearch(true); playPop(); }}
          className="flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-3 py-2 hover:border-[var(--green-300)]/40 hover:shadow-sm transition-all cursor-pointer"
        >
          <Search size={15} className="text-[var(--foreground)]/30" />
          <span className="text-[12px] text-[var(--foreground)]/25 hidden md:inline">Qidirish...</span>
          <kbd className="hidden md:flex items-center gap-0.5 text-[9px] font-bold text-[var(--foreground)]/20 bg-[var(--background)] border border-[var(--card-border)] rounded px-1 py-0.5 ml-1">
            ⌘K
          </kbd>
        </button>

        {/* ZC & Level — clickable */}
        {levelInfo && (
          <div className="relative" ref={levelRef}>
            <button
              onClick={handleLevelClick}
              className="hidden sm:flex items-center gap-2 md:gap-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-2.5 md:px-3.5 py-1.5 md:py-2 hover:border-[var(--green-300)]/40 hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1 md:gap-1.5 text-[12px] md:text-[13px] font-bold text-amber-500">
                <ZCIcon size={15} /> {progress!.totalXP}
              </span>
              <div className="w-px h-3.5 bg-[var(--green-600)]/10" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] md:text-[11px] font-bold text-[var(--green-600)] uppercase tracking-wide">{levelInfo.level}</span>
                <div className="w-12 md:w-16 h-1.5 md:h-2 bg-[var(--green-50)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#73E2A7] to-[#1C7C54] rounded-full transition-all duration-500" style={{ width: `${Math.min(levelInfo.progress * 100, 100)}%` }} />
                </div>
              </div>
            </button>

            {/* Level Popover */}
            {showLevel && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl shadow-2xl z-50 overflow-hidden">
                {/* Current level hero */}
                <div className="bg-gradient-to-br from-[#1B512D] to-[#1C7C54] p-5 text-white relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#73E2A7]/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#73E2A7]/8 rounded-full blur-xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                        {(() => { const Icon = LEVEL_META[levelInfo.level]?.icon || Star; return <Icon size={22} className="text-[#73E2A7]" />; })()}
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Hozirgi daraja</p>
                        <p className="text-[18px] font-bold leading-tight">{levelInfo.level}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="text-[#73E2A7]">{progress!.totalXP} XP</span>
                        <span className="text-white/50">
                          {levelInfo.nextLevel ? `${levelInfo.xpToNext} XP kerak` : "Maksimal daraja!"}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#73E2A7] to-[#DEF4C6] rounded-full transition-all duration-700" style={{ width: `${Math.min(levelInfo.progress * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* All levels */}
                <div className="p-4 space-y-1.5">
                  <p className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-wider mb-2">Barcha darajalar</p>
                  {LEVELS.map((l, i) => {
                    const meta = LEVEL_META[l.name] || { color: "#94a3b8", icon: Star };
                    const isCurrent = levelInfo.level === l.name;
                    const isUnlocked = progress!.totalXP >= l.minXP;
                    const LvlIcon = meta.icon;
                    return (
                      <div key={l.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isCurrent ? "bg-[var(--green-50)] border border-[var(--green-300)]/30" : "hover:bg-[var(--background)]"
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isUnlocked ? "" : "opacity-30"
                        }`} style={{ backgroundColor: `${meta.color}18` }}>
                          {isUnlocked ? (
                            <LvlIcon size={15} style={{ color: meta.color }} />
                          ) : (
                            <Lock size={13} style={{ color: meta.color }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold ${isUnlocked ? "text-[var(--foreground)]" : "text-[var(--foreground)]/40"}`}>
                            {l.name}
                            {isCurrent && <span className="ml-1.5 text-[10px] font-bold text-[var(--green-600)]">· Siz</span>}
                          </p>
                          <p className={`text-[11px] ${isUnlocked ? "text-[var(--foreground)]/50" : "text-[var(--foreground)]/30"}`}>
                            {l.maxXP === Infinity ? `${l.minXP}+ XP` : `${l.minXP} – ${l.maxXP} XP`}
                          </p>
                        </div>
                        {isUnlocked && !isCurrent && (
                          <CheckCircle2 size={14} className="text-[var(--green-600)]/40 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Streak — clickable */}
        {progress && progress.streak >= 0 && (
          <div className="relative" ref={streakRef}>
            <button
              onClick={handleStreakClick}
              className={`hidden md:flex items-center gap-1.5 text-[13px] font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                progress.streak > 0
                  ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/15"
                  : "bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)]/40 hover:border-orange-300/30"
              }`}
            >
              <Flame size={15} />
              <span>{progress.streak}</span>
            </button>

            {/* Streak Popover */}
            {showStreak && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl shadow-2xl z-50 overflow-hidden">
                {/* Streak hero */}
                <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-5 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Flame size={26} />
                    </div>
                    <div>
                      <p className="text-[32px] font-bold leading-none">{progress.streak}</p>
                      <p className="text-[12px] font-medium text-white/80 mt-0.5">kunlik streak</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-white/70 mt-2">
                    {progress.streak > 0
                      ? `Ajoyib! ${progress.streak} kun ketma-ket o'qiyapsiz 🔥`
                      : "Bugun birinchi darsni yakunlang!"}
                  </p>
                </div>

                {/* Weekly calendar */}
                <div className="p-4">
                  <p className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-wider mb-3">Oxirgi 7 kun</p>
                  <div className="grid grid-cols-7 gap-1.5">
                    {streakDays.map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-medium text-[var(--foreground)]/40 uppercase">{d.day}</span>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold transition-all ${
                          d.wasActive
                            ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm shadow-orange-400/20"
                            : d.isToday
                              ? "bg-[var(--background)] border-2 border-dashed border-orange-300/50 text-[var(--foreground)]/50"
                              : "bg-[var(--background)] text-[var(--foreground)]/25"
                        }`}>
                          {d.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Streak tips */}
                <div className="px-4 pb-4 space-y-2">
                  <div className="flex items-center gap-2.5 bg-[var(--background)] rounded-xl px-3 py-2.5">
                    <div className="w-7 h-7 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={14} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">Har kuni o'qing</p>
                      <p className="text-[10px] text-[var(--foreground)]/50">Kamida 1 ta dars yakunlang</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[var(--background)] rounded-xl px-3 py-2.5">
                    <div className="w-7 h-7 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[var(--foreground)]">Streakni saqlab qoling</p>
                      <p className="text-[10px] text-[var(--foreground)]/50">1 kun o'tkazib yuborsangiz, streak 0 ga qaytadi</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowLevel(false); setShowStreak(false); setShowDropdown(false); playPop(); }}
            className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70 hover:bg-[var(--green-50)]/40 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 md:top-0.5 md:right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 ring-2 ring-[var(--header-bg)]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute top-full right-0 mt-2 w-80 md:w-[340px] bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--divider)]">
                <h3 className="text-[14px] font-bold text-[var(--foreground)]">Bildirishnomalar</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-[11px] font-semibold text-[var(--green-600)] hover:text-[var(--green-900)] transition-colors"
                  >
                    Barchasini o'qish
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {!notifs || notifs.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell size={24} className="text-[var(--foreground)]/15 mx-auto mb-2" />
                    <p className="text-[13px] text-[var(--foreground)]/40">Hali bildirishnomalar yo'q</p>
                  </div>
                ) : (
                  notifs.slice(0, 20).map((n) => {
                    const iconMap: Record<string, { icon: typeof Info; color: string; bg: string }> = {
                      info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
                      success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                      warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
                      reward: { icon: Gift, color: "text-purple-500", bg: "bg-purple-500/10" },
                    };
                    const meta = iconMap[n.type] || iconMap.info;
                    const NIcon = meta.icon;
                    const timeAgo = getTimeAgo(n.createdAt);

                    return (
                      <button
                        key={n._id}
                        onClick={() => { if (!n.read) markRead.mutate(n._id); }}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-[var(--divider)] last:border-0 ${
                          n.read ? "opacity-60" : "bg-[var(--green-50)]/20 hover:bg-[var(--green-50)]/40"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <NIcon size={14} className={meta.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-[13px] font-semibold truncate ${n.read ? "text-[var(--foreground)]/60" : "text-[var(--foreground)]"}`}>
                              {n.title}
                            </p>
                            {!n.read && <span className="w-1.5 h-1.5 bg-[var(--green-600)] rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-[12px] text-[var(--foreground)]/50 mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-[var(--foreground)]/35 mt-1">{timeAgo}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowLevel(false); setShowStreak(false); setShowNotifs(false); playPop(); }}
            className="flex items-center gap-2 pl-1 md:pl-2 hover:bg-[var(--green-50)]/40 p-1 rounded-xl transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="text-[13px] md:text-[14px] font-semibold text-[var(--foreground)] leading-tight">
                {user ? `${user.firstName} ${user.lastName.charAt(0)}.` : "..."}
              </p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--green-50)] border border-[#73E2A7]/30 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar.startsWith("http") ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${user.avatar}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={15} className="text-[var(--green-600)]" />
              )}
            </div>
            <ChevronDown size={14} className={`text-[var(--foreground)]/40 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-44 md:w-48 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[var(--card-border)] mb-1">
                <p className="text-[13px] font-bold text-[var(--foreground)] truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-[var(--foreground)]/50 truncate">
                  @{user?.userName}
                </p>
              </div>
              <button
                onClick={() => { playClick(); logout(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-red-500 cursor-pointer transition-all text-left"
              >
                <LogOut size={16} />
                <span>Chiqish</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Palette */}
      <GlobalSearch open={showSearch} onClose={() => setShowSearch(false)} />
    </header>
  );
}
