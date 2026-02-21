# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**ChatSmuggler** — Browser extension to export conversations from ChatGPT, Gemini, Grok, Claude, and DeepSeek.
Tagline: *"Your chats. Smuggled out."*

- **Repo**: `primeinc/chatsmuggler` (private)
- **License**: MIT
- **Platform targets**: Chrome (Manifest V3), cross-browser goal (Firefox, Edge)

## Architecture

Per-platform adapter pattern: each AI chat site gets a content script adapter
that extracts conversation data into a common schema, then exports to
user-selected formats (JSON, Markdown, etc.).

```
src/
  adapters/         # Per-platform content script adapters
    chatgpt.ts
    gemini.ts
    grok.ts
    claude.ts
    deepseek.ts
  common/           # Shared types, schema, utilities
  background/       # Service worker (MV3)
  popup/            # Extension popup UI
  options/          # Options page
```

## Toolchain

| Tool | Purpose | Config |
|---|---|---|
| TypeScript | Language | `tsconfig.json` — strictest viable config |
| Vite | Build | Extension bundling with HMR |
| ESLint | Linting + SAST | Flat config, `@microsoft/eslint-plugin-sdl` + `eslint-plugin-security` + `eslint-plugin-no-secrets` |
| Prettier | Formatting | `tabWidth: 2`, `trailingComma: "all"` |
| Husky + lint-staged | Pre-commit | Lint + format staged files |
| Vitest | Testing | Unit + integration tests |
| GitHub Actions | CI/CD | Lint, typecheck, test, build, security scan |

## Commands

```bash
npm ci                    # Install (locked deps, CI-safe)
npm run dev               # Dev build with HMR
npm run build             # Production build
npm run lint              # ESLint (zero warnings allowed)
npm run lint:fix          # ESLint with auto-fix
npm run typecheck         # tsc --noEmit
npm run test              # Vitest
npm run test:watch        # Vitest in watch mode
npm run format            # Prettier write
npm run format:check      # Prettier check (CI)
npm run audit             # npm audit --audit-level=high
```

## TypeScript Config (Strict AF)

Derived from analysis of 25 reference repos. We enable flags that 0/25 repos effectively use (see `docs/research/config-analysis.md` Sections 1.2 and 8.2):

- `strict: true` (umbrella for all strict flags)
- `noUncheckedIndexedAccess: true` — array/object index returns `T | undefined`
- `exactOptionalPropertyTypes: true` — distinguishes `undefined` from missing
- `noImplicitOverride: true` — requires `override` keyword
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `forceConsistentCasingInFileNames: true`
- `noPropertyAccessFromIndexSignature: true`

## ESLint Security Rules

Three security plugins are MANDATORY per Microsoft SDL:

1. **`@microsoft/eslint-plugin-sdl`** — Microsoft's official 26-rule SDL plugin (XSS, innerHTML, postMessage, insecure URLs)
2. **`eslint-plugin-security`** — detect unsafe regex, eval, child_process, buffer issues
3. **`eslint-plugin-no-secrets`** — entropy-based secret detection in source

Additionally:
- `@typescript-eslint` strict + stylistic presets
- `no-floating-promises: error` — only 3/25 reference repos enable this, but it's critical
- `no-misused-promises: error` — prevents async footguns

## Conventions

- **No `any`** — ever. Use `unknown` and narrow.
- **No `// @ts-ignore`** — use `// @ts-expect-error` with explanation if absolutely necessary.
- **No `innerHTML`** — use `textContent` or DOM APIs. Enforced by `@microsoft/sdl/no-inner-html`.
- **No `eval`/`new Function`** — MV3 enforces this; lint catches it too.
- **No `postMessage(data, '*')`** — always specify target origin.
- **Validate all `chrome.runtime.onMessage` inputs** — treat all messages as untrusted.
- **Minimal permissions** — justify every permission in `docs/security/permissions-justification.md`.
- **Pin all GitHub Actions to SHA** — never use tags (CVE-2025-30066 precedent).
- **`npm ci` only** — never `npm install` in CI.
- All config decisions are logged with reasoning in `docs/research/`.

## Security Posture

Targets Microsoft SDL compliance. See:
- `docs/research/microsoft-sdl-requirements.md` — SDL practices mapped to tooling
- `docs/research/microsoft-sdl-audit-baseline.md` — audit-ready baseline with citations
- `docs/research/config-analysis.md` — analysis of 25 reference repos

## Reference Repos

Cloned to `./refs` (symlink to `~/dev/refs/browser-extensions/`, gitignored).
25 shallow clones of top TypeScript browser extensions. Do not modify them.
See `docs/research/reference-repos.md` for the full list with reasoning.
