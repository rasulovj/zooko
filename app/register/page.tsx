"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { usePublicRegister } from "../lib/auth";
import { useTheme } from "../providers/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";

function LeafIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20c4 0 8.68-3.31 12-11" />
            <path d="M17 8c-2 4-6 8-12 11" />
        </svg>
    );
}

const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

export default function RegisterPage() {
    const { theme } = useTheme();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        grade: "5",
    });
    const register = usePublicRegister();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        register.mutate(form);
    };

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const inputClass =
        "w-full h-12 px-4 bg-[var(--card-bg)] border border-[var(--input-border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--green-600)]/20 focus:border-[var(--green-600)]/30 transition-all";

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Left Panel */}
            <div
                className={`hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 border-r border-white/5 transition-colors duration-500 ${theme === "dark" ? "bg-[#0b1410]" : "bg-[#1A6B43]"
                    }`}
            >
                <div className="absolute top-6 right-6 z-20">
                    <ThemeToggle className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-all" />
                </div>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-white/5 rounded-full blur-3xl opacity-40" />
                </div>

                <div className="relative z-10 max-w-md">
                    <Link href="/" className="flex items-center gap-2.5 mb-12 group">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 border border-white/10">
                            <LeafIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                            zooko
                        </span>
                    </Link>

                    <h2 className="text-4xl font-extrabold text-white leading-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
                        O'z hisobingizni yarating
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Ro'yxatdan o'ting va darhol platformadan foydalaning.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[var(--background)]">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="flex items-center justify-between mb-8 lg:hidden">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                                <LeafIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                                zooko
                            </span>
                        </Link>
                        <ThemeToggle />
                    </div>

                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                        Ro'yxatdan o'tish
                    </h1>
                    <p className="text-[var(--foreground)]/50 text-sm mb-7">
                        Ma'lumotlaringizni kiriting va sinfingizni tanlang.
                    </p>

                    {register.isError && (
                        <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 font-medium">
                            {(register.error as Error & { response?: { data?: { message?: string } } })?.response?.data?.message ||
                                "Xatolik yuz berdi. Qaytadan urinib ko'ring."}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="firstName" className="block text-xs font-medium text-[var(--foreground)]/60 mb-1.5">
                                    Ism
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    value={form.firstName}
                                    onChange={set("firstName")}
                                    placeholder="Ali"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-xs font-medium text-[var(--foreground)]/60 mb-1.5">
                                    Familiya
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    value={form.lastName}
                                    onChange={set("lastName")}
                                    placeholder="Karimov"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="userName" className="block text-xs font-medium text-[var(--foreground)]/60 mb-1.5">
                                Foydalanuvchi nomi
                            </label>
                            <input
                                id="userName"
                                type="text"
                                required
                                autoComplete="username"
                                value={form.userName}
                                onChange={set("userName")}
                                placeholder="ali_karimov"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-[var(--foreground)]/60 mb-1.5">
                                Parol
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={form.password}
                                onChange={set("password")}
                                placeholder="••••••••"
                                className={inputClass}
                            />
                        </div>

                        {/* Grade picker */}
                        <div>
                            <label className="block text-xs font-medium text-[var(--foreground)]/60 mb-2">
                                Sinf
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {GRADES.map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, grade: g }))}
                                        className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all ${form.grade === g
                                                ? "bg-[var(--green-600)] text-white scale-105 shadow-sm"
                                                : "bg-[var(--card-bg)] border border-[var(--input-border)] text-[var(--foreground)]/50 hover:border-[var(--green-600)]/30 hover:text-[var(--foreground)]"
                                            }`}
                                    >
                                        {g}-sinf
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={register.isPending}
                            className="w-full h-12 bg-[var(--green-600)] text-white font-semibold rounded-xl hover:bg-[var(--green-900)] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {register.isPending ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-[var(--foreground)]/40">
                        Hisobingiz bormi?{" "}
                        <Link href="/login" className="text-[var(--green-600)] font-medium hover:underline">
                            Kirish
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
