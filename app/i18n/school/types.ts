import type { OrganId } from "../../lib/anatomy-data";

/**
 * One organ system, as school science teaches it.
 *
 * The shape follows what a textbook chapter actually covers, in the order it
 * covers it: what the system is made of, how it works step by step, the
 * experiment, and what the exam asks. Leaving any of those out would make
 * this a nicer read than the textbook but a worse companion to it.
 */
export type SystemContent = {
  id: string;
  /** Deliberately without a year: the chapter sits in different grades
   *  between the current textbook and the 2022 revision, and the revision's
   *  table of contents is not final. */
  curriculum: string;
  name: string;
  oneLine: string;
  intro: string;
  /**
   * The same passage said plainly, for the easy reading.
   *
   * Every `…Easy` field on this type is optional and falls back to its full
   * version when absent, so a half-written system still reads. They are being
   * filled a field at a time across seven systems, and a missing one has to
   * cost nothing.
   *
   * Fields with no easy twin are the ones already written that way: `oneLine`
   * and `flow[].step` and `exam[].point` are short labels; `numbers[].compare`
   * is the plain-language half of the number it sits beside ("쌀알보다 작아요");
   * `experiment[].goal`, `.prepare`, `.steps` and `tryIt[].how` are already
   * addressed to a child doing the thing ("빨대로 공기를 불어넣어 봅니다").
   * Giving those an easy form would mean rewriting them as themselves.
   */
  introEasy?: string;
  /** A diagram of the whole system, under `public/anatomy/systems/`. Optional
   *  because not every system has one drawn yet. Credits live in
   *  ATTRIBUTION.md — every one of these is a third party's work. */
  image?: { src: string; alt: string };
  /** `organId` links to an organ this site already has a page for. Blood
   *  vessels, bladder, ears and the rest have no page yet and simply read. */
  organs: { name: string; role: string; roleEasy?: string; organId?: OrganId }[];
  flow: { step: string; detail: string; detailEasy?: string }[];
  terms: { word: string; mean: string; meanEasy?: string }[];
  experiment: {
    title: string;
    goal: string;
    prepare: string[];
    steps: string[];
    result: string;
    /** Which part of the model stands for which part of the body. This is
     *  the part the exam asks about. */
    meaning: string;
    /**
     * Grouped rather than spelled out as `resultEasy` and `meaningEasy`: two
     * more top-level keys would put this entry at eight fields, and these two
     * are always written together — the result and what it stands for.
     * `goal` has no easy form; it is one short sentence already.
     */
    easy?: { result?: string; meaning?: string };
  }[];
  whyQuestions: { q: string; a: string; aEasy?: string }[];
  numbers: { label: string; value: string; compare: string }[];
  tryIt: { title: string; how: string; what: string; whatEasy?: string }[];
  connection: string;
  connectionEasy?: string;
  summary: string[];
  /**
   * The only easy field that is a parallel array rather than a sibling key,
   * because `summary` is a bare `string[]` with nothing to hang one on.
   *
   * It is therefore used whole or not at all: the view reads this array
   * instead of `summary` when it is present, and ignores it otherwise. Lining
   * the two up index by index would put the wrong plain sentence under a
   * heading the first time an entry is inserted in the middle. Write all of a
   * system's lines or none of them.
   */
  summaryEasy?: string[];
  exam: { point: string; note: string; noteEasy?: string }[];
};
