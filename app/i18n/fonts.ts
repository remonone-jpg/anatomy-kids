import {
  Cormorant_Garamond,
  DM_Sans,
  Noto_Naskh_Arabic,
  Noto_Sans,
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
} from "next/font/google";
import type { ScriptGroup } from "./config";

// The display pair. Cormorant Garamond carries the "atelier" voice and happens
// to ship Cyrillic, so Latin and Russian share it.
/**
 * `preload: false` on all of these, and it is not a small detail.
 *
 * These objects are built at module scope — that is what `next/font` requires
 * — and every locale renders from one layout, so a preload link for each was
 * going into every page. A Korean reader was fetching thirteen woff2 files,
 * 749 KB, for scripts their page never renders a glyph of. Left to the
 * browser, a face is fetched when a character actually needs it: the Latin
 * pages still get theirs, one round trip later, and every other page gets
 * none. `font-display: swap` covers that round trip.
 */
const cormorant = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], preload: false });
const cormorantCyrillic = Cormorant_Garamond({ variable: "--font-serif", subsets: ["cyrillic", "latin"], weight: ["400", "500", "600"], preload: false });
const dmSans = DM_Sans({ variable: "--font-sans", subsets: ["latin", "latin-ext"], preload: false });
const notoSansCyrillic = Noto_Sans({ variable: "--font-sans", subsets: ["cyrillic", "latin"], preload: false });

const devanagariSerif = Noto_Serif_Devanagari({ variable: "--font-serif", subsets: ["devanagari", "latin"], weight: ["400", "500", "600"], preload: false });
const devanagariSans = Noto_Sans_Devanagari({ variable: "--font-sans", subsets: ["devanagari", "latin"], preload: false });

const arabicSerif = Noto_Naskh_Arabic({ variable: "--font-serif", subsets: ["arabic"], weight: ["400", "500", "600"], preload: false });
const arabicSans = Noto_Sans_Arabic({ variable: "--font-sans", subsets: ["arabic"], preload: false });

const webFonts: Partial<Record<ScriptGroup, { serif: { variable: string }; sans: { variable: string } }>> = {
  latin: { serif: cormorant, sans: dmSans },
  cyrillic: { serif: cormorantCyrillic, sans: notoSansCyrillic },
  devanagari: { serif: devanagariSerif, sans: devanagariSans },
  arabic: { serif: arabicSerif, sans: arabicSans },
};

/**
 * The Korean faces, subset and served from `public/fonts`.
 *
 * Not `next/font`: its preload links are emitted for every route that shares
 * this layout, and all twelve locales share one. Korean would have paid for
 * the Latin faces (it was paying 749 KB of them) and every other locale would
 * now pay for these. Held as plain files instead, the layout can preload the
 * two a page will actually use and say nothing about the rest.
 *
 * Subset to KS X 1001's 2,350 syllables plus Latin, digits and the punctuation
 * this site uses — the whole corpus needs 1,090 of them, and the standard set
 * covers anything written later without a rebuild.
 */
export const KOREAN_FONT_FILES = [
  "/fonts/ibmplexsanskr-400.woff2",
  "/fonts/ibmplexsanskr-600.woff2",
  "/fonts/ibmplexsanskr-700.woff2",
  "/fonts/gowunbatang-400.woff2",
];

/**
 * `@font-face` for those files, written out rather than generated so the
 * layout can put it in the document head with the base path already applied.
 * `swap` matches what `next/font` does for every other script.
 */
export function koreanFontFaces(base: (path: string) => string) {
  const face = (family: string, weight: number, file: string) =>
    `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:swap;src:url("${base(file)}") format("woff2")}`;
  return [
    face("IBM Plex Sans KR", 400, "/fonts/ibmplexsanskr-400.woff2"),
    face("IBM Plex Sans KR", 600, "/fonts/ibmplexsanskr-600.woff2"),
    face("IBM Plex Sans KR", 700, "/fonts/ibmplexsanskr-700.woff2"),
    face("Gowun Batang", 400, "/fonts/gowunbatang-400.woff2"),
  ].join("");
}

/**
 * Chinese and Japanese use platform fonts rather than web fonts.
 *
 * Two reasons. Practically, Google serves each CJK family as 100+ unicode-range
 * subset files; asking `next/font` for six of them makes the toolchain resolve
 * hundreds of files, which takes down the Cloudflare/vinext dev server.
 * Editorially, a CJK web font is several megabytes unless it is subset — far
 * too much for a page that already ships a ~3 MB model — while every CJK
 * platform carries a high-quality system face. These classes live in
 * `globals.css` and set the same variables the web fonts do.
 *
 * Korean no longer takes this route: a platform face is a different face on
 * every platform, and the one macOS supplies has a single weight, so the 500s
 * and 600s the design asks for were being faked by the rasteriser.
 */
const systemFontClass: Partial<Record<ScriptGroup, string>> = {
  sc: "font-stack-sc",
  jp: "font-stack-jp",
  kr: "font-stack-kr",
};

/** Font classes for a script — only this script's faces are requested. */
export function fontClassName(script: ScriptGroup) {
  const system = systemFontClass[script];
  if (system) return system;
  const pair = webFonts[script] ?? webFonts.latin!;
  return `${pair.serif.variable} ${pair.sans.variable}`;
}
