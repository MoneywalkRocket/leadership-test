import type { BipolarQuestion } from "./types";

// ═══════════════════════════════════════════════════════════════════
// Bipolar scenario questions — each presents TWO equally valid
// leadership approaches. The slider (1–7) captures which side
// the respondent naturally leans toward. Neither side is "wrong."
//
// factorA ← low scores (1–3), factorB ← high scores (5–7)
// ═══════════════════════════════════════════════════════════════════

export const questions: BipolarQuestion[] = [
  // ── 1. II vs PA ──
  {
    id: 1,
    scenario: "팀에 예상치 못한 위기가 발생했습니다.",
    sideA: "즉시 앞에 나서서 방향을 제시하고 책임을 진다",
    sideB: "상황을 지켜보면서 팀이 스스로 해결책을 찾도록 둔다",
    factorA: "II",
    factorB: "PA",
  },
  // ── 2. IM vs CR ──
  {
    id: 2,
    scenario: "새로운 프로젝트를 시작할 때, 팀에게 가장 먼저 전달하는 것은?",
    sideA: "이 프로젝트가 왜 중요한지, 어떤 변화를 만들 수 있는지",
    sideB: "구체적인 목표 수치와 달성 시 어떤 보상이 있는지",
    factorA: "IM",
    factorB: "CR",
  },
  // ── 3. IS vs MBEA ──
  {
    id: 3,
    scenario: "팀의 업무 프로세스가 잘 돌아가고 있습니다.",
    sideA: "더 나은 방법이 있는지 기존 방식에 질문을 던진다",
    sideB: "잘 돌아가는 프로세스를 유지하고 이탈을 관리한다",
    factorA: "IS",
    factorB: "MBEA",
  },
  // ── 4. IC vs CR ──
  {
    id: 4,
    scenario: "구성원의 성과가 기대에 미치지 못할 때?",
    sideA: "개인 상황과 강점을 파악해서 맞춤형 지원을 한다",
    sideB: "목표 대비 갭을 명확히 짚고, 개선 기준을 제시한다",
    factorA: "IC",
    factorB: "CR",
  },
  // ── 5. SV vs IM ──
  {
    id: 5,
    scenario: "팀 회의에서 중요한 방향을 결정해야 합니다.",
    sideA: "실무자들의 의견을 먼저 충분히 듣고 반영한다",
    sideB: "내가 그린 비전을 공유하고 팀의 에너지를 끌어올린다",
    factorA: "SV",
    factorB: "IM",
  },
  // ── 6. MBEA vs IS ──
  {
    id: 6,
    scenario: "팀원이 기존과 다른 새로운 접근법을 제안합니다.",
    sideA: "검증된 방식과의 차이를 먼저 분석하고 리스크를 점검한다",
    sideB: "일단 실험해보게 하고, 실패해도 학습이 되면 괜찮다고 본다",
    factorA: "MBEA",
    factorB: "IS",
  },
  // ── 7. II vs SV ──
  {
    id: 7,
    scenario: "조직의 가치와 구성원 개인의 사정이 충돌할 때?",
    sideA: "원칙과 기준을 일관되게 적용하는 게 중요하다",
    sideB: "개인의 상황을 먼저 이해하고 현실적으로 조율한다",
    factorA: "II",
    factorB: "SV",
  },
  // ── 8. CR vs IC ──
  {
    id: 8,
    scenario: "팀원이 잘한 일이 있을 때, 나의 첫 반응은?",
    sideA: "성과를 즉시 인정하고 공식적으로 보상/포상한다",
    sideB: "그 사람의 성장 맥락에서 어떤 의미인지 1:1로 이야기한다",
    factorA: "CR",
    factorB: "IC",
  },
  // ── 9. PA vs MBEA ──
  {
    id: 9,
    scenario: "사소한 규칙 위반이 발생했지만 결과에는 영향이 없었습니다.",
    sideA: "큰 문제가 아니면 굳이 지적하지 않는다",
    sideB: "작은 것이라도 기준을 세워두는 것이 나중을 위해 중요하다",
    factorA: "PA",
    factorB: "MBEA",
  },
  // ── 10. IM vs IC ──
  {
    id: 10,
    scenario: "팀의 에너지가 떨어졌을 때 나의 접근은?",
    sideA: "팀 전체에게 우리가 향하는 큰 그림을 다시 보여준다",
    sideB: "각 개인을 만나서 무엇이 힘든지, 무엇이 필요한지 듣는다",
    factorA: "IM",
    factorB: "IC",
  },
  // ── 11. IS vs II ──
  {
    id: 11,
    scenario: "내가 내린 결정에 팀원이 강하게 반대합니다.",
    sideA: "좋은 신호로 보고, 다른 관점에서 다시 생각해본다",
    sideB: "근거를 설명하되, 결정한 방향은 일관되게 밀고 간다",
    factorA: "IS",
    factorB: "II",
  },
  // ── 12. SV vs CR ──
  {
    id: 12,
    scenario: "성과 평가 시즌, 가장 중요하게 보는 것은?",
    sideA: "구성원이 얼마나 성장했는지, 잠재력이 어디까지인지",
    sideB: "설정한 목표 대비 실제 달성률과 수치",
    factorA: "SV",
    factorB: "CR",
  },
  // ── 13. MBEA vs PA ──
  {
    id: 13,
    scenario: "팀 내 두 사람 사이에 갈등 조짐이 보입니다.",
    sideA: "조기에 개입해서 문제가 커지기 전에 정리한다",
    sideB: "당사자들이 스스로 해결할 시간을 준다",
    factorA: "MBEA",
    factorB: "PA",
  },
  // ── 14. IC vs MBEA ──
  {
    id: 14,
    scenario: "업무 배분을 할 때 나의 기준은?",
    sideA: "각 사람의 강점과 성장 니즈에 맞춰 배분한다",
    sideB: "효율과 품질 기준에 맞춰 가장 적합한 사람에게 맡긴다",
    factorA: "IC",
    factorB: "MBEA",
  },
  // ── 15. IM vs MBEA ──
  {
    id: 15,
    scenario: "마감이 빠듯한 상황에서 나의 리더십 스타일은?",
    sideA: "팀에게 이 과제의 의미를 상기시키며 동기를 끌어올린다",
    sideB: "체크리스트를 만들고, 진행 상황을 촘촘히 추적한다",
    factorA: "IM",
    factorB: "MBEA",
  },
  // ── 16. II vs CR ──
  {
    id: 16,
    scenario: "성과는 좋았지만, 과정에서 원칙을 약간 벗어난 팀원이 있습니다.",
    sideA: "결과와 별개로, 과정의 원칙 준수를 짚고 넘어간다",
    sideB: "성과를 인정하되, 다음엔 기준을 맞추자고 가볍게 언급한다",
    factorA: "II",
    factorB: "CR",
  },
  // ── 17. SV vs II ──
  {
    id: 17,
    scenario: "리더로서 내가 가장 중요하게 생각하는 것은?",
    sideA: "구성원들이 나를 통해 성장했다고 느끼는 것",
    sideB: "내가 제시한 기준과 가치가 조직에 뿌리내리는 것",
    factorA: "SV",
    factorB: "II",
  },
  // ── 18. IS vs CR ──
  {
    id: 18,
    scenario: "분기 목표를 설정할 때 나의 스타일은?",
    sideA: "기존 목표를 뒤집을 수 있는 실험적 목표도 포함한다",
    sideB: "달성 가능한 수치를 명확히 정하고 보상 체계를 연결한다",
    factorA: "IS",
    factorB: "CR",
  },
  // ── 19. PA vs IS ──
  {
    id: 19,
    scenario: "잘 돌아가는 시스템에 대해 팀원이 변화를 요구합니다.",
    sideA: "지금 잘 되고 있으니 굳이 바꿀 필요는 없다고 본다",
    sideB: "변화의 근거를 듣고, 가능성이 있으면 시도해본다",
    factorA: "PA",
    factorB: "IS",
  },
  // ── 20. IC vs IM ──
  {
    id: 20,
    scenario: "신입 팀원이 합류했을 때 가장 먼저 하는 것은?",
    sideA: "그 사람의 배경/강점을 파악하고 맞춤형 온보딩을 설계한다",
    sideB: "팀의 미션과 비전, 우리가 만들 변화를 열정적으로 공유한다",
    factorA: "IC",
    factorB: "IM",
  },
  // ── 21. MBEA vs SV ──
  {
    id: 21,
    scenario: "팀원이 실수를 반복하고 있습니다.",
    sideA: "체크리스트/가이드라인을 만들어서 재발을 방지한다",
    sideB: "왜 실수가 반복되는지 개인적 맥락까지 이해하려 한다",
    factorA: "MBEA",
    factorB: "SV",
  },
  // ── 22. CR vs PA ──
  {
    id: 22,
    scenario: "팀의 성과가 정체되어 있습니다.",
    sideA: "목표를 더 명확히 하고, 인센티브 구조를 재설계한다",
    sideB: "시간이 지나면 자연스럽게 흐름이 돌아올 것으로 본다",
    factorA: "CR",
    factorB: "PA",
  },
  // ── 23. SV vs MBEA ──
  {
    id: 23,
    scenario: "권한을 위임할 때 나의 방식은?",
    sideA: "실패해도 안전한 범위를 함께 정하고 자율에 맡긴다",
    sideB: "명확한 보고 체계와 중간 점검 포인트를 설정한다",
    factorA: "SV",
    factorB: "MBEA",
  },
  // ── 24. II vs IS ──
  {
    id: 24,
    scenario: "팀 문화를 만들 때 더 중요한 것은?",
    sideA: "흔들리지 않는 핵심 가치와 원칙을 세우는 것",
    sideB: "자유롭게 질문하고 도전할 수 있는 분위기를 만드는 것",
    factorA: "II",
    factorB: "IS",
  },
  // ── 25. IM vs PA ──
  {
    id: 25,
    scenario: "팀이 도전적인 과제 앞에서 주저하고 있습니다.",
    sideA: "비전을 다시 공유하고 '할 수 있다'는 에너지를 불어넣는다",
    sideB: "팀의 페이스를 존중하고, 준비가 될 때까지 기다린다",
    factorA: "IM",
    factorB: "PA",
  },
  // ── 26. IC vs II ──
  {
    id: 26,
    scenario: "팀원에게 어려운 피드백을 전달해야 합니다.",
    sideA: "그 사람의 감정과 상황을 고려해서 방식을 조절한다",
    sideB: "사실 기반으로 명확하게 전달하는 것이 진정한 존중이다",
    factorA: "IC",
    factorB: "II",
  },
  // ── 27. CR vs IS ──
  {
    id: 27,
    scenario: "예산이 남았을 때 어디에 쓰겠습니까?",
    sideA: "성과 보상을 강화해서 팀의 동기를 높인다",
    sideB: "새로운 시도/실험 프로젝트에 투자한다",
    factorA: "CR",
    factorB: "IS",
  },
  // ── 28. SV vs IM ──
  {
    id: 28,
    scenario: "리더로서 가장 보람을 느끼는 순간은?",
    sideA: "팀원이 나 없이도 스스로 잘 해내는 모습을 볼 때",
    sideB: "팀 전체가 하나의 목표를 향해 몰입하는 순간",
    factorA: "SV",
    factorB: "IM",
  },
  // ── 29. MBEA vs IC ──
  {
    id: 29,
    scenario: "프로젝트 중간 점검에서 가장 중요하게 보는 것은?",
    sideA: "일정/품질/리스크 지표가 정상 범위인지",
    sideB: "팀원들이 각자 역할에서 배움과 성장을 느끼고 있는지",
    factorA: "MBEA",
    factorB: "IC",
  },
  // ── 30. PA vs CR ──
  {
    id: 30,
    scenario: "큰 의사결정을 앞두고 정보가 부족합니다.",
    sideA: "더 많은 정보가 모일 때까지 판단을 보류한다",
    sideB: "현재 정보로 기준을 세우고, 빠르게 실행에 옮긴다",
    factorA: "PA",
    factorB: "CR",
  },
];

export const TOTAL_QUESTIONS = questions.length; // 30
