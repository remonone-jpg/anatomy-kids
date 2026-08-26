import type { OrganId } from "../../lib/anatomy-data";
import type { KnowledgeQuizItem } from "../types";
import { knowledgeQuizKo } from "./ko";

/**
 * Locales with a written question set. A locale without one simply does not
 * offer the knowledge quiz — questions are drawn verbatim from that locale's
 * reading panels, so they cannot be machine translated without going wrong.
 */
const QUIZ: Partial<Record<string, KnowledgeQuizItem[]>> = { ko: knowledgeQuizKo };

export function quizAvailable(locale: string): boolean {
  return (QUIZ[locale]?.length ?? 0) > 0;
}

/** Every question for one organ. */
export function getOrganQuiz(locale: string, organ: OrganId): KnowledgeQuizItem[] {
  return (QUIZ[locale] ?? []).filter((item) => item.organ === organ);
}

/** The whole set, for the round played from the whole-body view. */
export function getAllQuiz(locale: string): KnowledgeQuizItem[] {
  return QUIZ[locale] ?? [];
}
