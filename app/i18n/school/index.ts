import type { SystemContent } from "./types";
import { systemsKo } from "./systems-ko";

/** Korean only, like the kids copy and the clinical encyclopedia. A locale
 *  without this simply does not offer school mode. */
const SYSTEMS: Partial<Record<string, SystemContent[]>> = { ko: systemsKo };

export function schoolAvailable(locale: string): boolean {
  return (SYSTEMS[locale]?.length ?? 0) > 0;
}

export function getSystems(locale: string): SystemContent[] {
  return SYSTEMS[locale] ?? [];
}

export function getSystem(locale: string, id: string): SystemContent | undefined {
  return getSystems(locale).find((entry) => entry.id === id);
}

export type { SystemContent };
