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
  /** `organId` links to an organ this site already has a page for. Blood
   *  vessels, bladder, ears and the rest have no page yet and simply read. */
  organs: { name: string; role: string; organId?: OrganId }[];
  flow: { step: string; detail: string }[];
  terms: { word: string; mean: string }[];
  experiment: {
    title: string;
    goal: string;
    prepare: string[];
    steps: string[];
    result: string;
    /** Which part of the model stands for which part of the body. This is
     *  the part the exam asks about. */
    meaning: string;
  }[];
  whyQuestions: { q: string; a: string }[];
  numbers: { label: string; value: string; compare: string }[];
  tryIt: { title: string; how: string; what: string }[];
  connection: string;
  summary: string[];
  exam: { point: string; note: string }[];
};
