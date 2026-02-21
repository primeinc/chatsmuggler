# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | Yes       |

## Reporting a Vulnerability

**Do NOT open a public issue for security vulnerabilities.**

Please report security vulnerabilities via [GitHub Security Advisories](https://github.com/primeinc/chatsmuggler/security/advisories/new).

### What to include

- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

### Response timeline

- **Acknowledgment**: 48 hours
- **Initial assessment**: 7 days
- **Fix for critical issues**: 72 hours after confirmation
- **Fix for high issues**: 7 days after confirmation
- **Fix for medium/low issues**: 30 days after confirmation

## Security Bug Bar

| Severity | Definition | SLA |
|----------|-----------|-----|
| Critical | XSS, CSP bypass, credential leak, RCE | 1 day |
| High | Permission escalation, data exfiltration, supply chain | 7 days |
| Medium | Information disclosure, insecure defaults | 30 days |
| Low | Defense-in-depth improvement | Next release |

## Scope

The following are in scope for security reports:
- The browser extension itself (content scripts, background service worker, popup, options)
- Build pipeline and CI/CD configuration
- Dependencies and supply chain

## Extension Permissions

All extension permissions are documented and justified in `docs/security/permissions-justification.md`.
Any change to `manifest.json` permissions is treated as a security-relevant change requiring review.
