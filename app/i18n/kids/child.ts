/**
 * Putting the child's own name into the copy, and coping when there isn't one.
 *
 * Kept free of browser APIs on purpose: the name is read from storage by the
 * app and handed in here, so this file stays a pure function of its inputs and
 * never reaches for `localStorage` during a render.
 */

/** Stands in for the name when none has been given. */
const NO_NAME = "우리";

/**
 * Particles that change shape after a final consonant. Everything else — 의,
 * 만의, 보다, 도, and a bare space — attaches unchanged and is left alone.
 */
const PARTICLES: Record<string, string> = { 가: "이가", 는: "이는", 를: "이를" };

/**
 * Five sentences that a pronoun alone cannot rescue, because the wording
 * itself has to change — "{child}의 뇌는" would become "우리의 뇌는", which is
 * stiff, and "{child} 주먹만 해요" would lose whose fist it is.
 *
 * Keyed by the original template so the copy files stay untouched: with a name
 * present, every sentence renders exactly as it did before. Two of the six
 * places share the "주먹만 해요" template, so five entries cover all six.
 */
const NO_NAME_TEXT: Record<string, string> = {
  "{child} 주먹만 해요": "내 주먹만 해요",
  "{child} 얼굴만 해요": "내 얼굴만 해요",
  "{child}의 뇌는 두 살 때까지 제일 빨리 자랐어요.": "우리 뇌는 두 살 때까지 제일 빨리 자랐어요.",
  "{child}의 손가락 지문은?": "내 손가락 지문은?",
  "{child}의 손가락 지문은 세상에 딱 하나뿐이에요.": "내 손가락 지문은 세상에 딱 하나뿐이에요.",
};

/**
 * Whether the last syllable ends in a consonant, which is what decides
 * 지훈이가 from 수호가.
 *
 * Only Hangul syllables carry that information in their code point. A name in
 * Latin letters or digits is treated as having none, so it takes the plain
 * particle: "Emma가". Guessing from spelling would be wrong as often as right
 * — English orthography and Korean pronunciation do not line up — and
 * "Emma이가" is worse than "Emma가" either way.
 */
export function hasFinalConsonant(name: string): boolean {
  const last = name.trim().at(-1);
  if (!last) return false;
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

/**
 * Substitutes `{child}`, fixing up the particle that follows it.
 *
 * `name` is null when the grown-up skipped the question or has not been asked.
 */
export function applyChild(text: string, name: string | null): string {
  if (!name) return NO_NAME_TEXT[text] ?? text.replaceAll("{child}", NO_NAME);

  const linking = hasFinalConsonant(name);
  return text.replace(/\{child\}([가는를])?/g, (_match, particle: string | undefined) =>
    particle ? name + (linking ? PARTICLES[particle] : particle) : name,
  );
}

/** Trimmed, capped, and empty-as-null — the one place the rules live. */
export const CHILD_NAME_MAX = 12;

export function normaliseChildName(raw: string): string {
  return raw.trim().slice(0, CHILD_NAME_MAX);
}
