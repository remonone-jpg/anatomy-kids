import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * The app's pages are all client-rendered 3D and copy — nothing reads a
 * request — so every locale can be prerendered ahead of time and served as
 * files. `redirects()` cannot come along: it needs a server, and the bare `/`
 * is handled by a generated index.html instead (see scripts/build-static.mjs).
 */
const nextConfig: NextConfig = {
  output: "export",
  // Served from https://<user>.github.io/<repo>/.
  basePath: process.env.PAGES_BASE ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
