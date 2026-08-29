import type { KidsQuizItem, KnowledgeQuizItem } from "../types";

// Untranslated on purpose. Every question quotes this locale's own reading
// panels, so writing them is authoring work rather than translation; an empty
// set simply means the quiz is not offered here.
export const knowledgeQuiz: KnowledgeQuizItem[] = [];

// Same for the children's set: written, not translated.
export const kidsQuiz: KidsQuizItem[] = [];

// The school quiz has not been written for this locale.
export const systemQuiz: [] = [];
