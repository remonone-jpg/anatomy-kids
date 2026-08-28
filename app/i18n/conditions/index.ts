import type { OrganId } from "../../lib/anatomy-data";
import type { ConditionDetail } from "../types";
import { conditionsKo } from "./ko";

/** Korean only for now. Other locales fall through to an empty list, which
 *  hides the whole feature rather than showing half-translated medicine. */
const CONDITIONS: Partial<Record<string, ConditionDetail[]>> = { ko: conditionsKo };

export function conditionsAvailable(locale: string): boolean {
  return (CONDITIONS[locale]?.length ?? 0) > 0;
}

export function getConditions(locale: string, organ: OrganId): ConditionDetail[] {
  return (CONDITIONS[locale] ?? []).filter((entry) => entry.organ === organ);
}

/** The card lists `organ.conditions`, which is plain strings. Matching on the
 *  name is what links the two; an organ whose detail hasn't been written yet
 *  simply returns undefined and stays unclickable. */
export function getConditionByName(
  locale: string,
  organ: OrganId,
  name: string,
): ConditionDetail | undefined {
  return getConditions(locale, organ).find((entry) => entry.name === name);
}
