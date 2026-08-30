import type { DiagramLabel } from "./types";
import { circulationLabels } from "./circulation-labels-ko";
import { digestionLabels } from "./digestion-labels-ko";
import { excretionLabels } from "./excretion-labels-ko";

/** Korean only, like the rest of the school layer. */
const LABELS: Partial<Record<string, Partial<Record<string, DiagramLabel[]>>>> = {
  ko: {
    digestion: digestionLabels,
    circulation: circulationLabels,
    excretion: excretionLabels,
  },
};

export function getDiagramLabels(locale: string, systemId: string): DiagramLabel[] {
  return LABELS[locale]?.[systemId] ?? [];
}

export type { DiagramLabel };
