"use client";

import { useState } from "react";
import type { ScoringResult, TypeDescription, FactorId, TypeCode } from "@/lib/types";
import { factorLabels, typeMap } from "@/lib/results";
import { axisDetails, generateInsights } from "@/lib/analysis";

interface ResultCardProps {
  result: ScoringResult;
  typeDesc: TypeDescription;
}

const FACTOR_GRADIENTS: Record<string, string> = {
  II: "from-violet-500 to-purple-600", IM: "from-indigo-500 to-blue-600",
  IS: "from-blue-500 to-cyan-500", IC: "from-cyan-500 to-teal-500",
  CR: "from-emerald-500 to-green-600", MBEA: "from-amber-500 to-orange-500",
  PA: "from-rose-400 to-pink-500", SV: "from-teal-500 to-cyan-600",
};

const COMPOSITE_GROUPS: {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  gradient: string;
  factors: FactorId[];
  desc: string;
  high: string;
  low: string;
}[] = [
  {
    id: "TF", name: "변혁적 리더십", nameEn: "Transformational", emoji: "🔥",
    gradient: "from-violet-500 to-indigo-500", factors: ["II", "IM", "IS", "IC"],
    desc: "비전과 영감으로 팀을 이끌고, 구성원의 성장과 변화를 촉진하는 스타일",
    high: "비전 제시, 동기부여, 혁신 촉진, 개인 맞춤 코칭에 강합니다. 팀에 방향감과 에너지를 불어넣는 핵심 동력입니다.",
    low: "실행과 안정에 집중하는 편입니다. 팀이 방향을 잃거나 에너지가 떨어질 때, 의도적으로 '왜 이 일을 하는가'를 공유해보세요.",
  },
  {
    id: "TA", name: "거래적 리더십", nameEn: "Transactional", emoji: "⚖️",
    gradient: "from-emerald-500 to-green-500", factors: ["CR", "MBEA"],
    desc: "명확한 기준과 보상, 체계적 관리를 통해 안정적 성과를 만드는 스타일",
    high: "목표-보상을 명확히 연결하고, 문제를 조기에 감지해 체계적으로 관리합니다. 팀의 예측 가능성과 공정성이 높습니다.",
    low: "기대치가 암묵적이거나 관리가 느슨할 수 있습니다. 프로젝트 시작 시 성공 기준과 체크 포인트를 명시해보세요.",
  },
  {
    id: "PAc", name: "방임적 리더십", nameEn: "Passive/Avoidant", emoji: "🌊",
    gradient: "from-rose-400 to-pink-500", factors: ["PA"],
    desc: "팀의 자율에 맡기며 관망하는 스타일. 과도하면 리더십 공백으로 이어질 수 있음",
    high: "상황을 지켜보며 팀의 자생력을 믿는 편입니다. 다만 문제가 커진 후 대응하는 패턴이 반복되지 않도록 최소 개입 기준을 정해두세요.",
    low: "적극적이고 선제적인 리더십을 발휘합니다. 모든 것에 개입하면 팀의 자율성이 줄어들 수 있으니, 위임할 영역을 구분하세요.",
  },
  {
    id: "SV", name: "서번트 리더십", nameEn: "Servant Leadership", emoji: "🤲",
    gradient: "from-teal-500 to-cyan-500", factors: ["SV"],
    desc: "구성원의 성장과 웰빙을 최우선으로 두고, 권한 위임과 경청을 실천하는 스타일",
    high: "구성원을 진심으로 배려하고 성장을 지원합니다. 높은 신뢰와 충성도를 이끌어내는 강점이지만, 때로는 단호한 결정도 필요합니다.",
    low: "성과와 효율을 우선시하는 실용적 리더십입니다. 구성원이 '도구'가 아닌 '사람'으로 느끼도록, 회의에서 먼저 의견을 묻는 작은 시그널부터 시작해보세요.",
  },
];

const AXIS_META = [
  { key: "D1" as const, left: "V", leftFull: "Visionary", right: "O", rightFull: "Operator" },
  { key: "D2" as const, left: "E", leftFull: "Empowering", right: "C", rightFull: "Controlling" },
  { key: "D3" as const, left: "A", leftFull: "Active", right: "R", rightFull: "Reactive" },
  { key: "D4" as const, left: "H", leftFull: "Human-first", right: "P", rightFull: "Performance-first" },
];

function Toggle({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-100 mt-3 pt-3">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors w-full text-left">
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {title}
      </button>
      {open && <div className="mt-3 text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>}
    </div>
  );
}

export default function ResultCard({ result, typeDesc }: ResultCardProps) {
  const maxScore = 7;
  const insights = generateInsights(result.topFactors, result.bottomFactor, result.axes);
  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 p-8 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative">
          <div className="text-6xl mb-4">{typeDesc.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">{typeDesc.name}</h1>
          <p className="text-lg text-white/80 font-medium mb-4">{typeDesc.nameKo}</p>
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm font-mono text-sm font-bold tracking-[0.3em] border border-white/20">
            {result.typeCode}
          </div>
          <p className="mt-6 text-white/75 leading-relaxed max-w-lg mx-auto text-sm">{typeDesc.summary}</p>
        </div>
      </div>

      {/* 4 Axes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5">4축 분석</h2>
        <div className="space-y-5">
          {AXIS_META.map(({ key, left, leftFull, right, rightFull }) => {
            const val = result.axes[key];
            const clamped = Math.max(-3, Math.min(3, val));
            // positive val = left side (V/E/A/H), negative = right side (O/C/R/P)
            // CSS left: 0% = left edge, 100% = right edge
            // So positive val → low pct (left), negative val → high pct (right)
            const pct = ((3 - clamped) / 6) * 100;
            const isLeft = val >= 0;
            const detail = axisDetails[key];

            return (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className={`text-sm font-bold ${isLeft ? "text-indigo-600" : "text-gray-400"}`}>
                    {left} <span className="font-normal text-xs text-gray-400">{leftFull}</span>
                  </span>
                  <span className={`text-sm font-bold ${!isLeft ? "text-cyan-600" : "text-gray-400"}`}>
                    <span className="font-normal text-xs text-gray-400">{rightFull}</span> {right}
                  </span>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 z-10" />
                  {/* Bar: spans from pct to 50% (or 50% to pct) */}
                  <div
                    className={`absolute top-0 h-full rounded-full ${isLeft ? "bg-gradient-to-r from-indigo-400 to-indigo-500" : "bg-gradient-to-r from-cyan-400 to-cyan-500"}`}
                    style={{
                      left: `${Math.min(pct, 50)}%`,
                      width: `${Math.abs(pct - 50)}%`,
                    }}
                  />
                  {/* Dot */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md z-20 ${isLeft ? "bg-indigo-500" : "bg-cyan-500"}`}
                    style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
                  />
                </div>
                {detail && (
                  <Toggle title="자세히 보기">
                    <p><strong className="text-indigo-700">{left} ({leftFull}):</strong> {detail.leftDetail}</p>
                    <p><strong className="text-cyan-700">{right} ({rightFull}):</strong> {detail.rightDetail}</p>
                    <p className="text-gray-500 italic">{detail.balanceNote}</p>
                  </Toggle>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Style Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">리더십 스타일 프로필</h2>
        <p className="text-xs text-gray-400 mb-5">4가지 리더십 스타일별 강도와 구성 요인</p>
        <div className="space-y-5">
          {COMPOSITE_GROUPS.map(({ id, name, nameEn, emoji, gradient, factors: groupFactors, desc, high, low }) => {
            const compositeScore = result.composites[id as keyof typeof result.composites];
            const zVal = result.zScores[id as keyof typeof result.zScores];
            const level = zVal > 0.5 ? "강함" : zVal < -0.5 ? "약함" : "보통";
            const levelColor = zVal > 0.5 ? "text-emerald-600 bg-emerald-50" : zVal < -0.5 ? "text-amber-600 bg-amber-50" : "text-gray-500 bg-gray-50";
            const interpretation = zVal > 0.5 ? high : zVal < -0.5 ? low : high;

            return (
              <div key={id} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{emoji}</span>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{name}</div>
                        <div className="text-[10px] text-gray-400">{nameEn}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-gray-700">{compositeScore.toFixed(1)}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor}`}>{level}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
                <div className="px-4 pb-4 pt-2">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all`}
                      style={{ width: `${(compositeScore / maxScore) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{interpretation}</p>
                  <Toggle title="구성 요인 보기">
                    <div className="grid grid-cols-1 gap-2">
                      {groupFactors.map((fid) => {
                        const fScore = result.factors[fid];
                        return (
                          <div key={fid} className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{factorLabels[fid]?.full ?? fid}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${FACTOR_GRADIENTS[fid] ?? "from-gray-400 to-gray-500"} rounded-full`}
                                  style={{ width: `${(fScore / maxScore) * 100}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-mono text-gray-400 w-7 text-right">{fScore.toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Toggle>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">핵심 인사이트</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">TOP</span>
            <div className="text-sm text-gray-700">
              <div className="font-semibold text-indigo-700 mb-0.5">주요 강점 요인</div>
              {result.topFactors.map((f) => factorLabels[f.factor]?.full).join(", ")}
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-sm font-bold">!</span>
            <div className="text-sm text-gray-700">
              <div className="font-semibold text-amber-700 mb-0.5">주의 영역</div>
              {factorLabels[result.bottomFactor.factor]?.full}
            </div>
          </div>
        </div>
        <Toggle title="상세 인사이트 보기" defaultOpen>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Toggle>
      </div>

      {/* Strengths & blind spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-emerald-400">
          <h2 className="text-base font-bold text-gray-900 mb-3">강점</h2>
          <ul className="space-y-2.5">
            {typeDesc.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-amber-400">
          <h2 className="text-base font-bold text-gray-900 mb-3">맹점 (리스크)</h2>
          <ul className="space-y-2.5">
            {typeDesc.blindSpots.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-0.5">!</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Multiple Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl p-6 border border-indigo-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">추천 행동</h2>
        <div className="space-y-3">
          {typeDesc.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">팀 궁합</h2>

        {/* Best match */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">+</span>
            <h3 className="text-sm font-bold text-emerald-700">시너지가 좋은 유형</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {typeDesc.bestMatch.map((code) => {
              const t = typeMap.get(code as TypeCode);
              return t ? (
                <span key={code} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  {t.emoji} {t.name} <span className="text-emerald-400 font-mono">{code}</span>
                </span>
              ) : null;
            })}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{typeDesc.bestMatchReason}</p>
        </div>

        {/* Worst match */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">!</span>
            <h3 className="text-sm font-bold text-rose-700">마찰이 생길 수 있는 유형</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {typeDesc.worstMatch.map((code) => {
              const t = typeMap.get(code as TypeCode);
              return t ? (
                <span key={code} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                  {t.emoji} {t.name} <span className="text-rose-400 font-mono">{code}</span>
                </span>
              ) : null;
            })}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{typeDesc.worstMatchReason}</p>
        </div>
      </div>

    </div>
  );
}
