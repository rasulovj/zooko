"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FileText, Award, ArrowRight, Command, CornerDownLeft } from "lucide-react";
import { useCourses } from "../lib/courses";
import { getStoredUser } from "../lib/auth";

type SearchResult = {
  type: "course" | "lesson" | "page";
  title: string;
  subtitle?: string;
  href: string;
  icon: typeof BookOpen;
  iconColor: string;
  iconBg: string;
};

const PAGES: SearchResult[] = [
  { type: "page", title: "Bosh sahifa", subtitle: "Dashboard", href: "/dashboard", icon: Search, iconColor: "text-[var(--green-600)]", iconBg: "bg-[var(--green-50)]" },
  { type: "page", title: "Kurslarim", subtitle: "Barcha kurslar", href: "/dashboard/lessons", icon: BookOpen, iconColor: "text-[var(--green-600)]", iconBg: "bg-[var(--green-50)]" },
  { type: "page", title: "Natijalar", subtitle: "O'qish statistikasi", href: "/dashboard/progress", icon: FileText, iconColor: "text-blue-500", iconBg: "bg-blue-50" },
  { type: "page", title: "Nishonlar", subtitle: "Yutuqlar va badgelar", href: "/dashboard/badges", icon: Award, iconColor: "text-amber-500", iconBg: "bg-amber-50" },
];

export default function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [grade, setGrade] = useState("");
  useEffect(() => {
    const u = getStoredUser();
    if (u?.grade) setGrade(u.grade);
  }, []);

  const { data: courses } = useCourses(grade);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Show pages + first few courses when empty
      const items: SearchResult[] = [...PAGES];
      if (courses) {
        courses.slice(0, 3).forEach((c) => {
          items.push({
            type: "course",
            title: c.title,
            subtitle: `${c.lessons.length} dars · ${c.grade}-sinf`,
            href: `/dashboard/lessons/${c._id}`,
            icon: BookOpen,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-50",
          });
        });
      }
      return items;
    }

    const items: SearchResult[] = [];

    // Search pages
    PAGES.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || (p.subtitle && p.subtitle.toLowerCase().includes(q))) {
        items.push(p);
      }
    });

    // Search courses
    if (courses) {
      courses.forEach((c) => {
        if (c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)) {
          items.push({
            type: "course",
            title: c.title,
            subtitle: `${c.lessons.length} dars · ${c.grade}-sinf`,
            href: `/dashboard/lessons/${c._id}`,
            icon: BookOpen,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-50",
          });
        }

        // Search lessons inside courses
        c.lessons.forEach((l, li) => {
          if (l.title.toLowerCase().includes(q)) {
            items.push({
              type: "lesson",
              title: l.title,
              subtitle: `${c.title} · ${li + 1}-dars`,
              href: `/dashboard/lessons/${c._id}`,
              icon: FileText,
              iconColor: "text-blue-500",
              iconBg: "bg-blue-50",
            });
          }
        });
      });
    }

    return items.slice(0, 12);
  }, [query, courses]);

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0); }, [results]);

  const navigate = useCallback((result: SearchResult) => {
    onClose();
    router.push(result.href);
  }, [router, onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      navigate(results[activeIndex]);
    }
  }, [results, activeIndex, navigate]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        style={{ animation: "fade-in 0.15s ease-out" }}
        onClick={() => onClose()}
      />

      {/* Palette */}
      <div className="relative flex justify-center pt-[15vh] md:pt-[20vh] px-4">
        <div
          className="w-full max-w-[520px] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            animation: "search-drop 0.2s cubic-bezier(0.32, 0.72, 0, 1)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px var(--card-border)",
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--divider)]">
            <Search size={18} className="text-[var(--foreground)]/30 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kurs, dars yoki sahifa qidiring..."
              className="flex-1 bg-transparent text-[15px] font-medium text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 outline-none"
              style={{ fontFamily: "var(--font-display)" }}
            />
            <kbd className="hidden md:flex items-center gap-0.5 text-[10px] font-bold text-[var(--foreground)]/25 bg-[var(--background)] border border-[var(--card-border)] rounded-md px-1.5 py-0.5">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto overscroll-contain py-2">
            {results.length === 0 ? (
              <div className="py-10 text-center">
                <Search size={28} className="text-[var(--foreground)]/10 mx-auto mb-3" />
                <p className="text-[14px] font-semibold text-[var(--foreground)]/30" style={{ fontFamily: "var(--font-display)" }}>
                  Hech narsa topilmadi
                </p>
                <p className="text-[12px] text-[var(--foreground)]/20 mt-1">
                  Boshqa kalit so'z bilan qidirib ko'ring
                </p>
              </div>
            ) : (
              <>
                {/* Group label */}
                {!query && (
                  <p className="px-5 pt-1 pb-2 text-[10px] font-bold text-[var(--foreground)]/25 uppercase tracking-widest">
                    Tez o'tish
                  </p>
                )}
                {results.map((r, i) => {
                  const Icon = r.icon;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={`${r.type}-${r.href}-${i}`}
                      onClick={() => navigate(r)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors duration-75 ${
                        isActive
                          ? "bg-[var(--green-50)]/60"
                          : "hover:bg-[var(--background)]"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl ${r.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={r.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-semibold truncate ${
                          isActive ? "text-[var(--green-600)]" : "text-[var(--foreground)]"
                        }`}>
                          {r.title}
                        </p>
                        {r.subtitle && (
                          <p className="text-[11px] text-[var(--foreground)]/35 truncate mt-0.5">
                            {r.subtitle}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <div className="flex items-center gap-1 text-[var(--green-600)]/40 flex-shrink-0">
                          <CornerDownLeft size={13} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-t border-[var(--divider)] bg-[var(--background)]/50">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--foreground)]/25">
              <kbd className="font-mono bg-[var(--card-bg)] border border-[var(--card-border)] rounded px-1 py-0.5 text-[9px]">↑↓</kbd>
              <span>navigatsiya</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--foreground)]/25">
              <kbd className="font-mono bg-[var(--card-bg)] border border-[var(--card-border)] rounded px-1 py-0.5 text-[9px]">↵</kbd>
              <span>tanlash</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--foreground)]/25">
              <kbd className="font-mono bg-[var(--card-bg)] border border-[var(--card-border)] rounded px-1 py-0.5 text-[9px]">esc</kbd>
              <span>yopish</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
