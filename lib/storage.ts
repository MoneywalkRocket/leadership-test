import type { Answers, ScoringResult } from "./types";

interface StoredResponse {
  id: string;
  createdAt: Date;
  answers: Answers;
  scores: ScoringResult;
  typeCode: string;
  typeName: string;
}

// ── In-memory store (globalThis to share across module instances) ──
// Next.js can load the same module in different contexts (API route vs server component).
// Using globalThis ensures a single shared Map across all contexts.
const globalKey = "__leadership_test_store__" as const;

function getStore(): Map<string, StoredResponse> {
  const g = globalThis as unknown as Record<string, Map<string, StoredResponse>>;
  if (!g[globalKey]) {
    g[globalKey] = new Map();
  }
  return g[globalKey];
}

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 25; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function saveResponse(data: {
  answers: Answers;
  scores: ScoringResult;
  typeCode: string;
  typeName: string;
}): Promise<string> {
  const id = generateId();
  getStore().set(id, {
    id,
    createdAt: new Date(),
    ...data,
  });
  return id;
}

export async function getResponse(id: string): Promise<StoredResponse | null> {
  return getStore().get(id) ?? null;
}
