import type { SystemChart } from "./types";
import { sensesChart } from "./senses-chart-ko";
import { togetherChart } from "./together-chart-ko";

/**
 * Korean only, like the diagram labels beside it — the writing in these charts
 * is content, not furniture. A locale without one falls back to what the stage
 * showed before: the parts list, standing where the drawing would be. Nothing
 * has to be translated for the other eleven to keep working.
 *
 * Only the two systems with no diagram have a chart. Giving one to the other
 * five would put a second, worse picture beside the drawing they already have.
 *
 * ── 설명 글을 채우는 자리 ──────────────────────────────────────────────
 * 각 노드의 `desc`(자세한 판)와 `descEasy`(쉬운 판)가 서랍에 열리는 본문입니다.
 * 지금은 빈 문자열이고, 빈 동안에는 서랍이 "설명은 아직 준비 중이에요"를
 * 보여줍니다. `descEasy`가 비어 있으면 쉬운 판에서도 `desc`를 씁니다.
 * 필요하면 `tryIt`/`tryItEasy`(직접 해봐요 한 줄)도 같은 노드에 넣을 수 있어요.
 */
const CHARTS: Partial<Record<string, Partial<Record<string, SystemChart>>>> = {
  ko: {
    senses: sensesChart,
    together: togetherChart,
  },
};

export function getSystemChart(locale: string, systemId: string): SystemChart | null {
  return CHARTS[locale]?.[systemId] ?? null;
}

export type { SystemChart, ChartNode, ChartRow } from "./types";
