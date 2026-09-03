import type { OrganId } from "./anatomy-data";
import type { Organ } from "../i18n/merge";
import type { ConditionDetail } from "../i18n/types";
import type { SystemContent } from "../i18n/school";
import type { DiagramLabel } from "../i18n/school/diagrams";

/**
 * The whole site, flattened for the search box.
 *
 * No index structure beyond this array: the entire corpus is ~276k characters,
 * and a substring scan over that is one or two milliseconds — cheaper than
 * keeping a real index honest. What matters is building this once per mode,
 * not on every keystroke.
 */
export type SearchHit = {
  type: "organ" | "hotspot" | "deep" | "story" | "condition" | "label" | "system";
  /** Row title in the result list. */
  title: string;
  /** Where it lives — "심장 · 심화" — so a hit names its own doorway. */
  sub: string;
  /** Tier 1: the thing's name. A one-character query searches only this. */
  name: string;
  /** Tier 2: headings. */
  head: string;
  /** Tier 3: full text. */
  body: string;
  organId?: OrganId;
  systemId?: string;
  /** hotspot id, deep-dive category, diagram label id, condition name, system face. */
  key?: string;
};

const join = (...parts: (string | undefined | null)[]) => parts.filter(Boolean).join(" ");

/** Which face of the systems panel each block family lives on. */
const SYSTEM_FACES: { face: string; label: (s: SystemContent, easy: boolean) => string }[] = [
  { face: "basic", label: (s, e) => join(s.name, s.oneLine, e && s.introEasy ? s.introEasy : s.intro, ...s.organs.map((o) => join(o.name, e && o.roleEasy ? o.roleEasy : o.role))) },
  { face: "flow", label: (s, e) => join(...s.flow.map((f) => join(f.step, e && f.detailEasy ? f.detailEasy : f.detail)), ...s.terms.map((t) => join(t.word, e && t.meanEasy ? t.meanEasy : t.mean)), e && s.connectionEasy ? s.connectionEasy : s.connection) },
  { face: "lab", label: (s, e) => join(...s.experiment.map((x) => join(x.title, x.goal, ...x.prepare, ...x.steps, e && x.easy?.result ? x.easy.result : x.result, e && x.easy?.meaning ? x.easy.meaning : x.meaning)), ...s.numbers.map((n) => join(n.label, n.value, n.compare)), ...s.tryIt.map((t) => join(t.title, t.how, e && t.whatEasy ? t.whatEasy : t.what))) },
  { face: "exam", label: (s, e) => join(...s.whyQuestions.map((w) => join(w.q, e && w.aEasy ? w.aEasy : w.a)), ...(e && s.summaryEasy ? s.summaryEasy : s.summary), ...s.exam.map((x) => join(x.point, e && x.noteEasy ? x.noteEasy : x.note))) },
];

export function buildSearchIndex(args: {
  organs: Organ[];
  conditions: (organ: OrganId) => ConditionDetail[];
  systems: SystemContent[];
  diagramLabels: (systemId: string) => DiagramLabel[];
  /** Kids-only extra reading, already merged with the child's name. */
  moreFacts: (organ: OrganId) => string[];
  bodySense: (organ: OrganId) => string | null;
  easy: boolean;
  faceLabels: Record<string, string>;
  subLabels: Record<SearchHit["type"], string>;
}): SearchHit[] {
  const { organs, easy, subLabels } = args;
  const hits: SearchHit[] = [];
  const pick = (full: string | undefined, plain: string | undefined) => (easy && plain ? plain : full ?? "");

  for (const o of organs) {
    // The organ itself. Kids-only extras fold into its body rather than being
    // rows of their own — they have no landing place other than the organ.
    hits.push({
      type: "organ", organId: o.id, title: o.name, sub: join(o.system, "·", subLabels.organ),
      name: join(o.name, o.system, o.scientificName),
      head: o.poetic,
      body: join(o.description, o.size, o.weight, o.location, o.function, o.dailyFact, o.medical, o.bloodSupply, o.funFact,
        easy ? join(...args.moreFacts(o.id), args.bodySense(o.id) ?? "") : ""),
    });
    for (const h of o.hotspots) {
      hits.push({ type: "hotspot", organId: o.id, key: h.id, title: h.label,
        sub: join(o.name, "·", subLabels.hotspot), name: h.label, head: "", body: h.detail });
    }
    for (const d of o.deepDive ?? []) {
      hits.push({ type: "deep", organId: o.id, key: d.category, title: pick(d.title, d.titleEasy),
        sub: join(o.name, "·", subLabels.deep), name: "", head: pick(d.title, d.titleEasy), body: pick(d.body, d.bodyEasy) });
    }
    (o.stories ?? []).forEach((s) => {
      hits.push({ type: "story", organId: o.id, title: s.title,
        sub: join(o.name, "·", subLabels.story), name: "", head: s.title, body: pick(s.body, s.bodyEasy) });
    });
    for (const c of args.conditions(o.id)) {
      hits.push({ type: "condition", organId: o.id, key: c.name, title: c.name,
        sub: join(o.name, "·", subLabels.condition), name: c.name,
        head: pick(c.oneLine, c.oneLineEasy),
        body: join(pick(c.what, c.whatEasy), ...(easy && c.symptomsEasy ? c.symptomsEasy : c.symptoms),
          pick(c.causes, c.causesEasy), ...c.fixedFactors, ...c.modifiableFactors, c.seeDoctor, pick(c.note, c.noteEasy)) });
    }
  }

  for (const s of args.systems) {
    for (const l of args.diagramLabels(s.id)) {
      hits.push({ type: "label", systemId: s.id, key: l.id, title: l.name,
        sub: join(s.name, "·", subLabels.label), name: l.name, head: "",
        body: join(pick(l.desc, l.descEasy), pick(l.tryIt, l.tryItEasy),
          pick(l.crossSystem?.reason, l.crossSystem?.reasonEasy)) });
    }
    for (const f of SYSTEM_FACES) {
      hits.push({ type: "system", systemId: s.id, key: f.face,
        title: join(s.name, "·", args.faceLabels[f.face] ?? f.face),
        sub: subLabels.system, name: s.name, head: join(s.name, args.faceLabels[f.face] ?? ""),
        body: f.label(s, easy) });
    }
  }
  return hits;
}

/**
 * Query aliases: what a child (or anyone) types against what the text says.
 * Expansion, not replacement — the literal query still searches too.
 */
const ALIASES: Record<string, string[]> = {
  "순환": ["심혈관", "심장", "피"],
  "피": ["혈액", "심장"],
  "혈액": ["피", "심장"],
  "숨": ["호흡", "폐"],
  "호흡": ["폐", "숨"],
  "쉬야": ["오줌", "콩팥"],
  "오줌": ["콩팥", "방광"],
  "뼈": ["운동 기관", "골격"],
  "근육": ["운동 기관"],
  "두뇌": ["뇌"],
  "머리": ["뇌", "머리뼈"],
  "맹장": ["막창자꼬리"],
  "밥": ["소화", "위"],
  "음식": ["소화", "위"],
  "눈알": ["눈"],
  "신장": ["콩팥"],
  "허파": ["폐"],
  "똥": ["큰창자", "잘록창자"],
  "당뇨": ["당뇨병", "이자"],
};

/** Trailing particles worth retrying without, when a query finds nothing. */
const PARTICLES = ["이", "가", "을", "를", "은", "는", "의", "에"];

export type SearchResult = { hit: SearchHit; score: number; pos: number };

/** Per-type cap for tier-3 (body) matches, so 200 deep dives cannot flood the list. */
const BODY_CAP = 5;

export function runSearch(index: SearchHit[], raw: string): SearchResult[] | null {
  const q = raw.trim();
  if (!q) return null;

  const attempt = (needle: string): SearchResult[] => {
    const terms = [needle, ...(ALIASES[needle] ?? [])];
    const results: SearchResult[] = [];
    for (const hit of index) {
      let best: SearchResult | null = null;
      for (const t of terms) {
        const tl = t.toLocaleLowerCase("ko");
        const inName = hit.name.toLocaleLowerCase("ko").indexOf(tl);
        // Tier 0/1: the name. This is all a one-character query gets — at one
        // character, body matches are noise ("피" is inside 피로 and 머리핀).
        let score = -1, pos = 0;
        if (inName === 0) { score = 0; pos = 0; }
        else if (inName > 0) { score = 1; pos = inName; }
        else if (needle.length >= 2) {
          const inHead = hit.head.toLocaleLowerCase("ko").indexOf(tl);
          if (inHead >= 0) { score = 2; pos = inHead; }
          else {
            const inBody = hit.body.toLocaleLowerCase("ko").indexOf(tl);
            if (inBody >= 0) { score = 3; pos = inBody; }
          }
        }
        if (score >= 0 && (!best || score < best.score || (score === best.score && pos < best.pos))) {
          best = { hit, score, pos };
        }
      }
      if (best) results.push(best);
    }
    results.sort((a, b) => a.score - b.score || a.pos - b.pos);
    // Cap the body tier per type; the name and heading tiers are small by nature.
    const seen: Record<string, number> = {};
    return results.filter((r) => {
      if (r.score < 3) return true;
      seen[r.hit.type] = (seen[r.hit.type] ?? 0) + 1;
      return seen[r.hit.type] <= BODY_CAP;
    });
  };

  let out = attempt(q);
  // A query ending in a particle ("심장이") misses text that says 심장은 —
  // one retry with the particle dropped covers it without a morphology lib.
  if (out.length === 0 && q.length >= 2 && PARTICLES.includes(q[q.length - 1])) {
    out = attempt(q.slice(0, -1));
  }
  return out;
}
