"use client";

import { useEffect, useState } from "react";
import { getStoredUser, useLogout } from "../lib/auth";
import { useProgress, getLevelInfo } from "../lib/progress";
import { Flame, Bell, LogOut, User, Menu, Sun, Moon } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { playClick, playPop, playNotification } from "../lib/sounds";
import ZCIcon from "./ZCIcon";
import { useTheme } from "../providers/ThemeProvider";

export default function Header() {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const logout = useLogout();
  const { data: progress } = useProgress();
  const { toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const levelInfo = progress ? getLevelInfo(progress.totalXP) : null;

  return (
    <header className="h-14 md:h-16 bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--card-border)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        {/* Mobile hamburger */}
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
        {/* ZC & Level */}
        {levelInfo && (
          <div className="hidden sm:flex items-center gap-2 md:gap-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-2.5 md:px-3.5 py-1.5 md:py-2">
            <span className="flex items-center gap-1 md:gap-1.5 text-[12px] md:text-[13px] font-bold text-amber-500">
              <ZCIcon size={15} /> {progress!.totalXP}
            </span>
            <div className="w-px h-3.5 bg-[#1C7C54]/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] md:text-[11px] font-bold text-[var(--green-600)] uppercase tracking-wide">{levelInfo.level}</span>
              <div className="w-12 md:w-16 h-1.5 md:h-2 bg-[var(--green-50)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#73E2A7] to-[#1C7C54] rounded-full transition-all duration-500" style={{ width: `${Math.min(levelInfo.progress * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Streak */}
        {progress && progress.streak > 0 && (
          <div className="hidden md:flex items-center gap-1.5 bg-orange-50 text-orange-500 text-[13px] font-semibold px-3 py-2 rounded-xl">
            <Flame size={15} />
            <span>{progress.streak}</span>
          </div>
        )}

        {/* Theme toggle */}
        <button
          onClick={() => { playPop(); toggleTheme(); }}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70 hover:bg-[var(--green-50)]/40 transition-all"
          title={theme === "dark" ? "Yorug' rejim" : "Qorong'i rejim"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button onClick={() => playNotification()} className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70 hover:bg-[var(--green-50)]/40 transition-all">
          <Bell size={18} />
          <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 bg-[#73E2A7] rounded-full ring-2 ring-[var(--card-bg)]" />
        </button>

        {/* Logout */}
        <button
          onClick={() => { playClick(); logout(); }}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[var(--foreground)]/40 hover:text-red-500 hover:bg-red-50/60 transition-all"
          title="Chiqish"
        >
          <LogOut size={18} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1 md:pl-2">
          <div className="text-right hidden md:block">
            <p className="text-[13px] md:text-[14px] font-semibold text-[var(--foreground)] leading-tight">
              {user ? `${user.firstName} ${user.lastName.charAt(0)}.` : "..."}
            </p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--green-50)] border border-[#73E2A7]/30 flex items-center justify-center">
            <User size={15} className="text-[var(--green-600)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
