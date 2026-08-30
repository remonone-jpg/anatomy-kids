import type { OrganId } from "../../../lib/anatomy-data";

/**
 * One clickable label on a system diagram.
 *
 * `id` matches the `data-organ` stamped on the SVG's <text> element, which is
 * what survives a reworded label — matching on the visible string would break
 * the first time the wording changes.
 */
export type DiagramLabel = {
  id: string;
  /** The visible text, kept for cross-checking against the SVG. */
  label: string;
  name: string;
  desc: string;
  /** Present when this site already has a page for the organ. */
  organId?: OrganId;
  /** Beyond the school syllabus — shown, but set apart. */
  beyond?: boolean;
  /**
   * Labels that name parts of this one, by id. Some diagrams label a thing and
   * its pieces both — 머리뼈 next to 머리덮개뼈 and 아래턱뼈 — and without
   * saying so the two readings sit at the same level and the drawing looks
   * like it is naming eight separate bones where it means three.
   */
  children?: string[];
  /**
   * Something to try on your own body — feel for the bone, find the pulse.
   * Kept apart from `desc` rather than mixed into it: a sentence asking the
   * reader to do something reads differently from one telling them a fact, and
   * buried mid-paragraph it goes unnoticed.
   */
  tryIt?: string;
  /** Labels worth reading next, by id. Neighbours, not parts. */
  related?: string[];
};
