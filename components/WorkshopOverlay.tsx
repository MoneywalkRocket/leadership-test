"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import type { ScoringResult, TypeDescription, TypeCode } from "@/lib/types";
import { workshopData } from "@/lib/workshop";
import { typeMap } from "@/lib/results";

type View = "hub" | "reflection" | "discussion" | "action" | "interaction";

interface Props {
  result: ScoringResult;
  typeDesc: TypeDescription;
}

// ── Hub: 4 entry points ──
function Hub({ onNavigate }: { onNavigate: (v: View) => void }) {
  const items: { view: View; emoji: string; title: string; sub: string; color: string }[] = [
    { view: "reflection", emoji: "🪞", title: "셀프 리플렉션", sub: "나를 솔직하게 돌아보는 질문 4개에 회고를 기록하세요", color: "purple" },
    { view: "discussion", emoji: "💬", title: "팀 토론 시나리오", sub: "3개의 상황 중 지금 대화 나누고 싶은 주제를 골라보세요", color: "blue" },
    { view: "action", emoji: "🌱", title: "성장 액션 플랜", sub: "10가지 Quick Win 중 이번 주 도전할 2가지를 선택하세요", color: "emerald" },
    { view: "interaction", emoji: "🤝", title: "나 사용법 카드", sub: "팀원에게 공유할 수 있는 나의 사용법 카드를 만드세요", color: "orange" },
  ];
  const colorMap: Record<string, string> = {
    purple: "border-purple-200 hover:border-purple-400 hover:bg-purple-50/50",
    blue: "border-blue-200 hover:border-blue-400 hover:bg-blue-50/50",
    emerald: "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50",
    orange: "border-orange-200 hover:border-orange-400 hover:bg-orange-50/50",
  };
  const iconBg: Record<string, string> = {
    purple: "bg-purple-100", blue: "bg-blue-100", emerald: "bg-emerald-100", orange: "bg-orange-100",
  };
  return (
    <div className="space-y-3">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">워크샵 가이드</h2>
        <p className="text-sm text-gray-500 mt-1">아래 활동 중 하나를 선택하세요</p>
      </div>
      {items.map((it) => (
        <button
          key={it.view}
          onClick={() => onNavigate(it.view)}
          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${colorMap[it.color]}`}
        >
          <div className="flex items-center gap-4">
            <span className={`flex-shrink-0 w-12 h-12 rounded-xl ${iconBg[it.color]} flex items-center justify-center text-2xl`}>{it.emoji}</span>
            <div>
              <div className="font-bold text-gray-900">{it.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{it.sub}</div>
            </div>
            <svg className="w-5 h-5 text-gray-300 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Back button ──
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      워크샵 메뉴로
    </button>
  );
}

// ── 1. Self-Reflection ──
function ReflectionView({ questions, typeCode, onBack }: { questions: string[]; typeCode: string; onBack: () => void }) {
  const storageKey = `reflection-notes-${typeCode}`;
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState(false);

  // Load saved notes from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw) as { question: string; answer: string }[];
        const loaded: Record<number, string> = {};
        data.forEach((item, i) => {
          if (item.answer) loaded[i] = item.answer;
        });
        setNotes(loaded);
      }
    } catch { /* ignore parse errors */ }
  }, [storageKey]);

  const handleSave = () => {
    const data = questions.map((q, i) => ({ question: q, answer: notes[i] || "" }));
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <BackBtn onClick={onBack} />
      <div className="flex items-center gap-3 mb-5">
        <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl">🪞</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">셀프 리플렉션</h2>
          <p className="text-xs text-gray-400">솔직하게 적을수록, 더 깊은 대화가 됩니다</p>
        </div>
      </div>
      <div className="space-y-5">
        {questions.map((q, i) => (
          <div key={i} className="rounded-2xl border border-purple-100 overflow-hidden">
            <div className="bg-purple-50 px-4 py-3 flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold mt-0.5">
                Q{i + 1}
              </span>
              <p className="text-sm text-gray-800 font-medium leading-relaxed">{q}</p>
            </div>
            <div className="p-3">
              <textarea
                placeholder="여기에 나의 생각을 적어보세요..."
                value={notes[i] || ""}
                onChange={(e) => setNotes((prev) => ({ ...prev, [i]: e.target.value }))}
                className="w-full h-24 p-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent placeholder:text-gray-300"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-lg transition-all"
      >
        {saved ? "저장 완료!" : "내 회고 저장하기"}
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">브라우저에 저장됩니다. 워크샵에서 짝과 나눠보세요.</p>
    </div>
  );
}

// ── 2. Discussion Scenarios ──
function DiscussionView({ scenarios, onBack }: { scenarios: { situation: string; prompt: string }[]; onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      <BackBtn onClick={onBack} />
      <div className="flex items-center gap-3 mb-5">
        <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">💬</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">팀 토론 시나리오</h2>
          <p className="text-xs text-gray-400">지금 대화하고 싶은 주제를 하나 골라보세요</p>
        </div>
      </div>
      <div className="space-y-3">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`w-full text-left rounded-2xl border-2 transition-all overflow-hidden ${
              selected === i
                ? "border-blue-400 shadow-lg shadow-blue-100"
                : "border-gray-100 hover:border-blue-200"
            }`}
          >
            <div className={`px-4 py-3 ${selected === i ? "bg-blue-50" : "bg-gray-50"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${selected === i ? "text-blue-500" : "text-gray-400"}`}>
                  시나리오 {i + 1}
                </span>
                {selected === i && (
                  <span className="text-xs font-bold text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">선택됨</span>
                )}
              </div>
              <p className="text-sm text-gray-800 font-medium leading-relaxed">{s.situation}</p>
            </div>
            {selected === i && (
              <div className="px-4 py-4 bg-white border-t border-blue-100">
                <div className="flex items-start gap-2 mb-3">
                  <span className="flex-shrink-0 text-blue-500 mt-0.5">❓</span>
                  <p className="text-sm text-blue-700 leading-relaxed font-medium">{s.prompt}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs text-blue-600">이 주제를 옆 사람과 3분간 나눠보세요. 서로 다른 유형의 관점을 비교해보면 더 흥미롭습니다.</p>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 3. Action Plan ──
function ActionPlanView({ quickWins, typeDesc, onBack }: { quickWins: string[]; typeDesc: TypeDescription; onBack: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [plans, setPlans] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleWin = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else if (next.size < 2) {
        next.add(i);
      }
      return next;
    });
  };

  const selectedArr = Array.from(selected).sort();
  const canSave = selectedArr.length === 2 && selectedArr.every((i) => (plans[i] || "").trim().length > 0);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `action-plan-${typeDesc.name}.png`;
      link.href = dataUrl;
      link.click();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  }, [typeDesc.name]);

  return (
    <div>
      <BackBtn onClick={onBack} />
      <div className="flex items-center gap-3 mb-5">
        <span className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">🌱</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">성장 액션 플랜</h2>
          <p className="text-xs text-gray-400">이번 주 도전할 Quick Win 2가지를 골라보세요</p>
        </div>
      </div>

      {/* Quick Win selection */}
      <div className="space-y-2 mb-5">
        {quickWins.map((win, i) => {
          const isSelected = selected.has(i);
          const disabled = !isSelected && selected.size >= 2;
          return (
            <button
              key={i}
              onClick={() => toggleWin(i)}
              disabled={disabled}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-emerald-400 bg-emerald-50"
                  : disabled
                    ? "border-gray-100 bg-gray-50 opacity-40"
                    : "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30"
              }`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                isSelected ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {isSelected ? "✓" : i + 1}
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">{win}</span>
            </button>
          );
        })}
      </div>

      {/* Plan writing for selected items */}
      {selectedArr.length > 0 && (
        <div className="space-y-4 mb-5">
          <h3 className="text-sm font-bold text-gray-700">어떻게 실행할 건가요?</h3>
          {selectedArr.map((idx) => (
            <div key={idx} className="rounded-xl border border-emerald-200 overflow-hidden">
              <div className="bg-emerald-50 px-4 py-2">
                <p className="text-xs text-emerald-700 font-medium">{quickWins[idx]}</p>
              </div>
              <div className="p-3">
                <textarea
                  placeholder="구체적인 실행 계획을 적어보세요..."
                  value={plans[idx] || ""}
                  onChange={(e) => setPlans((prev) => ({ ...prev, [idx]: e.target.value }))}
                  className="w-full h-20 p-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent placeholder:text-gray-300"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exportable card (hidden until ready, always rendered for capture) */}
      {canSave && (
        <>
          <div ref={cardRef} className="p-6 rounded-2xl border border-emerald-200 bg-white mb-4">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <span className="text-2xl">{typeDesc.emoji}</span>
              <div>
                <div className="font-bold text-gray-900">{typeDesc.name}</div>
                <div className="text-xs text-gray-400">{typeDesc.nameKo} | 이번 주 액션 플랜</div>
              </div>
            </div>
            {selectedArr.map((idx, i) => (
              <div key={idx} className={i > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-800 font-medium">{quickWins[idx]}</p>
                </div>
                <p className="text-sm text-gray-600 pl-7 leading-relaxed">{plans[idx]}</p>
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-300 text-right">
              Leadership Type Test | Workshop Action Plan
            </div>
          </div>

          <button
            onClick={handleSaveImage}
            disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saved ? "저장 완료!" : saving ? "이미지 생성 중..." : "이미지로 저장하기"}
          </button>
        </>
      )}
    </div>
  );
}

// ── 4. Interaction Guide ("나 사용법") ──
function InteractionView({
  typeDesc,
  guide,
  onBack,
}: {
  typeDesc: TypeDescription;
  guide: { meetingStyle: string; conflictPattern: string; decisionPriority: string; communicationTip: string };
  onBack: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `나-사용법-${typeDesc.name}.png`;
      link.href = dataUrl;
      link.click();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  }, [typeDesc.name]);

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#ffffff" });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `나-사용법-${typeDesc.name}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `나 사용법 - ${typeDesc.name}` });
      } else {
        // Fallback to download
        handleSaveImage();
      }
    } catch {
      handleSaveImage();
    }
  };

  // Compatibility badges
  const bestTypes = typeDesc.bestMatch.map((c) => typeMap.get(c as TypeCode)).filter(Boolean);
  const worstTypes = typeDesc.worstMatch.map((c) => typeMap.get(c as TypeCode)).filter(Boolean);

  return (
    <div>
      <BackBtn onClick={onBack} />
      <div className="flex items-center gap-3 mb-5">
        <span className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🤝</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">나 사용법 카드</h2>
          <p className="text-xs text-gray-400">이 카드를 팀원에게 공유해보세요</p>
        </div>
      </div>

      {/* The exportable card */}
      <div ref={cardRef} className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 p-5 text-white text-center">
          <div className="text-3xl mb-2">{typeDesc.emoji}</div>
          <div className="text-lg font-extrabold">{typeDesc.name}</div>
          <div className="text-sm text-white/70">{typeDesc.nameKo}</div>
          <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-mono font-bold tracking-widest">{typeDesc.code}</div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="text-center mb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">나 사용법</span>
          </div>

          <div className="rounded-xl bg-blue-50 p-3">
            <div className="text-xs font-bold text-blue-600 mb-1">🗣 회의할 때</div>
            <p className="text-xs text-gray-700 leading-relaxed">{guide.meetingStyle}</p>
          </div>

          <div className="rounded-xl bg-rose-50 p-3">
            <div className="text-xs font-bold text-rose-600 mb-1">⚡ 갈등이 생기면</div>
            <p className="text-xs text-gray-700 leading-relaxed">{guide.conflictPattern}</p>
          </div>

          <div className="rounded-xl bg-amber-50 p-3">
            <div className="text-xs font-bold text-amber-600 mb-1">⚖️ 결정할 때</div>
            <p className="text-xs text-gray-700 leading-relaxed">{guide.decisionPriority}</p>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-3">
            <div className="text-xs font-bold text-orange-700 mb-1">💡 나와 대화하는 팁</div>
            <p className="text-xs text-gray-800 leading-relaxed font-medium">{guide.communicationTip}</p>
          </div>

          {/* Compatibility mini */}
          <div className="flex gap-2 pt-2">
            <div className="flex-1 rounded-lg bg-emerald-50 p-2 text-center">
              <div className="text-[10px] font-bold text-emerald-600 mb-1">시너지 유형</div>
              <div className="flex justify-center gap-1">
                {bestTypes.map((t) => (
                  <span key={t!.code} className="text-sm" title={t!.name}>{t!.emoji}</span>
                ))}
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-rose-50 p-2 text-center">
              <div className="text-[10px] font-bold text-rose-600 mb-1">주의 유형</div>
              <div className="flex justify-center gap-1">
                {worstTypes.map((t) => (
                  <span key={t!.code} className="text-sm" title={t!.name}>{t!.emoji}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-gray-300 pt-1">
            Leadership Type Test | 나 사용법 카드
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSaveImage}
          disabled={saving}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saved ? "저장 완료!" : saving ? "생성 중..." : "이미지 저장"}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-all"
        >
          바로 공유하기
        </button>
      </div>
    </div>
  );
}

// ── Main Overlay ──
export default function WorkshopOverlay({ result, typeDesc }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("hub");
  const workshop = workshopData[result.typeCode];

  if (!workshop) return null;

  const handleClose = () => {
    setOpen(false);
    setView("hub");
  };

  return (
    <>
      {/* Floating CTA button */}
      {!open && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]">
          <button
            onClick={() => setOpen(true)}
            className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="text-base">📋</span>
            워크샵 콘텐츠로 넘어가기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{typeDesc.emoji}</span>
              <span className="text-sm font-bold text-gray-700">{typeDesc.name}</span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-lg mx-auto">
              {view === "hub" && <Hub onNavigate={setView} />}
              {view === "reflection" && (
                <ReflectionView questions={workshop.reflectionQuestions} typeCode={result.typeCode} onBack={() => setView("hub")} />
              )}
              {view === "discussion" && (
                <DiscussionView scenarios={workshop.discussionScenarios} onBack={() => setView("hub")} />
              )}
              {view === "action" && (
                <ActionPlanView quickWins={workshop.actionPlan.quickWins} typeDesc={typeDesc} onBack={() => setView("hub")} />
              )}
              {view === "interaction" && (
                <InteractionView typeDesc={typeDesc} guide={workshop.interactionGuide} onBack={() => setView("hub")} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
