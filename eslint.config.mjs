import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Served as-is, not authored here: the Draco and Basis decoders are
    // vendored emscripten output. Linting them reported eleven errors that
    // nobody could act on, and a run that always fails is a run nobody reads.
    "public/**",
  ]),
]);

export default eslintConfig;
