/**
 * Which of the three readings the app is showing.
 *
 * This was a boolean — kids on, kids off — and "kids off" was read as "adult"
 * in twenty-one places. A third mode breaks that reading silently: everything
 * guarded by `!kidsOn` would spill into it, including the eighty conditions
 * and the clinical notes, which have no business on a primary-schooler's
 * screen. The derivation lives here so the next mode added does not have to
 * rediscover that.
 *
 * Read through `useSyncExternalStore`, like the kids flag and the child's
 * name, so nothing touches storage during a render.
 */

export type Mode = "kids" | "school" | "adult";

const KEY = "anatomy:mode";
/** What the two-state switch used before. Still read, never written. */
const LEGACY_KEY = "anatomy:kids-mode";

const listeners = new Set<() => void>();

export function subscribeMode(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readMode(): Mode {
  const stored = window.localStorage.getItem(KEY);
  if (stored === "kids" || stored === "school" || stored === "adult") return stored;
  // Someone who was already using the app keeps the mode they were in. Without
  // this a child reading in kids mode lands in the adult one on the next
  // deploy, which is the one thing a version bump must not do.
  return window.localStorage.getItem(LEGACY_KEY) === "0" ? "adult" : "kids";
}

/** Kids mode is the default this build exists for, and matches the old flag. */
export function serverMode(): Mode {
  return "kids";
}

export function writeMode(next: Mode) {
  window.localStorage.setItem(KEY, next);
  // Kept in step so a rollback to the two-state build finds the same answer.
  window.localStorage.setItem(LEGACY_KEY, next === "adult" ? "0" : "1");
  listeners.forEach((listener) => listener());
}
