import type { OrganId } from "../../lib/anatomy-data";

/**
 * The child this build is for. Used sparingly — a couple of comparisons like
 * "your fist" land far better with a name attached, but a name sprinkled over
 * every sentence reads as a gimmick.
 */
export const CHILD_NAME = "수호";

/**
 * Organs a five-year-old can point to on their own body.
 *
 * The other four (liver, kidneys, eyeball, pancreas) stay in the data and keep
 * their child-facing copy, so re-enabling one is a single edit here. The eye is
 * left out on purpose: a detached eyeball frightens a lot of children this age.
 */
export const KIDS_ORGAN_IDS: OrganId[] = ["heart", "brain", "lungs", "intestine", "skin"];

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
  quoteLine1: string;
  quoteLine2: string;
  quoteSign: string;
  listen: string;
  listenStop: string;
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
