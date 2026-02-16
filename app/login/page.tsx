"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useLogin } from "../lib/auth";

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.31 12-11" />
      <path d="M17 8c-2 4-6 8-12 11" />
    </svg>
  );
}

export default function LoginPage() {
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
      <div className="hidden lg:flex lg:w-1/2 bg-green-900 relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-green-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-green-300/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-12 group">
            <div className="w-10 h-10 bg-green-300 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <LeafIcon className="w-5 h-5 text-green-900" />
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
          <p className="text-green-300/70 text-lg leading-relaxed">
            To'xtagan joyingizdan davom eting. Darslaringiz va nishonlaringiz kutmoqda.
          </p>

          <div className="mt-16 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["🧒", "👧", "👦", "🧒"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-green-600/30 border-2 border-green-900 flex items-center justify-center text-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm text-green-300/60">
              <span className="text-white font-medium">2,400+</span> bu oyda o'rganuvchilar
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[var(--background)]">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <LeafIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-green-900 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              zooko
            </span>
          </Link>

          <h1
            className="text-2xl font-bold text-green-900 mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kirish
          </h1>
          <p className="text-green-900/45 text-sm mb-8">
            O'qituvchingiz bergan ma'lumotlarni kiriting.
          </p>

          {login.isError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
              {(login.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message || "Kirish amalga oshmadi. Ma'lumotlaringizni tekshiring."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-green-900/70 mb-1.5">
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
                className="w-full h-12 px-4 bg-[var(--card-bg)] border border-green-900/10 rounded-xl text-sm text-green-900 placeholder:text-green-900/25 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-xs font-medium text-green-900/70">
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
                className="w-full h-12 px-4 bg-[var(--card-bg)] border border-green-900/10 rounded-xl text-sm text-green-900 placeholder:text-green-900/25 focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full h-12 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-green-900/40">
            Ma'lumotlaringiz yo'qmi?{" "}
            <span className="text-green-600 font-medium">O'qituvchingizdan so'rang.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
