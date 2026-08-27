import type { OrganId } from "../../lib/anatomy-data";
import type { KidsQuizItem, KnowledgeQuizItem } from "../types";
import { format } from "../types";
import { CHILD_NAME } from "../kids/types";
import { knowledgeQuizKo } from "./ko";
import { kidsQuizKo } from "./kids-ko";

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

/** Locales with a written children's set. Separate from the grown-up one:
 *  either may exist without the other. */
const KIDS_QUIZ: Partial<Record<string, KidsQuizItem[]>> = { ko: kidsQuizKo };

export function kidsQuizAvailable(locale: string): boolean {
  return (KIDS_QUIZ[locale]?.length ?? 0) > 0;
}

/**
 * One organ's questions, with the child's name filled in.
 *
 * The placeholder appears in all three fields — a question can ask about
 * "{child}'s heart", an option can answer "{child}'s fist", and an explanation
 * can praise them by name — so all three go through the substitution. Doing
 * only the question would leave the name showing raw in the answers.
 */
export function getKidsQuiz(locale: string, organ: OrganId): KidsQuizItem[] {
  const child = { child: CHILD_NAME };
  return (KIDS_QUIZ[locale] ?? [])
    .filter((item) => item.organ === organ)
    .map((item) => ({
      ...item,
      question: format(item.question, child),
      options: [format(item.options[0], child), format(item.options[1], child)] as [string, string],
      explain: format(item.explain, child),
    }));
}
