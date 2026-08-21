import type { OrganId } from "./anatomy-data";

/**
 * Where each organ actually sits in a body, in centimetres.
 *
 * The nine organ models were each generated on their own and normalised into
 * their own unit box, so the files carry no true size: the heart and the
 * intestine arrive the same size. These boxes restore that information.
 *
 * They are measured, not estimated. Every figure is the bounding box of the
 * corresponding structure in the Z-Anatomy atlas (CC-BY-SA 4.0), which is the
 * same source as `body.glb` and therefore already shares its coordinate space —
 * so an organ placed here lands where the shell says it should.
 *
 * Axes follow the shell: +Y up with the feet at 0 and the crown at ~174,
 * +X toward the body's own left, +Z forward out of the chest. A structure on
 * the body's right — the liver, mostly — therefore has a negative x.
 */

export type OrganPlacement = {
  id: OrganId;
  /** Bounding box of the real structure, centimetres. */
  size: [number, number, number];
  /** Box centres. Two entries mean the model is placed once per side. */
  centers: [number, number, number][];
  /**
   * Correction applied before fitting, in degrees, for models whose own
   * orientation does not match the body's. Fitting measures the box after
   * this rotation, so a correction never changes how well the organ fits.
   */
  rotation?: [number, number, number];
};

export const BODY_HEIGHT_CM = 174.3;

/** The organ the shell itself stands for — it has no box inside the body. */
export const SHELL_ORGAN: OrganId = "skin";

export const organPlacements: OrganPlacement[] = [
  // The model runs front-to-back along its own X, so it arrives in profile.
  { id: "brain", size: [14.0, 12.0, 17.5], centers: [[0.4, 163.0, -1.0]], rotation: [0, 90, 0] },
  // A single eyeball model, placed once per orbit. It arrives looking sideways,
  // and its box is deeper than an eye because the optic nerve trails behind the
  // globe — hence the 4.5, which leaves the globe itself about 2.4 across.
  { id: "eyeball", size: [2.4, 2.4, 4.5], centers: [[-3.1, 159.6, 5.5], [3.1, 159.6, 5.5]], rotation: [0, 90, 0] },
  { id: "lungs", size: [30.0, 28.1, 24.0], centers: [[-0.6, 130.4, 0.1]] },
  { id: "heart", size: [8.5, 11.4, 6.5], centers: [[0.7, 125.9, 5.0]] },
  { id: "liver", size: [24.0, 17.0, 18.0], centers: [[-3.5, 119.2, 2.0]] },
  { id: "pancreas", size: [13.6, 6.0, 7.0], centers: [[1.4, 111.9, 0.5]] },
  { id: "kidneys", size: [18.0, 12.9, 8.0], centers: [[-1.1, 110.1, -3.5]] },
  { id: "intestine", size: [26.0, 30.0, 18.0], centers: [[-2.0, 97.4, 3.0]] },
];
