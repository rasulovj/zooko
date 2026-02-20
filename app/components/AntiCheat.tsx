"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReportViolation } from "../lib/nazorat-ishi";

interface AntiCheatProps {
  examId: string;
  enabled: boolean;
  children: React.ReactNode;
  onViolation?: (type: string, count: number) => void;
}

export default function AntiCheat({ examId, enabled, children, onViolation }: AntiCheatProps) {
  const reportViolation = useReportViolation();
  const violationCount = useRef(0);
  const isFullscreen = useRef(false);

  const report = useCallback((type: string, details?: string) => {
    if (!enabled) return;
    violationCount.current++;
    reportViolation.mutate({ examId, type, details });
    onViolation?.(type, violationCount.current);
  }, [examId, enabled, reportViolation, onViolation]);

  // Request fullscreen on mount
  useEffect(() => {
    if (!enabled) return;

    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
        isFullscreen.current = true;
      } catch {
        // Browser may block without user gesture
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(enterFullscreen, 500);
    return () => clearTimeout(timer);
  }, [enabled]);

  // Detect fullscreen exit
  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen.current) {
        report("fullscreen_exit", "O'quvchi to'liq ekrandan chiqdi");
        // Try to re-enter fullscreen
        document.documentElement.requestFullscreen().catch(() => {});
      }
      isFullscreen.current = !!document.fullscreenElement;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [enabled, report]);

  // Detect tab switch / window blur
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        report("tab_switch", "O'quvchi boshqa tabga o'tdi");
      }
    };

    const handleBlur = () => {
      report("tab_switch", "Brauzer oynasi fokusdan chiqdi");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, report]);

  // Block copy/paste and right-click
  useEffect(() => {
    if (!enabled) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      report("copy_attempt", "Nusxa olishga urinish");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      report("paste_attempt", "Joylashtirish urinishi");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      report("right_click", "O'ng tugma bosildi");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+S, F12
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "a", "s", "u"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        report("copy_attempt", `Klaviatura: ${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key}`);
      }
      if (e.key === "F12") {
        e.preventDefault();
        report("copy_attempt", "F12 — DevTools");
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, report]);

  // Cleanup: exit fullscreen on unmount
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  return <>{children}</>;
}
