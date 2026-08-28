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

/**
 * The children's quiz, kept deliberately separate from the grown-up one.
 *
 * Two options, and the wrong one is obviously wrong. That is the design, not a
 * shortcut: a five-year-old who has just heard the facts should get nearly all
 * of these right, and walk away with "I know this". A plausible trap would
 * only teach them that they do not.
 *
 * `question`, `options` and `explain` all carry `{child}`, so all three have to
 * go through the substitution.
 */
/** One entry of the clinical encyclopedia.
 *
 *  The three cause fields were one field to begin with. Mixing the mechanism
 *  in with the risk factors, and the unchangeable risks in with the
 *  changeable ones, left a reader with no idea what — if anything — to do. */
export type ConditionDetail = {
  id: string;
  organ: OrganId;
  name: string;
  oneLine: string;
  what: string;
  symptoms: string[];
  /** Why it happens. Mechanism only — no blame, no advice. */
  causes: string;
  /** Age, family history, and the like. Named so nobody reads the other
   *  column as the whole story. */
  fixedFactors: string[];
  /** What can be reduced — never "prevented". People who do everything
   *  right still get ill. */
  modifiableFactors: string[];
  seeDoctor: string;
  urgent?: boolean;
  note?: string;
};

export type KidsQuizItem = {
  id: string;
  organ: OrganId;
  question: string;
  options: [string, string];
  answer: 0 | 1;
  /** One line after the answer, in a praising tone. */
  explain: string;
};

/**
 * A question drawn from what the reading panels already say.
 *
 * `category` points back at the deep-dive entry the answer came from, which is
 * what lets the result screen offer to open that passage rather than just
 * asserting the answer. `"stories"` covers the ones drawn from the long reads,
 * which have no category of their own.
 */
export type KnowledgeQuizItem = {
  id: string;
  organ: OrganId;
  category: DeepDiveCategory | "stories";
  question: string;
  options: [string, string, string];
  answer: 0 | 1 | 2;
  explain: string;
};

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
  /** Optional because the clinical encyclopedia only exists in Korean. The UI
   *  is gated on the data, so a locale without this group never reaches it —
   *  better than eleven files of blank labels. */
  conditions?: {
    listTitle: string; back: string; urgent: string;
    what: string; symptoms: string; causes: string;
    risk: string; fixed: string; modifiable: string;
    seeDoctor: string; note: string;
    noDetail: string; disclaimer: string;
  };
};

export type Dictionary = { ui: UiDictionary; organs: OrganContentDictionary };

/** Minimal `{name}` interpolation — the copy has no plurals or dates. */
export function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
