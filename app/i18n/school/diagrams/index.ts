import type { DiagramLabel } from "./types";
import { circulationLabels } from "./circulation-labels-ko";
import { digestionLabels } from "./digestion-labels-ko";
import { excretionLabels } from "./excretion-labels-ko";
import { movementLabels } from "./movement-labels-ko";
import { respirationLabels } from "./respiration-labels-ko";

/** Korean only, like the rest of the school layer. */
const LABELS: Partial<Record<string, Partial<Record<string, DiagramLabel[]>>>> = {
  ko: {
    movement: movementLabels,
    digestion: digestionLabels,
    respiration: respirationLabels,
    circulation: circulationLabels,
    excretion: excretionLabels,
  },
};

export function getDiagramLabels(locale: string, systemId: string): DiagramLabel[] {
  return LABELS[locale]?.[systemId] ?? [];
}

/**
 * What to call the list of nearby labels, which is not the same thing in every
 * diagram: bones sit next to each other, vessels and organs run into each
 * other. A generic heading would be true of all four and say nothing.
 */
const RELATED: Partial<Record<string, Partial<Record<string, string>>>> = {
  ko: {
    movement: "가까이 있는 뼈",
    digestion: "이어지는 기관",
    respiration: "이어지는 기관",
    circulation: "이어지는 혈관",
    excretion: "이어지는 기관",
  },
};

export function getRelatedHeading(locale: string, systemId: string): string | undefined {
  return RELATED[locale]?.[systemId];
}

export type { DiagramLabel };
