"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions, TOTAL_QUESTIONS } from "@/lib/questions";
import { encodeAnswers } from "@/lib/encode";
import type { Answers } from "@/lib/types";

type Direction = "next" | "prev" | null;

export default function TestPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const q = questions[currentIdx];
  const currentValue = answers[q.id];
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIdx === TOTAL_QUESTIONS - 1;

  const progressCount = currentIdx + 1;
  const pct = Math.round((Math.max(answeredCount, currentIdx) / TOTAL_QUESTIONS) * 100);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIdx > 0) {
        goTo(currentIdx - 1, "prev");
      } else if (e.key === "ArrowRight" && !isLast) {
        if (currentValue === undefined) {
          setAnswers((prev) => ({ ...prev, [q.id]: 4 }));
        }
        goTo(currentIdx + 1, "next");
      } else if (e.key >= "1" && e.key <= "7") {
        handleAnswer(q.id, parseInt(e.key));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, currentValue, isLast]);

  const goTo = useCallback((idx: number, dir: Direction) => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIdx(idx);
      setIsAnimating(false);
    }, 200);
  }, [isAnimating]);

  const handleAnswer = useCallback((qid: number, val: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  }, []);

  const handleSliderChange = (val: number) => {
    handleAnswer(q.id, val);
  };

  // A/B click: set slider value, do NOT auto-advance
  const handleOptionClick = (val: number) => {
    handleAnswer(q.id, val);
  };

  // "다음": if no explicit selection, record neutral (4) before advancing
  const handleNext = () => {
    if (isLast) return;
    if (currentValue === undefined) {
      setAnswers((prev) => ({ ...prev, [q.id]: 4 }));
    }
    goTo(currentIdx + 1, "next");
  };

  const handleSubmit = () => {
    const finalAnswers = { ...answers };
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      if (finalAnswers[i] === undefined) {
        finalAnswers[i] = 4;
      }
    }

    if (submitting) return;
    setSubmitting(true);

    const encoded = encodeAnswers(finalAnswers);
    router.push(`/results/${encoded}`);
  };

  const animClass = isAnimating
    ? direction === "next"
      ? "opacity-0 translate-x-8"
      : "opacity-0 -translate-x-8"
    : "opacity-100 translate-x-0";

  // Status bar: 10 segments to avoid overflow
  const SEGMENT_COUNT = 10;
  const questionsPerSegment = TOTAL_QUESTIONS / SEGMENT_COUNT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-4 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-indigo-300/70 text-sm font-medium">
            {currentIdx + 1} / {TOTAL_QUESTIONS}
          </span>
          <span className="text-indigo-300/70 text-sm font-medium">{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(progressCount / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div
          className={`w-full max-w-xl transform transition-all duration-200 ease-out ${animClass}`}
        >
          {/* Scenario */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-medium mb-5">
              상황 {currentIdx + 1}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              {q.scenario}
            </h2>
          </div>

          {/* Bipolar options */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleOptionClick(2)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                currentValue !== undefined && currentValue <= 3
                  ? "border-indigo-400 bg-indigo-500/15 text-white shadow-lg shadow-indigo-500/10"
                  : "border-white/10 bg-white/5 text-white/80 hover:border-white/25 hover:bg-white/[0.08]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentValue !== undefined && currentValue <= 3
                    ? "bg-indigo-400 text-white"
                    : "bg-white/10 text-white/50"
                }`}>A</span>
                <span className="text-sm md:text-base leading-relaxed pt-1">{q.sideA}</span>
              </div>
            </button>

            <button
              onClick={() => handleOptionClick(6)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                currentValue !== undefined && currentValue >= 5
                  ? "border-cyan-400 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/10"
                  : "border-white/10 bg-white/5 text-white/80 hover:border-white/25 hover:bg-white/[0.08]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentValue !== undefined && currentValue >= 5
                    ? "bg-cyan-400 text-white"
                    : "bg-white/10 text-white/50"
                }`}>B</span>
                <span className="text-sm md:text-base leading-relaxed pt-1">{q.sideB}</span>
              </div>
            </button>
          </div>

          {/* Fine-tune slider */}
          <div className="px-2">
            <div className="flex items-center justify-between text-[10px] text-white/30 mb-2 px-1">
              <span>A에 가까움</span>
              <span>중립</span>
              <span>B에 가까움</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={1}
                max={7}
                step={1}
                value={currentValue ?? 4}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="bipolar-slider w-full"
              />
              {/* px-[12px] matches the range thumb center offset (24px thumb / 2) */}
              <div className="flex justify-between px-[12px] -mt-1">
                {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                  <button
                    key={v}
                    onClick={() => handleSliderChange(v)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      (currentValue ?? 4) === v
                        ? v <= 3 ? "bg-indigo-400 scale-150" : v >= 5 ? "bg-cyan-400 scale-150" : "bg-white scale-150"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center mt-3">
              <span className={`text-xs font-medium ${
                currentValue === undefined ? "text-white/30"
                  : currentValue <= 3 ? "text-indigo-300"
                  : currentValue >= 5 ? "text-cyan-300"
                  : "text-white/50"
              }`}>
                {currentValue === undefined
                  ? "선택하지 않으면 '중립'으로 기록됩니다"
                  : currentValue === 1 ? "매우 A" : currentValue === 2 ? "A" : currentValue === 3 ? "약간 A"
                  : currentValue === 4 ? "중립"
                  : currentValue === 5 ? "약간 B" : currentValue === 6 ? "B" : "매우 B"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="px-4 pb-6 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => goTo(currentIdx - 1, "prev")}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </button>

          {/* Segment-based status (10 segments, always fits) */}
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: SEGMENT_COUNT }).map((_, seg) => {
              const segStart = Math.floor(seg * questionsPerSegment);
              const segEnd = Math.floor((seg + 1) * questionsPerSegment);
              const segQuestions = questions.slice(segStart, segEnd);
              const answeredInSeg = segQuestions.filter((sq) => answers[sq.id] !== undefined).length;
              const isCurrent = currentIdx >= segStart && currentIdx < segEnd;
              const allInSegAnswered = answeredInSeg === segQuestions.length;

              return (
                <button
                  key={seg}
                  onClick={() => goTo(segStart, segStart > currentIdx ? "next" : "prev")}
                  className={`h-1.5 rounded-full transition-all ${
                    isCurrent
                      ? "w-6 bg-white"
                      : allInSegAnswered
                        ? "w-3 bg-indigo-400/70"
                        : answeredInSeg > 0
                          ? "w-3 bg-indigo-400/30"
                          : "w-3 bg-white/10"
                  }`}
                />
              );
            })}
          </div>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  분석 중...
                </>
              ) : (
                <>
                  결과 보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 transition-all"
            >
              다음
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
