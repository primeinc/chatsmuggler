# Microsoft SDL & DevOps Security Requirements

## Applied to a TypeScript Browser Extension Project

> Research compiled 2026-02-20. Based on the [Microsoft Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/securityengineering/sdl/practices), [Microsoft Cloud Security Benchmark - DevOps Security Controls](https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security), and [SDL Verification Requirements](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle).

---

## Table of Contents

1. [SDL Practice 1 - Security Standards, Metrics & Governance](#1-establish-security-standards-metrics--governance)
2. [SDL Practice 2 - Proven Security Features & Frameworks](#2-require-use-of-proven-security-features-languages--frameworks)
3. [SDL Practice 3 - Threat Modeling](#3-perform-security-design-review--threat-modeling)
4. [SDL Practice 4 - Cryptography Standards](#4-define-and-use-cryptography-standards)
5. [SDL Practice 5 - Software Supply Chain Security](#5-secure-the-software-supply-chain)
6. [SDL Practice 6 - Secure Engineering Environment](#6-secure-the-engineering-environment)
7. [SDL Practice 7 - Security Testing](#7-perform-security-testing)
8. [SDL Practice 8 - Operational Platform Security](#8-ensure-operational-platform-security)
9. [SDL Practice 9 - Security Monitoring & Response](#9-implement-security-monitoring--response)
10. [SDL Practice 10 - Security Training](#10-provide-security-training)
11. [DevOps Security Controls (DS-1 through DS-7)](#devops-security-controls)
12. [Browser Extension Specific Security](#browser-extension-specific-security)
13. [Implementation Summary & Priority Matrix](#implementation-summary--priority-matrix)

---

## 1. Establish Security Standards, Metrics & Governance

**SDL Requirement:** Define minimum acceptable security quality levels. Track security defects with appropriate severity. Maintain a security bug bar. Create a formal exception process for deviations.

**Classification:** MANDATORY

### Tooling Recommendations

| Requirement | Tool / Config | Notes |
|---|---|---|
| Security bug bar | GitHub Issues with `security` label + severity labels (`critical`, `high`, `medium`, `low`) | Define SLAs: critical = 1 day, high = 7 days, medium = 30 days |
| Security requirements tracking | GitHub Issues / Projects board with security milestone | Tag all security work items for KPI reporting |
| Exception process | Documented in `SECURITY.md` with approval workflow | Use PR-based approval for security exceptions |
| Compliance reporting | GitHub Actions workflow that outputs security metrics | Weekly automated security posture report |

### Implementation Notes (Browser Extension Context)

- Define a bug bar: any XSS, CSP bypass, or credential leak is **critical**
- Track extension permissions as security-relevant changes requiring review
- Any change to `manifest.json` permissions must be flagged and justified

---

## 2. Require Use of Proven Security Features, Languages & Frameworks

**SDL Requirement:** Use well-established, security-vetted languages, frameworks, and libraries. Avoid rolling custom security implementations.

**Classification:** MANDATORY

### Tooling Recommendations

| Requirement | Tool / Config | Notes |
|---|---|---|
| Type-safe language | TypeScript with `strict: true` | Eliminates entire classes of bugs (null deref, type confusion) |
| Linting framework | ESLint with flat config | Foundation for all static analysis |
| Framework security | Use browser extension APIs directly (no eval, no remote code) | Manifest V3 enforces this |
| Cryptography | Web Crypto API only | Never use custom crypto; use `crypto.subtle` for all operations |
| Secure defaults | `tsconfig.json`: `strict`, `noImplicitAny`, `strictNullChecks` | Catches null/undefined errors at compile time |

### Implementation Notes

```jsonc
// tsconfig.json - security-relevant settings
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 3. Perform Security Design Review & Threat Modeling

**SDL Requirement:** Create threat models using STRIDE methodology. Identify assets, trust boundaries, and data flows. Document threats and mitigations. Update threat models when significant changes occur.

**Classification:** MANDATORY

> Reference: [SDL Practice 3 - Secure Design Review & Threat Modeling](https://www.microsoft.com/securityengineering/sdl/practices/secure-by-design)

### Tooling Recommendations

| Requirement | Tool / Config | Priority | Notes |
|---|---|---|---|
| Threat modeling tool | [Microsoft Threat Modeling Tool](https://www.microsoft.com/download/details.aspx?id=49168) or OWASP Threat Dragon | MANDATORY | Create DFDs with trust boundaries |
| Methodology | STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege) | MANDATORY | Systematic threat enumeration |
| Threat tracking | GitHub Issues tagged `threat-model` | MANDATORY | Link mitigations to implementation PRs |
| Review cadence | On every major feature or permission change | MANDATORY | Required before any new `permissions` in manifest |

### Implementation Notes (Browser Extension Context)

Key trust boundaries for a browser extension:
- **Extension <-> Web Page**: Content scripts operate in page context; messages cross trust boundaries
- **Extension <-> Background Service Worker**: Internal messaging channel
- **Extension <-> External APIs**: Network requests to backend services
- **Extension <-> Browser Storage**: `chrome.storage` / `browser.storage` data at rest
- **Extension <-> Other Extensions**: Cross-extension messaging if applicable

Key threats specific to browser extensions:
- Content script injection / XSS in extension pages
- Message spoofing between content scripts and background
- Data exfiltration through overly broad host permissions
- Supply chain compromise of npm dependencies injecting malicious code
- CSP bypass attempts
- Storage tampering / data integrity attacks

STRIDE analysis should also challenge assumptions such as:
- "We assume our open-source dependencies don't have malicious code."
- "We assume that all authenticated users have benign intent."
- "We assume the host page DOM structure is trustworthy."

**Deliverable:** A `docs/security/threat-model.md` file with DFDs and STRIDE analysis, updated per major release.

---

## 4. Define and Use Cryptography Standards

**SDL Requirement:** Use only approved cryptographic algorithms and implementations. No custom crypto. Enforce HTTPS for all network communications.

**Classification:** MANDATORY

### Tooling Recommendations

| Requirement | Tool / Config | Notes |
|---|---|---|
| Crypto implementation | Web Crypto API (`crypto.subtle`) | Browser-native, hardware-backed where available |
| HTTPS enforcement | Manifest V3 CSP default: `upgrade-insecure-requests` | MV3 auto-upgrades HTTP to HTTPS |
| No insecure URLs | `@microsoft/eslint-plugin-sdl` rule `no-insecure-url` | Lint-time enforcement |
| Key management | Never store keys in source code | Use `chrome.storage.session` for ephemeral secrets |

### Implementation Notes

- Manifest V3 default CSP includes `upgrade-insecure-requests`
- All `fetch()` calls must use HTTPS endpoints
- If the extension handles tokens/secrets, store in `chrome.storage.session` (encrypted, session-scoped, never synced)
- Never use `btoa()`/`atob()` for security-sensitive encoding

---

## 5. Secure the Software Supply Chain

**SDL Requirement:** Inventory all third-party dependencies. Scan for known vulnerabilities. Produce Software Bill of Materials (SBOM). Sign and attest artifacts. Establish governed ingestion process for open source.

**Classification:** MANDATORY

> Reference: [SDL Practice 5 - Secure the software supply chain](https://www.microsoft.com/securityengineering/sdl/practices/sscs) and [DS-2: Ensure software supply chain security](https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security#ds-2-ensure-software-supply-chain-security)

### Tooling Recommendations

| Requirement | Tool / Config | Priority | Notes |
|---|---|---|---|
| **Dependency vulnerability scanning** | `npm audit` (built-in) | MANDATORY | Run in CI; fail build on critical/high |
| **Advanced SCA** | [Socket.dev](https://socket.dev) GitHub App | MANDATORY | Detects malicious packages by analyzing behavior (network access, fs access, obfuscated code), not just known CVEs |
| **Dependency version updates** | GitHub Dependabot | MANDATORY | Auto-PRs for vulnerable dependencies |
| **Dependency review on PRs** | `actions/dependency-review-action` | MANDATORY | Blocks PRs that introduce known-vulnerable deps |
| **Lock file integrity** | `npm ci` (not `npm install`) in CI | MANDATORY | Ensures reproducible builds from lockfile |
| **Lock file committed** | `package-lock.json` in version control | MANDATORY | Required for integrity verification |
| **SBOM generation** | [Microsoft SBOM Tool](https://github.com/microsoft/sbom-tool) | RECOMMENDED | Generate SPDX-format SBOM per release |
| **Artifact signing** | [GitHub Artifact Attestations (Sigstore)](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds) | RECOMMENDED | Proves provenance of built extension package |
| **Minimal dependencies** | Manual review + `npm ls --all` | MANDATORY | Browser extensions should minimize dependency tree |
| **License compliance** | `license-checker` or Socket.dev | RECOMMENDED | Ensure all deps have compatible licenses |
| **Dependency pinning** | Exact versions in `package.json` | MANDATORY | No `^` or `~` ranges for direct dependencies |

### Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-reviewers"
```

```yaml
# In CI workflow — dependency review step
- name: Dependency Review
  uses: actions/dependency-review-action@<pinned-sha>
  with:
    fail-on-severity: high
    deny-licenses: GPL-3.0, AGPL-3.0
```

### License Policy

| Allowed | Denied |
|---|---|
| MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD | GPL (any version), AGPL, SSPL, EUPL, unlicensed |

**Critical for browser extensions:** Keep the dependency tree as small as possible. Every dependency is attack surface. Prefer vendoring small utilities over adding npm packages. The [2025 npm supply chain attacks](https://snyk.io/articles/npm-security-best-practices-shai-hulud-attack/) demonstrated that "just run npm audit" is insufficient -- behavioral analysis (Socket.dev) is now essential.

---

## 6. Secure the Engineering Environment

**SDL Requirement:** Zero Trust approach to access. Disallow direct commits to production branches. Require code review and approval for all PRs. Segment access. Use MFA. Remove secrets from code.

**Classification:** MANDATORY

> Reference: [SDL Practice 6](https://www.microsoft.com/securityengineering/sdl/practices/secure-dev-infra) and [DS-3: Secure DevOps infrastructure](https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security#ds-3-secure-devops-infrastructure)

### Tooling Recommendations

| Requirement | Tool / Config | Priority | Notes |
|---|---|---|---|
| **Branch protection** | GitHub Branch Protection Rules / Rulesets | MANDATORY | See detailed config below |
| **Required reviews** | Minimum 1 reviewer (2 for security-sensitive paths) | MANDATORY | No self-approval |
| **CODEOWNERS** | `.github/CODEOWNERS` file | MANDATORY | Require owner review for manifest, CSP, permissions |
| **No direct commits** | Block force pushes + require PR | MANDATORY | SDL Practice 6.2 explicitly requires this |
| **Signed commits** | Require commit signing (GPG or SSH) | RECOMMENDED | Verify author identity |
| **MFA** | Require 2FA for all org members | MANDATORY | GitHub org setting |
| **Secret management** | GitHub Actions Secrets + environment protection | MANDATORY | Never hardcode secrets |
| **Least privilege CI tokens** | `permissions:` block in workflows | MANDATORY | Explicit, minimal permissions per job |

### Branch Protection Configuration

```
Branch: main
- Require pull request reviews before merging: YES
  - Required approving reviews: 1 (minimum)
  - Dismiss stale pull request approvals when new commits are pushed: YES
  - Require review from Code Owners: YES
- Require status checks to pass before merging: YES
  - Require branches to be up to date before merging: YES
  - Required checks: lint, typecheck, test, security-scan
- Require signed commits: RECOMMENDED
- Block force pushes: YES
- Do not allow bypassing the above settings: YES (for non-admins)
```

### CODEOWNERS Configuration

```
# .github/CODEOWNERS
# Security-sensitive files require security-aware reviewer
manifest.json           @project-owner
**/permissions*          @project-owner
**/content-security*     @project-owner
package.json             @project-owner
package-lock.json        @project-owner
.github/workflows/       @project-owner
```

---

## 7. Perform Security Testing

**SDL Requirement:** Implement SAST, DAST, SCA, credential scanning, and penetration testing. Integrate security testing as CI/CD gating controls. Perform continuous security testing.

**Classification:** MANDATORY

> Reference: [SDL Practice 7](https://www.microsoft.com/securityengineering/sdl/practices/security-testing), [DS-4: SAST](https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security#ds-4-integrate-static-application-security-testing-into-devops-pipeline), [DS-5: DAST](https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security#ds-5-integrate-dynamic-application-security-testing-into-devops-pipeline)

### 7.1 Static Analysis Security Testing (SAST)

| Tool | Priority | What It Catches | Notes |
|---|---|---|---|
| **[`@microsoft/eslint-plugin-sdl`](https://github.com/microsoft/eslint-plugin-sdl)** | MANDATORY | XSS (innerHTML, document.write), insecure URLs, eval, postMessage wildcard origin, unsafe DOM manipulation | **Microsoft's own SDL ESLint rules** -- 26 rules specifically designed for SDL compliance |
| **[`eslint-plugin-security`](https://github.com/eslint-community/eslint-plugin-security)** | MANDATORY | Trojan source attacks, unsafe regex, child_process exec, non-literal require, buffer issues | Community-maintained Node security rules |
| **[`eslint-plugin-no-secrets`](https://github.com/nickdeis/eslint-plugin-no-secrets)** | MANDATORY | Hardcoded secrets, API keys, tokens in source code | Uses entropy analysis + pattern matching |
| **[GitHub CodeQL](https://codeql.github.com/)** | RECOMMENDED | Deep semantic code analysis, taint tracking, data flow analysis | Free for public repos; requires GitHub Advanced Security for private |
| **TypeScript compiler (`tsc --noEmit`)** | MANDATORY | Type errors, null safety, unreachable code | First line of defense; catches bugs before lint |
| **[Microsoft DevSkim](https://github.com/Microsoft/DevSkim)** | RECOMMENDED | IDE-level security linting with auto-fix suggestions | VS Code extension available |

### `@microsoft/eslint-plugin-sdl` Rules Detail

This is Microsoft's official ESLint plugin for SDL compliance. It includes 26 rules:

**DOM/XSS Prevention:**
- `no-inner-html` -- Restricts innerHTML/outerHTML assignments
- `no-document-write` -- Bans unsanitized DOM manipulation
- `no-html-method` -- Prevents jQuery's unsafe html() method

**Code Execution Prevention:**
- `no-eval` (via ESLint built-in) -- Blocks dynamic code execution
- `no-implied-eval` -- Restricts setTimeout/setInterval with strings
- `no-new-func` -- Prevents Function constructor abuse

**Network/Origin Security:**
- `no-insecure-url` -- Enforces HTTPS/FTPS over HTTP/FTP
- `no-postmessage-star-origin` -- Requires specific postMessage origins

**Other:**
- `no-cookies` -- Discourages HTTP cookies for storage
- `no-document-domain` -- Prevents same-origin policy bypasses
- `no-unsafe-alloc` -- Flags uninitialized Buffer allocation

### ESLint Security Configuration

```javascript
// eslint.config.js (flat config) - security rules
import sdl from "@microsoft/eslint-plugin-sdl";
import security from "eslint-plugin-security";
import noSecrets from "eslint-plugin-no-secrets";

export default [
  // ... base config
  {
    plugins: {
      "@microsoft/sdl": sdl,
      "security": security,
      "no-secrets": noSecrets,
    },
    rules: {
      // Microsoft SDL rules
      "@microsoft/sdl/no-inner-html": "error",
      "@microsoft/sdl/no-document-write": "error",
      "@microsoft/sdl/no-insecure-url": "error",
      "@microsoft/sdl/no-postmessage-star-origin": "error",
      "@microsoft/sdl/no-html-method": "error",
      "@microsoft/sdl/no-cookies": "warn",

      // Security plugin rules
      "security/detect-eval-with-expression": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-object-injection": "warn",
      "security/detect-possible-timing-attacks": "warn",

      // No secrets
      "no-secrets/no-secrets": ["error", { "tolerance": 4.5 }],

      // Built-in ESLint security rules
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
  },
];
```

### 7.2 Secret / Credential Scanning

| Tool | Priority | Notes |
|---|---|---|
| **GitHub Secret Scanning** | MANDATORY | Automatically detects committed secrets (API keys, tokens, passwords) |
| **GitHub Push Protection** | MANDATORY | Blocks pushes containing detected secrets before they reach the repo |
| **`eslint-plugin-no-secrets`** | MANDATORY | Catches secrets at lint time, before commit |
| **`gitleaks`** | RECOMMENDED | Pre-commit hook for local secret detection |
| **`.gitignore` hardening** | MANDATORY | Ensure `.env`, `*.pem`, `*.key`, credentials files are ignored |

### Pre-commit Secret Prevention

```yaml
# .pre-commit-config.yaml (or husky equivalent)
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

```gitignore
# .gitignore - security-critical entries
.env
.env.*
*.pem
*.key
*.p12
*.pfx
credentials.json
secrets.json
*.secret
```

### 7.3 Dynamic Analysis Security Testing (DAST)

| Tool | Priority | Notes |
|---|---|---|
| **Manual testing of extension pages** | MANDATORY | Test popup, options, and side panel pages for XSS |
| **Browser DevTools CSP violation monitoring** | MANDATORY | Monitor console for CSP violations during testing |
| **Extension-specific E2E tests** | RECOMMENDED | Playwright or Puppeteer tests that verify security behavior |

### DAST Notes for Browser Extensions

DAST for browser extensions differs from web apps. The primary attack surface is:
1. Content scripts injecting into third-party pages (XSS risk)
2. Message passing between content script and background script (injection risk)
3. Export format generation (if generating HTML, ensure sanitization)
4. Extension popup/options page (standard web security applies)

Satisfy this requirement with automated E2E tests that load the extension and verify CSP enforcement, permission boundaries, and message validation.

### 7.4 Continuous Security Testing (CST)

| Tool | Priority | Notes |
|---|---|---|
| **`npm audit` in CI** | MANDATORY | Run on every PR and scheduled weekly |
| **Socket.dev PR checks** | MANDATORY | Behavioral analysis on every dependency change |
| **CodeQL scheduled scans** | RECOMMENDED | Weekly full-repo analysis beyond PR-scoped checks |
| **Dependabot alerts** | MANDATORY | Continuous monitoring of dependency vulnerabilities |

---

## 8. Ensure Operational Platform Security

**SDL Requirement:** Secure the runtime environment. Apply security baselines. Monitor for attacks.

**Classification:** MANDATORY

### Tooling Recommendations (Browser Extension Context)

| Requirement | Tool / Config | Priority | Notes |
|---|---|---|---|
| **Content Security Policy** | `manifest.json` CSP field | MANDATORY | Strictest possible CSP; see detailed config below |
| **Manifest V3** | Use MV3 exclusively | MANDATORY | MV3 eliminates remote code execution, enforces service workers |
| **Minimal permissions** | `manifest.json` permissions | MANDATORY | Request only what is needed; use `optional_permissions` for the rest |
| **Host permissions** | Narrowest possible match patterns | MANDATORY | Never use `<all_urls>` unless absolutely required; prefer `optional_host_permissions` |
| **Web accessible resources** | Restrict with `matches` in MV3 | MANDATORY | Limit which sites can access extension resources |
| **Extension update mechanism** | Chrome Web Store / AMO auto-update | MANDATORY | Signed by store; provides integrity verification |

### Content Security Policy (Manifest V3)

```jsonc
// manifest.json
{
  "manifest_version": 3,
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none';"
  }
}
```

**Key CSP rules for extensions:**
- `script-src 'self'` -- Only execute scripts bundled with the extension (MV3 default)
- `object-src 'none'` -- Block plugins (Flash, Java, etc.)
- `base-uri 'none'` -- Prevent base tag hijacking
- `frame-ancestors 'none'` -- Prevent clickjacking of extension pages
- No `unsafe-eval` -- MV3 disallows this entirely
- No `unsafe-inline` -- MV3 disallows this for scripts

### Manifest V3 Security Model

MV3 provides these security improvements over MV2:
1. **Service workers replace background pages** -- No persistent background context to exploit
2. **No remote code execution** -- `executeScript` only accepts functions, not strings; no eval
3. **Declarative Net Request** -- Rules-based network modification instead of webRequest blocking
4. **Stricter CSP** -- Cannot relax CSP to allow `unsafe-eval` or remote scripts
5. **Host permission controls** -- Users can restrict site access at install time

---

## 9. Implement Security Monitoring & Response

**SDL Requirement:** Have an incident response plan. Monitor for security events. Implement logging. Prepare for vulnerability disclosure.

**Classification:** MANDATORY

### Tooling Recommendations

| Requirement | Tool / Config | Priority | Notes |
|---|---|---|---|
| **Security contact** | `SECURITY.md` in repo root | MANDATORY | Vulnerability disclosure instructions |
| **Error monitoring** | Sentry, or built-in `chrome.runtime.lastError` handling | RECOMMENDED | Catch and report runtime errors |
| **Update response plan** | Documented process for emergency updates | MANDATORY | How to push a security fix to the store quickly |
| **GitHub Security Advisories** | Repository Security Advisories | RECOMMENDED | Private vulnerability discussion + coordinated disclosure |

### SECURITY.md Template

```markdown
# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | Yes       |

## Reporting a Vulnerability

Please report security vulnerabilities via [GitHub Security Advisories](link).
Do NOT open a public issue for security vulnerabilities.

Expected response time: 48 hours for acknowledgment, 7 days for initial assessment.
```

---

## 10. Provide Security Training

**SDL Requirement:** All team members must complete security awareness training. Developers must complete role-specific secure development training.

**Classification:** MANDATORY

### Resources

| Resource | Type | Notes |
|---|---|---|
| [Microsoft SDL Training](https://www.microsoft.com/download/details.aspx?id=16420) | Free course | Core SDL concepts |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | Reference | Web application security awareness |
| [CWE Top 25](https://cwe.mitre.org/top25/) | Reference | Most dangerous software weaknesses |
| [Chrome Extension Security docs](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security) | Reference | Extension-specific security guidance |
| Browser extension threat modeling | Team exercise | Conduct at project kickoff and major milestones |

---

## DevOps Security Controls

> Based on [Microsoft Cloud Security Benchmark - DevOps Security](https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security). All controls DS-1 through DS-6 are rated "Must have." DS-7 is rated "Should have."

### DS-1: Conduct Threat Modeling -- MUST HAVE

Maps to SDL Practice 3. See [Section 3](#3-perform-security-design-review--threat-modeling).

### DS-2: Ensure Software Supply Chain Security -- MUST HAVE

Maps to SDL Practice 5. See [Section 5](#5-secure-the-software-supply-chain).

### DS-3: Secure DevOps Infrastructure -- MUST HAVE

Maps to SDL Practice 6. See [Section 6](#6-secure-the-engineering-environment). Additional CI/CD-specific requirements below.

### GitHub Actions Security Hardening

```yaml
# Every workflow file must include:
name: CI
on: [push, pull_request]

# MANDATORY: Restrict default permissions
permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read      # Only what's needed
      # Add others explicitly per job
    steps:
      # MANDATORY: Pin actions to full SHA, not tags
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
      # NEVER: uses: actions/checkout@v4  (tags can be moved maliciously)
```

| Hardening Measure | Priority | Notes |
|---|---|---|
| **Pin all actions to full commit SHA** | MANDATORY | Tags can be moved; SHA is immutable. The [tj-actions/changed-files incident (CVE-2025-30066)](https://www.wiz.io/blog/github-actions-security-guide) proved this is critical |
| **Set `permissions: read-all` at workflow level** | MANDATORY | Explicit least-privilege for GITHUB_TOKEN |
| **Grant write permissions per-job only** | MANDATORY | Never at workflow level |
| **Use `harden-runner`** | RECOMMENDED | [step-security/harden-runner](https://github.com/step-security/harden-runner) restricts outbound network |
| **Never use self-hosted runners for public repos** | MANDATORY | Risk of persistent compromise |
| **Require environment approvals for deployments** | RECOMMENDED | GitHub Environments with protection rules |
| **Audit third-party actions before use** | MANDATORY | Review source code; prefer official (e.g., `actions/*`) or verified publishers |

### DS-4: Integrate SAST into DevOps Pipeline -- MUST HAVE

Maps to SDL Practice 7.1. See [Section 7.1](#71-static-analysis-security-testing-sast).

### DS-5: Integrate DAST into DevOps Pipeline -- MUST HAVE

Maps to SDL Practice 7.2. See [Section 7.3](#73-dynamic-analysis-security-testing-dast).

### DS-6: Enforce Security of Workload Throughout DevOps Lifecycle -- MUST HAVE

| Requirement | Implementation | Notes |
|---|---|---|
| Scan artifacts before release | CI pipeline must pass all security checks | Lint + typecheck + test + audit + secret scan |
| Verify build integrity | Use `npm ci` (lockfile-based) | Reproducible builds |
| Automate deployment | GitHub Actions for store submission | Reduces human error |
| Immutable artifacts | Build once, deploy the same artifact | Hash verification between build and publish |
| Node version pinning | `.nvmrc` + `engines` field in package.json | Exact Node LTS version |

### DS-7: Enable Logging and Monitoring in DevOps -- SHOULD HAVE

| Requirement | Implementation | Notes |
|---|---|---|
| CI/CD audit logging | GitHub Actions audit log (org-level) | Monitor for unauthorized workflow changes |
| Workflow run history | GitHub Actions run logs | Retained per GitHub policy |
| Alerting on failures | GitHub Actions notifications + Slack/email | Notify on security check failures |

---

## Browser Extension Specific Security

### Manifest V3 Security Checklist

| Item | Status | Notes |
|---|---|---|
| Use Manifest V3 (not V2) | MANDATORY | V2 is deprecated and less secure |
| Minimal `permissions` array | MANDATORY | Only request what you need |
| Use `optional_permissions` for non-essential | MANDATORY | User grants on demand |
| Restrict `host_permissions` | MANDATORY | Narrowest match patterns possible |
| Set strict CSP for extension pages | MANDATORY | No eval, no inline, no remote scripts |
| Restrict `web_accessible_resources` with `matches` | MANDATORY | Prevent cross-origin resource access |
| Validate all `chrome.runtime.onMessage` inputs | MANDATORY | Treat all messages as untrusted |
| Use `chrome.runtime.id` to verify message sender | MANDATORY | Prevent message spoofing |
| Sanitize any HTML rendered in extension pages | MANDATORY | Use DOM APIs, not innerHTML |
| No string-based `executeScript` | MANDATORY (MV3 enforced) | MV3 only allows function references |
| Document permission justification | MANDATORY | `docs/security/permissions-justification.md` |

### Content Script Security Patterns

```typescript
// CORRECT: Validate message origin
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Verify sender is our own extension
  if (sender.id !== chrome.runtime.id) {
    return; // Reject messages from other extensions
  }

  // Validate message structure with type narrowing
  if (!isValidMessage(message)) {
    return; // Reject malformed messages
  }

  // Process message...
});

// CORRECT: Never use innerHTML with untrusted content
function renderData(data: string): void {
  const el = document.createElement('span');
  el.textContent = data; // textContent is safe; innerHTML is not
  container.appendChild(el);
}

// CORRECT: Specific postMessage target origin
window.postMessage(data, 'https://specific-domain.com');
// NEVER: window.postMessage(data, '*');
```

---

## Implementation Summary & Priority Matrix

### Phase 1: Immediate (Before First Commit)

| Action | Category | SDL Reference |
|---|---|---|
| Enable TypeScript strict mode | Language Safety | Practice 2 |
| Install `@microsoft/eslint-plugin-sdl` | SAST | Practice 7.1 |
| Install `eslint-plugin-security` | SAST | Practice 7.1 |
| Install `eslint-plugin-no-secrets` | Secret Scanning | Practice 7.1, DS-4 |
| Configure `.gitignore` for secrets | Secret Prevention | Practice 6 |
| Set up `package-lock.json` | Supply Chain | Practice 5 |
| Create `SECURITY.md` | Governance | Practice 1, 9 |
| Configure Manifest V3 with strict CSP | Platform Security | Practice 8 |
| Minimize extension permissions | Platform Security | Practice 8 |

### Phase 2: Repository Setup (Before First PR)

| Action | Category | SDL Reference |
|---|---|---|
| Enable GitHub branch protection on `main` | Environment Security | Practice 6, DS-3 |
| Require PR reviews (minimum 1) | Environment Security | Practice 6.2 |
| Set up `.github/CODEOWNERS` | Environment Security | Practice 6 |
| Enable GitHub Secret Scanning | Secret Scanning | DS-4 |
| Enable GitHub Push Protection | Secret Scanning | DS-4 |
| Configure Dependabot for npm | Supply Chain | Practice 5, DS-2 |
| Install Socket.dev GitHub App | Supply Chain | Practice 5, DS-2 |
| Enable required status checks (lint, test, typecheck) | CI Gating | DS-4, DS-6 |

### Phase 3: CI Pipeline (First Workflow)

| Action | Category | SDL Reference |
|---|---|---|
| Create CI workflow with security checks | DevOps Security | DS-4, DS-6 |
| Pin all GitHub Actions to SHA | Supply Chain | DS-3 |
| Set `permissions: read-all` default | Least Privilege | DS-3 |
| Add `npm audit --audit-level=high` step | SCA | Practice 5, 7.5 |
| Add `dependency-review-action` | Supply Chain | DS-2 |
| Add ESLint security scan step | SAST | DS-4 |
| Add TypeScript type-check step | SAST | Practice 2 |
| Use `npm ci` (not `npm install`) | Build Integrity | Practice 5, DS-6 |

### Phase 4: Enhanced Security (Ongoing)

| Action | Category | SDL Reference |
|---|---|---|
| Conduct initial threat model | Threat Modeling | Practice 3, DS-1 |
| Set up CodeQL analysis (if GitHub Advanced Security available) | SAST | DS-4 |
| Generate SBOM per release | Supply Chain | Practice 5.3 |
| Set up artifact attestation | Supply Chain | Practice 5.4 |
| Configure pre-commit hooks (gitleaks) | Secret Scanning | Practice 7 |
| Implement E2E security tests | DAST | DS-5 |
| Establish security review cadence | Governance | Practice 1 |
| Review and update threat model | Threat Modeling | Practice 3 |

---

## CI Workflow Template

```yaml
name: Security CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'  # Weekly Monday scan

permissions:
  contents: read

jobs:
  security-checks:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write  # For CodeQL upload
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

      - uses: actions/setup-node@1d0ff469b7ec7b3cb9d8673fde0c81c44821de2a # v4.2.0
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies (locked)
        run: npm ci

      - name: TypeScript type check
        run: npx tsc --noEmit

      - name: ESLint security scan
        run: npx eslint . --max-warnings 0

      - name: Run tests
        run: npm test

      - name: Audit dependencies
        run: npm audit --audit-level=high

  dependency-review:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
      - uses: actions/dependency-review-action@<pinned-sha>
        with:
          fail-on-severity: high
```

---

## Automated Pre-merge Checks Summary

These checks MUST pass before any code merges to `main`:

| Check | Tool | Blocks Merge |
|---|---|---|
| TypeScript strict compilation | `tsc --noEmit` | YES |
| ESLint (all rules, zero warnings) | `eslint --max-warnings 0` | YES |
| Security linting | `@microsoft/eslint-plugin-sdl` + `eslint-plugin-security` | YES |
| Secret detection | `eslint-plugin-no-secrets` | YES |
| Unit tests pass | `vitest` or `jest` | YES |
| Build succeeds | `vite build` or equivalent | YES |
| Dependency audit | `npm audit --audit-level=high` | YES |
| Secret scanning | GitHub push protection | YES (pre-push) |
| CodeQL analysis | GitHub CodeQL | YES (on PRs to main, if available) |
| Dependency review | `actions/dependency-review-action` | YES (on PRs) |
| Formatting | `prettier --check` | YES |

### Pre-commit Hooks (local enforcement)

```
husky + lint-staged:
  *.ts, *.tsx  -> eslint --fix + prettier --write
  *.json       -> prettier --write
  *            -> secret detection (no-secrets check)
```

### Pre-push Hooks

```
husky:
  tsc --noEmit (full typecheck)
  npm audit --audit-level=high
```

---

## Compliance Mapping

| SDL Control | NIST 800-53 | PCI-DSS v3.2.1 | CIS v8 | Description |
|---|---|---|---|---|
| DS-1 Threat Model | SA-15 | 6.5, 12.2 | 16.10, 16.14 | Threat modeling with STRIDE |
| DS-2 Supply Chain | SA-12, SA-15 | 6.3, 6.5 | 16.4, 16.6, 16.11 | SBOM, dependency scanning, vulnerability management |
| DS-3 Infrastructure | CM-2, CM-6, AC-2, AC-3, AC-6 | 2.2, 6.3, 7.1 | 16.7 | Secrets management, branch protection, least privilege |
| DS-4 SAST | SA-11 | 6.3, 6.5 | 16.12 | Static analysis, CodeQL, credential scanning |
| DS-5 DAST | SA-11 | 6.3, 6.5 | 16.12 | Dynamic testing, runtime security validation |
| DS-6 Workload | CM-2, CM-6, AC-2, AC-3, AC-6 | 6.1, 6.2, 6.3 | 7.5, 7.6, 7.7, 16.1, 16.7 | End-to-end artifact security |
| DS-7 Monitoring | AU-3, AU-6, AU-12, SI-4 | 10.1, 10.2, 10.3, 10.6 | 8.2, 8.5, 8.9, 8.11 | Audit logging, anomaly detection |

---

## References

- [Microsoft Security Development Lifecycle Practices](https://www.microsoft.com/en-us/securityengineering/sdl/practices)
- [Microsoft SDL - Compliance Documentation](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle)
- [Microsoft Cloud Security Benchmark - DevOps Security](https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security)
- [Microsoft eslint-plugin-sdl](https://github.com/microsoft/eslint-plugin-sdl) -- 26 rules for SDL compliance
- [GitHub Security Hardening for Actions](https://docs.github.com/en/actions/reference/security/secure-use)
- [Chrome Extension Manifest V3 Security](https://developer.chrome.com/docs/extensions/develop/migrate/improve-security)
- [Chrome Extension CSP](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy)
- [Socket.dev - npm Supply Chain Security](https://socket.dev)
- [Microsoft SBOM Tool](https://github.com/microsoft/sbom-tool)
- [GitHub Artifact Attestations](https://docs.github.com/actions/security-guides/using-artifact-attestations-to-establish-provenance-for-builds)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions SHA Pinning Guide](https://www.stepsecurity.io/blog/pinning-github-actions-for-enhanced-security-a-complete-guide)
- [eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security)
- [eslint-plugin-no-secrets](https://github.com/nickdeis/eslint-plugin-no-secrets)
- [Microsoft DevSkim](https://github.com/Microsoft/DevSkim)
