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
  /**
   * The three views the header switches between, and the group's own name.
   * `viewSystems` is shorter than `schoolSystems` ("기관계 보기") because the
   * header row already reads as a set of views — the verb was doing work
   * only when the pair sat alone inside the reading panel.
   */
  viewSwitch: string;
  viewOrgan: string;
  viewBody: string;
  viewSystems: string;
  /** The row under the header: what to read, rather than where to look. */
  contentNav: string;
  navDeepDive: string;
  navStories: string;
  navQuiz: string;
  navConditions: string;
  /** Back out of a long face of the reading panel to the organ's own facts. */
  navBasic: string;
  /** The systems layer's three faces. Different words from the organ layer's,
   *  because they divide a different reading. */
  navFlow: string;
  navLab: string;
  navExam: string;
  /** Site-wide search: the result list's furniture. Lives here because the
   *  searchable text is Korean-only, like everything else in this file. */
  searchResults: string;
  searchEmpty: string;
  searchOpen: string;
  faceBasic: string;
  searchGroups: { organ: string; hotspot: string; deep: string; story: string; condition: string; label: string; system: string };
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
  modeEasy: string;
  modeDetailed: string;
  /** Shown under a passage that has no plain rewrite yet. */
  readingFallback: string;
  schoolSystems: string;
  schoolOrgans: string;
  system: {
    madeOf: string; order: string; terms: string; experiment: string;
    prepare: string; steps: string; result: string; meaning: string; goal: string;
    why: string; numbers: string; tryIt: string; connection: string;
    summary: string; exam: string; listen: string; quizPaper: string;
  };
  diagram: {
    zoomIn: string; zoomOut: string; reset: string;
    hint: string; detail: string; beyond: string; loading: string;
    /** Heads the list of labels that name parts of the one being read. */
    contains: string;
    /** Badge on a label that is part of a larger one; takes the parent's name. */
    belongsTo: string;
    tryIt: string;
    related: string;
    /** Takes the position and the total, e.g. 28개 중 3번째. */
    position: string;
    prev: string;
    next: string;
    /** Heads the link out of this diagram into another system. */
    crossSystem: string;
  };
  /** The flow chart that stands in for a diagram on the two systems that have
   *  none. Furniture only — the boxes and their writing are content, and live
   *  with the charts in i18n/school/charts. */
  chart: {
    hint: string;
    /** Stands in for a node's writing until it is written. */
    empty: string;
    goSystem: string;
    goOrgan: string;
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
