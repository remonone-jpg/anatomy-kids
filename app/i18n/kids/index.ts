import type { OrganId } from "../../lib/anatomy-data";
import { format, type Dictionary, type OrganContent, type OrganContentDictionary, type UiDictionary } from "../types";
import { CHILD_NAME, type KidsCopy, type KidsOrganCopy, type KidsUiCopy } from "./types";
import { kids as ko } from "./ko";

/**
 * Locales with a child-facing rewrite. A locale without one keeps the adult
 * copy and simply does not offer kids mode — inventing child copy by machine
 * translating clinical prose would read worse than not offering it at all.
 * Adding a language is one file plus one line here.
 */
const KIDS_COPY: Partial<Record<string, KidsCopy>> = { ko };

export function kidsAvailable(locale: string): boolean {
  return KIDS_COPY[locale] !== undefined;
}

const withChild = (text: string) => format(text, { child: CHILD_NAME });

/**
 * Child copy layered over one organ. Clinical fields are left untouched rather
 * than blanked, so switching kids mode off restores the original entry intact.
 */
function mergeOrgan(base: OrganContent, copy: KidsOrganCopy): OrganContent {
  return {
    ...base,
    poetic: withChild(copy.poetic),
    description: withChild(copy.description),
    size: withChild(copy.size),
    function: withChild(copy.function),
    dailyFact: withChild(copy.dailyFact),
    funFact: withChild(copy.funFact),
    hotspots: Object.fromEntries(
      Object.entries(base.hotspots).map(([id, hotspot]) => [
        id,
        // The anatomical label stays; only the explanation is rewritten.
        { ...hotspot, detail: copy.hotspots[id] ? withChild(copy.hotspots[id]) : hotspot.detail },
      ]),
    ),
  };
}

function mergeUi(base: UiDictionary, copy: KidsUiCopy): UiDictionary {
  return {
    ...base,
    brand: { ...base.brand, tagline: copy.tagline },
    library: {
      ...base.library,
      title: copy.libraryTitle,
      viewAll: copy.viewAll,
      quoteLine1: copy.quoteLine1,
      quoteLine2: copy.quoteLine2,
      quoteSign: copy.quoteSign,
    },
    tools: { ...base.tools, rotate: copy.rotate, zoom: copy.zoom, reset: copy.reset },
    viewer: {
      ...base.viewer,
      tip: copy.tip,
      tipDrag: copy.tipDrag,
      tipScroll: copy.tipScroll,
      tipClick: copy.tipClick,
      caption: copy.caption,
      structures: copy.structures,
    },
    info: {
      ...base.info,
      keyFacts: copy.keyFacts,
      size: copy.size,
      daily: copy.daily,
      function: copy.function,
      didYouKnow: copy.didYouKnow,
      animate: copy.animate,
      quiz: copy.quizButton,
    },
    quiz: { ...base.quiz, ...copy.quiz },
    modal: { ...base.modal, ...copy.modal },
  };
}

/**
 * Returns the dictionary rewritten for a five-year-old, or the original when
 * the locale has no child copy. Never mutates the input — the adult dictionary
 * stays intact so the mode toggle works in both directions.
 */
export function applyKids(dictionary: Dictionary, locale: string): Dictionary {
  const copy = KIDS_COPY[locale];
  if (!copy) return dictionary;
  const organs = Object.fromEntries(
    Object.entries(dictionary.organs).map(([id, content]) => [
      id,
      mergeOrgan(content, copy.organs[id as OrganId]),
    ]),
  ) as OrganContentDictionary;
  return { ui: mergeUi(dictionary.ui, copy.ui), organs };
}

/**
 * The "try it on yourself" line for one organ. It is deliberately not part of
 * `OrganContent` — that type is shared by all twelve locales, and this only
 * exists where a child rewrite does — so it is read through here instead.
 */
export function getBodySense(locale: string, id: OrganId): string | null {
  const copy = KIDS_COPY[locale];
  return copy ? withChild(copy.organs[id].bodySense) : null;
}

/**
 * Strings kids mode adds rather than replaces (the narration button, the mode
 * toggle). They have no home in `UiDictionary`, so components read them here.
 */
export function getKidsUi(locale: string): KidsUiCopy | null {
  return KIDS_COPY[locale]?.ui ?? null;
}

export { CHILD_NAME, KIDS_ORGAN_IDS } from "./types";
