"use client";

import { useMyExams, type MyExam } from "../../lib/nazorat-ishi";
import ZookoLoader from "../../components/ZookoLoader";
import { ClipboardCheck, Clock, CheckCircle2, AlertCircle, Lock, ArrowRight, Target, Hash, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

function formatDate(d: string) {
  return new Date(d).toLocaleString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getTimeUntil(d: string) {
  const diff = new Date(d).getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return `${Math.floor(h / 24)} kun`;
  if (h > 0) return `${h} soat ${m} daqiqa`;
  return `${m} daqiqa`;
}

function getExamStatus(exam: MyExam) {
  const now = new Date();
  const start = new Date(exam.settings.startTime);
  const end = new Date(exam.settings.endTime);

  if (exam.myResult?.status === "submitted" || exam.myResult?.status === "graded") {
    return { key: "done", label: "Topshirilgan", color: "bg-emerald-500/8 text-emerald-600 border-emerald-500/15", dot: "bg-emerald-500", canStart: false };
  }
  if (now < start) {
    return { key: "waiting", label: "Boshlanmagan", color: "bg-[var(--foreground)]/5 text-[var(--foreground)]/50 border-[var(--card-border)]", dot: "bg-[var(--foreground)]/30", canStart: false };
  }
  if (now > end) {
    return { key: "expired", label: "Vaqt tugagan", color: "bg-red-500/8 text-red-500 border-red-500/15", dot: "bg-red-400", canStart: false };
  }
  if (exam.myResult?.status === "in_progress") {
    return { key: "active", label: "Davom etmoqda", color: "bg-amber-500/8 text-amber-600 border-amber-500/15", dot: "bg-amber-500 animate-pulse", canStart: true };
  }
  return { key: "ready", label: "Tayyor", color: "bg-blue-500/8 text-blue-600 border-blue-500/15", dot: "bg-blue-500", canStart: true };
}

export default function NazoratIshiListPage() {
  const { data: exams, isLoading } = useMyExams();
  const router = useRouter();

  if (isLoading) return <ZookoLoader />;

  const activeExams = exams?.filter(e => { const s = getExamStatus(e); return s.key === "ready" || s.key === "active"; }) || [];
  const otherExams = exams?.filter(e => { const s = getExamStatus(e); return s.key !== "ready" && s.key !== "active"; }) || [];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[var(--foreground)] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Nazorat ishlari
        </h1>
        <p className="text-[14px] text-[var(--foreground)]/50 mt-1">
          Sizga tayinlangan imtihonlar va nazorat ishlari
          {exams && <span className="ml-1 font-semibold text-[var(--green-600)]">· {exams.length} ta</span>}
        </p>
      </div>

      {!exams || exams.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-[var(--foreground)]/5 flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck size={28} className="text-[var(--foreground)]/20" />
          </div>
          <p className="text-[var(--foreground)]/40 text-[16px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>Hozircha nazorat ishlari yo'q</p>
          <p className="text-[13px] text-[var(--foreground)]/30 mt-1">O'qituvchi yangi nazorat ishi tayinlaganda bu yerda ko'rinadi</p>
        </div>
      ) : (
        <>
          {/* Active / Ready exams — hero style */}
          {activeExams.length > 0 && (
            <div className="space-y-3">
              {activeExams.map(exam => {
                const status = getExamStatus(exam);
                const isResuming = exam.myResult?.status === "in_progress";
                return (
                  <div key={exam._id}
                    className="bg-gradient-to-br from-[#1B512D] to-[#1C7C54] rounded-2xl p-5 md:p-6 shadow-lg relative overflow-hidden animate-fade-in-up">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#73E2A7]/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#73E2A7]/8 rounded-full blur-2xl" />
                    <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                            <Sparkles size={16} className="text-[#73E2A7]" />
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-white/10 text-white/80 border border-white/10`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isResuming ? "bg-amber-400 animate-pulse" : "bg-[#73E2A7]"}`} />
                              {status.label}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-[18px] md:text-[20px] font-bold text-white tracking-tight mb-1" style={{ fontFamily: "var(--font-display)" }}>{exam.title}</h3>
                        {exam.description && <p className="text-[13px] text-white/50 mb-3">{exam.description}</p>}
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/40">
                          <span className="flex items-center gap-1.5"><Clock size={11} /> {formatDate(exam.settings.startTime)} — {formatDate(exam.settings.endTime)}</span>
                          <span className="flex items-center gap-1.5"><Hash size={11} /> {exam.questions.length} savol</span>
                          <span className="flex items-center gap-1.5"><Target size={11} /> {exam.totalPoints} ball</span>
                        </div>
                      </div>
                      <button onClick={() => router.push(`/dashboard/nazorat-ishi/${exam._id}`)}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-bold bg-white text-[#1B512D] hover:bg-white/90 transition-all shadow-lg active:scale-[0.97] flex-shrink-0">
                        {isResuming ? "Davom etish" : "Boshlash"}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Other exams */}
          {otherExams.length > 0 && (
            <div className="space-y-3">
              {activeExams.length > 0 && (
                <h2 className="text-[14px] font-semibold text-[var(--foreground)]/40 uppercase tracking-wider px-1">Boshqa nazorat ishlari</h2>
              )}
              {otherExams.map(exam => {
                const status = getExamStatus(exam);
                const timeUntil = status.key === "waiting" ? getTimeUntil(exam.settings.startTime) : null;
                return (
                  <div key={exam._id}
                    className={`bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-5 transition-all duration-200 ${status.key === "done" ? "opacity-75" : ""}`}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`hidden md:flex w-11 h-11 rounded-xl items-center justify-center flex-shrink-0 ${status.key === "done" ? "bg-emerald-500/10" : status.key === "expired" ? "bg-red-500/8" : "bg-[var(--foreground)]/5"}`}>
                        {status.key === "done" ? <CheckCircle2 size={18} className="text-emerald-500" /> : status.key === "expired" ? <AlertCircle size={18} className="text-red-400" /> : <ClipboardCheck size={18} className="text-[var(--foreground)]/30" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1">
                          <h3 className="text-[15px] font-bold text-[var(--foreground)] truncate">{exam.title}</h3>
                          <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                        </div>
                        {exam.description && <p className="text-[13px] text-[var(--foreground)]/45 mb-2">{exam.description}</p>}
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--foreground)]/40">
                          <span className="flex items-center gap-1.5"><Clock size={11} /> {formatDate(exam.settings.startTime)} — {formatDate(exam.settings.endTime)}</span>
                          <span className="flex items-center gap-1"><Hash size={11} />{exam.questions.length} savol</span>
                          <span className="flex items-center gap-1"><Target size={11} />{exam.totalPoints} ball</span>
                          {timeUntil && <span className="font-semibold text-blue-600">{timeUntil} qoldi</span>}
                        </div>

                        {/* Score for completed */}
                        {exam.myResult && (exam.myResult.status === "submitted" || exam.myResult.status === "graded") && (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${exam.myResult.percentage >= exam.settings.passingScore ? "bg-emerald-500" : "bg-red-400"}`} style={{ width: `${Math.min(exam.myResult.percentage, 100)}%` }} />
                              </div>
                              <span className={`text-[13px] font-bold ${exam.myResult.percentage >= exam.settings.passingScore ? "text-emerald-600" : "text-red-500"}`}>
                                {exam.myResult.percentage}%
                              </span>
                              <span className="text-[12px] text-[var(--foreground)]/30">{exam.myResult.totalScore}/{exam.totalPoints}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side */}
                      <div className="flex-shrink-0 ml-2">
                        {status.key === "done" ? (
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 flex items-center justify-center">
                            <Lock size={16} className="text-[var(--foreground)]/20" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
