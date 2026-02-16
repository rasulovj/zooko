"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <span
            className="text-[120px] md:text-[160px] font-bold text-[var(--green-600)]/10 leading-none select-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-[var(--green-50)] flex items-center justify-center">
              <span className="text-4xl">🍃</span>
            </div>
          </div>
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sahifa topilmadi
        </h1>
        <p className="text-[15px] text-[var(--foreground)]/50 mb-8 leading-relaxed">
          Siz qidirayotgan sahifa mavjud emas yoki boshqa joyga ko'chirilgan.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[var(--foreground)]/60 bg-[var(--card-bg)] border-2 border-[var(--card-border)] hover:border-[var(--green-300)] hover:text-[var(--foreground)] transition-all"
          >
            <ArrowLeft size={16} />
            Orqaga
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[var(--green-600)] hover:opacity-90 transition-opacity shadow-lg shadow-[var(--green-600)]/20"
          >
            <Home size={16} />
            Bosh sahifa
          </Link>
        </div>
      </div>
    </div>
  );
}
