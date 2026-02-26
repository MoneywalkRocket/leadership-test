import type { Answers } from "./types";
import { TOTAL_QUESTIONS } from "./questions";

/**
 * Encode 30 answers (each 1-7) into a compact URL-safe string.
 * Each answer becomes one character: "1"-"7".
 * Result: 30-char string, e.g. "4523671234567123456712345671234"
 */
export function encodeAnswers(answers: Answers): string {
  let encoded = "";
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    encoded += String(answers[i] ?? 4);
  }
  return encoded;
}

/**
 * Decode a 30-char string back into Answers.
 * Returns null if the string is invalid.
 */
export function decodeAnswers(encoded: string): Answers | null {
  if (encoded.length !== TOTAL_QUESTIONS) return null;
  const answers: Answers = {};
  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const val = parseInt(encoded[i], 10);
    if (isNaN(val) || val < 1 || val > 7) return null;
    answers[i + 1] = val;
  }
  return answers;
}
