# Session Log — 2026-02-21 — Research Phase

## Current State

- **Working directory**: `/c/Users/will/dev/chatsmuggler`
- **Branch**: `main` (clean, pushed to `origin/main`)
- **Commit**: `e7dae5d` — "Add project scaffolding, SDL research, and dev environment baseline"
- **No files open/being edited** — all work committed and pushed

## What Was Built This Session

| File                                            | Lines | Purpose                                         |
| ----------------------------------------------- | ----- | ----------------------------------------------- |
| `CLAUDE.md`                                     | ~95   | Project guide, toolchain, commands, conventions |
| `SECURITY.md`                                   | ~55   | Vuln disclosure, bug bar, SLAs (SDL Practice 9) |
| `.gitignore`                                    | ~25   | Standard + `/refs` symlink exclusion            |
| `.github/CODEOWNERS`                            | ~15   | Security-sensitive path review gates            |
| `.github/dependabot.yml`                        | ~18   | npm daily + GH Actions weekly                   |
| `docs/research/reference-repos.md`              | ~90   | 25 curated repos with reasoning                 |
| `docs/research/config-analysis.md`              | 748   | TS/ESLint/Prettier/CI from 25 repos             |
| `docs/research/microsoft-sdl-requirements.md`   | 829   | 10 SDL practices + DS-1..DS-7                   |
| `docs/research/microsoft-sdl-audit-baseline.md` | 454   | 28 requirements, RACI, evidence pack            |
| `docs/research/devcontainer-baseline.md`        | 538   | 18 requirements, templates, enforcement         |

**Total**: 2,885 insertions across 10 files

## Also Done (Not in Repo)

- 25 reference repos shallow-cloned to `~/dev/refs/browser-extensions/` (symlinked as `./refs`, gitignored)
- GitHub repo configured: 10 custom labels (platform-specific + priority + feature), 10 topics, private project board (https://github.com/users/primeinc/projects/6)
- Memory files written to `~/.claude/projects/C--Users-will-dev-chatsmuggler/memory/`

## Issues Encountered

- **Branch protection**: requires GitHub Pro for private repos. Rules fully documented in SDL docs. Will activate when repo goes public or upgrades to Pro.
- **Secret scanning + push protection**: requires GitHub Advanced Security for private repos. Compensating controls: `eslint-plugin-no-secrets` (lint-time) + `gitleaks` (pre-commit hook).

## Research Agents Dispatched

Four background agents ran in parallel during this session:

1. **Config analyzer** — read tsconfig/eslint/prettier/husky/CI from all 25 repos → `config-analysis.md`
2. **SDL agent** — fetched all 10 SDL practices + DevOps controls → `microsoft-sdl-requirements.md`
3. **SDL audit baseline** — skeptical analyst persona, primary source citations, testable requirements → `microsoft-sdl-audit-baseline.md`
4. **Devcontainer baseline** — spec compliance, security, reproducibility, templates → `devcontainer-baseline.md`

## Key Research Findings

- `@microsoft/eslint-plugin-sdl` — Microsoft's official 26-rule ESLint plugin for SDL compliance. NON-NEGOTIABLE.
- `no-floating-promises` + `no-misused-promises` — only 3/25 reference repos enable these, but they're critical for async safety.
- `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `noImplicitOverride` — 0/25 repos _effectively_ enable these (refined-github inherits via `@sindresorhus/tsconfig` but explicitly disables `noUncheckedIndexedAccess`). We will enable all three. See config-analysis.md Section 1.2 and 8.2 for exact data.
- Socket.dev for behavioral SCA — detects malicious packages by analyzing behavior (network, fs, obfuscation), not just CVE databases.
- GitHub Actions must be pinned by SHA, not tag — CVE-2025-30066 (tj-actions/changed-files tag hijack) proved this is critical.
- Only 3/25 repos have functional pre-commit hooks (husky + lint-staged). We'll exceed the entire reference set.
- Vite is the modern build tool pick (6/25, trending up from webpack's 9/25).
- DAST for browser extensions has limited applicability vs web apps — flagged as known gap in audit baseline.
- Microsoft does not define "minimum SDL" for external adopters (their SDL is an internal mandate) — documented in known gaps.

## Next Step: Task #7 — Set Up Dev Environment

All research is complete. Implementation plan (in order):

1. `npm init` + `package.json` with exact deps and scripts
2. `tsconfig.json` — strictest viable config (see config-analysis.md Section 7)
3. `eslint.config.mjs` — flat config with `@microsoft/eslint-plugin-sdl` + `eslint-plugin-security` + `eslint-plugin-no-secrets` + `@typescript-eslint` strict
4. `.prettierrc` — consensus from 25 repos: `tabWidth: 2`, `useTabs: false`, `trailingComma: "all"`
5. Husky + lint-staged — pre-commit: lint+format staged files; pre-push: tsc+audit
6. `.devcontainer/` — Dockerfile (pinned digest, non-root, Chromium) + devcontainer.json
7. `.github/workflows/ci.yml` — lint, typecheck, test, build, audit, dependency-review as parallel jobs; all actions pinned by SHA
8. `manifest.json` — MV3 skeleton with strict CSP (`script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'`)
9. Vite config for extension bundling
10. Basic `src/` scaffold (adapters/, common/, background/, popup/, options/)

## Critical Decisions to Preserve

- Name: **ChatSmuggler** (user picked from brainstorm session)
- `@microsoft/eslint-plugin-sdl` is non-negotiable
- `noUncheckedIndexedAccess: true` + `exactOptionalPropertyTypes: true` + `noImplicitOverride: true` (0/25 repos effectively enable — see config-analysis.md Sections 1.2 and 8.2 for exact data)
- Actions pinned by SHA only (never tags)
- `npm ci` only in CI, exact version pinning in package.json (no `^` or `~`)
- Socket.dev for behavioral SCA (not just npm audit)
- Vite for build tooling (not webpack)
- Manifest V3 only (no MV2 compat)
- All permissions must be justified in `docs/security/permissions-justification.md`

## Competitors Identified

- `Yalums/lyra-exporter` — multi-platform AI export (closest competitor, new)
- `pionxzh/chatgpt-exporter` — 2.2k stars, ChatGPT only
- `nicepkg/ctxport` — copy AI convos as Markdown, zero upload
- `vicentereig/quaid` — AI chat backup
- `chat-export` topic is basically empty in TypeScript — room to own it
