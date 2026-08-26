import type { OrganId } from "../lib/anatomy-data";

/** Prose for one organ. Structure (positions, colours, model) lives in
 *  `anatomy-data.ts`; only translatable text belongs here. */
export type OrganContent = {
  name: string;
  system: string;
  description: string;
  poetic: string;
  size: string;
  weight: string;
  location: string;
  function: string;
  dailyFact: string;
  medical: string;
  bloodSupply: string;
  funFact: string;
  tissue: string;
  comparison: string;
  conditions: string[];
  /**
   * Longer reads for the grown-up view: a few paragraphs that each stand on
   * their own. Optional because a locale may carry the short copy without
   * having had these written yet.
   */
  stories?: { title: string; body: string }[];
  /**
   * The layer below the stories, folded away until asked for. Grouping by
   * category is what keeps eight paragraphs from reading as one long wall.
   */
  deepDive?: DeepDive[];
  /** Keyed by hotspot id — the Terminologia Anatomica term is the anchor. */
  hotspots: Record<string, { label: string; detail: string }>;
};

/** The angles a structure is worth looking at from, in the order they read. */
export type DeepDiveCategory =
  | "structure" | "mechanism" | "numbers" | "development"
  | "teamwork" | "myths" | "history" | "animals"
  | "rhythm" | "exercise" | "food" | "aging"
  | "microscope" | "evolution" | "space" | "weather"
  | "etymology" | "culture" | "research" | "senses";

export type DeepDive = { category: DeepDiveCategory; title: string; body: string };

export type OrganContentDictionary = Record<OrganId, OrganContent>;

export type UiDictionary = {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string; imageAlt: string };
  brand: { tagline: string; home: string };
  nav: { explore: string; systems: string; lessons: string; library: string; notes: string };
  search: { placeholder: string };
  profile: { open: string };
  language: { label: string; choose: string };
  library: {
    title: string; open: string; close: string; saved: string; viewAll: string;
    quoteLine1: string; quoteLine2: string; quoteSign: string;
  };
  tools: { label: string; rotate: string; zoom: string; isolate: string; section: string; layers: string; compare: string; reset: string };
  viewer: {
    title: string; canvas: string; tip: string; tipDrag: string; tipScroll: string; tipClick: string;
    loading: string; autoRotate: string; caption: string; structures: string;
    /**
     * Shown when an organ has copy but no mesh yet. Optional because only the
     * locales that have been written carry it; the rest fall back in place
     * rather than being given a machine translation.
     */
    pending?: string;
    pendingNote?: string;
  };
  info: {
    kicker: string; keyFacts: string; size: string; weight: string; daily: string;
    location: string; bloodSupply: string; function: string; medical: string;
    didYouKnow: string; viewLesson: string; animate: string; quiz: string; compare: string;
  };
  compare: { title: string; comparing: string; reference: string; primaryRole: string; scale: string; vs: string; close: string };
  cards: {
    resources: string; microscopic: string; compareOrgans: string; functionAnimation: string;
    clinicalNotes: string; whereItWorks: string; commonConditions: string;
    exploreTissue: string; openComparison: string; playAnimation: string; seeAll: string; seeSystem: string;
    playAria: string; systemAria: string;
  };
  quiz: {
    start: string; find: string; progress: string; correct: string; wrong: string;
    reveal: string; answer: string; done: string; score: string; retry: string; exit: string; hint: string;
  };
  modal: {
    guided: string; close: string; continueExploring: string;
    quizTitle: string; motionTitle: string; bodyTitle: string; insideTitle: string;
    quizPrompt: string; quizA: string; quizB: string; quizC: string;
    lessonBody: string; systemIntro: string; system: string; primaryRole: string; bloodSupply: string;
  };
};

export type Dictionary = { ui: UiDictionary; organs: OrganContentDictionary };

/** Minimal `{name}` interpolation — the copy has no plurals or dates. */
export function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
