"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { playPop } from "../lib/sounds";

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={() => {
                playPop();
                toggleTheme();
            }}
            className={className || "w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[var(--foreground)]/40 hover:text-[var(--foreground)]/70 hover:bg-[var(--green-50)]/40 transition-all"}
            title={theme === "dark" ? "Yorug' rejim" : "Qorong'i rejim"}
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
