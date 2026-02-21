# Browser Extension Config Analysis: 25 Reference Repos

Comprehensive analysis of TypeScript, ESLint, Prettier, pre-commit hooks, CI, and build tool configurations across 25 browser extension repositories.

**Repos analyzed:** refined-github, darkreader, ext-saladict, SponsorBlock, clients (bitwarden), tridactyl, BilibiliSponsorBlock, Memex, Authenticator, vimium-c, scriptcat, web-scrobbler, globalSpeed, plasmo, extension.js, chrome-extension-tools, vitesse-webext, create-chrome-ext, jiffyreader-public-archive, selenium-ide, chathub, page-assist, chatgpt-advanced, RSSHub-Radar, chatgpt-exporter

---

## 1. TypeScript Strict Flags by Repo

### 1.1 Strict Flag Matrix

| Repo                       | `strict` | `noImplicitAny` | `strictNullChecks` | `strictFunctionTypes` | `strictBindCallApply` | `noImplicitThis` | `alwaysStrict` | `noUnusedLocals` | `noUnusedParameters` | `noImplicitReturns` | `noFallthroughCasesInSwitch` | `noUncheckedIndexedAccess` | `noPropertyAccessFromIndexSignature` | `forceConsistentCasingInFileNames` | `allowUnreachableCode` | `allowUnusedLabels` | `exactOptionalPropertyTypes` | `noImplicitOverride` | `useUnknownInCatchVariables` | `verbatimModuleSyntax` | `isolatedModules` |
| -------------------------- | -------- | --------------- | ------------------ | --------------------- | --------------------- | ---------------- | -------------- | ---------------- | -------------------- | ------------------- | ---------------------------- | -------------------------- | ------------------------------------ | ---------------------------------- | ---------------------- | ------------------- | ---------------------------- | -------------------- | ---------------------------- | ---------------------- | ----------------- |
| **Authenticator**          | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | YES                 | YES                          | -                          | -                                    | YES                                | false                  | false               | -                            | -                    | (via strict)                 | -                      | -                 |
| **BilibiliSponsorBlock**   | -        | false           | -                  | -                     | -                     | -                | -              | -                | -                    | YES                 | YES                          | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **chatgpt-advanced**       | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | YES                                | -                      | -                   | -                            | -                    | (via strict)                 | -                      | -                 |
| **chatgpt-exporter**       | YES      | YES             | YES                | (via strict)          | (via strict)          | (via strict)     | (via strict)   | YES              | YES                  | YES                 | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | YES               |
| **chathub**                | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | YES                                | -                      | -                   | -                            | -                    | (via strict)                 | -                      | YES               |
| **chrome-extension-tools** | YES      | (via strict)    | YES                | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | YES               |
| **clients (bitwarden)**    | false    | YES             | -                  | -                     | -                     | -                | -              | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **create-chrome-ext**      | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | YES                                | -                      | -                   | -                            | -                    | (via strict)                 | -                      | -                 |
| **darkreader**             | -        | YES             | YES                | -                     | -                     | -                | -              | YES              | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **extension.js**           | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | YES               |
| **ext-saladict**           | YES      | false           | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | YES               |
| **globalSpeed**            | -        | YES             | -                  | -                     | -                     | -                | -              | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | YES               |
| **jiffyreader**            | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | YES            | YES              | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | -                 |
| **Memex**                  | -        | false           | false              | -                     | -                     | -                | -              | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **page-assist**            | false    | -               | -                  | -                     | -                     | -                | -              | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **plasmo**                 | -        | -               | -                  | -                     | -                     | -                | -              | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **refined-github**         | YES\*    | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | (via strict)     | (via strict)         | (via strict)        | (via strict)                 | false                      | false                                | (via strict)                       | -                      | -                   | -                            | -                    | (via strict)                 | YES                    | -                 |
| **RSSHub-Radar**           | false    | false           | -                  | -                     | -                     | -                | -              | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **scriptcat**              | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | YES               |
| **selenium-ide**           | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | YES              | YES                  | YES                 | YES                          | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | -                 |
| **SponsorBlock**           | -        | false           | -                  | -                     | -                     | -                | -              | -                | -                    | YES                 | YES                          | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **tridactyl**              | -        | false           | -                  | YES                   | YES                   | YES              | YES            | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | -                            | -                      | -                 |
| **vimium-c**               | YES      | YES             | YES                | YES                   | YES                   | YES              | YES            | YES              | YES                  | YES                 | -                            | false                      | YES                                  | YES                                | -                      | -                   | -                            | -                    | (via strict)                 | -                      | -                 |
| **vitesse-webext**         | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | YES              | -                    | -                   | -                            | -                          | -                                    | YES                                | -                      | -                   | -                            | -                    | (via strict)                 | -                      | -                 |
| **web-scrobbler**          | YES      | (via strict)    | (via strict)       | (via strict)          | (via strict)          | (via strict)     | (via strict)   | -                | -                    | -                   | -                            | -                          | -                                    | -                                  | -                      | -                   | -                            | -                    | (via strict)                 | -                      | YES               |

\*refined-github extends `@sindresorhus/tsconfig` which enables `strict: true` along with `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`, and `forceConsistentCasingInFileNames`. However, refined-github then explicitly disables `noUncheckedIndexedAccess` and `noPropertyAccessFromIndexSignature`.

### 1.2 Strict Flag Adoption Summary

| Flag                                 | Count Enabled                | Count Disabled                                                                        | Notes                                                                                                         |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `strict: true`                       | **17/25** (68%)              | 3 explicit false, 5 absent                                                            | Most popular approach                                                                                         |
| `noImplicitAny`                      | 20 (via strict or explicit)  | 5 explicit false (BilibiliSponsorBlock, ext-saladict, Memex, SponsorBlock, tridactyl) | Commonly relaxed in legacy codebases                                                                          |
| `strictNullChecks`                   | 17+ (via strict or explicit) | 1 explicit false (Memex)                                                              | Critical for safety                                                                                           |
| `strictFunctionTypes`                | 17+ (via strict or explicit) | -                                                                                     | Rarely overridden                                                                                             |
| `strictBindCallApply`                | 17+ (via strict or explicit) | -                                                                                     | Rarely overridden                                                                                             |
| `noImplicitThis`                     | 17+ (via strict or explicit) | -                                                                                     | Rarely overridden                                                                                             |
| `alwaysStrict`                       | 17+ (via strict or explicit) | -                                                                                     | Emits "use strict"                                                                                            |
| `noUnusedLocals`                     | **8/25** (32%)               | -                                                                                     | chatgpt-exporter, darkreader, jiffyreader, selenium-ide, vimium-c, vitesse-webext, refined-github\*           |
| `noUnusedParameters`                 | **4/25** (16%)               | -                                                                                     | chatgpt-exporter, selenium-ide, vimium-c, refined-github\*                                                    |
| `noImplicitReturns`                  | **7/25** (28%)               | -                                                                                     | Authenticator, BilibiliSponsorBlock, chatgpt-exporter, selenium-ide, SponsorBlock, vimium-c, refined-github\* |
| `noFallthroughCasesInSwitch`         | **5/25** (20%)               | 1 explicit false (vimium-c)                                                           | Authenticator, BilibiliSponsorBlock, selenium-ide, SponsorBlock, refined-github\*                             |
| `forceConsistentCasingInFileNames`   | **7/25** (28%)               | -                                                                                     | Important for cross-platform                                                                                  |
| `noUncheckedIndexedAccess`           | 0 effectively                | 2 explicit false                                                                      | Very strict; refined-github\* has it via base but disables it                                                 |
| `noPropertyAccessFromIndexSignature` | **1/25** (4%)                | 1 explicit false                                                                      | Only vimium-c enables it                                                                                      |
| `exactOptionalPropertyTypes`         | 0 effectively                | -                                                                                     | refined-github\* has it via base but may encounter issues                                                     |
| `noImplicitOverride`                 | 0                            | -                                                                                     | Not used by any repo                                                                                          |
| `verbatimModuleSyntax`               | **1/25** (4%)                | -                                                                                     | Only refined-github                                                                                           |
| `isolatedModules`                    | **8/25** (32%)               | -                                                                                     | Required by some bundlers                                                                                     |
| `useUnknownInCatchVariables`         | 17+ (via strict)             | -                                                                                     | Included in `strict` since TS 4.4                                                                             |
| `allowUnreachableCode: false`        | **1/25** (4%)                | -                                                                                     | Only Authenticator                                                                                            |
| `allowUnusedLabels: false`           | **1/25** (4%)                | -                                                                                     | Only Authenticator                                                                                            |

### 1.3 Union of All Strict Flags (Strictest Possible Combined Config)

```jsonc
{
  "compilerOptions": {
    // Core strict family (strict: true enables all of these)
    "strict": true,
    // "noImplicitAny": true,           // included in strict
    // "strictNullChecks": true,         // included in strict
    // "strictFunctionTypes": true,      // included in strict
    // "strictBindCallApply": true,      // included in strict
    // "noImplicitThis": true,           // included in strict
    // "alwaysStrict": true,             // included in strict
    // "useUnknownInCatchVariables": true, // included in strict (TS 4.4+)

    // Additional strictness beyond `strict: true`
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,

    // Error prevention
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,

    // Iterator safety (TS 5.6+, Sep 2024). Ensures built-in iterators
    // return { done: true, value: undefined } with proper typing.
    // Not widely adopted yet but worth evaluating.
    // "noStrictBuiltinIteratorReturn": true,

    // Module / bundler settings (common)
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}

> **TypeScript landscape (Feb 2026):** TS 5.8 stable, TS 5.9 released late 2025. New flag `noStrictBuiltinIteratorReturn` (TS 5.6+) is worth evaluating for iterator protocol safety. Recommended target for new projects: `ES2022` (conservative) or `ES2024` (modern, adds `Map.groupBy`, `SharedArrayBuffer` improvements).
```

---

## 2. ESLint Configuration Patterns

### 2.1 Config Format Adoption

> **CRITICAL (Feb 2026):** ESLint v10.0.0 (released January 16, 2026) **completely removed support for legacy `.eslintrc.*` and `.eslintignore` files.** Flat config (`eslint.config.*`) is now the ONLY supported format. The 11 repos below using legacy config must migrate or stay on ESLint 9.x. See [ESLint v10.0.0 blog post](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) and [migration guide](https://eslint.org/docs/latest/use/configure/migration-guide).

| Format                                               | Repos                                                                                                                | Count |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----- |
| Flat config (`eslint.config.{js,mjs}`)               | darkreader, chatgpt-exporter, plasmo, refined-github, scriptcat, vitesse-webext, web-scrobbler, clients, jiffyreader | **9** |
| Legacy `.eslintrc.{js,cjs}` (**DEAD in ESLint 10+**) | Authenticator, chrome-extension-tools, ext-saladict, selenium-ide, tridactyl                                         | **5** |
| Legacy `.eslintrc.json` (**DEAD in ESLint 10+**)     | BilibiliSponsorBlock, chatgpt-advanced, chathub, Memex, SponsorBlock, vimium-c                                       | **6** |
| No ESLint config                                     | create-chrome-ext, globalSpeed, page-assist, RSSHub-Radar, extension.js (uses Biome)                                 | **5** |

### 2.2 ESLint Extends/Presets Used

| Preset/Config                                            | Repos Using It                                                                                                                               |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint:recommended`                                     | Authenticator, BilibiliSponsorBlock, chathub, chrome-extension-tools, darkreader, Memex, SponsorBlock, tridactyl                             |
| `@typescript-eslint/recommended`                         | Authenticator, BilibiliSponsorBlock, chatgpt-advanced, chathub, chrome-extension-tools, plasmo, scriptcat, SponsorBlock, tridactyl, vimium-c |
| `@typescript-eslint/recommended-requiring-type-checking` | tridactyl, vimium-c                                                                                                                          |
| `plugin:react/recommended`                               | BilibiliSponsorBlock, chathub, chrome-extension-tools, ext-saladict, Memex, scriptcat, selenium-ide, SponsorBlock                            |
| `plugin:react-hooks/recommended`                         | chathub, scriptcat                                                                                                                           |
| `prettier` (eslint-config-prettier)                      | chathub, clients, ext-saladict, Memex, scriptcat, selenium-ide, tridactyl                                                                    |
| `standard`                                               | ext-saladict, Memex                                                                                                                          |
| XO (via `xo`)                                            | refined-github                                                                                                                               |
| `@antfu/eslint-config`                                   | vitesse-webext                                                                                                                               |
| `@pionxzh/eslint-config`                                 | chatgpt-exporter                                                                                                                             |
| `plugin:sonarjs/recommended`                             | tridactyl                                                                                                                                    |
| `angular-eslint`                                         | clients                                                                                                                                      |

### 2.3 Most Commonly Configured Rules

| Rule                                               | Repos Configuring It                                                                                                          | Typical Setting                                   |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `@typescript-eslint/no-unused-vars`                | BilibiliSponsorBlock, chrome-extension-tools, clients, darkreader, scriptcat, selenium-ide, SponsorBlock, tridactyl, vimium-c | `"error"` with `argsIgnorePattern: "^_"`          |
| `@typescript-eslint/no-explicit-any`               | chrome-extension-tools, clients, darkreader, scriptcat, tridactyl, vimium-c                                                   | Usually `"off"` (relaxed)                         |
| `@typescript-eslint/no-non-null-assertion`         | BilibiliSponsorBlock, chrome-extension-tools, darkreader, SponsorBlock, tridactyl, vimium-c                                   | Usually `"off"`                                   |
| `@typescript-eslint/ban-ts-comment`                | BilibiliSponsorBlock, scriptcat, SponsorBlock, tridactyl                                                                      | Split between `"off"` and `"error"`               |
| `@typescript-eslint/consistent-type-imports`       | darkreader, refined-github, scriptcat                                                                                         | `"error"`                                         |
| `@typescript-eslint/no-floating-promises`          | clients, tridactyl, vimium-c                                                                                                  | `"error"`                                         |
| `@typescript-eslint/no-misused-promises`           | clients, tridactyl                                                                                                            | `"error"` with `checksVoidReturn: false`          |
| `@typescript-eslint/explicit-function-return-type` | refined-github, vimium-c                                                                                                      | `"error"` with `allowExpressions: true`           |
| `curly`                                            | clients, darkreader, Memex, tridactyl, vimium-c                                                                               | `"error"` (often `"all"`)                         |
| `eqeqeq`                                           | darkreader, tridactyl, vimium-c                                                                                               | `"error"` or `["error", "smart"]`                 |
| `no-console`                                       | clients, Memex                                                                                                                | `"error"` or `"warn"`                             |
| `prefer-const`                                     | chrome-extension-tools, darkreader, Memex, tridactyl                                                                          | `"error"`                                         |
| `no-var`                                           | Memex, tridactyl, vimium-c                                                                                                    | `"error"`                                         |
| `no-throw-literal`                                 | tridactyl, vimium-c                                                                                                           | `"error"`                                         |
| `import/order`                                     | clients, darkreader, refined-github                                                                                           | `"error"` with alphabetize                        |
| `import/no-restricted-paths`                       | clients, darkreader                                                                                                           | `"error"` with zone definitions                   |
| `prettier/prettier`                                | ext-saladict, Memex, scriptcat, selenium-ide                                                                                  | `"error"`                                         |
| `react/prop-types`                                 | BilibiliSponsorBlock, ext-saladict, scriptcat, selenium-ide, SponsorBlock                                                     | Usually `"off"` (TypeScript makes it unnecessary) |

### 2.4 Custom/Noteworthy ESLint Rules

- **darkreader**: Custom local plugin (`eslint-plugin-local`) with `jsx-uses-m-pragma` and `jsx-uses-vars`; `eslint-plugin-compat` for browser compatibility checking.
- **refined-github**: XO-based config with extensive `no-restricted-syntax` rules enforcing architectural patterns; `unicorn` plugin for modern JS patterns; `@typescript-eslint/switch-exhaustiveness-check`.
- **clients (bitwarden)**: Custom `@bitwarden/platform` and `@bitwarden/components` ESLint plugins; `rxjs` and `rxjs-angular` plugins; `import/no-restricted-paths` for enforcing monorepo boundaries.
- **tridactyl**: `sonarjs/recommended` for code quality; extensive type-checked linting with `recommended-requiring-type-checking`.
- **vimium-c**: Type-checked linting; `@typescript-eslint/explicit-module-boundary-types`; `@typescript-eslint/no-base-to-string`; `@typescript-eslint/restrict-template-expressions`.
- **scriptcat**: Custom `require-last-error-check` rule for chrome.runtime.lastError checking.
- **extension.js**: Uses **Biome** instead of ESLint (`biome lint .`; `biome format --write .`).

---

## 3. Prettier Settings

### 3.1 Per-Repo Prettier Config

| Repo                   | printWidth                                                                                                                        | tabWidth | useTabs | semi  | singleQuote | trailingComma | endOfLine | Other Notable                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- | ----- | ----------- | ------------- | --------- | --------------------------------------------------------- |
| BilibiliSponsorBlock   | 120                                                                                                                               | 4        | -       | true  | false       | -             | auto      | `quoteProps: "preserve"`                                  |
| chathub                | 120                                                                                                                               | 2        | -       | false | true        | all           | -         | -                                                         |
| chrome-extension-tools | -                                                                                                                                 | 2        | -       | false | true        | all           | -         | `jsxSingleQuote: true`, `proseWrap: always`, jsdoc plugin |
| clients (bitwarden)    | 100                                                                                                                               | -        | -       | -     | -           | -             | -         | mdx proseWrap                                             |
| create-chrome-ext      | 100                                                                                                                               | 2        | false   | false | true        | all           | lf        | svelte plugin                                             |
| extension.js           | 80                                                                                                                                | 2        | false   | false | true        | none          | -         | `bracketSpacing: false`                                   |
| ext-saladict           | -                                                                                                                                 | 2        | -       | false | true        | -             | -         | -                                                         |
| jiffyreader            | 180                                                                                                                               | 2        | true    | true  | true        | all           | -         | import sort plugins                                       |
| Memex                  | -                                                                                                                                 | 4        | -       | false | true        | all           | -         | -                                                         |
| page-assist            | 80                                                                                                                                | 2        | false   | false | false       | none          | -         | import sort plugin                                        |
| plasmo                 | 80                                                                                                                                | 2        | false   | false | false       | none          | -         | import sort plugin                                        |
| RSSHub-Radar           | 80                                                                                                                                | 2        | false   | false | false       | none/all      | lf        | import sort plugin                                        |
| scriptcat              | 120                                                                                                                               | 2        | false   | true  | false       | es5           | auto      | `proseWrap: always`                                       |
| selenium-ide           | -                                                                                                                                 | -        | -       | false | true        | es5           | lf        | -                                                         |
| tridactyl              | -                                                                                                                                 | 4        | false   | false | false       | all           | -         | `arrowParens: "avoid"`                                    |
| **No Prettier config** | Authenticator, chatgpt-advanced, chatgpt-exporter, darkreader, globalSpeed, SponsorBlock, vimium-c, vitesse-webext, web-scrobbler |          |         |       |             |               |           |                                                           |

### 3.2 Prettier Consensus Settings

| Setting         | Most Common Value         | Distribution                                                                   |
| --------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `tabWidth`      | **2**                     | 2 (11 repos), 4 (3 repos: BilibiliSponsorBlock, Memex, tridactyl)              |
| `semi`          | **false** (no semicolons) | false (10 repos), true (4 repos: BilibiliSponsorBlock, jiffyreader, scriptcat) |
| `singleQuote`   | Split                     | true (8 repos), false (6 repos)                                                |
| `trailingComma` | **"all"**                 | all (7 repos), none (3 repos), es5 (2 repos)                                   |
| `printWidth`    | **80** or **100**         | 80 (4 repos), 100 (2 repos), 120 (3 repos), 180 (1 repo)                       |
| `endOfLine`     | **"lf"** when specified   | lf (3 repos), auto (2 repos)                                                   |
| `useTabs`       | **false**                 | false (6 repos), true (1 repo: jiffyreader)                                    |

### 3.3 Import Sorting Plugins

| Plugin                                   | Repos                    |
| ---------------------------------------- | ------------------------ |
| `@ianvs/prettier-plugin-sort-imports`    | plasmo, RSSHub-Radar     |
| `@plasmohq/prettier-plugin-sort-imports` | jiffyreader, page-assist |
| `prettier-plugin-organize-imports`       | jiffyreader              |
| `prettier-plugin-jsdoc`                  | chrome-extension-tools   |
| `prettier-plugin-svelte`                 | create-chrome-ext        |
| `prettier-package-json`                  | RSSHub-Radar             |

---

## 4. Pre-commit Hook Patterns

### 4.1 Hook Tool Adoption

| Repo                    | Husky                          | lint-staged                  | Hook Contents                                                                                                                             |
| ----------------------- | ------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **chatgpt-exporter**    | YES                            | YES (in package.json)        | pre-commit: `pnpm exec lint-staged`; pre-push: `pnpm run test`; commit-msg: `pnpm exec commitlint --edit`                                 |
| **clients (bitwarden)** | YES                            | YES (lint-staged.config.mjs) | pre-commit: `npx lint-staged`; lint-staged runs `prettier --write` on all files, `eslint --fix` on `*.ts`, cargo fmt/clippy on Rust files |
| **extension.js**        | YES                            | -                            | pre-commit: commented out (`# pnpm lint-staged`)                                                                                          |
| **RSSHub-Radar**        | YES (`prepare: husky install`) | YES (in package.json)        | lint-staged: `prettier --write --ignore-unknown` on all files                                                                             |
| **vitesse-webext**      | -                              | YES (in package.json)        | lint-staged: `eslint --fix` on all files                                                                                                  |
| **Other 20 repos**      | No                             | No                           | No pre-commit hooks configured                                                                                                            |

**Summary:** Only **3 repos** have fully functional pre-commit hooks (chatgpt-exporter, clients, RSSHub-Radar). The pattern is universally **Husky + lint-staged**.

### 4.2 lint-staged Configurations

| Repo             | Glob                | Command                                         |
| ---------------- | ------------------- | ----------------------------------------------- |
| chatgpt-exporter | `*.{js,jsx,ts,tsx}` | `pnpm exec eslint`                              |
| clients          | `*`                 | `prettier --cache --ignore-unknown --write`     |
| clients          | `*.ts`              | `eslint --cache --cache-strategy content --fix` |
| RSSHub-Radar     | `**/*`              | `prettier --write --ignore-unknown`             |
| vitesse-webext   | `*`                 | `eslint --fix`                                  |

---

## 5. CI Patterns (GitHub Actions)

### 5.1 CI Steps Matrix

| Repo                     | Lint                                                    | Typecheck                                 | Build                                   | Test                  | Other                                               |
| ------------------------ | ------------------------------------------------------- | ----------------------------------------- | --------------------------------------- | --------------------- | --------------------------------------------------- |
| **refined-github**       | `npm run lint` (eslint + biome + prettier)              | `npm run build:typescript` (tsc --noEmit) | `npm run build:bundle` (rollup)         | vitest                | lockfile-lint, codespell                            |
| **darkreader**           | `npm run lint` (eslint)                                 | -                                         | -                                       | jest (unit + browser) | -                                                   |
| **web-scrobbler**        | eslint, stylelint, prettier, remark (each separate job) | `npm run checkts` (tsc --noEmit x2)       | build chrome + firefox (separate jobs)  | vitest                | -                                                   |
| **clients (bitwarden)**  | `npm run lint` (eslint + prettier)                      | `npm run test:types`                      | webpack (browser, web, desktop, CLI)    | jest (matrix by app)  | filename lint, dep-ownership, sdk-internal-versions |
| **SponsorBlock**         | `npm run lint` (eslint)                                 | -                                         | webpack (chrome, firefox, safari, edge) | jest                  | -                                                   |
| **BilibiliSponsorBlock** | `npm run lint` (eslint)                                 | -                                         | webpack (chrome, firefox, safari)       | jest                  | -                                                   |
| **chatgpt-exporter**     | `pnpm run lint` (eslint)                                | -                                         | vite build                              | `pnpm run test`       | -                                                   |
| **selenium-ide**         | `eslint` (direct)                                       | -                                         | `npm run build` (tsc + webpack)         | jest + side-runner    | xvfb for browser tests                              |
| **tridactyl**            | `bash ci/lint.sh`                                       | -                                         | -                                       | unit tests            | mozilla linting                                     |
| **extension.js**         | biome                                                   | -                                         | -                                       | matrix of test suites | xvfb for CLI tests                                  |
| **scriptcat**            | `pnpm lint:ci` (eslint --cache)                         | -                                         | -                                       | vitest + coverage     | codecov                                             |
| **Memex**                | -                                                       | -                                         | -                                       | `yarn test` (jest)    | SSH for private submodules                          |
| **RSSHub-Radar**         | -                                                       | -                                         | pnpm zip (wxt)                          | -                     | -                                                   |
| **Authenticator**        | prettier --check                                        | -                                         | npm run build                           | puppeteer tests       | -                                                   |

### 5.2 Common CI Patterns

1. **Lint on PR/push to main**: Nearly universal. Most run ESLint as minimum.
2. **Separate lint/test/build jobs**: web-scrobbler, refined-github, clients split these into parallel jobs.
3. **Typecheck as separate step**: refined-github (`tsc --noEmit`), web-scrobbler (`tsc --noEmit` x2 configs), clients (`npm run test:types`).
4. **Matrix builds**: clients (browser, web, desktop, CLI); SponsorBlock (chrome, firefox, safari, edge).
5. **Node version**: Most use Node 18-22. Many use `.nvmrc` or `package.json` `engines` field.
6. **Package manager**: Split between npm, pnpm, and yarn. pnpm gaining popularity.
7. **Caching**: `actions/setup-node` with `cache: 'npm'` or `cache: 'pnpm'`.

---

## 6. Build Tools

| Bundler                                   | Repos Using It                                                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **webpack**                               | Authenticator, BilibiliSponsorBlock, clients, ext-saladict, globalSpeed, jiffyreader, Memex, selenium-ide, SponsorBlock (9) |
| **vite**                                  | chatgpt-exporter, chathub, extension.js, vitesse-webext, web-scrobbler, chrome-extension-tools (6)                          |
| **rollup**                                | darkreader, refined-github, vimium-c, chrome-extension-tools (4)                                                            |
| **esbuild**                               | chatgpt-advanced, jiffyreader, plasmo, tridactyl, web-scrobbler, chrome-extension-tools (6)                                 |
| **wxt**                                   | page-assist, RSSHub-Radar (2)                                                                                               |
| **plasmo**                                | jiffyreader, plasmo (2)                                                                                                     |
| **turbo** (monorepo orchestrator)         | extension.js, plasmo (2)                                                                                                    |
| **tsup**                                  | plasmo (1)                                                                                                                  |
| **rspack**                                | scriptcat (1)                                                                                                               |
| **Biome** (linter/formatter, not bundler) | extension.js, refined-github (2)                                                                                            |

**Trends (updated Feb 2026):**

- webpack remains the most common (legacy dominance in browser extensions)
- Vite is the clear modern choice for new projects (now at v7.3.1; v6.0 introduced Environment API, v7.0 updated default browser targets)
- esbuild commonly used as a transformer within other tools
- **WXT is now the recommended browser extension framework for new projects (2025-2026).** Combines Vite speed with Nuxt-inspired DX. Actively maintained, growing community. See [wxt.dev](https://wxt.dev/)
- **Plasmo has entered maintenance mode** with minimal active development as of 2026. Still usable but no longer the default recommendation for new projects.
- Biome emerging as an ESLint/Prettier alternative (used by extension.js and refined-github, but Prettier remains the ecosystem standard)

---

## 7. Recommended Configuration (Strictest Viable)

### 7.1 tsconfig.json

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    // === Core Strict Family ===
    // Enables: noImplicitAny, strictNullChecks, strictFunctionTypes,
    //          strictBindCallApply, noImplicitThis, alwaysStrict,
    //          useUnknownInCatchVariables
    // Rationale: 17/25 repos use strict:true. This is table stakes.
    "strict": true,

    // === Additional Strictness ===

    // Catches dead variables. 8/25 repos enable this explicitly.
    // Can be enforced by ESLint instead if you prefer warnings over errors,
    // but tsc enforcement is more reliable since it runs pre-build.
    "noUnusedLocals": true,

    // Catches unused function parameters. 4/25 repos enable this.
    // More controversial since callback signatures often have required-but-unused params.
    // Prefix unused params with _ to suppress. Worth enabling.
    "noUnusedParameters": true,

    // Forces all code paths to return. 7/25 repos enable this.
    // Prevents subtle bugs where a function falls off without returning.
    "noImplicitReturns": true,

    // Prevents accidental fallthrough in switch statements. 5/25 repos enable this.
    // Use explicit `// falls through` comment or `break` when intentional.
    "noFallthroughCasesInSwitch": true,

    // Forces consistent casing in imports. 7/25 repos enable this.
    // Critical for cross-platform (Linux is case-sensitive, macOS/Windows are not).
    "forceConsistentCasingInFileNames": true,

    // Adds `undefined` to index signature results. 0/25 repos effectively use this.
    // Very strict but catches real bugs. refined-github enables via base but disables.
    // RECOMMENDATION: Enable if starting fresh. Disable if retrofitting.
    "noUncheckedIndexedAccess": true,

    // Forces bracket notation for index signatures. 1/25 repos (vimium-c).
    // Makes it explicit when accessing dynamic keys vs known properties.
    // RECOMMENDATION: Enable. Low friction, high clarity.
    "noPropertyAccessFromIndexSignature": true,

    // Treats optional properties as exactly their type, not type|undefined.
    // 0/25 repos effectively use this. Very strict, can be painful with spread.
    // RECOMMENDATION: Enable if starting fresh. Most impactful with strict APIs.
    "exactOptionalPropertyTypes": true,

    // Forces `override` keyword on overridden class members. 0/25 repos use this.
    // Catches refactoring bugs when base class changes.
    // RECOMMENDATION: Enable. Zero cost for new projects.
    "noImplicitOverride": true,

    // Prevents unreachable code. Only Authenticator uses this.
    // Already caught by ESLint no-unreachable, but tsc is more thorough.
    "allowUnreachableCode": false,

    // Prevents unused labels. Only Authenticator uses this.
    "allowUnusedLabels": false,

    // Forces type-only imports to use `import type`. 1/25 repos (refined-github).
    // Helps bundlers with tree-shaking. Modern best practice.
    "verbatimModuleSyntax": true,

    // Required by many bundlers (vite, esbuild). 8/25 repos enable this.
    // Ensures each file can be independently transpiled.
    "isolatedModules": true,

    // === Module Resolution ===
    // "bundler" is the modern choice for vite/esbuild/rollup workflows.
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "resolveJsonModule": true,
    "esModuleInterop": true,

    // === Emit ===
    // Let the bundler handle emit. tsc is for type-checking only.
    "noEmit": true,

    // === Performance ===
    // Skip type-checking .d.ts in node_modules. Universal practice.
    "skipLibCheck": true,

    // === JSX (if applicable) ===
    "jsx": "react-jsx",
  },
}
```

### 7.2 eslint.config.mjs

```javascript
// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // Base recommended rules
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Prettier compat - disables formatting rules that conflict
  eslintConfigPrettier,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // --- TypeScript Rules ---

      // Enforce consistent type imports (tree-shaking, clarity)
      // Used by: darkreader, refined-github, scriptcat
      "@typescript-eslint/consistent-type-imports": "error",

      // Catch unused vars with _ prefix escape hatch
      // Used by: 9+ repos with various configs. This is the consensus pattern.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Prevent floating (unhandled) promises - major source of silent failures
      // Used by: clients, tridactyl, vimium-c
      "@typescript-eslint/no-floating-promises": "error",

      // Prevent misused promises (e.g., passing async to void-returning callbacks)
      // Used by: clients, tridactyl
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],

      // Enforce explicit return types on module boundaries
      // Used by: refined-github, vimium-c
      // RATIONALE: Prevents type widening at module boundaries. allowExpressions
      // relaxes this for inline arrow functions which are self-documenting.
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],

      // --- Core ESLint Rules ---

      // Force curly braces on all control flow (prevents bugs from ambiguous if/else)
      // Used by: clients, darkreader, vimium-c
      curly: ["error", "all"],

      // Enforce strict equality (=== over ==) with smart exception for null checks
      // Used by: darkreader, vimium-c
      eqeqeq: ["error", "smart"],

      // Ban console.log in production code (use proper logging)
      // Used by: clients, Memex
      "no-console": ["error", { allow: ["warn", "error"] }],

      // Prefer const over let when variable is never reassigned
      // Used by: chrome-extension-tools, darkreader, Memex, tridactyl
      "prefer-const": "error",

      // Ban var declarations
      // Used by: Memex, tridactyl, vimium-c
      "no-var": "error",

      // Prefer template literals over string concatenation
      // Used by: darkreader
      "prefer-template": "error",

      // Ban throw of non-Error objects
      // Used by: tridactyl, vimium-c
      "no-throw-literal": "error",

      // Enforce return in callbacks (prevents forgetting to return in .map/.filter)
      // Not commonly configured but prevents real bugs
      "array-callback-return": "error",

      // No debugger statements in committed code
      // Used by: darkreader, tridactyl, vimium-c
      "no-debugger": "error",
    },
  },

  // Ignore patterns
  {
    ignores: ["dist/**", "build/**", "node_modules/**", "*.config.{js,mjs,cjs}"],
  },
);
```

### 7.3 .prettierrc

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["@ianvs/prettier-plugin-sort-imports"],
  "importOrder": ["<BUILTIN_MODULES>", "<THIRD_PARTY_MODULES>", "", "^@/(.*)$", "", "^[./]"]
}
```

**Rationale for each setting:**

| Setting                | Value                 | Why                                                                                                                         |
| ---------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `printWidth: 100`      | Moderate              | 80 is too tight for modern code; 120 too wide for split panes. clients uses 100.                                            |
| `tabWidth: 2`          | Industry standard     | 11/15 repos with Prettier use 2.                                                                                            |
| `useTabs: false`       | Near-universal        | Only 1 repo uses tabs.                                                                                                      |
| `semi: true`           | Defensive choice      | While 10/14 repos go no-semi, semicolons prevent ASI edge cases. Security-sensitive code should prefer explicit semicolons. |
| `singleQuote: true`    | Slight majority       | 8/14 repos use single quotes. Less visual noise.                                                                            |
| `trailingComma: "all"` | Modern best practice  | 7/14 repos use "all". Cleaner git diffs.                                                                                    |
| `endOfLine: "lf"`      | Cross-platform safety | Prevents CRLF issues. 3/3 repos that specify it use "lf".                                                                   |
| Import sort plugin     | Automated ordering    | 5+ repos use import sorting. Eliminates merge conflicts from import reordering.                                             |

### 7.4 Pre-commit Hooks

**package.json additions:**

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^16.0.0"
  },
  "lint-staged": {
    "*": "prettier --cache --ignore-unknown --write",
    "*.{ts,tsx}": "eslint --cache --cache-strategy content --fix"
  }
}
```

**.husky/pre-commit:**

```sh
pnpm exec lint-staged
```

**.husky/pre-push (optional but recommended):**

```sh
pnpm run test
```

**Rationale:** This mirrors the clients (bitwarden) pattern, which is the most sophisticated pre-commit setup in the dataset:

- Prettier runs on ALL files (catches formatting in JSON, YAML, MD, etc.)
- ESLint runs only on TypeScript files (faster, more targeted)
- `--cache` flags make it fast for incremental commits
- `--fix` auto-fixes what it can, failing only on unfixable issues
- Pre-push test run catches test regressions before they hit CI

> **Husky v9 migration (Feb 2026):** Husky v9 changed hook script patterns from v4-v8. The `prepare` script is now just `husky` (no `husky install`). If upgrading from older Husky, check the [Husky migration guide](https://typicode.github.io/husky/). Some repos in our 25-repo set may still be on v4-v8 patterns.

> **lint-staged v16 breaking change (2025):** lint-staged v16.0.0 switched process spawning from `execa` to `nano-spawn`. If using Node.js scripts as lint-staged tasks, you must explicitly run them with `node` (e.g., `node my-script.js` not just `my-script.js`). See [lint-staged v16.0.0 release notes](https://github.com/lint-staged/lint-staged/releases/tag/v16.0.0).

### 7.5 GitHub Actions CI Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec tsc --noEmit

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    strategy:
      matrix:
        target: [chrome, firefox]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build:${{ matrix.target }}
      - uses: actions/upload-artifact@v4
        with:
          name: extension-${{ matrix.target }}
          path: dist/
```

**Rationale:**

- **Parallel jobs** for lint, typecheck, test (most repos do this; refined-github, web-scrobbler, clients all separate concerns)
- **Build depends on all checks passing** (`needs: [lint, typecheck, test]`)
- **Matrix build** for chrome/firefox (SponsorBlock, BilibiliSponsorBlock, darkreader pattern)
- **`--frozen-lockfile`** ensures reproducible builds
- **`.nvmrc` for node version** (web-scrobbler, refined-github, clients pattern)
- **Artifact upload** for review/deployment (universal pattern)

### 7.6 package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:chrome": "cross-env TARGET=chrome vite build",
    "build:firefox": "cross-env TARGET=firefox vite build",
    "lint": "eslint . && prettier --check .",
    "lint:fix": "eslint . --fix && prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:ci": "vitest run",
    "format": "prettier --write .",
    "prepare": "husky"
  }
}
```

---

## 8. Key Observations and Recommendations

### 8.1 TypeScript Strictness Tiers

Based on the data, repos fall into three tiers:

**Tier 1 - Maximum Strictness** (aspire to this):

- vimium-c, refined-github, chatgpt-exporter, selenium-ide
- These enable `strict: true` PLUS multiple additional flags

**Tier 2 - Standard Strict** (minimum acceptable):

- Authenticator, chatgpt-advanced, chathub, chrome-extension-tools, create-chrome-ext, extension.js, jiffyreader, scriptcat, vitesse-webext, web-scrobbler
- These use `strict: true` but few additional flags

**Tier 3 - Relaxed/Legacy** (avoid for new projects):

- BilibiliSponsorBlock, SponsorBlock, tridactyl, darkreader, Memex, clients, page-assist, RSSHub-Radar
- Missing `strict: true` or explicitly disabling key flags

### 8.2 The Flags Nobody Uses (But Should)

These flags are technically the "strictest" but are avoided in practice:

1. **`exactOptionalPropertyTypes`** - 0 repos effectively use it. Very disruptive to existing code patterns but catches real type errors with optional properties.
2. **`noImplicitOverride`** - 0 repos use it. Zero friction for new projects; only relevant with class inheritance.
3. **`noUncheckedIndexedAccess`** - Effectively 0 repos (refined-github disables it). Adds `| undefined` to all index accesses. Very safe but requires many null checks.

### 8.3 ESLint: The Promise Safety Rules

The most impactful ESLint rules that few repos enable are the **promise safety rules**:

- `@typescript-eslint/no-floating-promises` (3/25 repos)
- `@typescript-eslint/no-misused-promises` (2/25 repos)

These require type-checked linting (slower but far more powerful). They catch one of the most common categories of bugs in async JavaScript: unhandled promise rejections.

### 8.4 Import Ordering

There is strong consensus that automated import ordering is valuable:

- 5+ repos use Prettier plugins for import sorting
- 3+ repos use ESLint `import/order` rules
- This eliminates a major source of meaningless merge conflicts

### 8.5 Formatter Wars

Two camps are emerging:

1. **Prettier** (dominant, 15/25 repos have some Prettier config)
2. **Biome** (emerging, used by extension.js and refined-github alongside ESLint)

For new projects, Prettier remains the safe choice due to ecosystem support. Biome is faster but has less plugin support.
