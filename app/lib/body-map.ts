import type { OrganId } from "./anatomy-data";

/**
 * Where each organ sits inside a body, drawn as one picture.
 *
 * The shipped `location.webp` illustrations show a single organ each, so they
 * can never answer the question a child actually asks — how all of this fits
 * inside them at once, and what is next to what. This is a schematic front view
 * of a child (a larger head than an adult figure, which is what they draw
 * themselves), with every organ placed on it.
 *
 * Front view means the figure faces the viewer, so a structure on the child's
 * right — the liver, most of it — is drawn on the LEFT of the image. Depth is
 * conveyed by draw order: posterior structures come first in `bodyPlacements`
 * and are overlapped by the ones in front of them.
 *
 * Geometry only. Every name a child reads or hears comes from the locale files.
 */

export type BodyShape =
  | { kind: "path"; d: string; /** Set to stroke the path instead of filling it. */ stroke?: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number };

export type BodyPlacement = {
  id: OrganId;
  shapes: BodyShape[];
  /** Origin for the idle animation, in viewBox units. */
  pulse?: { x: number; y: number };
};

export const BODY_VIEWBOX = "0 0 200 460";

/**
 * The silhouette doubles as the target for skin — it is the one organ that is
 * the boundary rather than something inside it, which is the point worth making.
 */
export const BODY_SILHOUETTE: BodyShape[] = [
  { kind: "ellipse", cx: 100, cy: 48, rx: 30, ry: 35 },
  { kind: "path", d: "M 92,76 L 108,76 L 108,96 L 92,96 Z" },
  {
    kind: "path",
    d: "M 100,90 C 116,90 132,94 138,102 C 142,108 140,130 137,158 C 134,186 132,220 130,252 C 120,261 80,261 70,252 C 68,220 66,186 63,158 C 60,130 58,108 62,102 C 68,94 84,90 100,90 Z",
  },
  { kind: "path", d: "M 66,106 C 52,122 46,160 44,196 C 43,214 45,228 47,238", stroke: 21 },
  { kind: "path", d: "M 134,106 C 148,122 154,160 156,196 C 157,214 155,228 153,238", stroke: 21 },
  { kind: "path", d: "M 86,254 C 82,300 82,360 84,404 C 85,424 86,434 87,442", stroke: 28 },
  { kind: "path", d: "M 114,254 C 118,300 118,360 116,404 C 115,424 114,434 113,442", stroke: 28 },
];

/**
 * Draw order is back-to-front: the kidneys sit behind the liver, the liver in
 * front of the pancreas, the heart in front of the lungs. `skin` is absent
 * because the silhouette above is its shape.
 */
export const bodyPlacements: BodyPlacement[] = [
  {
    id: "kidneys",
    shapes: [
      { kind: "path", d: "M 76,190 C 82,190 86,196 86,203 C 86,212 81,217 75,217 C 70,217 67,211 67,203 C 67,195 70,190 76,190 Z" },
      { kind: "path", d: "M 124,190 C 118,190 114,196 114,203 C 114,212 119,217 125,217 C 130,217 133,211 133,203 C 133,195 130,190 124,190 Z" },
    ],
  },
  {
    id: "pancreas",
    shapes: [
      { kind: "path", d: "M 79,199 C 92,195 106,196 118,201 C 124,203 125,207 121,209 C 116,211 108,208 99,206 C 90,204 82,205 79,205 C 75,205 75,200 79,199 Z" },
    ],
  },
  {
    id: "liver",
    shapes: [
      { kind: "path", d: "M 66,170 C 66,166 70,164 78,164 L 106,167 C 112,168 114,172 112,177 C 107,188 94,196 80,196 C 70,196 66,188 66,178 Z" },
    ],
  },
  {
    id: "intestine",
    shapes: [
      { kind: "path", d: "M 80,216 C 80,211 120,211 120,218 C 120,225 78,223 78,230 C 78,238 122,236 122,243 C 122,250 88,250 86,246", stroke: 9 },
    ],
  },
  {
    id: "lungs",
    shapes: [
      { kind: "path", d: "M 92,108 C 84,107 76,113 73,124 C 69,138 71,152 76,160 C 82,167 90,164 92,156 C 94,148 94,120 94,112 C 94,109 93,108 92,108 Z" },
      { kind: "path", d: "M 108,108 C 116,107 124,113 127,124 C 131,138 129,152 124,160 C 118,167 110,164 108,156 C 106,148 106,120 106,112 C 106,109 107,108 108,108 Z" },
    ],
    pulse: { x: 100, y: 134 },
  },
  {
    id: "heart",
    shapes: [
      { kind: "path", d: "M 96,124 C 103,120 112,124 113,133 C 115,143 109,152 102,156 C 96,152 92,144 92,135 C 91,129 93,126 96,124 Z" },
    ],
    pulse: { x: 105, y: 137 },
  },
  {
    id: "brain",
    shapes: [
      { kind: "path", d: "M 100,22 C 113,22 122,29 122,38 C 122,47 113,53 100,53 C 87,53 78,47 78,38 C 78,29 87,22 100,22 Z" },
    ],
  },
  {
    id: "eyeball",
    shapes: [
      { kind: "ellipse", cx: 91, cy: 59, rx: 5, ry: 5 },
      { kind: "ellipse", cx: 109, cy: 59, rx: 5, ry: 5 },
    ],
  },
];

/** The organ the silhouette itself stands for. */
export const OUTLINE_ORGAN: OrganId = "skin";
