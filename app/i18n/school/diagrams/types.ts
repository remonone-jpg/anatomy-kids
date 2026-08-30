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
};
