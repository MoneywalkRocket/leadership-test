// ── Factor IDs ──
export type FactorId =
  | "II"   // Idealized Influence
  | "IM"   // Inspirational Motivation
  | "IS"   // Intellectual Stimulation
  | "IC"   // Individualized Consideration
  | "CR"   // Contingent Reward
  | "MBEA" // Management-by-Exception Active
  | "PA"   // Passive/Avoidant
  | "SV";  // Servant/People-first

// ── Composite IDs ──
export type CompositeId = "TF" | "TA" | "PAc" | "SV";

// ── Axis codes ──
export type Axis1 = "V" | "O"; // Visionary vs Operator
export type Axis2 = "E" | "C"; // Empowering vs Controlling
export type Axis3 = "A" | "R"; // Active vs Reactive
export type Axis4 = "H" | "P"; // Human-first vs Performance-first

export type TypeCode = `${Axis1}${Axis2}${Axis3}${Axis4}`;

// ── Bipolar Question ──
// Each question has two poles (A and B). The slider goes 1–7.
// 1 = strongly A, 4 = neutral, 7 = strongly B.
// factorA gets (8 - value) / 7 contribution, factorB gets value / 7.
export interface BipolarQuestion {
  id: number;
  sideA: string;       // Left pole text
  sideB: string;       // Right pole text
  factorA: FactorId;   // Factor boosted by choosing A side
  factorB: FactorId;   // Factor boosted by choosing B side
  scenario: string;    // Neutral scenario context
}

// ── Scoring result ──
export interface FactorScores {
  II: number;
  IM: number;
  IS: number;
  IC: number;
  CR: number;
  MBEA: number;
  PA: number;
  SV: number;
}

export interface CompositeScores {
  TF: number;  // Transformational
  TA: number;  // Transactional
  PAc: number; // Passive/Avoidant composite
  SV: number;  // Servant
}

export interface ZScores {
  TF: number;
  TA: number;
  PAc: number;
  SV: number;
  IC: number;
  MBEA: number;
  IS: number;
  CR: number;
}

export interface AxisScores {
  D1: number; // V vs O
  D2: number; // E vs C
  D3: number; // A vs R
  D4: number; // H vs P
}

export interface ScoringResult {
  factors: FactorScores;
  composites: CompositeScores;
  zScores: ZScores;
  axes: AxisScores;
  typeCode: TypeCode;
  typeName: string;
  topFactors: { factor: FactorId; score: number }[];
  bottomFactor: { factor: FactorId; score: number };
}

// ── Type description ──
export interface TypeDescription {
  code: TypeCode;
  name: string;
  nameKo: string;
  emoji: string;
  summary: string;
  strengths: string[];
  blindSpots: string[];
  recommendation: string;
  recommendations: string[];       // multiple actionable tips
  bestMatch: TypeCode[];            // compatible types
  bestMatchReason: string;
  worstMatch: TypeCode[];           // friction types
  worstMatchReason: string;
}

// ── Answers map ──
export type Answers = Record<number, number>; // qid → 1..7

// ── DB row shape (for API) ──
export interface ResponseRow {
  id: string;
  createdAt: string;
  answers: Answers;
  scores: ScoringResult;
  typeCode: string;
  typeName: string;
}
