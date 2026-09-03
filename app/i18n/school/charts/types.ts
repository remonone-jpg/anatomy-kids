import type { OrganId } from "../../../lib/anatomy-data";

/**
 * A flow chart for a system that has no drawing.
 *
 * Five of the seven systems stand on a labelled diagram: the reader points at
 * a part and a drawer opens with its writing. Senses and together have no
 * such picture — senses is five organs scattered around the body, and together
 * is not a place at all — so what they show instead is the path the thing takes.
 * The nodes are the boxes, the rows are the steps between them, and a node
 * opens the same drawer a diagram label does.
 *
 * Deliberately separate from `SystemContent`: `flow` is a numbered reading of
 * six steps in the panel, and bending it into a chart would mean one array
 * serving two shapes — the moment a chart wants a row of five boxes side by
 * side, `flow` has no way to say so.
 */
export type ChartNode = {
  id: string;
  /** The name in the box. Short — it has to sit on one or two lines. */
  label: string;
  labelEasy?: string;
  /** The half-line under the name: what this one does, in three or four words. */
  kicker?: string;
  kickerEasy?: string;
  /**
   * The writing that opens in the drawer. Empty until it is written, and the
   * drawer says so rather than opening on nothing.
   */
  desc?: string;
  descEasy?: string;
  /** Something to try, shown under the writing. Optional. */
  tryIt?: string;
  tryItEasy?: string;
  /**
   * The box's colour, as a hex value. Written here rather than in the
   * stylesheet because it belongs to the thing, not to the layout: the four
   * systems in the loop carry the same colours the list on the left gives
   * them, and the eye and the skin carry their own organ's. The box tints
   * itself from this; the chosen box still turns coral, so "what this is" and
   * "what I pressed" stay two different signals.
   */
  accent?: string;
  /** Key into the chart's icon set. A name, not a component: this is data. */
  icon?: string;
  /** Opens that system's own layer — the way out of the chart into a diagram. */
  goSystem?: string;
  /** Opens the 3D organ page. Only for the organs this site has modelled. */
  goOrgan?: OrganId;
};

export type ChartRow = {
  id: string;
  /** What the arrow into this row carries. Absent on the first row, which
   *  nothing points at, and wherever the step speaks for itself. */
  arrow?: string;
  arrowEasy?: string;
  /** Side by side within the row. Five is the most that has to fit. */
  nodes: ChartNode[];
  /**
   * Off to one side rather than in the chain. The body's material flow is a loop of
   * four; sensing and moving belong to the same body but not to that loop,
   * and threading them into it would draw a line that is not there.
   */
  aside?: boolean;
};

export type SystemChart = {
  rows: ChartRow[];
  /**
   * The return leg, drawn as a bracket down both sides from `to` back up to
   * `from` — the part of a cycle a column of arrows cannot show.
   */
  loop?: { from: string; to: string; label: string; labelEasy?: string };
  /** Heads the rows marked `aside`. */
  asideTitle?: string;
};
