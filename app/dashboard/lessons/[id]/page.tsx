"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourse, type ContentBlock } from "../../../lib/courses";
import { useProgress, useCompleteLesson, useSubmitQuiz, useSubmitInteractive } from "../../../lib/progress";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CircleHelp,
  Play,
  PenLine,
  ArrowLeftRight,
  Layers3,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Loader2,
  Inbox,
  Lightbulb,
  GripVertical,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { playClick, playSuccess, playError, playLevelUp, playPop, playCelebrate } from "../../../lib/sounds";
import ZCIcon from "../../../components/ZCIcon";
import ZookoLoader from "../../../components/ZookoLoader";

/* ===== Shared UI Atoms ===== */
const ACCENT = {
  quiz: { bg: "bg-[#1C7C54]/5", border: "border-[var(--card-border)]", text: "text-[var(--green-600)]", label: "Test", Icon: CircleHelp },
  code_challenge: { bg: "bg-[#1B512D]/5", border: "border-[#1B512D]/10", text: "text-[var(--foreground)]", label: "Kod", Icon: Play },
  fill_blank: { bg: "bg-[#73E2A7]/10", border: "border-[#73E2A7]/30", text: "text-[var(--foreground)]", label: "Bo'sh joy", Icon: PenLine },
  match_words: { bg: "bg-[var(--green-50)]/40", border: "border-[#73E2A7]/20", text: "text-[var(--green-600)]", label: "Moslashtirish", Icon: ArrowLeftRight },
  scratch_blocks: { bg: "bg-[#1C7C54]/5", border: "border-[var(--card-border)]", text: "text-[var(--green-600)]", label: "Bloklar", Icon: Layers3 },
} as const;

function BlockShell({ type, xp, children }: { type: keyof typeof ACCENT; xp?: number; children: React.ReactNode }) {
  const a = ACCENT[type];
  const BlockIcon = a.Icon;
  return (
    <div className={`rounded-2xl border ${a.border} ${a.bg} overflow-hidden transition-shadow hover:shadow-md hover:shadow-[#1C7C54]/5`}>
      <div className="flex items-center gap-2 md:gap-2.5 px-4 md:px-6 pt-4 md:pt-5 pb-2">
        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[var(--card-bg)]/70 flex items-center justify-center`}>
          <BlockIcon size={14} className={a.text} />
        </div>
        <span className={`text-[11px] md:text-[12px] font-bold uppercase tracking-wider ${a.text}`}>{a.label}</span>
        {xp && (
          <span className="ml-auto flex items-center gap-1 md:gap-1.5 text-[11px] md:text-[12px] font-bold text-[var(--green-600)]/50 bg-[var(--green-50)]/60 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">
            <ZCIcon size={12} />+{xp} ZC
          </span>
        )}
      </div>
      <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 md:pt-3">{children}</div>
    </div>
  );
}

function ResultBanner({ correct, xp }: { correct: boolean; xp: number }) {
  return (
    <div className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 rounded-2xl ${correct ? "bg-[var(--green-50)]" : "bg-red-50"}`}>
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${correct ? "bg-[#1C7C54]" : "bg-red-400"}`}>
        {correct ? <CheckCircle2 size={20} className="text-white" /> : <XCircle size={20} className="text-white" />}
      </div>
      <div>
        <p className={`text-lg font-bold ${correct ? "text-[var(--foreground)]" : "text-red-700"}`}>{correct ? "To'g'ri javob!" : "Noto'g'ri"}</p>
        {xp > 0 && (
          <p className="text-[13px] font-semibold text-[var(--green-600)]/70 mt-0.5 flex items-center gap-1">
            <ZCIcon size={14} /> +{xp} ZC olindi
          </p>
        )}
      </div>
    </div>
  );
}

function AnsweredBadge({ correct }: { correct: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg ${correct ? "bg-[var(--green-50)] text-[var(--green-600)]" : "bg-red-50 text-red-500"}`}>
      {correct ? <Check size={13} /> : <X size={13} />}
      {correct ? "To'g'ri" : "Noto'g'ri"}
    </span>
  );
}

function SubmitBtn({ onClick, disabled, loading, label }: { onClick: () => void; disabled: boolean; loading: boolean; label: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full bg-[#1C7C54] text-white text-[15px] font-bold py-4 rounded-2xl hover:bg-[#1B512D] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md shadow-[#1C7C54]/15 flex items-center justify-center gap-2">
      {loading ? <><Loader2 size={18} className="animate-spin" /> Tekshirilmoqda...</> : label}
    </button>
  );
}

/* ===== QUIZ BLOCK ===== */
function QuizBlock({ block, courseId, lessonId, progress, submitQuiz }: {
  block: ContentBlock; courseId: string; lessonId: string; progress: any; submitQuiz: any;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; xpEarned: number } | null>(null);
  const alreadyAnswered = progress?.quizScores?.find((q: any) => q.contentId === block._id);

  const handleSubmit = async () => {
    if (selected === null) return;
    const res = await submitQuiz.mutateAsync({ courseId, lessonId, contentId: block._id, selectedIndex: selected });
    setResult({ correct: res.correct, xpEarned: res.xpEarned });
    res.correct ? playCelebrate() : playError();
  };

  if (alreadyAnswered) return (
    <BlockShell type="quiz">
      <div className="flex items-center gap-2 mb-4"><AnsweredBadge correct={alreadyAnswered.correct} /></div>
      <p className="text-lg font-bold text-[var(--foreground)] mb-4">{block.question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {block.options?.map((opt: any, i: number) => (
          <div key={opt._id || i} className={`text-base px-5 py-4 rounded-2xl border-2 transition-colors ${i === block.correctIndex ? "bg-[var(--green-50)] border-[#73E2A7] text-[var(--foreground)] font-bold" : "bg-[var(--card-bg)]/60 border-[var(--card-border)] text-[var(--foreground)]/40"}`}>
            <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span> {opt.text}
          </div>
        ))}
      </div>
    </BlockShell>
  );

  if (result) return <BlockShell type="quiz"><ResultBanner correct={result.correct} xp={result.xpEarned} /></BlockShell>;

  return (
    <BlockShell type="quiz" xp={block.xpReward || 20}>
      <p className="text-lg font-bold text-[var(--foreground)] mb-5">{block.question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {block.options?.map((opt: any, i: number) => (
          <button key={opt._id || i} onClick={() => setSelected(i)}
            className={`text-left text-base px-5 py-4.5 rounded-2xl border-2 transition-all duration-200 ${selected === i ? "border-[#1C7C54] bg-[var(--green-50)]/60 text-[var(--foreground)] font-semibold scale-[1.02] shadow-md shadow-[#1C7C54]/10" : "border-transparent bg-[var(--card-bg)]/80 hover:bg-[var(--card-bg)] hover:border-[#73E2A7]/40 hover:scale-[1.01] text-[var(--foreground)]/70"}`}>
            <span className="font-bold mr-2 opacity-40">{String.fromCharCode(65 + i)}.</span> {opt.text}
          </button>
        ))}
      </div>
      <SubmitBtn onClick={handleSubmit} disabled={selected === null || submitQuiz.isPending} loading={submitQuiz.isPending} label="Javobni tekshirish" />
    </BlockShell>
  );
}

/* ===== CODE CHALLENGE BLOCK ===== */
function CodeChallengeBlock({ block, courseId, lessonId, progress, submitInteractive }: {
  block: ContentBlock; courseId: string; lessonId: string; progress: any; submitInteractive: any;
}) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ correct: boolean; xpEarned: number } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const alreadyAnswered = progress?.quizScores?.find((q: any) => q.contentId === block._id);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    const res = await submitInteractive.mutateAsync({ courseId, lessonId, contentId: block._id, answer: answer.trim() });
    setResult({ correct: res.correct, xpEarned: res.xpEarned });
    res.correct ? playCelebrate() : playError();
  };

  if (alreadyAnswered) return (
    <BlockShell type="code_challenge">
      <div className="flex items-center gap-2 mb-4"><AnsweredBadge correct={alreadyAnswered.correct} /></div>
      <p className="text-lg font-bold text-[var(--foreground)] mb-4">{block.question}</p>
      {block.codeTemplate && <pre className="bg-[#1B512D] text-[#73E2A7] text-base p-6 rounded-2xl overflow-x-auto font-mono leading-relaxed">{block.codeTemplate}</pre>}
      <p className="text-sm text-[var(--foreground)]/50 mt-4">Javob: <code className="bg-[var(--green-50)] px-3 py-1 rounded-lg text-[var(--green-600)] font-bold text-base">{block.expectedOutput}</code></p>
    </BlockShell>
  );

  if (result) return (
    <BlockShell type="code_challenge">
      <ResultBanner correct={result.correct} xp={result.xpEarned} />
      {!result.correct && <p className="text-sm text-[var(--foreground)]/50 mt-4">To'g'ri javob: <code className="bg-[var(--green-50)] px-3 py-1 rounded-lg text-[var(--green-600)] font-bold text-base">{block.expectedOutput}</code></p>}
    </BlockShell>
  );

  return (
    <BlockShell type="code_challenge" xp={block.xpReward || 20}>
      <p className="text-lg font-bold text-[var(--foreground)] mb-5">{block.question}</p>
      {block.codeTemplate && <pre className="bg-[#1B512D] text-[#73E2A7] text-base p-6 rounded-2xl overflow-x-auto font-mono leading-relaxed mb-5">{block.codeTemplate}</pre>}
      <div className="space-y-4">
        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Natijani yozing..."
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full h-14 px-5 bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-2xl text-base font-mono text-[var(--foreground)] placeholder:text-[var(--foreground)]/25 focus:outline-none focus:ring-2 focus:ring-[#73E2A7]/40 focus:border-[#73E2A7] transition-all" />
        {block.hint && (
          <div>
            <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-1.5 text-sm font-bold text-[var(--green-600)]/60 hover:text-[var(--green-600)] transition-colors">
              <Lightbulb size={14} /> {showHint ? "Yashirish" : "Maslahat ko'rish"}
            </button>
            {showHint && <p className="text-sm text-[var(--green-600)] mt-2 bg-[var(--green-50)]/50 px-5 py-3 rounded-2xl">{block.hint}</p>}
          </div>
        )}
        <SubmitBtn onClick={handleSubmit} disabled={!answer.trim() || submitInteractive.isPending} loading={submitInteractive.isPending} label="Natijani tekshirish" />
      </div>
    </BlockShell>
  );
}

/* ===== FILL BLANK BLOCK ===== */
function FillBlankBlock({ block, courseId, lessonId, progress, submitInteractive }: {
  block: ContentBlock; courseId: string; lessonId: string; progress: any; submitInteractive: any;
}) {
  const blanks = block.blanks || [];
  const blankCount = (block.blankText?.match(/___/g) || []).length;
  const [placed, setPlaced] = useState<(string | null)[]>(Array(blankCount).fill(null));
  const [result, setResult] = useState<{ correct: boolean; xpEarned: number } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const alreadyAnswered = progress?.quizScores?.find((q: any) => q.contentId === block._id);

  const shuffledWords = useMemo(() => {
    const arr = [...blanks];
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [blanks]);

  const handleDragStart = (word: string) => setDragging(word);
  const handleDropOnSlot = (slotIndex: number) => {
    if (!dragging) return;
    const newPlaced = [...placed];
    newPlaced[slotIndex] = dragging;
    setPlaced(newPlaced);
    setDragging(null);
  };
  const handleClickWord = (word: string) => {
    const emptyIdx = placed.findIndex(p => p === null);
    if (emptyIdx === -1) return;
    const newPlaced = [...placed];
    newPlaced[emptyIdx] = word;
    setPlaced(newPlaced);
  };
  const handleRemoveFromSlot = (slotIndex: number) => {
    const newPlaced = [...placed];
    newPlaced[slotIndex] = null;
    setPlaced(newPlaced);
  };
  const handleSubmit = async () => {
    if (placed.some(p => !p)) return;
    const res = await submitInteractive.mutateAsync({ courseId, lessonId, contentId: block._id, answer: placed });
    setResult({ correct: res.correct, xpEarned: res.xpEarned });
    res.correct ? playCelebrate() : playError();
  };

  const renderText = (showAnswers: boolean) => {
    const parts = block.blankText?.split("___") || [];
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && (
          showAnswers ? (
            <span className="inline-block bg-[var(--green-50)] text-[var(--foreground)] font-bold px-4 py-1 rounded-xl mx-1 border-2 border-[#73E2A7] text-base">{blanks[i]}</span>
          ) : (
            <span
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOnSlot(i)}
              onClick={() => placed[i] && handleRemoveFromSlot(i)}
              className={`inline-flex items-center justify-center min-w-[100px] h-11 px-4 mx-1 rounded-xl border-2 border-dashed text-base font-bold cursor-pointer transition-all duration-200 align-middle ${placed[i]
                ? "bg-[var(--green-50)] border-[#73E2A7] text-[var(--foreground)] hover:opacity-70 hover:scale-95"
                : dragging
                  ? "bg-[#73E2A7]/10 border-[#73E2A7] text-[#73E2A7] scale-105 animate-pulse"
                  : "bg-[var(--card-bg)]/80 border-[#1C7C54]/15 text-[var(--green-600)]/30"
                }`}
            >
              {placed[i] || "—"}
            </span>
          )
        )}
      </span>
    ));
  };

  if (alreadyAnswered) return (
    <BlockShell type="fill_blank">
      <div className="flex items-center gap-2 mb-4"><AnsweredBadge correct={alreadyAnswered.correct} /></div>
      <p className="text-lg text-[var(--foreground)] leading-relaxed">{renderText(true)}</p>
    </BlockShell>
  );

  if (result) return (
    <BlockShell type="fill_blank">
      <ResultBanner correct={result.correct} xp={result.xpEarned} />
      {!result.correct && <p className="text-sm text-[var(--foreground)]/50 mt-4">To'g'ri javoblar: <span className="font-bold">{blanks.join(", ")}</span></p>}
    </BlockShell>
  );

  return (
    <BlockShell type="fill_blank" xp={block.xpReward || 20}>
      <p className="text-lg text-[var(--foreground)] leading-[2.4] mb-6">{renderText(false)}</p>

      <div className="flex flex-wrap gap-3 mb-5">
        {shuffledWords.map((word, i) => {
          const usedCountSoFar = shuffledWords.slice(0, i).filter(w2 => w2 === word).length;
          const placedCount = placed.filter(p => p === word).length;
          const thisOneUsed = usedCountSoFar < placedCount;
          return (
            <button key={i} draggable={!thisOneUsed}
              onDragStart={() => !thisOneUsed && handleDragStart(word)}
              onDragEnd={() => setDragging(null)}
              onClick={() => !thisOneUsed && handleClickWord(word)}
              className={`px-5 py-3 rounded-xl text-base font-bold border-2 transition-all duration-200 select-none ${thisOneUsed
                ? "bg-[#1C7C54]/5 border-[var(--card-border)] text-[var(--green-600)]/20 cursor-default scale-95"
                : "bg-[var(--card-bg)] border-[#73E2A7] text-[var(--foreground)] hover:bg-[var(--green-50)]/50 hover:scale-105 hover:shadow-md hover:shadow-[#73E2A7]/20 cursor-grab active:cursor-grabbing shadow-sm"
                }`}
            >
              {word}
            </button>
          );
        })}
      </div>

      <p className="text-[12px] text-[var(--green-600)]/40 mb-5 flex items-center gap-1.5"><Lightbulb size={13} /> So'zni sudrab yoki bosib joylashtiring · Olib tashlash uchun bo'sh joydagi so'zni bosing</p>
      <SubmitBtn onClick={handleSubmit} disabled={placed.some(p => !p) || submitInteractive.isPending} loading={submitInteractive.isPending} label="Javobni tekshirish" />
    </BlockShell>
  );
}

/* ===== MATCH WORDS BLOCK ===== */
function MatchWordsBlock({ block, courseId, lessonId, progress, submitInteractive }: {
  block: ContentBlock; courseId: string; lessonId: string; progress: any; submitInteractive: any;
}) {
  const pairs = block.pairs || [];
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<{ left: string; right: string }[]>([]);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [result, setResult] = useState<{ correct: boolean; xpEarned: number } | null>(null);
  const alreadyAnswered = progress?.quizScores?.find((q: any) => q.contentId === block._id);

  const shuffledLeft = useMemo(() => {
    const arr = pairs.map(p => p.left);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [pairs]);
  const shuffledRight = useMemo(() => {
    const arr = pairs.map(p => p.right);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [pairs]);

  const checkPair = (left: string, right: string) => {
    const isCorrect = pairs.some(p => p.left === left && p.right === right);
    if (isCorrect) {
      playPop();
      const newMatched = [...matched, { left, right }];
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (newMatched.length === pairs.length) {
        setTimeout(async () => {
          const res = await submitInteractive.mutateAsync({ courseId, lessonId, contentId: block._id, answer: newMatched });
          setResult({ correct: res.correct, xpEarned: res.xpEarned });
          res.correct ? playCelebrate() : playError();
        }, 600);
      }
    } else {
      playError();
      setWrongPair({ left, right });
      setTimeout(() => { setWrongPair(null); setSelectedLeft(null); setSelectedRight(null); }, 800);
    }
  };
  const handleLeftClick = (left: string) => {
    if (isLeftMatched(left) || wrongPair) return;
    setSelectedLeft(left);
    if (selectedRight) checkPair(left, selectedRight);
  };
  const handleRightClick = (right: string) => {
    if (isRightMatched(right) || wrongPair) return;
    setSelectedRight(right);
    if (selectedLeft) checkPair(selectedLeft, right);
  };

  const isLeftMatched = (left: string) => matched.some(m => m.left === left);
  const isRightMatched = (right: string) => matched.some(m => m.right === right);
  const getMatchIndex = (left: string) => matched.findIndex(m => m.left === left);
  const getMatchIndexByRight = (right: string) => matched.findIndex(m => m.right === right);

  const matchTones = [
    { bg: "bg-[var(--green-50)]", border: "border-[#73E2A7]", text: "text-[var(--foreground)]" },
    { bg: "bg-[#73E2A7]/20", border: "border-[#1C7C54]/30", text: "text-[var(--green-600)]" },
    { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
    { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
    { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
    { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700" },
  ];

  if (alreadyAnswered) return (
    <BlockShell type="match_words">
      <div className="flex items-center gap-2 mb-4"><AnsweredBadge correct={alreadyAnswered.correct} /></div>
      <div className="space-y-3">
        {pairs.map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="bg-[var(--green-50)] text-[var(--foreground)] text-base font-semibold px-5 py-3.5 rounded-2xl border-2 border-[#73E2A7]/50 flex-1 text-center">{p.left}</span>
            <span className="text-[#73E2A7] text-lg font-bold">⟷</span>
            <span className="bg-[var(--green-50)] text-[var(--foreground)] text-base font-semibold px-5 py-3.5 rounded-2xl border-2 border-[#73E2A7]/50 flex-1 text-center">{p.right}</span>
          </div>
        ))}
      </div>
    </BlockShell>
  );

  if (result) return (
    <BlockShell type="match_words">
      <ResultBanner correct={result.correct} xp={result.xpEarned} />
      {!result.correct && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase tracking-wide">To'g'ri juftliklar</p>
          {pairs.map((p, i) => (
            <p key={i} className="text-base text-[var(--foreground)]/70"><span className="font-bold">{p.left}</span> ⟷ <span className="font-bold">{p.right}</span></p>
          ))}
        </div>
      )}
    </BlockShell>
  );

  return (
    <BlockShell type="match_words" xp={block.xpReward || 20}>
      {block.question && <p className="text-lg font-bold text-[var(--foreground)] mb-4">{block.question}</p>}
      <p className="text-[13px] text-[var(--green-600)]/50 mb-5 flex items-center gap-1.5"><ArrowLeftRight size={14} /> Chap va o'ngdan mos juftliklarni tanlang</p>

      {/* Progress indicator */}
      {pairs.length > 0 && (
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-2.5 bg-[var(--green-50)] rounded-full overflow-hidden">
            <div className="h-full bg-[#1C7C54] rounded-full transition-all duration-500 ease-out" style={{ width: `${(matched.length / pairs.length) * 100}%` }} />
          </div>
          <span className="text-sm font-bold text-[var(--green-600)]">{matched.length}/{pairs.length}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5 mb-4">
        <div className="space-y-3">
          {shuffledLeft.map((left, i) => {
            const mi = getMatchIndex(left);
            const isMatched = mi !== -1;
            const isWrong = wrongPair?.left === left;
            const tone = isMatched ? matchTones[mi % matchTones.length] : null;
            return (
              <button key={i} onClick={() => handleLeftClick(left)} disabled={isMatched || !!wrongPair}
                className={`w-full text-center text-base font-semibold px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${isMatched ? `${tone!.bg} ${tone!.border} ${tone!.text} opacity-60 cursor-default scale-95` :
                  isWrong ? "bg-red-50 border-red-300 text-red-600 animate-[shake_0.4s_ease-in-out]" :
                    selectedLeft === left ? "bg-[#1C7C54] border-[#1C7C54] text-white scale-[1.03] shadow-lg shadow-[#1C7C54]/20" :
                      "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--foreground)] hover:border-[#73E2A7] hover:bg-[var(--green-50)]/20 hover:scale-[1.02]"
                  }`}>
                {left}
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
          {shuffledRight.map((right, i) => {
            const mi = getMatchIndexByRight(right);
            const isMatched = mi !== -1;
            const isWrong = wrongPair?.right === right;
            const tone = isMatched ? matchTones[mi % matchTones.length] : null;
            return (
              <button key={i} onClick={() => handleRightClick(right)} disabled={isMatched || !!wrongPair}
                className={`w-full text-center text-base font-semibold px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${isMatched ? `${tone!.bg} ${tone!.border} ${tone!.text} opacity-60 cursor-default scale-95` :
                  isWrong ? "bg-red-50 border-red-300 text-red-600 animate-[shake_0.4s_ease-in-out]" :
                    selectedRight === right ? "bg-[#1C7C54] border-[#1C7C54] text-white scale-[1.03] shadow-lg shadow-[#1C7C54]/20" :
                      "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--foreground)] hover:border-[#73E2A7] hover:bg-[var(--green-50)]/20 hover:scale-[1.02]"
                  }`}>
                {right}
              </button>
            );
          })}
        </div>
      </div>

      {matched.length > 0 && matched.length < pairs.length && (
        <button onClick={() => { setMatched([]); setSelectedLeft(null); setSelectedRight(null); }}
          className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:text-red-600 transition-colors mt-2">
          <RotateCcw size={14} /> Qaytadan boshlash
        </button>
      )}
      {matched.length === pairs.length && !result && (
        <div className="flex items-center justify-center gap-2 py-4">
          <div className="w-5 h-5 border-2 border-[#1C7C54] border-t-transparent rounded-full animate-spin" />
          <p className="text-base font-bold text-[var(--green-600)]">Tekshirilmoqda...</p>
        </div>
      )}
    </BlockShell>
  );
}

/* ===== SORTABLE SCRATCH ITEM ===== */
function SortableScratchItem({ id, text, index }: { id: string; text: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined, opacity: isDragging ? 0.8 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center gap-4 rounded-2xl transition-all duration-200 ${isDragging ? "shadow-xl shadow-[#1C7C54]/15 scale-[1.02]" : "hover:shadow-md hover:shadow-[#1C7C54]/5"}`}>
      <div {...attributes} {...listeners}
        className="flex items-center justify-center w-11 h-11 bg-[var(--green-50)] text-[var(--green-600)]/40 hover:text-[var(--green-600)] hover:bg-[#73E2A7]/20 rounded-xl cursor-grab active:cursor-grabbing transition-all flex-shrink-0">
        <GripVertical size={18} />
      </div>
      <span className="w-9 h-9 bg-[#1C7C54]/10 text-[var(--green-600)] rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">{index + 1}</span>
      <div className="bg-[var(--card-bg)] text-[var(--foreground)] text-base font-mono font-semibold px-5 py-4 rounded-2xl border-2 border-[var(--card-border)] flex-1 select-none hover:border-[#73E2A7]/40 transition-colors">
        {text}
      </div>
    </div>
  );
}

/* ===== SCRATCH BLOCKS BLOCK ===== */
function ScratchBlocksBlock({ block, courseId, lessonId, progress, submitInteractive }: {
  block: ContentBlock; courseId: string; lessonId: string; progress: any; submitInteractive: any;
}) {
  const correctOrder = (block.scratchBlocks || []).sort((a, b) => a.order - b.order).map(b => b.text);
  const shuffled = useMemo(() => {
    const arr = [...correctOrder];
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }, [correctOrder]);

  const [items, setItems] = useState<string[]>(shuffled);
  const [result, setResult] = useState<{ correct: boolean; xpEarned: number } | null>(null);
  const alreadyAnswered = progress?.quizScores?.find((q: any) => q.contentId === block._id);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const itemIds = items.map((item, i) => `scratch-${i}-${item}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = itemIds.indexOf(active.id as string);
    const newIdx = itemIds.indexOf(over.id as string);
    setItems(arrayMove(items, oldIdx, newIdx));
  };

  const handleSubmit = async () => {
    const res = await submitInteractive.mutateAsync({ courseId, lessonId, contentId: block._id, answer: items });
    setResult({ correct: res.correct, xpEarned: res.xpEarned });
    res.correct ? playCelebrate() : playError();
  };

  if (alreadyAnswered) return (
    <BlockShell type="scratch_blocks">
      <div className="flex items-center gap-2 mb-4"><AnsweredBadge correct={alreadyAnswered.correct} /></div>
      <div className="space-y-3">
        {correctOrder.map((text, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-9 h-9 bg-[#1C7C54]/10 text-[var(--green-600)] rounded-lg flex items-center justify-center text-sm font-bold">{i + 1}</span>
            <div className="bg-[var(--card-bg)] text-[var(--foreground)] text-base font-mono font-semibold px-5 py-3.5 rounded-2xl border-2 border-[var(--card-border)] flex-1">{text}</div>
          </div>
        ))}
      </div>
    </BlockShell>
  );

  if (result) return (
    <BlockShell type="scratch_blocks">
      <ResultBanner correct={result.correct} xp={result.xpEarned} />
      {!result.correct && (
        <div className="mt-4">
          <p className="text-xs font-bold text-[var(--foreground)]/40 uppercase tracking-wide mb-3">To'g'ri tartib</p>
          {correctOrder.map((t, i) => (
            <p key={i} className="text-base font-mono text-[var(--green-600)] py-1">{i + 1}. {t}</p>
          ))}
        </div>
      )}
    </BlockShell>
  );

  return (
    <BlockShell type="scratch_blocks" xp={block.xpReward || 20}>
      {block.scratchInstruction && <p className="text-lg font-bold text-[var(--foreground)] mb-4">{block.scratchInstruction}</p>}
      <p className="text-[13px] text-[var(--green-600)]/50 mb-5 flex items-center gap-1.5"><Layers3 size={14} /> Bloklarni sudrab to'g'ri tartibga joylashtiring</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 mb-6">
            {items.map((item, i) => (
              <SortableScratchItem key={itemIds[i]} id={itemIds[i]} text={item} index={i} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <SubmitBtn onClick={handleSubmit} disabled={submitInteractive.isPending} loading={submitInteractive.isPending} label="Tartibni tekshirish" />
    </BlockShell>
  );
}

/* ===== MAIN PAGE ===== */
export default function CourseViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: course, isLoading } = useCourse(id);
  const { data: progress } = useProgress();
  const completeLesson = useCompleteLesson();
  const submitQuiz = useSubmitQuiz();
  const submitInteractive = useSubmitInteractive();
  const [activeLesson, setActiveLesson] = useState(0);
  const [showComplete, setShowComplete] = useState<string | null>(null);

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <ZookoLoader text="Yuklanmoqda…" />
    </div>
  );

  if (!course) return (
    <div className="text-center py-32">
      <div className="w-16 h-16 rounded-2xl bg-[var(--green-50)] flex items-center justify-center mx-auto mb-4">
        <Inbox size={28} className="text-[var(--green-600)]" />
      </div>
      <h2 className="text-xl font-bold text-[var(--foreground)]">Kurs topilmadi</h2>
      <button onClick={() => router.push("/dashboard/lessons")} className="mt-4 flex items-center gap-1.5 text-[15px] text-[var(--green-600)] hover:text-[var(--foreground)] font-semibold transition-colors mx-auto">
        <ChevronLeft size={16} /> Kurslarga qaytish
      </button>
    </div>
  );

  const lesson = course.lessons[activeLesson];
  const isLessonCompleted = (lessonId: string) => progress?.lessonsCompleted?.some((lc) => lc.courseId === id && lc.lessonId === lessonId);

  const handleCompleteLesson = async (lessonId: string) => {
    const res = await completeLesson.mutateAsync({ courseId: id, lessonId });
    if (!res.alreadyCompleted) {
      playCelebrate();
      setShowComplete(lessonId);
      setTimeout(() => setShowComplete(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {showComplete && (
        <div className="fixed top-20 right-4 md:right-6 z-50 animate-bounce">
          <div className="bg-[#1C7C54] text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl shadow-xl shadow-[#1B512D]/20 flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Trophy size={16} className="text-white" />
            </div>
            <span className="text-[13px] md:text-[15px] font-bold">+10 ZC — Dars yakunlandi!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 md:gap-5">
        <button onClick={() => router.push("/dashboard/lessons")}
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)]/40 hover:text-[var(--foreground)] hover:border-[#73E2A7] transition-all shadow-sm flex-shrink-0">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-[var(--foreground)] tracking-tight truncate" style={{ fontFamily: "var(--font-display)" }}>{course.title}</h1>
          <div className="flex items-center gap-2 md:gap-3 mt-1">
            <span className="text-[11px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-lg bg-[var(--green-50)] text-[var(--green-600)]">
              {course.grade === "all" ? "Barcha sinflar" : `${course.grade}-sinf`}
            </span>
            <span className="text-xs md:text-sm text-[var(--foreground)]/35">{course.lessons.length} dars</span>
          </div>
        </div>
      </div>

      {course.lessons.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-16 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[var(--green-50)] flex items-center justify-center mx-auto mb-4">
            <Inbox size={24} className="text-[var(--green-600)]" />
          </div>
          <h3 className="font-bold text-[var(--foreground)] text-lg mb-2">Hali darslar yo'q</h3>
          <p className="text-base text-[var(--foreground)]/40">O'qituvchingiz hali bu kursga darslar qo'shmagan.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Lesson sidebar — horizontal scroll on mobile, vertical sticky on desktop */}
          <div className="lg:w-[280px] lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:p-2 lg:space-y-2 scrollbar-hide">
              {course.lessons.map((l, i) => {
                const completed = isLessonCompleted(l._id);
                const active = activeLesson === i;
                return (
                  <button key={l._id} onClick={() => { setActiveLesson(i); playClick(); }}
                    className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-left transition-all duration-200 w-auto lg:w-full ${active ? "bg-[#1C7C54] text-white shadow-lg shadow-[#1B512D]/15 lg:scale-[1.02]" : "bg-[var(--card-bg)]/80 border border-[var(--card-border)] hover:border-[#73E2A7]/40 hover:shadow-md text-[var(--foreground)]"}`}>
                    <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl flex items-center justify-center text-xs lg:text-sm font-bold flex-shrink-0 ${completed ? (active ? "bg-white/20 text-white" : "bg-[var(--green-50)] text-[var(--green-600)]") : (active ? "bg-white/15 text-white/80" : "bg-[#1C7C54]/5 text-[var(--green-600)]/60")}`}>
                      {completed ? <Check size={14} /> : i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm lg:text-base font-semibold truncate max-w-[120px] lg:max-w-none ${active ? "text-white" : ""}`}>{l.title}</p>
                      {l.content.length > 0 && <p className={`text-[10px] lg:text-xs mt-0.5 ${active ? "text-white/60" : "text-[var(--foreground)]/30"}`}>{l.content.length} blok</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson content */}
          <div className="flex-1 min-w-0 space-y-5">
            {lesson && (
              <>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl px-4 md:px-8 py-5 md:py-6 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>{lesson.title}</h2>
                  {lesson.description && <p className="text-sm md:text-base text-[var(--foreground)]/50 mt-2">{lesson.description}</p>}
                </div>

                {lesson.content.length === 0 ? (
                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-12 text-center shadow-sm">
                    <p className="text-base text-[var(--foreground)]/40">Bu darsda hali kontent yo'q.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {lesson.content.map((block) => {
                      if (block.type === "quiz") return <QuizBlock key={block._id} block={block} courseId={id} lessonId={lesson._id} progress={progress} submitQuiz={submitQuiz} />;
                      if (block.type === "code_challenge") return <CodeChallengeBlock key={block._id} block={block} courseId={id} lessonId={lesson._id} progress={progress} submitInteractive={submitInteractive} />;
                      if (block.type === "fill_blank") return <FillBlankBlock key={block._id} block={block} courseId={id} lessonId={lesson._id} progress={progress} submitInteractive={submitInteractive} />;
                      if (block.type === "match_words") return <MatchWordsBlock key={block._id} block={block} courseId={id} lessonId={lesson._id} progress={progress} submitInteractive={submitInteractive} />;
                      if (block.type === "scratch_blocks") return <ScratchBlocksBlock key={block._id} block={block} courseId={id} lessonId={lesson._id} progress={progress} submitInteractive={submitInteractive} />;
                      return (
                        <div key={block._id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-sm">
                          {block.type === "text" && (
                            <div className="p-4 md:p-8"><div className="text-sm md:text-base text-[var(--foreground)]/80 leading-relaxed rich-content" dangerouslySetInnerHTML={{ __html: block.data }} /></div>
                          )}
                          {block.type === "image" && (
                            <div className={`p-3 md:p-5 ${block.imageSize === "small" ? "max-w-full sm:max-w-[300px]" : block.imageSize === "medium" ? "max-w-full sm:max-w-[500px]" : block.imageSize === "large" ? "max-w-full md:max-w-[700px]" : ""}`}>
                              <img src={block.data?.startsWith("/uploads") ? `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${block.data}` : block.data} alt="" className="w-full h-auto rounded-xl" />
                            </div>
                          )}
                          {block.type === "video" && (
                            <div className="aspect-video"><iframe src={block.data} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom nav */}
                <div className="space-y-4 pt-3">
                  {!isLessonCompleted(lesson._id) ? (
                    <button onClick={() => handleCompleteLesson(lesson._id)} disabled={completeLesson.isPending}
                      className="w-full bg-[#1C7C54] text-white text-[14px] md:text-[15px] font-bold py-3.5 md:py-4.5 rounded-2xl hover:bg-[#1B512D] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 md:gap-2.5 shadow-md shadow-[#1C7C54]/15">
                      <Trophy size={18} />
                      {completeLesson.isPending ? "Yakunlanmoqda..." : "Darsni yakunlash (+10 ZC)"}
                    </button>
                  ) : (
                    <div className="w-full bg-[var(--green-50)] text-[var(--green-600)] text-[14px] md:text-[15px] font-bold py-3.5 md:py-4.5 rounded-2xl flex items-center justify-center gap-2 md:gap-2.5 border border-[#73E2A7]/30">
                      <CheckCircle2 size={18} /> Dars yakunlangan
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <button onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))} disabled={activeLesson === 0}
                      className="flex items-center gap-1 md:gap-1.5 text-[13px] md:text-[15px] font-semibold text-[var(--green-600)] hover:text-[var(--foreground)] disabled:text-[var(--foreground)]/20 disabled:cursor-not-allowed transition-all hover:scale-105">
                      <ChevronLeft size={16} /> <span className="hidden sm:inline">Oldingi</span>
                    </button>
                    <span className="text-[12px] md:text-[13px] font-bold text-[var(--foreground)]/30 bg-[var(--green-50)]/50 px-3 md:px-4 py-1 md:py-1.5 rounded-full tabular-nums">{activeLesson + 1} / {course.lessons.length}</span>
                    <button onClick={() => setActiveLesson(Math.min(course.lessons.length - 1, activeLesson + 1))} disabled={activeLesson === course.lessons.length - 1}
                      className="flex items-center gap-1 md:gap-1.5 text-[13px] md:text-[15px] font-semibold text-[var(--green-600)] hover:text-[var(--foreground)] disabled:text-[var(--foreground)]/20 disabled:cursor-not-allowed transition-all hover:scale-105">
                      <span className="hidden sm:inline">Keyingi</span> <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
