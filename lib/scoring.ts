import { questions } from "./questions";
import { typeDescriptions } from "./results";
import type {
  Answers,
  FactorId,
  FactorScores,
  CompositeScores,
  ZScores,
  AxisScores,
  TypeCode,
  ScoringResult,
} from "./types";

// ═══════════════════════════════════════════════════════════════════
// Bipolar scoring: each question (1–7 slider) contributes to TWO
// factors simultaneously.
//
//   slider = 1 → fully sideA    (factorA gets 7, factorB gets 1)
//   slider = 4 → neutral        (factorA gets 4, factorB gets 4)
//   slider = 7 → fully sideB    (factorA gets 1, factorB gets 7)
//
// Each factor's score = mean of all contributions touching it (1–7).
// ═══════════════════════════════════════════════════════════════════

// ── Beta-phase normative data (μ, σ) ──
// Bipolar questions center around 4.0 with tighter spread.
const NORM: Record<string, { mu: number; sigma: number }> = {
  TF:   { mu: 4.0, sigma: 0.8 },
  TA:   { mu: 4.0, sigma: 0.8 },
  PAc:  { mu: 4.0, sigma: 0.9 },
  SV:   { mu: 4.0, sigma: 0.8 },
  IC:   { mu: 4.0, sigma: 0.8 },
  MBEA: { mu: 4.0, sigma: 0.8 },
  IS:   { mu: 4.0, sigma: 0.8 },
  CR:   { mu: 4.0, sigma: 0.8 },
};

// ── Helpers ──

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function zScore(x: number, key: string): number {
  const norm = NORM[key];
  if (!norm || norm.sigma === 0) return 0;
  return (x - norm.mu) / norm.sigma;
}

// ── Step 1: Factor scores from bipolar questions ──

function computeFactorScores(answers: Answers): FactorScores {
  const sums: Record<string, number[]> = {
    II: [], IM: [], IS: [], IC: [], CR: [], MBEA: [], PA: [], SV: [],
  };

  for (const q of questions) {
    const raw = answers[q.id] ?? 4; // default neutral
    // sideA score: slider 1→7, 4→4, 7→1  (reversed)
    // sideB score: slider 1→1, 4→4, 7→7  (direct)
    const scoreA = 8 - raw; // 1→7, 4→4, 7→1
    const scoreB = raw;     // 1→1, 4→4, 7→7

    sums[q.factorA].push(scoreA);
    sums[q.factorB].push(scoreB);
  }

  const result: Record<string, number> = {};
  for (const [factor, values] of Object.entries(sums)) {
    result[factor] = values.length > 0 ? mean(values) : 4;
  }

  return result as unknown as FactorScores;
}

// ── Step 2: Composite scores ──

function computeCompositeScores(f: FactorScores): CompositeScores {
  return {
    TF: mean([f.II, f.IM, f.IS, f.IC]),
    TA: mean([f.CR, f.MBEA]),
    PAc: f.PA,
    SV: f.SV,
  };
}

// ── Step 3: Z-scores ──

function computeZScores(c: CompositeScores, f: FactorScores): ZScores {
  return {
    TF:   zScore(c.TF, "TF"),
    TA:   zScore(c.TA, "TA"),
    PAc:  zScore(c.PAc, "PAc"),
    SV:   zScore(c.SV, "SV"),
    IC:   zScore(f.IC, "IC"),
    MBEA: zScore(f.MBEA, "MBEA"),
    IS:   zScore(f.IS, "IS"),
    CR:   zScore(f.CR, "CR"),
  };
}

// ── Step 4: Axis determination ──

function computeAxes(z: ZScores): AxisScores {
  return {
    D1: z.TF - z.TA,                    // V vs O
    D2: z.SV + z.IC - z.MBEA,           // E vs C
    D3: z.MBEA + z.IS - z.PAc,          // A vs R
    D4: z.IC + z.SV - z.CR,             // H vs P
  };
}

function axesToTypeCode(axes: AxisScores): TypeCode {
  const a1 = axes.D1 >= 0 ? "V" : "O";
  const a2 = axes.D2 >= 0 ? "E" : "C";
  const a3 = axes.D3 >= 0 ? "A" : "R";
  const a4 = axes.D4 >= 0 ? "H" : "P";
  return `${a1}${a2}${a3}${a4}` as TypeCode;
}

// ── Top/Bottom factors ──

function getTopAndBottomFactors(f: FactorScores) {
  const entries = Object.entries(f) as [FactorId, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const topFactors = sorted.slice(0, 2).map(([factor, score]) => ({
    factor,
    score: Math.round(score * 100) / 100,
  }));

  const bottomFactor = {
    factor: sorted[sorted.length - 1][0],
    score: Math.round(sorted[sorted.length - 1][1] * 100) / 100,
  };

  return { topFactors, bottomFactor };
}

// ── Main scoring function ──

export function score(answers: Answers): ScoringResult {
  const factors = computeFactorScores(answers);
  const composites = computeCompositeScores(factors);
  const zScores = computeZScores(composites, factors);
  const axes = computeAxes(zScores);
  const typeCode = axesToTypeCode(axes);

  const typeDesc = typeDescriptions.find((t) => t.code === typeCode);
  const typeName = typeDesc?.name ?? typeCode;

  const { topFactors, bottomFactor } = getTopAndBottomFactors(factors);

  return {
    factors,
    composites,
    zScores,
    axes,
    typeCode,
    typeName,
    topFactors,
    bottomFactor,
  };
}

// ── Validation ──

export function validateAnswers(answers: unknown): answers is Answers {
  if (typeof answers !== "object" || answers === null) return false;
  const obj = answers as Record<string, unknown>;
  for (let i = 1; i <= 30; i++) {
    const val = obj[String(i)];
    if (typeof val !== "number" || val < 1 || val > 7 || !Number.isInteger(val)) {
      return false;
    }
  }
  return true;
}
