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
};
