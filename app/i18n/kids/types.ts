import type { OrganId } from "../../lib/anatomy-data";

/**
 * Every organ, ordered for a child rather than by body system: the ones they
 * can point to on themselves come first, the ones they have to be told about
 * come last. Trimming this list is how kids mode would show fewer of them.
 */
export const KIDS_ORGAN_IDS: OrganId[] = [
  "heart",
  "brain",
  "lungs",
  "stomach",
  "intestine",
  "skin",
  "eyeball",
  "liver",
  "kidneys",
  "pancreas",
];

/**
 * Child-facing copy layered over an organ's adult entry. Only the fields a
 * child hears are overridden — clinical text (weight, blood supply, medical
 * note, conditions) is hidden by kids mode rather than rewritten.
 */
export type KidsOrganCopy = {
  poetic: string;
  description: string;
  size: string;
  function: string;
  dailyFact: string;
  funFact: string;
  /**
   * Extra one-liners, surfaced one at a time behind a button. A child who has
   * heard the description once still wants more, and a wall of ten facts is
   * not readable at this age — so they arrive singly, in a shuffled order.
   */
  moreFacts: string[];
  /**
   * Something to try on their own body. A five-year-old learns "the heart is
   * in the chest" by putting a hand there and feeling it, not by being shown
   * a diagram — this is the line that turns the screen into an activity.
   */
  bodySense: string;
  /**
   * Hotspot id -> child-facing explanation. Labels keep their real anatomical
   * name: the words are short, children this age enjoy saying them, and the
   * explanation underneath is what carries the meaning.
   */
  hotspots: Record<string, string>;
};

/** UI strings kids mode replaces. Everything else falls through to the locale. */
export type KidsUiCopy = {
  tagline: string;
  libraryTitle: string;
  viewAll: string;
  listTab: string;
  viewOrgan: string;
  viewBody: string;
  bodyLoading: string;
  bodyHint: string;
  bodyFocus: string;
  bodyReset: string;
  bodyLabel: string;
  bodyCredit: string;
  bodySenseTitle: string;
  quoteLine1: string;
  quoteLine2: string;
  quoteSign: string;
  listen: string;
  listenStop: string;
  moreFactsTitle: string;
  moreFactsButton: string;
  moreFactsRestart: string;
  kidsQuizTitle: string;
  kidsQuizButton: string;
  kidsQuizAgain: string;
  /** Shown before the explanation on a wrong pick. One is chosen at random so
   *  the same words don't repeat all round. None of them scold. */
  kidsQuizWrong: string[];
  /** The one-time question, and the way back to it. */
  nameAsk: string;
  namePlaceholder: string;
  nameStart: string;
  nameSkip: string;
  nameChange: string;
  /** The three-way mode switch, and the school layer it opens. */
  modeKids: string;
  modeSchool: string;
  modeAdult: string;
  schoolSystems: string;
  schoolOrgans: string;
  system: {
    madeOf: string; order: string; terms: string; experiment: string;
    prepare: string; steps: string; result: string; meaning: string; goal: string;
    why: string; numbers: string; tryIt: string; connection: string;
    summary: string; exam: string; listen: string; quizPaper: string;
  };
  systemQuiz: {
    title: string; paper: string; mixed: string; passage: string;
    next: string; finish: string; scoreTitle: string; score: string;
    retryWrong: string; restart: string; close: string; progress: string; allRight: string;
  };
  nameHint: string;
  modeLabel: string;
  keyFacts: string;
  size: string;
  daily: string;
  function: string;
  didYouKnow: string;
  animate: string;
  quizButton: string;
  tip: string;
  tipDrag: string;
  tipScroll: string;
  tipClick: string;
  caption: string;
  structures: string;
  rotate: string;
  zoom: string;
  reset: string;
  quiz: {
    find: string;
    correct: string;
    wrong: string;
    reveal: string;
    answer: string;
    done: string;
    score: string;
    retry: string;
    exit: string;
    hint: string;
    progress: string;
  };
  modal: {
    guided: string;
    motionTitle: string;
    bodyTitle: string;
    insideTitle: string;
    lessonBody: string;
    systemIntro: string;
    continueExploring: string;
  };
};

export type KidsCopy = {
  ui: KidsUiCopy;
  organs: Record<OrganId, KidsOrganCopy>;
};
