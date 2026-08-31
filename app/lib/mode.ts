/**
 * Which of the two readings the app is showing.
 *
 * The three modes this replaces each showed a *different set of things*: kids
 * had the extra facts and its own quiz, school had the organ systems, adult had
 * the deep dives and the clinical notes. Choosing a mode meant choosing what
 * you were allowed to see, which is the wrong axis — a five-year-old and a
 * grown-up are interested in the same organs.
 *
 * These two differ only in how the writing reads. Everything is present in
 * both; `easy` prefers the plain rewrite of a passage where one exists and
 * falls back to the full text where it does not.
 *
 * Read through `useSyncExternalStore`, like the child's name, so nothing
 * touches storage during a render.
 */

export type Mode = "easy" | "detailed";

const KEY = "anatomy:reading";
/** The three-way key. Still read, never written. */
const LEGACY_MODE = "anatomy:mode";
/** The two-state flag from before that. Still read, never written. */
const LEGACY_KIDS = "anatomy:kids-mode";

const listeners = new Set<() => void>();

export function subscribeMode(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readMode(): Mode {
  const stored = window.localStorage.getItem(KEY);
  if (stored === "easy" || stored === "detailed") return stored;
  // Whoever was reading in kids mode was reading the plain writing and keeps
  // it. School and adult were both reading the full text, so both land on
  // `detailed`. A version bump must never move a child onto the harder copy.
  const old = window.localStorage.getItem(LEGACY_MODE);
  if (old === "kids") return "easy";
  if (old === "school" || old === "adult") return "detailed";
  // Older still: the boolean that predates the three-way switch.
  return window.localStorage.getItem(LEGACY_KIDS) === "0" ? "detailed" : "easy";
}

/** What the server renders before storage can be read. */
export function serverMode(): Mode {
  return "easy";
}

export function writeMode(next: Mode) {
  window.localStorage.setItem(KEY, next);
  // Kept in step so rolling back to an older build finds the same answer.
  window.localStorage.setItem(LEGACY_MODE, next === "easy" ? "kids" : "adult");
  window.localStorage.setItem(LEGACY_KIDS, next === "easy" ? "1" : "0");
  listeners.forEach((listener) => listener());
}
