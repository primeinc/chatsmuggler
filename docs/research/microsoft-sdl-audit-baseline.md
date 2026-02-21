# Microsoft SDL & DevSecOps Audit Baseline for ChatSmuggler

**Document Status:** DRAFT -- Audit-Ready Baseline
**Scope:** TypeScript browser extension (ChatSmuggler) hosted on GitHub
**Prepared:** 2026-02-20
**Classification:** Internal -- Security & Compliance
**Methodology:** Requirements extracted from Microsoft published documentation on learn.microsoft.com. Every requirement is cited. Where Microsoft uses "must" or "required," the control is labeled MINIMUM. Where Microsoft uses "should" or "recommended," the control is labeled RECOMMENDED unless there is no alternative (see Section 7 for reasoning).

---

## 1. Executive Baseline (1 page max)

### MINIMUM Controls (Release-Blocking)

**Training & Awareness**
- All contributors shall complete security awareness training annually. Microsoft: "All Microsoft employees are required to complete general security and privacy awareness training [...] annual refresher training is required." [Source 1]

**Requirements & Design**
- Security and privacy requirements shall be defined and documented before implementation begins. Microsoft: "Every product, service, and feature Microsoft develops starts with clearly defined security and privacy requirements." [Source 1]
- A threat model shall exist and be updated when architecture changes. Microsoft MCSB v2 DS-1 criticality: "Must have." [Source 2]

**Implementation & Verification**
- Static Application Security Testing (SAST) shall run on every PR/commit. Microsoft MCSB v2 DS-4 criticality: "Must have." [Source 2]
- Secret scanning with push protection shall be enabled on all repositories. Microsoft: "Push protection checks any incoming pushes for high-confidence secrets and prevents the push from going through." [Source 6]
- Dependency/SCA scanning shall run continuously against all repositories. Microsoft MCSB v2 DS-2 criticality: "Must have." [Source 2]
- Code review by a non-author shall be required for all changes to protected branches. Microsoft: "A manual review is conducted by a reviewer who isn't the engineer that developed the code. Separation of duties is an important control." [Source 1]
- No secrets shall be stored in code, pipeline definitions, or configuration files. Microsoft: "Remove keys, credentials, and secrets from code and scripts used in CI/CD workflow jobs." [Source 2, Source 5]

**Supply Chain**
- Software Bill of Materials (SBOM) shall be generated for each release build. Microsoft SFI: "Governed Pipeline Templates [...] enable SBOM generation." [Source 4]; Microsoft MCSB v2 DS-2: "Maintain Software Bill of Materials (SBOM) in industry-standard formats (SPDX, CycloneDX)." [Source 2]
- Third-party actions/dependencies shall be pinned to specific versions (commit SHAs for GitHub Actions). Microsoft exam guidance: "Pin third-party actions to full commit SHAs." [Source 9]

**Branch Protection & Release**
- Protected branches shall require PRs; direct pushes shall be prohibited. Microsoft: "A branch with required policies configured can't be deleted, and requires pull requests (PRs) for all changes." [Source 7]
- CI build shall pass before merge is allowed. Microsoft: "Build policies reduce breaks and keep your test results passing." [Source 7]

### RECOMMENDED Controls (High-Value but Not Release-Blocking)

- Dynamic Application Security Testing (DAST) in pre-production. MCSB v2 DS-5 criticality: "Must have" but practical for web apps/APIs; limited applicability to browser extensions. [Source 2]
- DevOps audit logging forwarded to centralized SIEM. MCSB v2 DS-7 criticality: "Should have." [Source 2]
- Fuzz testing on parsers and input handling. Microsoft SDL: "Fuzz testing: Uses malformed and unexpected data to exercise APIs and parsers." [Source 1]
- Penetration testing (internal or external). Microsoft SDL: "both internal and external providers regularly conduct penetration tests." [Source 1]
- Two-person approval for production releases. Microsoft SFI: "two-person pull request sign-off." [Source 4]
- Safe deployment process (staged rollout / rings). Microsoft SDL: "systematic and gradually releases builds to larger and larger groups, referred to as rings." [Source 1]
- npm audit / npm audit fix integrated into CI. Microsoft: "npm audit command performs a thorough scan of your project, identifying potential security vulnerabilities." [Source 10]

---

### Source Key

| Ref | Document | URL |
|-----|----------|-----|
| Source 1 | Microsoft SDL (Compliance Assurance) | https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle |
| Source 2 | MCSB v2 DevOps Security | https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security |
| Source 3 | Secure Development Best Practices on Azure | https://learn.microsoft.com/azure/security/develop/secure-dev-overview |
| Source 4 | SFI: Protect Software Supply Chain | https://learn.microsoft.com/security/zero-trust/sfi/protect-software-supply-chain |
| Source 5 | Zero Trust: Secure DevOps Platform Environment | https://learn.microsoft.com/security/zero-trust/develop/secure-devops-platform-environment-zero-trust |
| Source 6 | GHAzDO Secret Scanning | https://learn.microsoft.com/azure/devops/repos/security/github-advanced-security-secret-scanning |
| Source 7 | Azure DevOps Branch Policies | https://learn.microsoft.com/azure/devops/repos/git/branch-policies |
| Source 8 | Zero Trust: Secure Developer Environment | https://learn.microsoft.com/security/zero-trust/develop/secure-dev-environment-zero-trust |
| Source 9 | GH-200 Exam Study Guide (GitHub Actions) | https://learn.microsoft.com/credentials/certifications/resources/study-guides/gh-200 |
| Source 10 | npm audit (Azure Artifacts) | https://learn.microsoft.com/azure/devops/artifacts/npm/npm-audit |
| Source 11 | MCSB v1 DevOps Security | https://learn.microsoft.com/security/benchmark/azure/mcsb-devops-security |
| Source 12 | Azure DevOps Security Overview | https://learn.microsoft.com/azure/devops/organizations/security/security-overview |
| Source 13 | Cloud Adoption Framework: Security Considerations for DevOps | https://learn.microsoft.com/azure/cloud-adoption-framework/ready/considerations/security-considerations-overview |
| Source 14 | CI/CD Governance | https://learn.microsoft.com/devops/operate/governance-cicd |
| Source 15 | Microsoft SBOM Tool (GitHub) | https://github.com/microsoft/sbom-tool |

---

## 2. Requirements Table

### SDL Requirements

| ID | Domain | Phase/Area | Requirement | Priority | Rationale | Enforcement Mechanism | Evidence Artifact(s) | Microsoft Source | Notes |
|----|--------|------------|-------------|----------|-----------|----------------------|---------------------|-----------------|-------|
| SDL-001 | SDL | Training | All contributors shall complete annual security awareness training. | MINIMUM | Microsoft: "All Microsoft employees are **required** to complete general security and privacy awareness training [...] annual refresher training is **required**." | Training management system; onboarding checklist | Training completion records; sign-off log | [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | For small teams, self-paced OWASP/Microsoft training modules suffice. |
| SDL-002 | SDL | Requirements | Security and privacy requirements shall be documented before development begins for each feature. | MINIMUM | Microsoft: "Every product, service, and feature Microsoft develops starts with clearly defined security and privacy requirements. These requirements form the foundation of secure applications." | PR template with security requirements section; feature specification template | Requirements document per feature; linked work items | [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | For a browser extension: permissions model, data handling, CSP policy. |
| SDL-003 | SDL | Design | A threat model using STRIDE methodology shall be created and maintained for the application. | MINIMUM | MCSB v2 DS-1 criticality: "**Must have.**" Microsoft: "Implement systematic threat modeling as a mandatory design-phase activity using the STRIDE methodology." | Architecture review gate; threat model version in repo | Threat model document (DFD + STRIDE analysis); version history | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | Use Microsoft Threat Modeling Tool or equivalent. Update on architectural changes. |
| SDL-004 | SDL | Design | Threat model shall be reviewed and updated when architectural changes are detected in PRs. | RECOMMENDED | MCSB v2 DS-1.2: "Automate architecture review triggers in pull request workflows that detect changes to system boundaries, authentication flows, or data handling logic." | Manual review trigger; PR label for architecture changes | Updated threat model diff; PR review comments | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | Difficult to fully automate for small teams; tag-based approach is practical. |
| SDL-005 | SDL | Implementation | All code changes shall undergo peer review by a non-author before merging to protected branches. | MINIMUM | Microsoft: "A manual review is conducted by a reviewer who **isn't** the engineer that developed the code. **Separation of duties** is an important control." | Branch protection: minimum 1 reviewer required | PR approval records; merge audit log | [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle), [Source 7](https://learn.microsoft.com/azure/devops/repos/git/branch-policies) | GitHub branch protection rule: "Require a pull request before merging" + "Require approvals: 1". |
| SDL-006 | SDL | Verification | Static code analysis shall run automatically on every commit and PR targeting protected branches. | MINIMUM | MCSB v2 DS-4 criticality: "**Must have.**" Microsoft: "Embed automated static application security testing into every build to detect vulnerabilities before code reaches production." | CI pipeline gate (required status check) | SAST scan results (SARIF); CI logs | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | For TypeScript: ESLint security plugin + CodeQL. |
| SDL-007 | SDL | Verification | Secret scanning with push protection shall be enabled on all repositories. | MINIMUM | Microsoft: "Push protection checks any incoming pushes for high-confidence secrets and **prevents the push** from going through." | GitHub secret scanning push protection (repository setting) | Secret scanning alerts dashboard; push protection logs | [Source 6](https://learn.microsoft.com/azure/devops/repos/security/github-advanced-security-secret-scanning), [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | GitHub native feature; no additional tooling cost if using GitHub Advanced Security or public repo defaults. |
| SDL-008 | SDL | Verification | Credential and secret scanner shall identify exposed secrets in source code and configuration files. | MINIMUM | Microsoft SDL verification: "**Credential and secret scanner**: Identifies possible instances of credential and secret exposure in source code and configuration files." | CI pipeline task; repository scanning | Secret scanning alerts; remediation records | [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | Overlaps with SDL-007; SDL-008 covers historical scanning, SDL-007 covers push-time blocking. |
| SDL-009 | SDL | Verification | Fuzz testing shall be performed on input parsers, APIs, and data-handling code. | RECOMMENDED | Microsoft SDL: "**Fuzz testing**: Uses malformed and unexpected data to exercise APIs and parsers to check for vulnerabilities and validate error handling." | Periodic test execution; CI integration for critical paths | Fuzz test results; bug reports | [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | Browser extension relevance: test message parsing, import/export handlers. |
| SDL-010 | SDL | Release | Builds shall not be released until all required security tests and reviews pass. | MINIMUM | Microsoft: "After passing all **required** security tests and reviews, builds aren't immediately released to all customers." | CI/CD gate: all required checks must pass | Release checklist; CI gate pass records | [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | Implemented via GitHub branch protection "Require status checks to pass." |
| SDL-011 | SDL | Release | A safe deployment process (staged rollout) should be used for production releases. | RECOMMENDED | Microsoft: "The release process **systematically and gradually** releases builds to larger and larger groups, referred to as rings." | Manual release process; Chrome Web Store staged rollout | Release notes; rollout schedule | [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | Chrome Web Store supports staged rollout percentage. |

### DevSecOps Requirements

| ID | Domain | Phase/Area | Requirement | Priority | Rationale | Enforcement Mechanism | Evidence Artifact(s) | Microsoft Source | Notes |
|----|--------|------------|-------------|----------|-----------|----------------------|---------------------|-----------------|-------|
| DSO-001 | DevSecOps | Supply Chain | Dependency scanning (SCA) shall run continuously on all repositories, covering direct and transitive dependencies. | MINIMUM | MCSB v2 DS-2 criticality: "**Must have.**" Microsoft: "Implement automated vulnerability scanning that continuously monitors dependencies against the National Vulnerability Database (NVD), GitHub Advisory Database." | Dependabot enabled; CI pipeline dependency check | Dependabot alerts; dependency scan reports | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | GitHub Dependabot is free for public repos. For private repos, requires GitHub Advanced Security or equivalent. |
| DSO-002 | DevSecOps | Supply Chain | Dependencies with known critical/high CVEs shall not be merged to protected branches. | MINIMUM | MCSB v2 DS-2.1: "Establish approval gates for high-risk dependency changes and **enforce policies prohibiting dependencies with critical vulnerabilities from merging** to protected branches." | Dependabot security updates; PR check blocking on critical CVEs | Vulnerability remediation records; PR gate logs | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | Threshold: block on Critical; warn on High. See Section 3 for thresholds. |
| DSO-003 | DevSecOps | Supply Chain | SBOM in SPDX or CycloneDX format shall be generated for every release build. | MINIMUM | MCSB v2 DS-2.1: "Maintain Software Bill of Materials (SBOM) in industry-standard formats (SPDX, CycloneDX) for regulatory compliance and incident response readiness." SFI: "enable SBOM generation." | CI pipeline SBOM generation step | SBOM artifact (JSON/XML); build log | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security), [Source 4](https://learn.microsoft.com/security/zero-trust/sfi/protect-software-supply-chain), [Source 15](https://github.com/microsoft/sbom-tool) | Use `microsoft/sbom-tool` or `anchore/sbom-action`. Microsoft standardizes on SPDX 2.2+. |
| DSO-004 | DevSecOps | Supply Chain | Third-party GitHub Actions shall be pinned to full commit SHAs, not mutable tags. | MINIMUM | Microsoft GH-200 exam guidance: "**Pin third-party actions to full commit SHAs**; align with immutable actions enforcement on hosted runners; **avoid floating @main/@v\* without justification**." | CI linter / manual review; Dependabot for Actions updates | Workflow YAML review; Dependabot PRs for action updates | [Source 9](https://learn.microsoft.com/credentials/certifications/resources/study-guides/gh-200) | Prevents supply-chain attacks via tag hijacking. |
| DSO-005 | DevSecOps | Supply Chain | npm packages shall be audited for known vulnerabilities in CI. | RECOMMENDED | Microsoft: "The **npm audit** command performs a thorough scan of your project, identifying potential security vulnerabilities." | `npm audit` step in CI pipeline | npm audit output; CI logs | [Source 10](https://learn.microsoft.com/azure/devops/artifacts/npm/npm-audit) | Complementary to Dependabot; catches transitive dependency issues at build time. |
| DSO-006 | DevSecOps | Pipeline | No secrets, credentials, or tokens shall be hardcoded in pipeline definitions, source code, or configuration files. | MINIMUM | MCSB v2 DS-3 criticality: "**Must have.**" Microsoft: "Remove keys, credentials, and secrets from code and scripts used in CI/CD workflow jobs and keep them in a key store." | Secret scanning (push protection); manual code review | Secret scanning results; code review records | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security), [Source 5](https://learn.microsoft.com/security/zero-trust/develop/secure-devops-platform-environment-zero-trust) | Use GitHub Secrets or Azure Key Vault for any required credentials. |
| DSO-007 | DevSecOps | Pipeline | GITHUB_TOKEN permissions shall be scoped to least privilege (read-only by default; explicit write scopes only where needed). | MINIMUM | Microsoft GH-200 exam guidance: "Understand GITHUB_TOKEN lifecycle (ephemeral, scoped), configure granular permissions, contrast with PAT; **restrict write scopes**." Zero Trust: "Implement least privilege and just-in-time access for DevOps." | Workflow-level `permissions:` block; repository settings (default token permissions = read) | Workflow YAML audit | [Source 9](https://learn.microsoft.com/credentials/certifications/resources/study-guides/gh-200), [Source 8](https://learn.microsoft.com/security/zero-trust/develop/secure-dev-environment-zero-trust) | Set repository default to "Read repository contents and packages permissions." |
| DSO-008 | DevSecOps | Pipeline | GitHub Actions usage shall be restricted to verified/allowed actions only. | RECOMMENDED | Zero Trust: "**Allow only verified DevOps tool integrations.** [...] Confirm that verified integrations require the least privilege possible." | GitHub org setting: "Allow select actions and reusable workflows" | Org/repo settings screenshot; allowed actions list | [Source 5](https://learn.microsoft.com/security/zero-trust/develop/secure-devops-platform-environment-zero-trust), [Source 9](https://learn.microsoft.com/credentials/certifications/resources/study-guides/gh-200) | For small projects: allowlist approach is practical. |
| DSO-009 | DevSecOps | Branch Protection | Protected branches (main) shall require PRs; direct pushes shall be prohibited. | MINIMUM | Microsoft: "A branch with required policies configured **can't be deleted**, and **requires pull requests (PRs) for all changes.**" | GitHub branch protection rule | Branch protection settings export; audit log | [Source 7](https://learn.microsoft.com/azure/devops/repos/git/branch-policies), [Source 14](https://learn.microsoft.com/devops/operate/governance-cicd) | GitHub: Settings > Branches > Branch protection rules. |
| DSO-010 | DevSecOps | Branch Protection | CI build shall pass before merge is permitted on protected branches. | MINIMUM | Microsoft: "**Require CI build to pass.** Useful for establishing baseline code quality, such as code linting, unit tests, and even security checks like virus and credential scans." | Branch protection: "Require status checks to pass before merging" | CI logs; branch protection settings | [Source 14](https://learn.microsoft.com/devops/operate/governance-cicd), [Source 7](https://learn.microsoft.com/azure/devops/repos/git/branch-policies) | Select specific required checks: lint, test, SAST. |
| DSO-011 | DevSecOps | Branch Protection | Minimum one approval from non-author reviewer shall be required before merge. | MINIMUM | Microsoft: "**Require peer review.** Have another human double check that code works as intended." SDL: "Separation of duties is an important control." | Branch protection: "Require approvals: >= 1" | PR approval records | [Source 14](https://learn.microsoft.com/devops/operate/governance-cicd), [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | Prohibit self-approval for sole-developer scenarios if possible. |
| DSO-012 | DevSecOps | Branch Protection | Force pushes and branch deletion shall be prohibited on protected branches. | MINIMUM | Microsoft: "A branch with required policies configured **can't be deleted**." General secure branching: "protected branches serve as the source for new releases to production." | Branch protection rule settings | Branch protection settings export | [Source 7](https://learn.microsoft.com/azure/devops/repos/git/branch-policies), [Source 8](https://learn.microsoft.com/security/zero-trust/develop/secure-dev-environment-zero-trust) | GitHub: "Do not allow force pushes" + "Do not allow deletions." |
| DSO-013 | DevSecOps | DAST | Dynamic application security testing should be performed in pre-production for web-facing components. | RECOMMENDED | MCSB v2 DS-5 criticality: "**Must have.**" However, browser extensions have limited web surface. Microsoft: "DAST discovers runtime issues invisible to static analysis." | Periodic manual testing; automated scan on options page if applicable | DAST scan report | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | Limited applicability for browser extensions; focus on any web-accessible UI (options page, popup). |
| DSO-014 | DevSecOps | Monitoring | DevOps audit logs should be reviewed periodically and retained for at least 90 days. | RECOMMENDED | MCSB v2 DS-7 criticality: "**Should have.**" Microsoft: "Capture all security-relevant DevOps activities: user authentication and authorization events, source code commits and branch operations." | GitHub audit log; periodic review schedule | Audit log exports; review meeting notes | [Source 2](https://learn.microsoft.com/security/benchmark/azure/mcsb-v2-devop-security) | GitHub retains audit logs for 180 days (Enterprise) or via API. Free tier has limited access. |
| DSO-015 | DevSecOps | Access | Personal access tokens (PATs) should not be used for source code access; prefer OIDC or SSH keys. | RECOMMENDED | Zero Trust: "**Don't use personal access tokens for source code access.**" | Org policy; developer onboarding guide | Access method audit | [Source 8](https://learn.microsoft.com/security/zero-trust/develop/secure-dev-environment-zero-trust) | Practical constraint: GitHub CLI and some integrations still require PATs. Minimize scope and expiry. |
| DSO-016 | DevSecOps | Pipeline | Workflow files shall use OIDC (workload identity federation) instead of long-lived secrets for cloud provider authentication. | RECOMMENDED | Microsoft: "OpenID Connect (OIDC) allows your GitHub Actions workflows to access resources in Azure **without needing to store the Azure credentials as long-lived GitHub secrets.**" | OIDC configuration in workflow YAML | Workflow YAML review; federated credential config | [Source 5](https://learn.microsoft.com/security/zero-trust/develop/secure-devops-platform-environment-zero-trust), [Source 13](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/considerations/security-considerations-overview) | Only applicable if the project authenticates to cloud providers. |
| DSO-017 | DevSecOps | Supply Chain | Component Governance / license compliance checks should be performed on all OSS dependencies. | RECOMMENDED | Microsoft SFI: "**Component Governance (CG):** Software Composition Analysis (SCA) automatically enabled across engineering systems to identify vulnerabilities in OSS dependencies." SDL: "Component Governance (CG): Open-source software detection and checking of version, vulnerability, and **legal obligations**." | License scanning tool in CI | License compliance report | [Source 4](https://learn.microsoft.com/security/zero-trust/sfi/protect-software-supply-chain), [Source 1](https://learn.microsoft.com/compliance/assurance/assurance-microsoft-security-development-lifecycle) | Use `license-checker` npm package or GitHub dependency review action. |

---

## 3. Minimum CI/CD Gate Set (Release-Blocking)

All gates below are **required status checks** on the `main` branch. Merge shall be blocked if any gate fails.

| Gate ID | Gate Name | What It Checks | Threshold | Source of Threshold | Blocks Merge? |
|---------|-----------|----------------|-----------|-------------------|---------------|
| G-01 | Lint | ESLint with security rules passes | 0 errors | **Proposed** (Microsoft does not specify lint thresholds; SDL requires "static code analysis" generally) | Yes |
| G-02 | Unit Tests | All unit tests pass | 100% pass rate | **Proposed** (Microsoft: "CI build to pass" includes "unit tests") [Source 14] | Yes |
| G-03 | TypeScript Compilation | `tsc --noEmit` succeeds | 0 errors | **Proposed** (part of "code is production ready" verification) | Yes |
| G-04 | SAST (CodeQL or equivalent) | CodeQL analysis completes with no new critical/high alerts | 0 critical, 0 high (new) | **Microsoft-derived**: MCSB v2 DS-4 specifies "severity-based quality gates that **block merges or deployments when critical or high-severity vulnerabilities are detected**." [Source 2] | Yes |
| G-05 | Secret Scanning (Push Protection) | No high-confidence secrets detected in push | 0 secrets | **Microsoft-specified**: "prevents the push from going through" [Source 6] | Yes (pre-push) |
| G-06 | Dependency Review | No new critical CVEs introduced in PR | 0 critical CVEs introduced | **Microsoft-derived**: "enforce policies **prohibiting dependencies with critical vulnerabilities** from merging to protected branches" [Source 2] | Yes |
| G-07 | npm audit | No critical vulnerabilities in dependency tree | 0 critical | **Proposed** (Microsoft recommends npm audit but does not specify a threshold) [Source 10] | Yes |
| G-08 | Build | Production build (`npm run build`) succeeds | Exit code 0 | **Proposed** (prerequisite for any release) | Yes |

### Non-Blocking but Required to Report

| Gate ID | Gate Name | What It Checks | Threshold | Blocks Merge? |
|---------|-----------|----------------|-----------|---------------|
| G-09 | SBOM Generation | SBOM generated in SPDX format | SBOM file produced | No (release-blocking, not PR-blocking) |
| G-10 | License Compliance | No copyleft licenses in production dependencies | 0 GPL/AGPL in prod deps | No (warning only; review required) |
| G-11 | npm audit (high) | High-severity vulnerabilities in dependency tree | Report count | No (track, fix within SLA) |

### Vulnerability SLA (Proposed)

Microsoft does not publish specific remediation SLAs for external adopters. The following are proposed defaults based on industry practice and the urgency implied by MCSB v2 language.

| Severity | Remediation SLA | Basis |
|----------|----------------|-------|
| Critical | 48 hours (block release) | MCSB v2: "block merges or deployments when critical [...] vulnerabilities are detected" |
| High | 7 calendar days | MCSB v2: "severity-based quality gates" imply differentiated urgency |
| Medium | 30 calendar days | Industry standard; Microsoft does not specify |
| Low | Next release cycle | Industry standard; Microsoft does not specify |

---

## 4. Evidence Pack Checklist (Audit-Ready)

This checklist maps audit-ready artifacts to requirement IDs. For each audit cycle, produce or verify the following:

### Training & Governance

- [ ] **Security training completion log** -- SDL-001
  - Names, dates, training module completed
  - Annual refresh dates

### Design & Architecture

- [ ] **Threat model document** (STRIDE-based DFD) -- SDL-003
  - Version-controlled in repository
  - Last review date
- [ ] **Security requirements document** per feature/release -- SDL-002
  - Linked to work items/issues
- [ ] **Architecture decision records** for security-relevant changes -- SDL-004

### Code Security

- [ ] **Branch protection settings export** (screenshot or API dump) -- DSO-009, DSO-010, DSO-011, DSO-012
  - Require PR: enabled
  - Required reviewers: >= 1
  - Required status checks: list of checks
  - Force push: disabled
  - Branch deletion: disabled
- [ ] **SAST scan results** (SARIF format) for most recent release -- SDL-006, G-04
  - CodeQL or ESLint security reports
  - Zero unresolved critical/high findings
- [ ] **Secret scanning dashboard** export -- SDL-007, SDL-008, G-05
  - Push protection: enabled
  - Open alerts: 0 (or documented exceptions)
- [ ] **PR approval records** for all merges to main in audit period -- SDL-005, DSO-011
  - Non-author approval confirmed

### Supply Chain

- [ ] **Dependabot alerts dashboard** export -- DSO-001, DSO-002, G-06
  - Open critical/high alerts: 0 (or documented exceptions with SLA)
- [ ] **SBOM artifact** for most recent release build -- DSO-003, G-09
  - Format: SPDX 2.2+ or CycloneDX
  - Generated by CI pipeline
- [ ] **npm audit report** for most recent release -- DSO-005, G-07
  - Zero critical findings
- [ ] **License compliance report** -- DSO-017, G-10
  - No copyleft licenses in production bundle
- [ ] **GitHub Actions workflow YAML** showing pinned action SHAs -- DSO-004
  - All third-party actions pinned to commit SHA
- [ ] **GITHUB_TOKEN permissions audit** -- DSO-007
  - Default: read-only at repository level
  - Workflow-level permissions blocks present

### Pipeline & Access

- [ ] **CI/CD pipeline definition** (all workflow YAML files) -- DSO-006, DSO-007, DSO-008
  - No hardcoded secrets
  - Least-privilege permissions
- [ ] **Allowed actions list** (if configured) -- DSO-008
- [ ] **Audit log sample** (30-day extract) -- DSO-014
  - Covers: push events, PR merges, settings changes, collaborator changes

### Release

- [ ] **Release checklist** showing all gates passed -- SDL-010
- [ ] **Staged rollout evidence** (if applicable) -- SDL-011

---

## 5. Implementation Blueprint

### Context

ChatSmuggler is a TypeScript browser extension hosted on GitHub. The following plan assumes a small team (1-3 developers) with GitHub Free or Pro. Items marked with ($) require GitHub Advanced Security (paid for private repos; free for public repos).

### Week 1: Foundation (Branch Protection + SAST + Secrets)

| Day | Task | Owner | Dependency | Req ID |
|-----|------|-------|------------|--------|
| 1 | Enable branch protection on `main`: require PR, 1 reviewer, no force push, no deletion | Repo Admin | None | DSO-009, DSO-010, DSO-011, DSO-012 |
| 1 | Set repository default GITHUB_TOKEN permissions to read-only | Repo Admin | None | DSO-007 |
| 1 | Enable GitHub secret scanning + push protection | Repo Admin | None | SDL-007, SDL-008 |
| 2 | Add ESLint security plugin (`eslint-plugin-security`) to project; configure as CI check | Developer | ESLint config | SDL-006, G-01 |
| 2-3 | Create CodeQL workflow (`.github/workflows/codeql.yml`) for TypeScript ($) | Developer | None | SDL-006, G-04 |
| 3 | Add `npm audit` step to CI workflow; fail on critical | Developer | CI workflow | DSO-005, G-07 |
| 3-4 | Enable Dependabot for npm (`dependabot.yml`); configure security updates | Developer | None | DSO-001, DSO-002, G-06 |
| 4-5 | Pin all third-party GitHub Actions to commit SHAs in workflow files | Developer | Workflow files | DSO-004 |
| 5 | Add dependency review action to PR workflow (`actions/dependency-review-action`) | Developer | CI workflow | DSO-002, G-06 |
| 5 | Configure required status checks on `main` branch: lint, test, build, CodeQL, dependency-review | Repo Admin | CI workflows exist | DSO-010 |

### Week 2: Supply Chain + Threat Model

| Day | Task | Owner | Dependency | Req ID |
|-----|------|-------|------------|--------|
| 6-7 | Create SBOM generation step in release workflow using `microsoft/sbom-tool` or `anchore/sbom-action` | Developer | Release workflow | DSO-003, G-09 |
| 7-8 | Add license compliance check (`license-checker` or `actions/dependency-review-action` with license config) | Developer | CI workflow | DSO-017, G-10 |
| 8-9 | Write initial threat model (STRIDE) for ChatSmuggler: identify trust boundaries (content script / background / popup / web page), data flows, external interfaces | Security Lead / Developer | Architecture understanding | SDL-003 |
| 9-10 | Document security requirements for current features (data handled, permissions, CSP policy) | Developer | Feature inventory | SDL-002 |
| 10 | Run `npm audit fix` to remediate existing vulnerabilities; triage remaining | Developer | None | DSO-005 |

### Weeks 3-4: Hardening + Documentation + Process

| Day | Task | Owner | Dependency | Req ID |
|-----|------|-------|------------|--------|
| 11-12 | Set up security training resources for contributors (link to OWASP, Microsoft SDL training modules) | Project Lead | None | SDL-001 |
| 12-13 | Create PR template with security checklist (threat model impact? new permissions? data handling changes?) | Developer | None | SDL-002, SDL-004 |
| 13-14 | Create release checklist template mapping all gates | Project Lead | All CI gates configured | SDL-010 |
| 14-15 | Configure GitHub Actions allowed list (restrict to verified actions only) if using org-level settings | Repo Admin | None | DSO-008 |
| 15-17 | Compile initial evidence pack (screenshots, exports, SBOM sample) | Project Lead | All controls implemented | Section 4 |
| 17-18 | Review and update threat model based on implementation findings | Developer | SDL-003 complete | SDL-004 |
| 18-20 | Conduct self-audit against Requirements Table; document gaps | Security Lead | All controls | Section 7 |

### RACI Matrix

| Activity | Repo Admin | Developer(s) | Security Lead / Project Lead |
|----------|-----------|-------------|------------------------------|
| Branch protection config | **R/A** | C | I |
| CI pipeline creation | C | **R** | **A** |
| Threat modeling | I | **R** | **A** |
| Security training | I | **R** | **A** |
| Secret scanning config | **R/A** | I | I |
| SBOM generation | I | **R** | **A** |
| Dependency remediation | I | **R/A** | C |
| Evidence pack compilation | I | C | **R/A** |
| Self-audit / gap analysis | C | C | **R/A** |
| Release sign-off | C | C | **R/A** |

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

### Dependency Order

```
1. Branch protection (foundation -- no dependencies)
   |
2. Secret scanning enable (no dependencies)
   |
3. CI pipeline: lint + test + build (depends on: project has test suite)
   |
4. SAST: CodeQL workflow (depends on: CI pipeline exists)
   |
5. Dependency scanning: Dependabot + dependency-review-action (depends on: CI pipeline)
   |
6. Required status checks configured (depends on: 3, 4, 5 all producing check results)
   |
7. SBOM generation (depends on: CI pipeline; release workflow)
   |
8. Threat model + security requirements (can run in parallel with 3-7)
   |
9. Evidence pack + self-audit (depends on: all above complete)
```

---

## 6. Framework Mapping Appendix

> **Disclaimer:** The mappings below are informational cross-references, not authoritative compliance assessments. Each framework has its own audit criteria, and this table does not substitute for a formal compliance evaluation against any framework.

The NIST SP 800-53, PCI-DSS, CIS, ISO 27001, and SOC 2 mappings below are drawn directly from the MCSB v2 control mapping tables.

| Req ID | Requirement Summary | NIST SSDF (SP 800-218) | NIST SP 800-53 Rev.5 | ISO 27001:2022 | SOC 2 TSC | CIS Controls v8.1 |
|--------|---------------------|----------------------|---------------------|----------------|-----------|-------------------|
| SDL-001 | Security training | PW.5 (Train) | AT-2, AT-3 | A.6.3 | CC1.4 | 14.1, 14.9 |
| SDL-002 | Security requirements | PW.1 (Define requirements) | SA-3, SA-8 | A.5.8, A.8.25 | CC3.1 | 16.1 |
| SDL-003 | Threat modeling | PW.1 (Threat modeling) | SA-11, SA-15, PL-8, RA-3 | A.5.12, A.8.25 | CC3.2, CC7.1 | 14.2, 14.3 |
| SDL-005 | Code review | PW.7 (Review code) | SA-11 | A.8.25, A.8.4 | CC8.1 | 16.3 |
| SDL-006 | SAST | PW.7, PW.8 (Test) | SA-11, RA-5, SI-2 | A.8.25, A.8.29 | CC7.1, CC7.2 | 16.3, 16.6 |
| SDL-007 | Secret scanning | PW.6 (Secure environment) | SC-12, SC-13 | A.8.3, A.5.33 | CC6.1 | 16.6 |
| DSO-001 | Dependency scanning | PS.3 (Third-party assessment) | SR-3, SR-4, SR-6, SA-12, RA-5 | A.5.19, A.5.22, A.5.23 | CC3.2, CC8.1 | 16.1, 16.2, 16.11 |
| DSO-003 | SBOM | PS.3 (SBOM) | SR-3, SR-4 | A.5.19, A.5.22 | CC3.2 | 16.1, 16.4 |
| DSO-006 | No hardcoded secrets | PW.6, PO.5 | AC-2, AC-3, AC-6, SC-12, SC-13 | A.5.15, A.5.16, A.8.3 | CC6.1, CC6.6, CC6.7 | 4.1, 4.7, 6.1, 6.5 |
| DSO-009 | Branch protection | PO.3 (Secure SDLC) | CM-2, CM-6, AC-3 | A.8.25, A.8.4 | CC8.1 | 16.3 |
| DSO-013 | DAST | PW.8 (Test software) | SA-11, CA-8, RA-5 | A.8.29, A.8.30 | CC7.1, CC7.3 | 16.7, 16.8 |
| DSO-014 | Audit logging | PO.3 (Log SDLC events) | AU-2, AU-3, AU-6, AU-12, SI-4 | A.8.15, A.8.16 | CC7.2, CC7.3 | 8.2, 8.5, 8.11 |

### NIST SSDF (SP 800-218) Coverage Summary

| SSDF Practice Group | Covered By |
|---------------------|-----------|
| PO (Prepare the Organization) | SDL-001, DSO-009, DSO-014 |
| PS (Protect the Software) | DSO-001, DSO-003, DSO-004, DSO-006 |
| PW (Produce Well-Secured Software) | SDL-002, SDL-003, SDL-005, SDL-006, SDL-007, SDL-009, DSO-013 |
| RV (Respond to Vulnerabilities) | DSO-001, DSO-002, Vulnerability SLA |

---

## 7. Known Gaps / Uncertainty

### 7.1 Microsoft Does Not Define "Minimum" for External Adopters

Microsoft SDL documentation describes what Microsoft does internally. The documents use language like "All development teams at Microsoft **must** adhere to the SDL processes and requirements" [Source 1], but this is a statement about Microsoft's internal mandate, not a prescriptive external standard. There is no published "minimum SDL compliance certification" or checklist for third parties.

**Our approach:** We treat Microsoft's "must" / "required" language as MINIMUM where it describes universal controls (training, code review, SAST, secret scanning). We treat "should" / "recommended" language as RECOMMENDED.

### 7.2 MCSB v2 Criticality Labels Are the Closest to "Minimum"

The Microsoft Cloud Security Benchmark v2 uses criticality labels:
- "**Must have**" -- We map these to MINIMUM.
- "**Should have**" -- We map these to RECOMMENDED.

These labels are applied to DS-1 through DS-7. DS-7 (logging/monitoring) is the only "Should have" among the DevOps controls. All others are "Must have."

**Status (Feb 2026):** MCSB v2 is now **Generally Available** (production documentation, last updated Feb 1, 2026) [Source 2]. It is the current authoritative source for DevOps security controls.

### 7.3 DAST Applicability to Browser Extensions

MCSB v2 DS-5 (DAST) is labeled "Must have," but the guidance is oriented toward web applications and APIs with HTTP endpoints. A browser extension has limited web-facing surface (popup page, options page, content scripts injected into third-party pages). Full DAST scanning of a browser extension is not standard practice.

**Decision:** We label DAST as RECOMMENDED for ChatSmuggler, acknowledging the MCSB "Must have" criticality but noting limited applicability. The threat model should document this rationale.

### 7.4 Fuzz Testing Scope

Microsoft SDL lists fuzz testing as a verification category: "Uses malformed and unexpected data to exercise APIs and parsers" [Source 1]. However, fuzz testing is not listed as a separate MCSB v2 control and has no criticality label.

**Decision:** Labeled RECOMMENDED. Applicable to ChatSmuggler's import/export parsing logic and message format handling.

### 7.5 Two-Person Approval vs. One-Person Approval

Microsoft's internal practice and SFI documentation reference "two-person pull request sign-off" [Source 4]. However, this is described in the context of Microsoft's governed pipeline templates for tens of thousands of pipelines. The MCSB v2 and branch policy documentation reference "minimum number of reviewers" without specifying a number [Source 7].

**Decision:** MINIMUM is set at 1 reviewer (non-author). Two-person approval is RECOMMENDED for production releases. For a small team (1-3 developers), requiring 2 reviewers on every PR may be impractical.

### 7.6 GitHub Advanced Security Licensing

Several MINIMUM controls (CodeQL SAST, secret scanning push protection, dependency review action) are available free for public repositories on GitHub. For private repositories, GitHub Advanced Security is a paid add-on. If ChatSmuggler is private, alternative free tools exist but may not meet the same detection quality.

**Alternatives for private repos without GHAS:**
- SAST: Semgrep (free tier), SonarCloud (free for OSS)
- Secret scanning: TruffleHog, gitleaks (open-source)
- Dependency scanning: Dependabot (free for all repos), `npm audit`

### 7.7 Contradictions Between Sources

| Topic | Source A | Source B | Resolution |
|-------|---------|---------|------------|
| Logging criticality | MCSB v2 DS-7: "Should have" | SDL doc: implies logging is mandatory ("extensively logged and monitored") | We use MCSB v2 criticality as authoritative; label RECOMMENDED. |
| DAST criticality | MCSB v2 DS-5: "Must have" | Practical applicability to browser extensions: low | Label RECOMMENDED with documented rationale. |
| Reviewer count | SFI: "two-person pull request sign-off" | Branch policies: configurable "minimum number of reviewers" | MINIMUM = 1; RECOMMENDED = 2 for releases. |
| npm audit action | Microsoft npm audit doc: descriptive ("the npm audit command performs...") | No prescriptive "must" language | Label RECOMMENDED; integrate in CI for defense in depth. |

### 7.8 SBOM Format Preference

Microsoft states: "Microsoft is standardizing on and recommends SPDX (Software Package Data Exchange) version 2.2 or later" (referenced in driver security checklist and C++ secure coding guidance). MCSB v2 DS-2 mentions both "SPDX, CycloneDX." The `microsoft/sbom-tool` generates SPDX.

**Decision:** Prefer SPDX 2.2+ for Microsoft alignment. CycloneDX is also acceptable per MCSB v2.

### 7.9 Penetration Testing

Microsoft SDL: "both internal and external providers regularly conduct penetration tests on Microsoft online services" [Source 1]. This is an internal practice statement. No MCSB v2 control explicitly requires penetration testing as a separate DevOps security control (it falls under DS-5 DAST umbrella).

**Decision:** Labeled RECOMMENDED. Periodic manual security review of the extension's permission model, CSP, and message-passing architecture is the most relevant form for this project type.

### 7.10 Safe Deployment / Staged Rollout

Microsoft SDL describes a ring-based deployment model [Source 1]. This is highly specific to Microsoft's scale. For a browser extension distributed via the Chrome Web Store, the equivalent is the Chrome Web Store's staged rollout feature (deploy to X% of users).

**Decision:** Labeled RECOMMENDED. Use Chrome Web Store staged rollout for major releases.

---

## Appendix A: Key Microsoft Quotes (Exact Language)

For audit defensibility, the following exact quotes underpin MINIMUM classifications:

1. **SDL mandatory adherence:** "All development teams at Microsoft **must** adhere to the SDL processes and requirements." -- [Source 1]

2. **Training required:** "All Microsoft employees are **required** to complete general security and privacy awareness training [...] annual refresher training is **required**." -- [Source 1]

3. **Separation of duties in code review:** "A manual review is conducted by a reviewer who **isn't** the engineer that developed the code. **Separation of duties** is an important control in this step." -- [Source 1]

4. **MCSB DS-1 (Threat modeling):** "Criticality level: **Must have.**" -- [Source 2]

5. **MCSB DS-2 (Supply chain):** "Criticality level: **Must have.**" -- [Source 2]

6. **MCSB DS-3 (DevOps infrastructure):** "Criticality level: **Must have.**" -- [Source 2]

7. **MCSB DS-4 (SAST):** "Criticality level: **Must have.**" -- [Source 2]

8. **MCSB DS-4 quality gates:** "Establish severity-based quality gates that **block merges or deployments when critical or high-severity vulnerabilities are detected**, preventing vulnerable code from advancing through the pipeline." -- [Source 2]

9. **MCSB DS-5 (DAST):** "Criticality level: **Must have.**" -- [Source 2]

10. **MCSB DS-6 (Workload lifecycle):** "Criticality level: **Must have.**" -- [Source 2]

11. **MCSB DS-7 (Logging):** "Criticality level: **Should have.**" -- [Source 2]

12. **Supply chain SBOM:** "Maintain Software Bill of Materials (SBOM) in industry-standard formats (SPDX, CycloneDX) for **regulatory compliance and incident response readiness**." -- [Source 2]

13. **Dependency blocking:** "Establish approval gates for high-risk dependency changes and **enforce policies prohibiting dependencies with critical vulnerabilities from merging to protected branches.**" -- [Source 2]

14. **Secret scanning push protection:** "Push protection checks any incoming pushes for high-confidence secrets and **prevents the push from going through.**" -- [Source 6]

15. **Branch protection PRs required:** "A branch with required policies configured **can't be deleted**, and **requires pull requests (PRs) for all changes.**" -- [Source 7]

16. **No hardcoded secrets:** "**Remove** keys, credentials, and secrets from code and scripts used in CI/CD workflow jobs and keep them in a key store." -- [Source 2]

17. **SFI governed pipelines:** "Standardized YAML templates enforce secure compute, inject **required** static analysis tools, enable SBOM generation, and apply compliance gates such as **two-person pull request sign-off** and code signing." -- [Source 4]

18. **Pin actions to SHAs:** "**Pin third-party actions to full commit SHAs**; align with immutable actions enforcement on hosted runners; **avoid floating @main/@v\* without justification**." -- [Source 9]

19. **GITHUB_TOKEN least privilege:** "Understand GITHUB_TOKEN lifecycle (ephemeral, scoped), configure granular permissions [...]; **restrict write scopes**." -- [Source 9]

20. **CI build required for merge:** "**Require CI build to pass.** Useful for establishing baseline code quality, such as code linting, unit tests, and even security checks like virus and credential scans." -- [Source 14]

---

*End of document. Last updated: 2026-02-20.*
