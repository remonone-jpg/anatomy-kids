/**
 * Where the child's name lives.
 *
 * On this device and nowhere else. It is never sent anywhere, never put in the
 * URL, and never handed to analytics — a five-year-old's name is not ours to
 * move around. `localStorage` is the whole of it.
 *
 * Read through `useSyncExternalStore` rather than an effect, for the same
 * reason the kids-mode flag is: touching storage during a render gives the
 * server one answer and the browser another.
 */

const KEY = "anatomy-kids:child-name";

const listeners = new Set<() => void>();

export function subscribeChildName(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * The stored name, or null when there is none.
 *
 * An absent key and an empty one mean different things: absent is "we have not
 * asked yet", empty is "asked, and they chose to skip". Both read as null here
 * — `hasBeenAsked` is what tells them apart.
 */
export function readChildName(): string | null {
  return window.localStorage.getItem(KEY) || null;
}

/** Null on the server, so the first paint uses the no-name copy. */
export function serverChildName(): string | null {
  return null;
}

export function subscribeChildAsked(listener: () => void) {
  return subscribeChildName(listener);
}

export function readChildAsked(): boolean {
  return window.localStorage.getItem(KEY) !== null;
}

/** True on the server so the prompt never flashes up before hydration. */
export function serverChildAsked(): boolean {
  return true;
}

/** Passing null records the skip, which stops the question coming back. */
export function writeChildName(name: string | null) {
  window.localStorage.setItem(KEY, name ?? "");
  listeners.forEach((listener) => listener());
}

/** Puts the app back to never-asked, which is what "이름 바꾸기" reopens. */
export function clearChildName() {
  window.localStorage.removeItem(KEY);
  listeners.forEach((listener) => listener());
}
