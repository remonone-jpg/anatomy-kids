/**
 * Fails the build when a stylesheet reads a custom property nothing defines.
 *
 * CSS treats an unknown `var(--x)` as an invalid value and drops that one
 * declaration, so a colour silently falls back to whatever it inherits. No
 * error, no warning, nothing in the console — the page just looks slightly
 * wrong, which is very hard to trace back to a typo. Seventy-four rules across
 * five screens were broken this way before anyone thought to look.
 *
 * Not every variable belongs in the stylesheet: a handful are set per element
 * from JSX (`style={{ "--hotspot-color": … }}`). Those are collected from the
 * source and treated as defined.
 *
 * Run: npm run css:audit
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKIP = new Set(["node_modules", ".next", "dist", "out", ".git", ".wrangler"]);

/** Every file under `dir` whose name ends in one of `exts`. */
function walk(dir, exts, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, found);
    else if (exts.some((ext) => entry.name.endsWith(ext))) found.push(full);
  }
  return found;
}

const styles = walk(path.join(ROOT, "app"), [".css"]);
const sources = walk(path.join(ROOT, "app"), [".ts", ".tsx"]);

// Defined in a stylesheet: `--name:` anywhere a declaration can sit.
const defined = new Set();
for (const file of styles) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]);
}

// Injected from JSX: the name appears as a quoted key or property.
const injected = new Set();
for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(/["'](--[\w-]+)["']\s*:/g)) injected.add(m[1]);
}

const problems = [];
for (const file of [...styles, ...sources]) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    for (const m of line.matchAll(/var\(\s*(--[\w-]+)\s*(?:,|\))/g)) {
      const name = m[1];
      // A fallback — `var(--x, red)` — is deliberate, not a mistake.
      if (m[0].endsWith(",")) continue;
      if (defined.has(name) || injected.has(name)) continue;
      problems.push({
        file: path.relative(ROOT, file),
        line: index + 1,
        name,
        text: line.trim(),
      });
    }
  });
}

if (problems.length === 0) {
  console.log(
    `css-vars: ok — ${defined.size} defined, ${injected.size} injected from JSX, no unknown references`,
  );
  process.exit(0);
}

console.error(`css-vars: ${problems.length} reference(s) to a variable nothing defines\n`);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}  ${p.name}`);
  console.error(`    ${p.text.length > 100 ? `${p.text.slice(0, 100)}…` : p.text}`);
}
console.error(
  `\nDefine it, or set it inline from JSX. Known names: ${[...defined].sort().join(", ")}`,
);
process.exit(1);
