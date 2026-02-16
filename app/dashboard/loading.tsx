export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-5">
        {/* Animated bouncing dots */}
        <div className="flex items-center gap-2">
          <span className="loading-dot w-3.5 h-3.5 rounded-full bg-[var(--green-600)]" style={{ animationDelay: "0s" }} />
          <span className="loading-dot w-3.5 h-3.5 rounded-full bg-[var(--green-300)]" style={{ animationDelay: "0.15s" }} />
          <span className="loading-dot w-3.5 h-3.5 rounded-full bg-[var(--green-600)]" style={{ animationDelay: "0.3s" }} />
        </div>
        <p className="text-sm text-[var(--foreground)]/50 font-medium animate-pulse">Yuklanmoqda…</p>
      </div>
    </div>
  );
}
