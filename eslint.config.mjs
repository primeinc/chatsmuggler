// @ts-check
import sdl from "@microsoft/eslint-plugin-sdl";
import security from "eslint-plugin-security";
import noSecrets from "eslint-plugin-no-secrets";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // Ignore patterns — never lint build output or deps
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "**/*.min.js", "pnpm-lock.yaml"],
  },

  // TypeScript source + scripts: typed rules + SDL + security plugins
  {
    files: ["src/**/*.ts"],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@microsoft/sdl": sdl,
      security,
      "no-secrets": noSecrets,
    },
    rules: {
      // ── SDL: Microsoft SDL required rules ────────────────────────────────
      // Pulled directly from sdl.configs.required entry 2 — no guessing.
      // Spread into this block so TypeScript parser is active when they run.
      "@microsoft/sdl/no-cookies": "error",
      "@microsoft/sdl/no-document-domain": "error",
      "@microsoft/sdl/no-document-write": "error",
      "@microsoft/sdl/no-html-method": "error",
      "@microsoft/sdl/no-inner-html": "error",
      "@microsoft/sdl/no-insecure-url": "error",
      "@microsoft/sdl/no-msapp-exec-unsafe": "error",
      // THE rule: bans the exact pattern found in WXT runtime
      "@microsoft/sdl/no-postmessage-star-origin": "error",
      "@microsoft/sdl/no-winjs-html-unsafe": "error",

      // ── TypeScript correctness ────────────────────────────────────────────
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",

      // ── Security plugin ───────────────────────────────────────────────────
      // Subset that applies to browser extension code; Node-centric rules
      // like detect-child-process are irrelevant but harmless to declare.
      "security/detect-eval-with-expression": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-object-injection": "warn",

      // ── Secret detection ─────────────────────────────────────────────────
      // warn locally; CI runs eslint --max-warnings 0 so this is a hard gate
      "no-secrets/no-secrets": ["warn", { tolerance: 4.2 }],

      // ── Core JS safety (belt-and-suspenders, SDL already covers some) ────
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
  },

  // Scripts: same rules but with Node types (tsconfig.scripts.json)
  {
    files: ["scripts/**/*.ts"],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.scripts.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@microsoft/sdl": sdl,
      security,
      "no-secrets": noSecrets,
    },
    rules: {
      "@microsoft/sdl/no-postmessage-star-origin": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-unsafe-regex": "error",
      "no-secrets/no-secrets": ["warn", { tolerance: 4.2 }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // Test files: typed rules via tsconfig.test.json (includes vitest + chrome types)
  {
    files: ["src/**/*.test.ts", "src/**/*.spec.ts"],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.test.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@microsoft/sdl": sdl,
      "no-secrets": noSecrets,
    },
    rules: {
      "@microsoft/sdl/no-postmessage-star-origin": "error",
      "no-secrets/no-secrets": ["warn", { tolerance: 4.2 }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // Prettier must be last — disables all formatting rules that conflict
  prettier,
);
