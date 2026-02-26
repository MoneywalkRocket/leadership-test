"use client";

import { useState } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import WorkshopOverlay from "@/components/WorkshopOverlay";
import type { ScoringResult, TypeDescription } from "@/lib/types";

interface Props {
  result: ScoringResult;
  typeDesc: TypeDescription;
}

export default function ResultsClient({ result, typeDesc }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `나의 리더십 유형: ${typeDesc.name} (${typeDesc.nameKo})`,
        text: `리더십 유형 테스트 결과 - ${result.typeCode} ${typeDesc.name}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-gray-600">
            ← 홈
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg hover:shadow-md transition-all"
            >
              {copied ? "복사됨!" : "공유하기"}
            </button>
            <Link
              href="/test"
              className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              다시 하기
            </Link>
          </div>
        </div>
      </div>

      {/* Result content */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <ResultCard result={result} typeDesc={typeDesc} />
      </div>

      {/* Workshop overlay (includes floating CTA) */}
      <WorkshopOverlay result={result} typeDesc={typeDesc} />
    </div>
  );
}
