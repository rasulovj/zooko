"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useLogin } from "../lib/auth";
import { useTheme } from "../providers/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import { Users } from "lucide-react";

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.31 12-11" />
      <path d="M17 8c-2 4-6 8-12 11" />
    </svg>
  );
}

export default function LoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Left Panel - Decorative */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 border-r border-white/5 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0b1410]' : 'bg-[#1A6B43]'}`}>
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-all" />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-white/10 dark:bg-[var(--green-600)]/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-white/5 dark:bg-[var(--green-300)]/5 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-12 group">
            <div className="w-10 h-10 bg-white/20 dark:bg-[var(--green-400)]/20 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 border border-white/10 dark:border-[var(--green-300)]/10">
              <LeafIcon className="w-5 h-5 text-white dark:text-[var(--green-300)]" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              zooko
            </span>
          </Link>

          <h2
            className="text-4xl font-extrabold text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            O'rganish sayohatingizga xush kelibsiz
          </h2>
          <p className="text-white/70 dark:text-white/40 text-lg leading-relaxed">
            To'xtagan joyingizdan davom eting. Darslaringiz va nishonlaringiz kutmoqda.
          </p>

        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[var(--background)]">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                <LeafIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                zookow
              </span>
            </Link>
            <ThemeToggle />
          </div>

          <h1
            className="text-2xl font-bold text-[var(--foreground)] mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kirish
          </h1>
          <p className="text-[var(--foreground)]/50 text-sm mb-8">
            O'qituvchingiz bergan ma'lumotlarni kiriting.
          </p>

          {login.isError && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 font-medium">
              {(login.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message || "Kirish amalga oshmadi. Ma'lumotlaringizni tekshiring."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[var(--foreground)]/60 mb-1.5">
                Elektron pochta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 bg-[var(--card-bg)] border border-[var(--input-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--green-600)]/20 focus:border-[var(--green-600)]/30 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-xs font-medium text-[var(--foreground)]/60">
                  Parol
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 bg-[var(--card-bg)] border border-[var(--input-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--green-600)]/20 focus:border-[var(--green-600)]/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full h-12 bg-[var(--green-600)] text-white font-semibold rounded-xl hover:bg-[var(--green-900)] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--foreground)]/40">
            Ma'lumotlaringiz yo'qmi?{" "}
            <span className="text-[var(--green-600)] font-medium">O'qituvchingizdan so'rang.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
