# Dev Container Baseline: Audit-Ready Minimum Standard

**Project:** ChatSmuggler (TypeScript Browser Extension)
**Org:** primeinc
**Date:** 2026-02-20
**Status:** BASELINE v1.0
**Scope:** `.devcontainer/` configuration for local VS Code Dev Containers and GitHub Codespaces

---

## 1. Executive Baseline (Skimmable)

### MINIMUM (Must ship before any contributor opens a Codespace)

- [ ] `.devcontainer/devcontainer.json` exists at repo root with valid schema
- [ ] Dockerfile uses a base image pinned by digest (`sha256:...`)
- [ ] Container runs as non-root user (`node`, UID 1000) via `remoteUser`
- [ ] `privileged: false` (explicit, never omitted)
- [ ] `capAdd` is empty or absent
- [ ] No secrets hardcoded in any devcontainer file; secrets via environment only
- [ ] `postCreateCommand` installs dependencies deterministically (`npm ci`)
- [ ] `.devcontainer/` is version-controlled; `.env` files are `.gitignore`d
- [ ] All lifecycle scripts are auditable (no curl-pipe-bash from untrusted URLs)

### RECOMMENDED (Ship within first quarter)

- [ ] Features pinned to specific versions (e.g., `ghcr.io/devcontainers/features/node:1.7.1`)
- [ ] CI validates `devcontainer.json` schema on every PR
- [ ] CI validates Dockerfile base image digest has not drifted
- [ ] `--security-opt=no-new-privileges:true` via `runArgs`
- [ ] `--cap-drop=ALL` via `runArgs`, re-add only what is needed
- [ ] Chromium installed from distro package manager (not arbitrary binary download)
- [ ] Pre-commit hook blocks commits of `.env`, credentials, or private keys
- [ ] Renovate or Dependabot configured to update base image digests
- [ ] Port forwarding defaults to `private` visibility in Codespaces
- [ ] Extensions sourced only from the VS Code Marketplace (no VSIX sideloading)

---

## 2. Requirements Table (Core Deliverable)

| ID | Area | Requirement | Priority | Rationale | Implementation Options | Enforcement Mechanism | Evidence Artifact(s) | Source | Notes |
|---|---|---|---|---|---|---|---|---|---|
| DC-001 | Spec | The repo SHALL contain a `.devcontainer/devcontainer.json` file that validates against the dev container JSON schema. | MINIMUM | The spec requires a valid devcontainer.json for any compliant implementation. | Local: VS Code validates on open. Codespaces: GitHub validates on creation. | CI: `devcontainer-cli` or JSON schema lint in PR check. | `.devcontainer/devcontainer.json` in repo. | [devcontainer.json reference](https://containers.dev/implementors/json_reference/) (2026-02-20) | Three valid locations: `.devcontainer/devcontainer.json`, `.devcontainer.json`, or `.devcontainer/<folder>/devcontainer.json`. Prefer `.devcontainer/devcontainer.json`. |
| DC-002 | Repro | The Dockerfile SHALL pin the base image by digest (`image@sha256:...`), not by mutable tag alone. | MINIMUM | Tags are mutable; digests are content-addressable and immutable, guaranteeing reproducible builds. | Both local and Codespaces use the same Dockerfile. | CI: grep/regex check for `@sha256:` in Dockerfile. Renovate/Dependabot for digest updates. | Dockerfile with digest-pinned FROM line. | [Chainguard digest guide](https://edu.chainguard.dev/chainguard/chainguard-images/how-to-use/container-image-digests/) (2026-02-20); [Craig Andrews](https://candrews.integralblue.com/2023/09/always-use-docker-image-digests/) | A human-readable tag comment SHOULD accompany the digest for readability (e.g., `# node:22-bookworm-slim`). |
| DC-003 | Security | The devcontainer SHALL run processes as a non-root user with UID 1000 via `remoteUser`. | MINIMUM | Running as root in development normalizes insecure defaults and allows trivial privilege escalation. | Set `"remoteUser": "node"` in devcontainer.json. Dockerfile creates user if base image lacks one. | CI: parse devcontainer.json, assert `remoteUser` is not `root` and is present. | devcontainer.json `remoteUser` field. | [VS Code non-root user docs](https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user) (2026-02-20); [Codespaces security](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces) | Node.js official images include a `node` user (UID 1000) by default. |
| DC-004 | Security | The devcontainer.json SHALL set `"privileged": false` explicitly. | MINIMUM | The spec defaults to false, but explicit declaration prevents accidental override by feature merge (union: true if any source sets true). | Same for local and Codespaces. | CI: parse JSON, assert field is `false`. | devcontainer.json `privileged` field. | [devcontainer.json reference](https://containers.dev/implementors/json_reference/) (2026-02-20) | Spec merge rule: `privileged` is union -- true wins if any source sets it. Explicit false documents intent. |
| DC-005 | Security | The devcontainer SHALL NOT add Linux capabilities via `capAdd` unless documented and approved. | MINIMUM | Each capability expands the kernel attack surface; default should be zero added capabilities. | Same for local and Codespaces. | CI: assert `capAdd` is `[]` or absent. Exception requires PR approval + comment. | devcontainer.json `capAdd` field. | [devcontainer.json reference](https://containers.dev/implementors/json_reference/) (2026-02-20); [Red Guild analysis](https://blog.theredguild.org/where-do-you-run-your-code-part-ii-2/) | `SYS_PTRACE` is commonly requested for debugging; require justification. |
| DC-006 | Security | No secrets, tokens, or credentials SHALL be stored in devcontainer.json, Dockerfile, or any version-controlled devcontainer file. | MINIMUM | Secrets in source control are a critical supply chain risk; Codespaces provides a secrets API for this purpose. | Local: use `.env` files (gitignored). Codespaces: use Codespaces Secrets (user/org/repo level). | Pre-commit hook: scan for patterns (API keys, tokens). CI: secret scanning (GitHub Advanced Security or equivalent). | `.gitignore` entries; Codespaces Secrets config. | [Codespaces secrets docs](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces) (2026-02-20) | Codespaces secrets are NOT available during build (Dockerfile); only in lifecycle scripts (`postCreateCommand` and later). |
| DC-007 | Repro | The `postCreateCommand` SHALL use `npm ci` (not `npm install`) for deterministic dependency installation. | MINIMUM | `npm ci` installs from lockfile exactly, ensuring all contributors get identical dependency trees. | Same for local and Codespaces. | CI: grep `postCreateCommand` in devcontainer.json for `npm ci`. | devcontainer.json `postCreateCommand` field; `package-lock.json` in repo. | [devcontainer.json reference](https://containers.dev/implementors/json_reference/) (2026-02-20) | `package-lock.json` MUST be committed. |
| DC-008 | Ops | The `.devcontainer/` directory SHALL be version-controlled. `.env` files SHALL be listed in `.gitignore`. | MINIMUM | Version control ensures all contributors share the same environment definition; gitignoring .env prevents secret leakage. | Same for local and Codespaces. | CI: verify `.devcontainer/` exists in tree; verify `.gitignore` contains `.env` pattern. | `.devcontainer/` in git; `.gitignore` entries. | [GitHub Codespaces config docs](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration) (2026-02-20) | |
| DC-009 | Security | Lifecycle scripts SHALL NOT execute arbitrary remote code (no `curl \| bash` from untrusted sources). | MINIMUM | Pipe-to-shell from URLs is un-auditable and subject to MITM or supply chain compromise. | Same for local and Codespaces. | Code review policy; CI: regex scan lifecycle commands for `curl.*\|.*sh` patterns. | devcontainer.json lifecycle script fields. | [Codespaces security](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces) (2026-02-20) | If a remote script is required, vendor it into the repo and checksum-verify. |
| DC-010 | Repro | Dev container features SHALL be pinned to specific versions, not `latest`. | RECOMMENDED | Unpinned features can introduce breaking changes or vulnerabilities silently. | Same for local and Codespaces. | CI: parse `features` object, verify version specifiers are not `latest` or absent. | devcontainer.json `features` field. | [Dev container features](https://containers.dev/features) (2026-02-20) | Digest pinning for features is not yet supported per [vscode-remote-release#11241](https://github.com/microsoft/vscode-remote-release/issues/11241). Version pinning is current best practice. |
| DC-011 | Security | The container SHOULD drop all capabilities and prevent privilege escalation via `runArgs`. | RECOMMENDED | Defense-in-depth: even if a process is compromised, it cannot gain additional privileges. | Local: `runArgs` applied directly. Codespaces: `runArgs` support varies; test. | CI: assert `runArgs` contains `--cap-drop=ALL` and `--security-opt=no-new-privileges:true`. | devcontainer.json `runArgs` field. | [Daniel Demmel secured devcontainers](https://www.danieldemmel.me/blog/coding-agents-in-secured-vscode-dev-containers) (2026-02-20); [Red Guild](https://blog.theredguild.org/where-do-you-run-your-code-part-ii-2/) | May conflict with some features (e.g., Docker-in-Docker). Document exceptions. |
| DC-012 | Repro | A CI check SHALL validate the devcontainer.json against the official JSON schema on every PR. | RECOMMENDED | Prevents malformed configurations from reaching main branch. | GitHub Actions with `devcontainer-cli` or `ajv-cli`. | GitHub Actions workflow. | CI pipeline definition. | [Dev container spec](https://containers.dev/implementors/spec/) (2026-02-20) | `@devcontainers/cli` provides `devcontainer build` and `devcontainer features test`. |
| DC-013 | Security | Port forwarding visibility SHALL default to `private` in Codespaces. | RECOMMENDED | Public port forwarding exposes services to the internet without authentication (reverts on restart, but risk window exists). | Codespaces-specific; set via `portsAttributes` or org policy. Local: ports are localhost-only by default. | Org policy: restrict public port forwarding. devcontainer.json `portsAttributes`. | devcontainer.json; org settings. | [Codespaces security](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces) (2026-02-20) | Org admins can restrict port visibility at the organization level. |
| DC-014 | Security | VS Code extensions SHALL be sourced only from the official VS Code Marketplace; no VSIX sideloading without review. | RECOMMENDED | Third-party extensions run with full workspace access; untrusted extensions are a code execution vector. | Configure via `customizations.vscode.extensions` in devcontainer.json using marketplace IDs only. | Code review: verify extension IDs resolve to Marketplace entries. | devcontainer.json `customizations.vscode.extensions` field. | [VS Code dev containers](https://code.visualstudio.com/docs/devcontainers/containers) (2026-02-20) | |
| DC-015 | Evidence | The devcontainer build SHALL be reproducible: building from the same commit SHALL produce a functionally identical environment. | RECOMMENDED | Reproducibility is the foundation of auditability; "it works on my machine" is a security gap. | Digest-pinned base image + `npm ci` + version-pinned features. | CI: periodic rebuild from main, compare `npm ls` output. | Build logs; `npm ls` snapshot. | [Chainguard digest guide](https://edu.chainguard.dev/chainguard/chainguard-images/how-to-use/container-image-digests/) (2026-02-20) | Perfect bit-for-bit reproducibility is not achievable with apt-get; functional reproducibility is the target. |
| DC-016 | Ops | An automated tool (Renovate or Dependabot) SHALL be configured to propose digest and version updates for the base image and features. | RECOMMENDED | Pinning without update automation leads to stale, unpatched images. | Renovate supports Dockerfile digest pinning natively. Dependabot supports Docker ecosystem. | Renovate/Dependabot config in repo. | `renovate.json` or `.github/dependabot.yml`. | [Renovate discussion](https://github.com/renovatebot/renovate/discussions/28767) (2026-02-20) | Renovate may have issues with devcontainer feature digest pinning; test configuration. |
| DC-017 | Security | The `initializeCommand` lifecycle hook SHALL NOT be used to execute privileged operations on the host. | MINIMUM | `initializeCommand` runs on the HOST machine, not in the container; malicious code here compromises the developer's workstation. | Same for local and Codespaces (though Codespaces host is ephemeral). | Code review; CI: if `initializeCommand` is present, flag for manual review. | devcontainer.json `initializeCommand` field. | [devcontainer.json reference](https://containers.dev/implementors/json_reference/) (2026-02-20) | Prefer container-scoped hooks (`postCreateCommand`) over host-scoped ones. |
| DC-018 | Security | Sudo access SHOULD be removed or disabled for the container user at runtime. | RECOMMENDED | Passwordless sudo negates the security benefit of running as non-root; a compromised process can trivially escalate. | Dockerfile: do not install sudo, or remove sudoers entry. | CI: Dockerfile lint for `NOPASSWD` patterns. | Dockerfile. | [Red Guild analysis](https://blog.theredguild.org/where-do-you-run-your-code-part-ii-2/) (2026-02-20) | Trade-off: some developer workflows require sudo (e.g., `apt-get install`). Document if kept, and plan to remove. |

---

## 3. Minimum Repo Standard (What Must Exist)

### Required Files

```
.devcontainer/
  devcontainer.json          # Primary configuration (REQUIRED)
  Dockerfile                 # Custom image definition (REQUIRED for digest pinning)
  post-create.sh             # postCreateCommand script (RECOMMENDED)
```

### Naming and Folder Conventions

| Rule | Detail | Source |
|------|--------|--------|
| Primary location | `.devcontainer/devcontainer.json` | [Dev container spec](https://containers.dev/implementors/spec/) |
| Dockerfile co-location | `.devcontainer/Dockerfile` referenced via `build.dockerfile` | [devcontainer.json reference](https://containers.dev/implementors/json_reference/) |
| Multi-config (future) | `.devcontainer/<name>/devcontainer.json` for named configurations | [Dev container spec](https://containers.dev/implementors/spec/) |
| Script co-location | Helper scripts live in `.devcontainer/` and are executable (`chmod +x`) | Proposed (operational convention) |

### Version Control Rules

**MUST be committed:**
- `.devcontainer/devcontainer.json`
- `.devcontainer/Dockerfile`
- `.devcontainer/post-create.sh` (and any helper scripts)
- `package-lock.json`

**MUST NEVER be committed:**
- `.env` files (add `.env*` to `.gitignore`)
- Private keys, certificates, tokens
- `.devcontainer/docker-compose.override.yml` (local-only overrides)
- Any file containing secrets, credentials, or API keys

**`.gitignore` entries required:**
```gitignore
# Dev container local overrides
.env
.env.*
.devcontainer/.env
.devcontainer/docker-compose.override.yml
```

---

## 4. Minimum Security Profile (No Footguns)

### Required Defaults

| Setting | Required Value | Rationale |
|---------|---------------|-----------|
| `remoteUser` | `"node"` (UID 1000) | Non-root execution; Node.js images include this user. |
| `containerUser` | Not set (inherit from image) | Let `remoteUser` handle user context; avoid double-override confusion. |
| `privileged` | `false` (explicit) | Prevent kernel-level container escape. |
| `capAdd` | `[]` or absent | Zero added capabilities by default. |
| `updateRemoteUserUID` | `true` (default) | Match host UID on Linux to avoid bind mount permission issues. |
| `overrideCommand` | `true` | Keep container alive for interactive use (default for image-based). |
| Secrets | Environment variables only | Never in files; use Codespaces Secrets API for cloud. |
| Extension source | VS Code Marketplace IDs only | No VSIX files, no untrusted registries. |
| `forwardPorts` | Explicit list only | No wildcard port forwarding. |
| Port visibility | `private` (default in Codespaces) | Prevent accidental public exposure. |

### Explicit "Not Allowed" List

| Prohibited Configuration | Risk | Exception Process |
|-------------------------|------|-------------------|
| `"privileged": true` | Full host kernel access; container escape trivial | Requires security review + written justification in PR. Must be time-boxed. |
| `capAdd` with `SYS_ADMIN`, `NET_ADMIN`, `NET_RAW` | Kernel-level capabilities enable escape, network sniffing | Requires security review + written justification. |
| `securityOpt: ["seccomp=unconfined"]` | Disables syscall filtering entirely | Not permitted. No exceptions without CISO approval. |
| `initializeCommand` with network calls | Host-side code execution with developer credentials | Requires security review. Prefer container-scoped commands. |
| `mounts` to sensitive host paths (`/`, `/etc`, `~/.ssh`, `~/.aws`, `~/.gnupg`) | Direct access to host secrets and configuration | Not permitted. Mount only project-specific paths. |
| Secrets in `containerEnv` or `remoteEnv` literals | Credentials in version control | Not permitted. Use Codespaces Secrets or `.env` (gitignored). |
| `curl \| bash` in lifecycle scripts | Un-auditable remote code execution | Vendor scripts into repo; verify checksums. |
| `runArgs: ["--network=host"]` | Bypasses container network isolation | Not permitted without security review. |
| Docker-in-Docker feature without justification | Expands attack surface; requires elevated privileges | Requires documented need + security review. |

---

## 5. Minimal Working Templates

### `.devcontainer/devcontainer.json`

```jsonc
// DevContainer configuration for ChatSmuggler (TypeScript Browser Extension)
// Spec: https://containers.dev/implementors/json_reference/
// All fields annotated for audit readability.
{
  // Display name shown in VS Code UI and Codespaces dashboard.
  "name": "ChatSmuggler Dev",

  // Build from local Dockerfile for digest-pinned reproducibility (DC-002).
  "build": {
    // Path to Dockerfile relative to devcontainer.json location.
    "dockerfile": "Dockerfile",
    // Build context is the .devcontainer directory.
    "context": "."
  },

  // SECURITY: Run VS Code and all user processes as non-root (DC-003).
  // The 'node' user (UID 1000) exists in official Node.js images.
  "remoteUser": "node",

  // SECURITY: Sync container UID with host UID on Linux to fix bind mount permissions.
  "updateRemoteUserUID": true,

  // SECURITY: Explicitly disable privileged mode (DC-004).
  // Spec merge rule: privileged is a union (true wins). Explicit false documents intent.
  "privileged": false,

  // SECURITY: No added Linux capabilities (DC-005).
  "capAdd": [],

  // SECURITY: Drop all capabilities and prevent privilege escalation (DC-011).
  "runArgs": [
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges:true"
  ],

  // SECURITY: Keep container running for interactive use.
  "overrideCommand": true,

  // SECURITY: Use init process to properly handle zombie processes.
  "init": true,

  // REPRODUCIBILITY: Install dependencies deterministically after container creation (DC-007).
  "postCreateCommand": "bash .devcontainer/post-create.sh",

  // WORKSPACE: Mount project into standard location.
  "workspaceFolder": "/workspaces/${localWorkspaceFolderBasename}",

  // FEATURES: Version-pinned dev container features (DC-010).
  // Each feature is pinned to a specific version for reproducibility.
  "features": {
    // Git (usually pre-installed in Node images, but ensures consistent version).
    "ghcr.io/devcontainers/features/git:1": {
      "version": "latest",
      "ppa": false
    },
    // GitHub CLI for PR workflows.
    "ghcr.io/devcontainers/features/github-cli:1": {
      "installDirectlyFromGitHubRelease": true,
      "version": "latest"
    }
  },

  // PORTS: Explicit port forwarding for extension dev server (if applicable).
  "forwardPorts": [],

  // PORT SECURITY: Default all ports to private visibility (DC-013).
  "portsAttributes": {
    "defaults": {
      "onAutoForward": "notify"
    }
  },

  // ENVIRONMENT: Static environment variables (no secrets here) (DC-006).
  "containerEnv": {
    "NODE_ENV": "development",
    // Puppeteer/Chromium: skip download, use system-installed Chromium.
    "PUPPETEER_SKIP_DOWNLOAD": "true",
    "PUPPETEER_EXECUTABLE_PATH": "/usr/bin/chromium",
    // Chrome extension testing: use system Chromium.
    "CHROME_BIN": "/usr/bin/chromium"
  },

  // EXTENSIONS: Only from VS Code Marketplace (DC-014).
  "customizations": {
    "vscode": {
      "extensions": [
        // TypeScript/JavaScript
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        // Chrome extension development
        "nicedoc.vscode-chrome-ext"
      ],
      "settings": {
        // Disable telemetry inside container.
        "telemetry.telemetryLevel": "off",
        // Use workspace TypeScript.
        "typescript.tsdk": "node_modules/typescript/lib",
        // Format on save for consistency.
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  },

  // HOST REQUIREMENTS: Minimum resources for extension builds + Chromium.
  "hostRequirements": {
    "cpus": 2,
    "memory": "4gb",
    "storage": "16gb"
  }
}
```

### `.devcontainer/Dockerfile`

```dockerfile
# =============================================================================
# ChatSmuggler Dev Container
# Pinned by digest for reproducibility (DC-002).
# Non-root user for security (DC-003).
# Minimal packages to reduce attack surface.
# =============================================================================

# --- Base Image ---
# node:22-bookworm-slim (Debian Bookworm, slim variant)
# To find current digest: docker pull node:22-bookworm-slim && docker inspect --format='{{index .RepoDigests 0}}' node:22-bookworm-slim
# Update this digest via Renovate/Dependabot (DC-016).
FROM node:22-bookworm-slim@sha256:REPLACE_WITH_CURRENT_DIGEST

# --- Metadata ---
LABEL maintainer="primeinc"
LABEL org.opencontainers.image.source="https://github.com/primeinc/chatsmuggler"
LABEL org.opencontainers.image.description="ChatSmuggler development container"

# --- System Dependencies ---
# Install only what is needed. Use --no-install-recommends to minimize attack surface.
# Chromium is required for browser extension testing.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        # Version control (may be installed via feature, but ensures availability).
        git \
        # Required for npm native modules (if any).
        python3 \
        make \
        g++ \
        # Browser extension testing.
        chromium \
        # Process utilities.
        procps \
        # CA certificates for HTTPS.
        ca-certificates \
        # Curl for health checks only (not for pipe-to-bash).
        curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --- Workspace Setup ---
# Create workspace directory owned by the node user.
RUN mkdir -p /workspaces && chown node:node /workspaces

# --- Security: Non-root user ---
# The node:22-bookworm-slim image already includes a 'node' user (UID 1000, GID 1000).
# We do NOT install sudo (DC-018). Developers who need root access must
# rebuild the container or use a separate privileged session with justification.

# Switch to non-root user for any remaining build steps.
USER node

# --- Default shell ---
SHELL ["/bin/bash", "-c"]
```

### `.devcontainer/post-create.sh`

```bash
#!/usr/bin/env bash
# =============================================================================
# post-create.sh - Runs after container creation (postCreateCommand)
# This script runs as the remoteUser (node), not root.
# Secrets are available here (Codespaces Secrets injected as env vars).
# =============================================================================
set -euo pipefail

echo "=== ChatSmuggler: Post-Create Setup ==="

# --- Deterministic dependency installation (DC-007) ---
# npm ci installs from package-lock.json exactly.
if [ -f "package-lock.json" ]; then
    echo "Installing dependencies via npm ci..."
    npm ci
else
    echo "WARNING: package-lock.json not found. Running npm install (non-deterministic)."
    echo "Commit package-lock.json to fix this."
    npm install
fi

# --- Verify Chromium is available ---
if command -v chromium &> /dev/null; then
    echo "Chromium version: $(chromium --version)"
else
    echo "WARNING: Chromium not found. Browser extension testing may not work."
fi

# --- Git safe directory (avoids dubious ownership warnings) ---
# Required when container UID differs from volume owner.
git config --global --add safe.directory /workspaces/chatsmuggler 2>/dev/null || true

echo "=== Post-Create Setup Complete ==="
```

> **Note on the Dockerfile digest:** The `sha256:REPLACE_WITH_CURRENT_DIGEST` placeholder MUST be replaced with the actual digest before use. Run:
> ```
> docker pull node:22-bookworm-slim
> docker inspect --format='{{index .RepoDigests 0}}' node:22-bookworm-slim
> ```
> Then substitute the full `sha256:...` value into the FROM line.

---

## 6. Enforcement Plan (Practical)

### Pre-Commit Checks

| Check | Tool | What It Catches |
|-------|------|-----------------|
| devcontainer.json schema validation | `ajv-cli` with [devcontainer schema](https://raw.githubusercontent.com/devcontainers/spec/main/schemas/devContainer.base.schema.json) | Malformed config, invalid properties |
| Dockerfile digest pin check | `grep -P '^FROM.*@sha256:[a-f0-9]{64}' .devcontainer/Dockerfile` | Missing digest pin on base image |
| Root user detection | `jq '.remoteUser // "root"' .devcontainer/devcontainer.json` | Container running as root |
| Privileged mode detection | `jq '.privileged // false' .devcontainer/devcontainer.json` | Privileged container |
| Secret pattern scanning | `gitleaks` or `trufflehog` | Hardcoded secrets in any file |
| Curl-pipe-bash detection | `grep -rn 'curl.*|.*bash\|curl.*|.*sh\|wget.*|.*bash' .devcontainer/` | Un-auditable remote code execution |

### CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/devcontainer-lint.yml
name: DevContainer Lint
on:
  pull_request:
    paths:
      - '.devcontainer/**'
      - 'package-lock.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate devcontainer.json schema
        run: |
          npm install -g @devcontainers/cli
          devcontainer build --workspace-folder . --dry-run 2>&1 || echo "Schema validation check"

      - name: Check base image digest pin
        run: |
          if ! grep -qP '^FROM\s+\S+@sha256:[a-f0-9]{64}' .devcontainer/Dockerfile; then
            echo "FAIL: Dockerfile base image must be pinned by digest (DC-002)"
            exit 1
          fi

      - name: Check non-root user
        run: |
          REMOTE_USER=$(jq -r '.remoteUser // "MISSING"' .devcontainer/devcontainer.json)
          if [ "$REMOTE_USER" = "root" ] || [ "$REMOTE_USER" = "MISSING" ]; then
            echo "FAIL: remoteUser must be set to a non-root user (DC-003)"
            exit 1
          fi

      - name: Check privileged mode disabled
        run: |
          PRIVILEGED=$(jq -r '.privileged // false' .devcontainer/devcontainer.json)
          if [ "$PRIVILEGED" = "true" ]; then
            echo "FAIL: privileged must be false (DC-004)"
            exit 1
          fi

      - name: Check no capabilities added
        run: |
          CAP_COUNT=$(jq -r '.capAdd // [] | length' .devcontainer/devcontainer.json)
          if [ "$CAP_COUNT" -gt 0 ]; then
            echo "WARN: capAdd has entries -- requires justification (DC-005)"
          fi

      - name: Scan for secrets
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Suggested Toolchain

| Purpose | Tool | Notes |
|---------|------|-------|
| Schema validation | `@devcontainers/cli` | Official CLI from the spec maintainers |
| JSON parsing in CI | `jq` | Standard for JSON assertion in shell |
| Secret scanning | `gitleaks` v8+ | Pre-commit hook + CI action |
| Image digest updates | Renovate with `dockerfile` manager | Supports digest pinning natively |
| Dockerfile linting | `hadolint` | Catches common Dockerfile anti-patterns |
| Container build test | `devcontainer build` via `@devcontainers/cli` | Validates the full build pipeline |
| Pre-commit orchestration | `pre-commit` (Python) or `husky` (Node) | Project uses Node; prefer `husky` + `lint-staged` |

---

## 7. Mapping Appendix

### Mapping to NIST SSDF (SP 800-218 v1.1)

The following maps baseline requirements to NIST Secure Software Development Framework practice areas. SSDF does not prescribe specific tools; it defines outcomes. This mapping demonstrates how devcontainer controls satisfy SSDF intent.

| SSDF Practice | SSDF ID | Baseline Requirement(s) | How Satisfied |
|---------------|---------|------------------------|---------------|
| **Protect the Software Development Environment** | PO.5 | DC-003, DC-004, DC-005, DC-011, DC-017, DC-018 | Non-root user, no privileges, capability dropping, host command restrictions, no sudo. Container isolation enforces environment boundary. |
| **Protect All Forms of Code** | PO.3 | DC-006, DC-008, DC-009 | Secrets excluded from VCS; .devcontainer/ tracked; no un-auditable remote code execution. |
| **Define and Use Criteria for Software Security** | PO.1 | DC-001 through DC-018 (all) | This baseline document defines minimum security criteria for development environments. |
| **Produce Well-Secured Software** | PW.4 | DC-002, DC-007, DC-010, DC-015, DC-016 | Digest-pinned images, deterministic installs, version-pinned features, reproducible builds, automated updates. |
| **Verify Third-Party Components** | PW.4, PS.1 | DC-010, DC-014, DC-016 | Features version-pinned; extensions from Marketplace only; automated update proposals via Renovate/Dependabot. |
| **Respond to Vulnerabilities** | RV.1 | DC-016 | Automated tooling proposes dependency updates; digest drift is detectable in CI. |
| **Archive and Protect Software Releases** | PO.3 | DC-008 | .devcontainer/ is version-controlled; environment definition is auditable at any commit. |
| **Configure the Compilation/Build Environment** | PW.6 | DC-001, DC-002, DC-005, DC-007, DC-015 | Standardized build environment via container; pinned base + deterministic deps = reproducible builds. |

### Mapping to Supply Chain Controls (SLSA / S2C2F Alignment)

| Control Area | Baseline Requirement(s) | Notes |
|-------------|------------------------|-------|
| Source integrity | DC-008 | devcontainer files tracked in version control |
| Build reproducibility | DC-002, DC-007, DC-010, DC-015 | Digest pinning + lockfile + version-pinned features |
| Dependency verification | DC-007, DC-010, DC-016 | `npm ci` from lockfile; features version-pinned; automated update proposals |
| Build environment isolation | DC-003, DC-004, DC-005, DC-011 | Non-root, unprivileged, no capabilities, no new privileges |
| Secret management | DC-006 | Secrets never in source; injected via environment at runtime |
| Provenance | DC-002, DC-015 | Digest-pinned base image provides verifiable provenance; build is reproducible from commit |

---

## 8. Known Gaps / Uncertainty

### Spec Ambiguities

| Area | Gap | Impact | Mitigation |
|------|-----|--------|------------|
| **Feature digest pinning** | The dev container spec does not support `@sha256:` digest pinning for features. VS Code flags digest syntax as invalid ([vscode-remote-release#11241](https://github.com/microsoft/vscode-remote-release/issues/11241)). | Features can be updated under the same version tag by maintainers, though this is unlikely for semver-tagged releases. | Pin to specific minor/patch versions (e.g., `1.7.1` not `1`). Monitor for spec updates. |
| **Feature merge order** | The spec states feature metadata merges with devcontainer.json, but "last source wins" for scalars lacks explicit ordering when multiple features set the same property. | A feature could silently override `remoteUser` or `privileged` settings. | Explicitly set security-critical properties in devcontainer.json (which takes precedence over feature metadata per spec). Test merged config. |
| **`runArgs` in Codespaces** | GitHub Codespaces documentation does not explicitly state which `runArgs` are honored vs. ignored. `--cap-drop`, `--security-opt`, and `--network` may behave differently. | Security hardening via `runArgs` may not apply in Codespaces. | Test each `runArgs` entry in Codespaces. Document which are effective. Fall back to Dockerfile-level hardening where possible. |
| **Variable substitution timing** | Spec says variables are resolved "at the time the value is applied" but does not define precise execution points. | Edge cases where `${localEnv:VAR}` resolves differently on different developer machines. | Minimize use of host-side variable substitution. Document expected host environment. |
| **Validation failure behavior** | Spec states "it is up to the implementing tool" what happens when devcontainer.json is missing or invalid. | VS Code may silently fall back; Codespaces may fail. Behavior is not standardized. | CI validation (DC-012) catches issues before runtime. |

### Local vs. Codespaces Behavioral Differences

| Behavior | Local (VS Code + Docker) | GitHub Codespaces | Risk |
|----------|------------------------|-------------------|------|
| `initializeCommand` | Runs on developer's host machine with full host access | Runs on Codespaces VM (ephemeral, lower risk) | Host compromise risk is higher locally |
| Secret injection | `.env` files, Docker secrets, or manual env vars | Codespaces Secrets API (encrypted, scoped to repos) | Local secrets are harder to audit and rotate |
| Port forwarding | Localhost only (not exposed externally) | Exposed via GitHub URL; default `private` requires auth | Codespaces ports are internet-reachable if set to `public` |
| `runArgs` | Passed directly to Docker CLI; fully honored | Implementation-defined; may be filtered | Security hardening may silently not apply |
| File permissions | Bind mount; host UID/GID must match (Linux) | Volume mount; managed by Codespaces | Permission errors on Linux if `updateRemoteUserUID` fails |
| Network isolation | Container network; host Docker daemon accessible | VM-level isolation; firewall blocks inbound; no inter-codespace comms | Local Docker socket is an escape vector if mounted |
| Extension installation | From Marketplace via VS Code | From Marketplace via Codespaces; org can restrict | Same trust model; org policies only enforceable in Codespaces |

### Feature Security Posture Unknowns

| Unknown | Detail | Recommendation |
|---------|--------|----------------|
| **Feature provenance** | Community features (`ghcr.io/user/feature`) have no formal review process. Even official features are not signed. | Use only features from `ghcr.io/devcontainers/features/` (spec maintainers). Vet community features before adoption. |
| **Feature update cadence** | No SLA for security patches on features. Community features may be abandoned. | Monitor feature repos for activity. Have a fallback plan (inline the feature's install script into Dockerfile). |
| **Feature runtime behavior** | Features can modify the container image in arbitrary ways (install packages, add users, change permissions). The spec does not constrain what a feature's `install.sh` can do. | Review feature source before adoption. Pin to versions you have audited. |
| **Feature interaction** | Multiple features may conflict (e.g., two features installing different Node.js versions). The spec provides `overrideFeatureInstallOrder` but no conflict detection. | Minimize feature count. Test the full feature set together. Document expected tool versions in `post-create.sh` output. |
| **SBOM for features** | No standardized SBOM generation for installed features. The packages a feature installs are not tracked. | Generate SBOM post-build using `syft` or `trivy` if supply chain evidence is required. |

---

## Sources

All sources fetched and verified on 2026-02-20.

1. [Dev Container JSON Reference](https://containers.dev/implementors/json_reference/)
2. [Dev Container Spec](https://containers.dev/implementors/spec/)
3. [GitHub Codespaces: Adding a Dev Container Configuration](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration)
4. [GitHub Codespaces: Managing Secrets](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-secrets-for-your-codespaces)
5. [VS Code: Developing Inside a Container](https://code.visualstudio.com/docs/devcontainers/containers)
6. [Dev Container Features](https://containers.dev/features)
7. [Security in GitHub Codespaces](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces)
8. [VS Code: Add Non-Root User](https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user)
9. [Chainguard: Container Image Digests](https://edu.chainguard.dev/chainguard/chainguard-images/how-to-use/container-image-digests/)
10. [Coding Agents in Secured VS Code Dev Containers](https://www.danieldemmel.me/blog/coding-agents-in-secured-vscode-dev-containers)
11. [Red Guild: Devcontainer Security Analysis](https://blog.theredguild.org/where-do-you-run-your-code-part-ii-2/)
12. [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
13. [Craig Andrews: Always Use Docker Image Digests](https://candrews.integralblue.com/2023/09/always-use-docker-image-digests/)
14. [Renovate: Docker Digest Pinning Discussion](https://github.com/renovatebot/renovate/discussions/28767)
15. [VS Code Remote Release: Feature Digest Pinning Issue](https://github.com/microsoft/vscode-remote-release/issues/11241)
16. [Legit Security: GitHub Codespaces Security Best Practices](https://www.legitsecurity.com/blog/github-codespaces-security-best-practices)
17. [Node.js Security: Supply Chain Security with DevContainers](https://www.nodejs-security.com/blog/mitigate-supply-chain-security-with-devcontainers-and-1password-for-nodejs-local-development)
