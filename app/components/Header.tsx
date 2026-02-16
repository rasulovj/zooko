"use client";

import { useEffect, useState, useRef } from "react";
import { getStoredUser, useLogout, User as UserType } from "../lib/auth";
import { useProgress, getLevelInfo } from "../lib/progress";
import { Flame, Bell, LogOut, User, Menu, ChevronDown } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { playClick, playPop, playNotification } from "../lib/sounds";
import ZCIcon from "./ZCIcon";
import { useTheme } from "../providers/ThemeProvider";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const logout = useLogout();
  const { data: progress } = useProgress();
  const { toggleMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getStoredUser());

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <ThemeToggle />

        {/* Notifications */}
        <button onClick={() => playNotification()} className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70 hover:bg-[var(--green-50)]/40 transition-all">
          <Bell size={18} />
          <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-2 h-2 bg-[#73E2A7] rounded-full ring-2 ring-[var(--card-bg)]" />
        </button>

        {/* Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowDropdown(!showDropdown); playPop(); }}
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
            <div className="absolute top-full right-0 mt-2 w-44 md:w-48 bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--card-border)] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-[var(--card-border)] mb-1">
                <p className="text-[13px] font-bold text-[var(--foreground)] truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-[var(--foreground)]/50 truncate">
                  {user?.email}
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
    </header>
  );
}
