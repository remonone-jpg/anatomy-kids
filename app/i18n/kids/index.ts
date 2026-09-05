import type { OrganId } from "../../lib/anatomy-data";
import type { Dictionary, OrganContent, OrganContentDictionary, UiDictionary } from "../types";
import type { KidsCopy, KidsOrganCopy, KidsUiCopy } from "./types";
import { applyChild } from "./child";
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

/** The name is threaded in from the app rather than read here, so this module
 *  never touches storage and stays safe to call during a render. */
const childName = (name: string | null) => (text: string) => applyChild(text, name);

/**
 * Child copy layered over one organ. Nothing is blanked — a field with no child
 * rewrite keeps the adult sentence, so switching kids mode off restores the
 * original entry intact and a half-written organ still reads.
 */
function mergeOrgan(base: OrganContent, copy: KidsOrganCopy, withChild: (t: string) => string): OrganContent {
  return {
    ...base,
    poetic: withChild(copy.poetic),
    description: withChild(copy.description),
    size: withChild(copy.size),
    function: withChild(copy.function),
    dailyFact: withChild(copy.dailyFact),
    funFact: withChild(copy.funFact),
    weight: copy.weight ? withChild(copy.weight) : base.weight,
    location: copy.location ? withChild(copy.location) : base.location,
    bloodSupply: copy.bloodSupply ? withChild(copy.bloodSupply) : base.bloodSupply,
    medical: copy.medical ? withChild(copy.medical) : base.medical,
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
      weight: copy.weight,
      daily: copy.daily,
      location: copy.location,
      bloodSupply: copy.bloodSupply,
      function: copy.function,
      medical: copy.medical,
      didYouKnow: copy.didYouKnow,
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
export function applyKids(dictionary: Dictionary, locale: string, name: string | null): Dictionary {
  const copy = KIDS_COPY[locale];
  if (!copy) return dictionary;
  const withChild = childName(name);
  const organs = Object.fromEntries(
    Object.entries(dictionary.organs).map(([id, content]) => [
      id,
      mergeOrgan(content, copy.organs[id as OrganId], withChild),
    ]),
  ) as OrganContentDictionary;
  return { ui: mergeUi(dictionary.ui, copy.ui), organs };
}

/**
 * The "try it on yourself" line for one organ. It is deliberately not part of
 * `OrganContent` — that type is shared by all twelve locales, and this only
 * exists where a child rewrite does — so it is read through here instead.
 */
export function getBodySense(locale: string, id: OrganId, name: string | null): string | null {
  const copy = KIDS_COPY[locale];
  return copy ? applyChild(copy.organs[id].bodySense, name) : null;
}

/**
 * The extra one-liners for an organ. Kids-only, so like `bodySense` they are
 * read from here rather than threaded through `OrganContent`.
 */
export function getMoreFacts(locale: string, id: OrganId, name: string | null): string[] {
  const copy = KIDS_COPY[locale];
  return copy ? copy.organs[id].moreFacts.map((text) => applyChild(text, name)) : [];
}

/**
 * Strings kids mode adds rather than replaces (the narration button, the mode
 * toggle). They have no home in `UiDictionary`, so components read them here.
 */
export function getKidsUi(locale: string): KidsUiCopy | null {
  return KIDS_COPY[locale]?.ui ?? null;
}

export { KIDS_ORGAN_IDS } from "./types";
export { applyChild, normaliseChildName, CHILD_NAME_MAX } from "./child";
