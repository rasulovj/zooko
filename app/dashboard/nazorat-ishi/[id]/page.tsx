"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStartExam, useSubmitExam, type ExamData } from "../../../lib/nazorat-ishi";
import AntiCheat from "../../../components/AntiCheat";
import ZookoLoader from "../../../components/ZookoLoader";
import {
  Clock, AlertTriangle, ChevronLeft, ChevronRight, Send, Check,
  Shield, ShieldAlert, ArrowLeft, Trophy, XCircle, Sparkles, Hash, Target,
  ChevronUp, ChevronDown, GripVertical, Code, Type, Link2, Layers,
} from "lucide-react";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const startExam = useStartExam();
  const submitExam = useSubmitExam();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [violationCount, setViolationCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [antiCheatReady, setAntiCheatReady] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const start = async () => {
      try {
        const data = await startExam.mutateAsync(examId);
        setExamData(data);
        if (data.result.answers?.length > 0) {
          const restored: Record<string, any> = {};
          data.result.answers.forEach((a: any) => { restored[a.questionId] = a.answer; });
          setAnswers(restored);
        }
      } catch (err: any) {
        alert(err.response?.data?.message || "Xatolik yuz berdi");
        router.push("/dashboard/nazorat-ishi");
      } finally {
        setLoading(false);
      }
    };
    start();
  }, [examId]);

  useEffect(() => {
    if (!examData) return;
    const endTime = new Date(examData.exam.settings.endTime).getTime();
    const tick = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0 && !submitted) handleSubmit();
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [examData, submitted]);

  useEffect(() => {
    if (examData && !antiCheatReady) setShowWarning(true);
  }, [examData]);

  const handleViolation = useCallback((type: string, count: number) => {
    setViolationCount(count);
  }, []);

  const setAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!examData || submitted) return;
    const answerList = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
    try {
      const result = await submitExam.mutateAsync({ examId, answers: answerList });
      setSubmitResult(result);
      setSubmitted(true);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
    } catch (err: any) {
      alert(err.response?.data?.message || "Xatolik");
    }
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) return <ZookoLoader />;
  if (!examData) return null;

  const questions = examData.exam.questions;
  const question = questions[currentQ];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = totalQ > 0 ? (answeredCount / totalQ) * 100 : 0;

  // ─── Warning screen ───
  if (showWarning && !antiCheatReady) {
    return (
      <div className="h-[calc(100vh-80px)] bg-[var(--background)] flex items-center justify-center p-6 overflow-hidden -m-4 md:-m-6">
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] p-8 shadow-2xl">
            {/* Shield icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <ShieldAlert size={36} className="text-amber-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse" />
              </div>
            </div>

            <h2 className="text-[22px] font-bold text-[var(--foreground)] text-center mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Nazorat ishi qoidalari
            </h2>
            <p className="text-[13px] text-[var(--foreground)]/35 text-center mb-6">Boshlashdan oldin qoidalar bilan tanishing</p>

            <div className="space-y-3 mb-8">
              {[
                { icon: "🖥️", text: "Brauzer to'liq ekranga o'tadi" },
                { icon: "🚫", text: "Boshqa tab/oynaga o'tish taqiqlangan" },
                { icon: "📋", text: "Nusxa olish va joylashtirish bloklangan" },
                { icon: "👁️", text: "Barcha qoidabuzarliklar qayd qilinadi" },
                { icon: "⏰", text: "Vaqt tugaganda javoblar avtomatik yuboriladi" },
              ].map((rule, i) => (
                <div key={i} className="flex items-center gap-3 bg-[var(--foreground)]/[0.03] rounded-xl px-4 py-3 border border-[var(--card-border)]">
                  <span className="text-[16px]">{rule.icon}</span>
                  <span className="text-[13px] font-medium text-[var(--foreground)]/70">{rule.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-amber-500/5 rounded-xl px-4 py-3 border border-amber-500/10 mb-6">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
              <span className="text-[12px] text-amber-600">Qoidabuzarliklar o'qituvchiga real vaqtda ko'rinadi</span>
            </div>

            <button
              onClick={() => { setAntiCheatReady(true); setShowWarning(false); }}
              className="w-full py-3.5 rounded-xl text-[14px] font-bold bg-[var(--green-600)] text-white hover:brightness-90 transition-all shadow-lg active:scale-[0.98]"
            >
              Tushundim, boshlash →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Result screen ───
  if (submitted && submitResult) {
    const passed = submitResult.percentage >= (examData.exam.settings.passingScore || 60);
    return (
      <div className="h-[calc(100vh-80px)] bg-[var(--background)] flex items-center justify-center p-6 overflow-hidden -m-4 md:-m-6">
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] p-8 shadow-xl text-center">
            {/* Result icon */}
            <div className="flex justify-center mb-5">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${passed ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                {passed ? <Trophy size={36} className="text-emerald-500" /> : <XCircle size={36} className="text-red-400" />}
              </div>
            </div>

            <h2 className="text-[22px] font-bold text-[var(--foreground)] mb-1 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {passed ? "Tabriklaymiz! 🎉" : "Nazorat ishi yakunlandi"}
            </h2>
            <p className="text-[13px] text-[var(--foreground)]/40 mb-6">
              {passed ? "Siz muvaffaqiyatli topshirdingiz" : "Natijalar quyida"}
            </p>

            {/* Score circle */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--card-border)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none"
                  stroke={passed ? "#10b981" : "#ef4444"} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - submitResult.percentage / 100)}`}
                  className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-[28px] font-bold ${passed ? "text-emerald-600" : "text-red-500"}`}>{submitResult.percentage}%</span>
                <span className="text-[11px] text-[var(--foreground)]/35">{submitResult.totalScore}/{examData.exam.totalPoints}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[var(--foreground)]/[0.03] rounded-xl p-3">
                <div className="text-[11px] text-[var(--foreground)]/35 mb-0.5">Savollar</div>
                <div className="text-[15px] font-bold text-[var(--foreground)]">{answeredCount}/{totalQ}</div>
              </div>
              <div className="bg-[var(--foreground)]/[0.03] rounded-xl p-3">
                <div className="text-[11px] text-[var(--foreground)]/35 mb-0.5">Holat</div>
                <div className={`text-[15px] font-bold ${passed ? "text-emerald-600" : "text-red-500"}`}>{passed ? "O'tdi ✓" : "O'tmadi ✗"}</div>
              </div>
            </div>

            {submitResult.needsManualReview && (
              <div className="flex items-center gap-2 bg-amber-500/5 rounded-xl px-4 py-3 border border-amber-500/10 mb-6 text-left">
                <Sparkles size={14} className="text-amber-500 flex-shrink-0" />
                <span className="text-[12px] text-amber-600">Kod savollari o'qituvchi tomonidan tekshiriladi. Natija o'zgarishi mumkin.</span>
              </div>
            )}

            <button onClick={() => router.push("/dashboard/nazorat-ishi")}
              className="w-full py-3.5 rounded-xl text-[14px] font-bold bg-[var(--green-600)] text-white hover:brightness-90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
              <ArrowLeft size={16} /> Orqaga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Confirm submit modal ───
  const confirmModal = showConfirm && (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 max-w-sm w-full shadow-xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[var(--green-600)]/10 flex items-center justify-center mx-auto mb-3">
            <Send size={22} className="text-[var(--green-600)]" />
          </div>
          <h3 className="text-[16px] font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>Topshirishni tasdiqlang</h3>
          <p className="text-[13px] text-[var(--foreground)]/45 mt-1">
            {answeredCount}/{totalQ} savolga javob berdingiz
            {answeredCount < totalQ && <span className="text-amber-500 font-semibold"> · {totalQ - answeredCount} ta javobsiz</span>}
          </p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-[var(--foreground)]/5 text-[var(--foreground)]/60 hover:bg-[var(--foreground)]/10 transition-all">
            Bekor qilish
          </button>
          <button onClick={() => { setShowConfirm(false); handleSubmit(); }} disabled={submitExam.isPending}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold bg-[var(--green-600)] text-white hover:brightness-90 transition-all disabled:opacity-50">
            {submitExam.isPending ? "Yuborilmoqda..." : "Ha, topshirish"}
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Type icon helper ───
  const typeIcon = (t: string) => {
    switch (t) {
      case "quiz": return <Hash size={13} />;
      case "code_challenge": return <Code size={13} />;
      case "fill_blank": return <Type size={13} />;
      case "match_words": return <Link2 size={13} />;
      case "scratch_blocks": return <Layers size={13} />;
      default: return <Hash size={13} />;
    }
  };

  // ─── Exam taking UI ───
  return (
    <AntiCheat examId={examId} enabled={antiCheatReady} onViolation={handleViolation}>
      {confirmModal}
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[var(--card-bg)]/90 backdrop-blur-md border-b border-[var(--card-border)] px-4 py-2.5">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[var(--green-600)]/10 flex items-center justify-center flex-shrink-0">
                <Shield size={14} className="text-[var(--green-600)]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-[var(--foreground)] text-[13px] truncate">{examData.exam.title}</h2>
                <div className="flex items-center gap-2 text-[11px] text-[var(--foreground)]/35">
                  <span>{answeredCount}/{totalQ} javob</span>
                  {violationCount > 0 && (
                    <span className="flex items-center gap-0.5 text-red-500 font-semibold">
                      <AlertTriangle size={10} /> {violationCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress ring */}
              <div className="hidden md:block relative w-9 h-9">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--card-border)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--green-600)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                    className="transition-all duration-300" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[var(--foreground)]/60">{Math.round(progress)}%</span>
              </div>

              {/* Timer */}
              {timeLeft !== null && (
                <div className={`flex items-center gap-1.5 font-mono font-bold text-[13px] px-3.5 py-2 rounded-xl transition-colors ${timeLeft < 60 ? "bg-red-500/10 text-red-500 border border-red-500/15" :
                  timeLeft < 300 ? "bg-amber-500/8 text-amber-600 border border-amber-500/15" :
                    "bg-[var(--foreground)]/5 text-[var(--foreground)] border border-transparent"
                  } ${timeLeft < 60 ? "animate-pulse" : ""}`}>
                  <Clock size={13} /> {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div className="max-w-5xl mx-auto mt-2">
            <div className="w-full h-1 bg-[var(--foreground)]/5 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--green-600)] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex max-w-5xl mx-auto w-full">
          {/* Question navigation sidebar */}
          <div className="hidden md:flex w-[72px] flex-col items-center gap-1.5 py-5 border-r border-[var(--card-border)] overflow-y-auto">
            {questions.map((_: any, i: number) => {
              const isAnswered = answers[questions[i]._id] !== undefined;
              const isCurrent = i === currentQ;
              return (
                <button key={i} onClick={() => setCurrentQ(i)}
                  className={`w-11 h-11 rounded-xl text-[12px] font-bold transition-all relative ${isCurrent
                    ? "bg-[var(--green-600)] text-white shadow-md shadow-[var(--green-600)]/20"
                    : isAnswered
                      ? "bg-[var(--green-600)]/10 text-[var(--green-600)] border border-[var(--green-600)]/15"
                      : "bg-[var(--foreground)]/[0.03] text-[var(--foreground)]/40 hover:bg-[var(--foreground)]/[0.06] border border-transparent"
                    }`}
                >
                  {i + 1}
                  {isAnswered && !isCurrent && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[var(--green-600)] rounded-full border-2 border-[var(--card-bg)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 md:p-8 overflow-y-auto">
            {question && (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Question header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--foreground)]/35 bg-[var(--foreground)]/[0.03] px-3 py-1.5 rounded-lg border border-[var(--card-border)]">
                      {typeIcon(question.type)}
                      Savol {currentQ + 1}/{totalQ}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[12px] font-bold text-[var(--green-600)] bg-[var(--green-600)]/8 px-2.5 py-1 rounded-lg">
                    <Target size={11} /> {question.points} ball
                  </span>
                </div>

                {/* Question content */}
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6">
                  <QuestionRenderer question={question} answer={answers[question._id]} onAnswer={(a) => setAnswer(question._id, a)} />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-[var(--foreground)]/[0.03] text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/[0.06] transition-all disabled:opacity-25 border border-[var(--card-border)]">
                    <ChevronLeft size={15} /> Oldingi
                  </button>

                  {/* Mobile question dots */}
                  <div className="flex md:hidden gap-1.5 flex-wrap justify-center max-w-[200px]">
                    {questions.map((_: any, i: number) => (
                      <button key={i} onClick={() => setCurrentQ(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentQ ? "bg-[var(--green-600)] scale-125" : answers[questions[i]._id] !== undefined ? "bg-[var(--green-600)]/40" : "bg-[var(--foreground)]/10"}`} />
                    ))}
                  </div>

                  {currentQ < totalQ - 1 ? (
                    <button onClick={() => setCurrentQ(currentQ + 1)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold bg-[var(--green-600)] text-white hover:brightness-90 transition-all active:scale-[0.97]">
                      Keyingi <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button onClick={() => setShowConfirm(true)}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-bold bg-[var(--green-600)] text-white hover:brightness-90 transition-all active:scale-[0.97]">
                      <Send size={13} /> Topshirish
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AntiCheat>
  );
}

// ═══════════════ QUESTION RENDERER ═══════════════
function QuestionRenderer({ question, answer, onAnswer }: { question: any; answer: any; onAnswer: (a: any) => void }) {
  const imgSrc = (url: string) => url?.startsWith("/uploads") ? `${process.env.NEXT_PUBLIC_IMAGE_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${url}` : url;

  switch (question.type) {
    case "quiz":
      return (
        <div className="space-y-4">
          <h3 className="text-[17px] font-bold text-[var(--foreground)] leading-snug">{question.question}</h3>
          {question.questionImage && (
            <div className="max-w-md">
              <img src={imgSrc(question.questionImage)} alt="" className="w-full h-auto rounded-xl border border-[var(--card-border)]" />
            </div>
          )}
          <div className="space-y-2.5">
            {(question.options || []).map((opt: any, i: number) => {
              const selected = answer === i;
              return (
                <button key={i} onClick={() => onAnswer(i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-[14px] group ${selected
                    ? "border-[var(--green-600)] bg-[var(--green-600)]/5"
                    : "border-[var(--card-border)] hover:border-[var(--green-600)]/25 hover:bg-[var(--foreground)]/[0.01]"
                    }`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-lg text-[12px] font-bold transition-all flex-shrink-0 ${selected ? "bg-[var(--green-600)] text-white" : "bg-[var(--foreground)]/5 text-[var(--foreground)]/40 group-hover:bg-[var(--foreground)]/8"
                      }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <div className="flex-1 space-y-2">
                      <span className={selected ? "text-[var(--green-600)] font-medium" : "text-[var(--foreground)]/80"}>{opt.text}</span>
                      {opt.image && <img src={imgSrc(opt.image)} alt="" className="max-w-[200px] h-auto rounded-lg border border-[var(--card-border)]" />}
                    </div>
                    {selected && <Check size={16} className="ml-auto text-[var(--green-600)] flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );

    case "code_challenge":
      return (
        <div className="space-y-4">
          <h3 className="text-[17px] font-bold text-[var(--foreground)] leading-snug">
            Kod yozing <span className="text-[13px] font-semibold text-[var(--foreground)]/30 ml-2">({question.language})</span>
          </h3>
          {question.hint && (
            <div className="flex items-start gap-2 bg-amber-500/5 rounded-xl px-4 py-3 border border-amber-500/10">
              <Sparkles size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-[13px] text-amber-700">{question.hint}</span>
            </div>
          )}
          {question.codeTemplate && (
            <pre className="bg-[var(--foreground)]/[0.03] rounded-xl p-4 text-[13px] font-mono text-[var(--foreground)]/60 overflow-x-auto border border-[var(--card-border)]">{question.codeTemplate}</pre>
          )}
          <textarea
            value={answer || ""}
            onChange={e => onAnswer(e.target.value)}
            placeholder="Javobingizni yozing..."
            rows={10}
            className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-[13px] font-mono text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--green-600)]/20 focus:border-[var(--green-600)]/30 resize-none transition-all"
          />
        </div>
      );

    case "fill_blank":
      return (
        <div className="space-y-4">
          <h3 className="text-[17px] font-bold text-[var(--foreground)] leading-snug">Bo'sh joylarni to'ldiring</h3>
          <p className="text-[14px] text-[var(--foreground)]/60 leading-relaxed bg-[var(--foreground)]/[0.02] rounded-xl p-4 border border-[var(--card-border)]">{question.blankText}</p>
          <div className="space-y-2.5">
            {Array.from({ length: (question.blankText?.match(/___/g) || []).length || 1 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--green-600)]/8 text-[var(--green-600)] text-[12px] font-bold">{i + 1}</span>
                <input
                  value={(answer || [])[i] || ""}
                  onChange={e => {
                    const arr = [...(answer || [])];
                    arr[i] = e.target.value;
                    onAnswer(arr);
                  }}
                  placeholder={`${i + 1}-javob`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-[13px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--green-600)]/20 focus:border-[var(--green-600)]/30 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "match_words":
      return (
        <div className="space-y-4">
          <h3 className="text-[17px] font-bold text-[var(--foreground)] leading-snug">Juftliklarni toping</h3>
          <div className="space-y-2.5">
            {(question.pairs || []).map((pair: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="px-3.5 py-2.5 rounded-xl bg-[var(--green-600)]/8 text-[var(--green-600)] text-[13px] font-semibold min-w-[90px] text-center border border-[var(--green-600)]/10">{pair.left}</span>
                <span className="text-[var(--foreground)]/20">→</span>
                <input
                  value={(answer || [])[i]?.right || ""}
                  onChange={e => {
                    const arr = [...(answer || question.pairs.map((p: any) => ({ left: p.left, right: "" })))];
                    arr[i] = { left: pair.left, right: e.target.value };
                    onAnswer(arr);
                  }}
                  placeholder="Javob"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] text-[13px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--green-600)]/20 focus:border-[var(--green-600)]/30 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "scratch_blocks":
      return <ScratchBlocksQuestion question={question} answer={answer} onAnswer={onAnswer} />;

    default:
      return <p className="text-[var(--foreground)]/50">Noma'lum savol turi</p>;
  }
}

// Scratch blocks with reordering
function ScratchBlocksQuestion({ question, answer, onAnswer }: { question: any; answer: any; onAnswer: (a: any) => void }) {
  const blocks = question.scratchBlocks || [];
  const [items, setItems] = useState<string[]>(() => {
    if (answer) return answer;
    return [...blocks].sort(() => Math.random() - 0.5).map((b: any) => b.text);
  });

  const moveItem = (from: number, to: number) => {
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    onAnswer(updated);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[17px] font-bold text-[var(--foreground)] leading-snug">Bloklarni to'g'ri tartibga joylashtiring</h3>
      {question.scratchInstruction && (
        <p className="text-[13px] text-[var(--foreground)]/50 bg-[var(--foreground)]/[0.02] rounded-xl p-3 border border-[var(--card-border)]">{question.scratchInstruction}</p>
      )}
      <div className="space-y-2">
        {items.map((text, i) => (
          <div key={i} className="flex items-center gap-2 group">
            <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
              <button onClick={() => i > 0 && moveItem(i, i - 1)} disabled={i === 0}
                className="hover:text-[var(--green-600)] disabled:opacity-20 transition-colors p-0.5">
                <ChevronUp size={14} />
              </button>
              <button onClick={() => i < items.length - 1 && moveItem(i, i + 1)} disabled={i === items.length - 1}
                className="hover:text-[var(--green-600)] disabled:opacity-20 transition-colors p-0.5">
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--green-600)]/5 border border-[var(--green-600)]/10 text-[13px] font-mono text-[var(--foreground)] group-hover:border-[var(--green-600)]/25 transition-all">
              <GripVertical size={14} className="text-[var(--foreground)]/20" />
              <span className="flex items-center justify-center w-5 h-5 rounded bg-[var(--green-600)]/10 text-[var(--green-600)] text-[10px] font-bold">{i + 1}</span>
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
