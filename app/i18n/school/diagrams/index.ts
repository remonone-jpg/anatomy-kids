import type { DiagramLabel } from "./types";
import { digestionLabels } from "./digestion-labels-ko";

/** Korean only, like the rest of the school layer. */
const LABELS: Partial<Record<string, Partial<Record<string, DiagramLabel[]>>>> = {
  ko: { digestion: digestionLabels },
};

export function getDiagramLabels(locale: string, systemId: string): DiagramLabel[] {
  return LABELS[locale]?.[systemId] ?? [];
}

export type { DiagramLabel };
