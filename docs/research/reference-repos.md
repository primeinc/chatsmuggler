# Reference Repos — ChatSmuggler

Curated 2026-02-20. Top 25 TypeScript browser extension repos by stars, selected for
config/CI maturity, domain relevance, or cross-browser patterns. Used to derive the
strictest viable dev environment for ChatSmuggler.

## Selection Criteria

- **Language**: TypeScript (primary or dominant)
- **Topics scanned**: `chrome-extension`, `browser-extension`, `web-extension`, `webextension`,
  `manifest-v3`, `chrome-extension-boilerplate`, `chat-export`, `chatgpt-export`, `content-script`
- **Ranked by**: Stars, then filtered for config quality and relevance

## Repos

### Tier 1 — Mature Extensions (battle-tested configs, CI, cross-browser)

| # | Repo | Stars | Reason |
|---|---|---:|---|
| 1 | `refined-github/refined-github` | 30,482 | Gold standard TS extension. Strict config, comprehensive CI, cross-browser. |
| 2 | `darkreader/darkreader` | 21,681 | Complex rendering extension. Strict TS, custom build, cross-browser. |
| 3 | `crimx/ext-saladict` | 12,990 | Professional-grade multi-mode extension. Complex state management. |
| 4 | `ajayyy/SponsorBlock` | 12,781 | Community-driven, content script heavy, solid review process. |
| 5 | `bitwarden/clients` | 12,287 | Security-first. Enterprise CI/CD. Monorepo. SDL-grade practices. |
| 6 | `tridactyl/tridactyl` | 6,090 | Cross-browser (Firefox focus). Mature TS, complex keybinding system. |
| 7 | `hanydd/BilibiliSponsorBlock` | 4,862 | SponsorBlock fork. Inherits solid patterns, adds localization. |
| 8 | `WorldBrain/Memex` | 4,625 | Annotation/export extension. Complex data pipeline, relevant domain. |
| 9 | `Authenticator-Extension/Authenticator` | 4,354 | Security-focused 2FA extension. Strict CSP and build. |
| 10 | `gdh1995/vimium-c` | 4,285 | Very strict TS config. Complex content script injection. |
| 11 | `scriptscat/scriptcat` | 4,119 | Userscript manager. Content script orchestration patterns. |
| 12 | `web-scrobbler/web-scrobbler` | 2,842 | Multi-site content scripts. Good model for per-site adapters. |
| 13 | `polywock/globalSpeed` | 2,366 | Clean, small, modern extension. Good minimal reference. |

### Tier 2 — Extension Frameworks & Tooling (build systems, DX patterns)

| # | Repo | Stars | Reason |
|---|---|---:|---|
| 14 | `PlasmoHQ/plasmo` | 12,864 | Extension framework. **Maintenance mode as of 2026** -- still usable but no longer actively developed. |
| 15 | `extension-js/extension.js` | 4,772 | Cross-browser framework. Zero-config approach. |
| 16 | `crxjs/chrome-extension-tools` | 3,955 | Vite + CRX. HMR for extensions. |
| 17 | `antfu-collective/vitesse-webext` | 3,355 | Antfu's starter. Legendary strict configs. |
| 18 | `guocaoyi/create-chrome-ext` | 2,106 | Scaffolding tool. Multi-framework boilerplates. |
| 19 | `ansh/jiffyreader-public-archive` | 3,984 | Clean modern ext with good DX setup. |
| 20 | `SeleniumHQ/selenium-ide` | 3,082 | Enterprise-grade CI/CD pipeline. |
| 20b | `wxt-dev/wxt` | ~growing | **Recommended framework for new extension projects (2025-2026).** Vite-powered, Nuxt-inspired DX, cross-browser. See [wxt.dev](https://wxt.dev/). Not in original 25 clone set but should be evaluated. |

### Tier 3 — Domain Relevant (AI chat, export, multi-provider)

| # | Repo | Stars | Reason |
|---|---|---:|---|
| 21 | `chathub-dev/chathub` | 10,541 | Multi-AI chat interface. Direct architectural overlap. |
| 22 | `n4ze3m/page-assist` | 7,552 | AI + browser extension. Modern stack. |
| 23 | `interstellard/chatgpt-advanced` | 6,486 | ChatGPT extension. Content script patterns for OpenAI DOM. |
| 24 | `DIYgod/RSSHub-Radar` | 6,990 | Clean TS extension. Feed detection = content extraction parallel. |
| 25 | `pionxzh/chatgpt-exporter` | 2,185 | **Direct competitor.** ChatGPT conversation export. |

### Honorable Mention (not cloned, but worth watching)

| Repo | Stars | Note |
|---|---:|---|
| `Yalums/lyra-exporter` | ~new | Multi-platform AI export (Claude, ChatGPT, Grok, Gemini). Closest competitor. |
| `nicepkg/ctxport` | ~new | Copy AI convos as Markdown. Zero upload, local-only. |
| `vicentereig/quaid` | ~new | AI chat backup tool. |

## Context7 Documentation Sources

For dev environment setup, we also reference official docs via Context7:

- `/websites/plasmo` — Plasmo framework (464 snippets)
- `/websites/developer_chrome_extensions` — Chrome Extensions (5,293 snippets)
- `/websites/developer_chrome_extensions_reference_api` — Chrome API reference (9,938 snippets)
- `/websites/developer_mozilla_en-us_mozilla_add-ons_webextensions` — WebExtensions (4,344 snippets)
- `/crxjs/chrome-extension-tools` — CRXJS Vite plugin (110 snippets)
- `/websites/typescriptlang` — TypeScript docs (2,371 snippets)
