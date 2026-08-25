/**
 * Prefixes a public-folder path with the deployment base.
 *
 * Next rewrites `basePath` into the URLs it generates itself, but these are
 * built as strings at runtime — an organ's model path, an illustration named
 * after its id — so it never sees them. Served from a project page under
 * `/anatomy-kids/`, a leading slash points at the domain root and every model
 * and image comes back 404.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
