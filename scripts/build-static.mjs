/**
 * Post-processes the static export for GitHub Pages.
 *
 * Two things a static host cannot do for us:
 *
 * 1. There is no page at `/` — every route lives under `/[locale]` — and the
 *    `redirects()` that handled it needs a server. A tiny index.html does the
 *    same job with a meta refresh, plus a link for anyone with JS disabled.
 * 2. Pages serves from a Jekyll pipeline by default, which silently drops
 *    directories beginning with an underscore. Next puts its entire build in
 *    `_next`. `.nojekyll` turns that off.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = "out";
const base = process.env.PAGES_BASE ?? "";
const target = `${base}/ko/`;

fs.writeFileSync(path.join(OUT, ".nojekyll"), "");

fs.writeFileSync(
  path.join(OUT, "index.html"),
  `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>몸속 구경하기</title>
    <meta http-equiv="refresh" content="0; url=${target}" />
    <link rel="canonical" href="${target}" />
  </head>
  <body>
    <p><a href="${target}">몸속 구경하기로 이동</a></p>
  </body>
</html>
`,
);

console.log(`wrote ${OUT}/index.html -> ${target}`);
console.log(`wrote ${OUT}/.nojekyll`);
