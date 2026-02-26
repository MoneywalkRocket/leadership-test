import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-cyan-600/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-medium mb-8">
          Full-Range Leadership + Servant Leadership
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
          나의 리더십 유형은
          <br />
          <span className="gradient-text">무엇일까?</span>
        </h1>

        <p className="text-base md:text-lg text-white/50 mb-10 leading-relaxed max-w-md mx-auto">
          30개의 시나리오로 알아보는 나의 리더십 성향.
          <br />
          16가지 유형 중 당신은 어디에 해당할까요?
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-10 max-w-sm mx-auto">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">30</div>
            <div className="text-xs text-white/40 mt-0.5">시나리오</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-xs text-white/40 mt-0.5">요인 분석</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">16</div>
            <div className="text-xs text-white/40 mt-0.5">리더십 유형</div>
          </div>
        </div>

        <Link
          href="/test"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] text-lg transition-all duration-200"
        >
          테스트 시작하기
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>

        <p className="mt-5 text-xs text-white/25">
          약 5분 소요 | 시나리오 기반 양극 선택
        </p>

        {/* Academic references */}
        <div className="mt-14 text-left glass-card p-5">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">
            학술적 근거
          </h3>
          <ul className="text-xs text-white/25 space-y-1 leading-relaxed">
            <li>
              Bass &amp; Avolio - Full Range Leadership Model (MLQ-5X 요인 구조)
            </li>
            <li>Liden et al. (2008) - Servant Leadership 다차원 척도</li>
            <li>
              Podsakoff et al. (1990) - Transformational 행동과 신뢰/만족/OCB
            </li>
          </ul>
          <p className="text-[10px] text-white/15 mt-2">
            ※ 본 테스트는 학술 구성개념을 참고하여 새로 작성한 문항(construct-aligned
            new items)을 사용합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
