#!/usr/bin/env node
/* scripts/attest-artifacts.ts
   Iron-law build gate: dist/ must exactly satisfy manifest.json contract.

   Checks:
   1. Every path declared in manifest.json exists in dist/
   2. No src/ prefix leakage in dist/
   3. No hashed (content-addressable) filenames
   4. No unexpected top-level JS entrypoints (code-split chunks not declared in manifest)
   5. No banned JS primitives in any bundle (eval, new Function, dynamic import)
   6. No network primitives in adapter bundles (fetch, WebSocket) — adapters are DOM scrapers only
   7. SHA-256 attestation summary printed for CI log traceability
*/
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Manifest {
  manifest_version: number;
  background?: { service_worker?: string };
  action?: { default_popup?: string };
  content_scripts?: { js?: string[] }[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, "dist");
const MANIFEST_PATH = resolve(ROOT, "manifest.json");

/**
 * Banned in ALL JS outputs.
 * Violations = hard build failure, no exceptions.
 */
const BANNED_JS_PATTERNS: { id: string; re: RegExp; why: string }[] = [
  {
    id: "EVAL",
    re: /\beval\s*\(/,
    why: "eval() executes arbitrary code — MV3 CSP blocks it anyway; presence is a sign of framework injection",
  },
  {
    id: "NEW_FUNCTION",
    re: /new\s+Function\s*\(/,
    why: "Function constructor is eval by another name — same MV3 CSP restriction applies",
  },
  {
    id: "DYNAMIC_IMPORT",
    re: /\bimport\s*\(/,
    why: "content scripts cannot rely on dynamic import at runtime; chunked splits break extension sandboxing",
  },
  {
    id: "POSTMESSAGE_STAR",
    re: /\.postMessage\s*\([^)]*,\s*["']\*["']/,
    why: "postMessage with '*' origin broadcasts to all frames — SDL no-postmessage-star-origin violation",
  },
];

/**
 * Banned specifically in adapter bundles (adapters/ prefix).
 * Adapters are DOM scrapers — they must not initiate network calls.
 * If a platform adapter legitimately needs network, add an explicit exemption here with justification.
 */
const ADAPTER_BANNED_PATTERNS: { id: string; re: RegExp; why: string }[] = [
  {
    id: "FETCH",
    re: /\bfetch\s*\(/,
    why: "adapters are DOM scrapers — network calls in adapters risk data exfiltration; use background service worker for network",
  },
  {
    id: "WEBSOCKET",
    re: /\bnew\s+WebSocket\s*\(/,
    why: "WebSocket in a content script is a persistent exfiltration channel — not allowed in adapter scope",
  },
  {
    id: "XML_HTTP_REQUEST",
    re: /\bnew\s+XMLHttpRequest\s*\(/,
    why: "XHR in adapters has same risk as fetch — use background service worker",
  },
];

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function die(msg: string): never {
  console.error(`\nATTEST FAIL: ${msg}\n`);
  process.exit(1);
}

async function listFilesRec(dir: string): Promise<string[]> {
  const out: string[] = [];
  const items = await readdir(dir, { withFileTypes: true });
  for (const it of items) {
    const p = join(dir, it.name);
    if (it.isDirectory()) {
      out.push(...(await listFilesRec(p)));
    } else {
      out.push(p);
    }
  }
  return out;
}

/** Convert absolute dist path to a posix-normalized relative path (dist-relative). */
function toDistRel(absPath: string): string {
  return absPath.slice(DIST.length + 1).replaceAll("\\", "/");
}

async function sha256(absPath: string): Promise<string> {
  const buf = await readFile(absPath);
  return createHash("sha256").update(buf).digest("hex");
}

function uniq<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // ── 1. Load and parse manifest ───────────────────────────────────────────
  const mRaw = await readFile(MANIFEST_PATH, "utf8").catch(() =>
    die("manifest.json not found at project root"),
  );
  let manifest: Manifest;
  try {
    manifest = JSON.parse(mRaw) as Manifest;
  } catch {
    die("manifest.json is not valid JSON");
  }

  // ── 2. Collect required dist paths from manifest ──────────────────────────
  const required: string[] = [];

  const sw = manifest.background?.service_worker;
  if (!sw) die("manifest.background.service_worker is missing — MV3 requires a service worker");
  required.push(sw);

  const popup = manifest.action?.default_popup;
  if (!popup) die("manifest.action.default_popup is missing");
  required.push(popup);

  for (const entry of manifest.content_scripts ?? []) {
    for (const js of entry.js ?? []) {
      required.push(js);
    }
  }

  const requiredNorm = uniq(required.map((p) => p.replace(/^\.\//, "")));

  // ── 3. Verify every required artifact exists ──────────────────────────────
  for (const rel of requiredNorm) {
    const abs = resolve(DIST, rel);
    const exists = await stat(abs)
      .then(() => true)
      .catch(() => false);
    if (!exists) die(`Missing required dist artifact: dist/${rel}`);
  }

  // ── 4. Enumerate all dist files ───────────────────────────────────────────
  const distFilesAbs = await listFilesRec(DIST);
  const distFiles = distFilesAbs.map(toDistRel).sort();

  // ── 5. No src/ prefix leakage ─────────────────────────────────────────────
  const srcLeaks = distFiles.filter((p) => p.startsWith("src/"));
  if (srcLeaks.length > 0) {
    die(`dist/ contains src/ path leakage (Vite root config issue): ${srcLeaks.join(", ")}`);
  }

  // ── 6. No hashed filenames ────────────────────────────────────────────────
  // Manifest paths are the contract — they must be stable across rebuilds.
  const hashed = distFiles.filter((p) => /\.[a-f0-9]{8,}\.(js|css|map)$/.test(p));
  if (hashed.length > 0) {
    die(
      `Hashed filenames in dist/ break the manifest contract (paths must be deterministic): ${hashed.join(", ")}`,
    );
  }

  // ── 7. No unexpected JS entrypoints, no chunks ───────────────────────────
  // The contract is: no code splitting. Every entrypoint is self-contained.
  // chunks/ is explicitly banned — if Rollup emits anything there, it means
  // shared-module splitting occurred, which breaks content script sandboxing
  // and expands the attack surface with unreferenced-but-loaded code.
  //
  // To explicitly allow a chunk (e.g. a shared utility in a future refactor),
  // add it to ALLOWED_CHUNKS below with a justification comment.
  const ALLOWED_CHUNKS: string[] = [
    // e.g. "chunks/shared-utils.js", // justification: ...
  ];

  const chunksInDist = distFiles.filter((p) => p.startsWith("chunks/") && p.endsWith(".js"));
  const illegalChunks = chunksInDist.filter((p) => !ALLOWED_CHUNKS.includes(p));
  if (illegalChunks.length > 0) {
    die(
      `Code-split chunks in dist/ — splitting is not allowed (content scripts must be self-contained): ${illegalChunks.join(", ")}`,
    );
  }

  const blessedJsPrefixes = ["background/", "adapters/", "popup/"];
  const blessedJsExact = new Set(["popup/index.js", ...ALLOWED_CHUNKS]);

  const unexpectedJs = distFiles.filter((p) => {
    if (!p.endsWith(".js")) return false;
    if (blessedJsExact.has(p)) return false;
    return !blessedJsPrefixes.some((prefix) => p.startsWith(prefix));
  });
  if (unexpectedJs.length > 0) {
    die(
      `Unexpected JS outputs in dist/ — possible framework injection or accidental code splitting: ${unexpectedJs.join(", ")}`,
    );
  }

  // ── 8. Minimum size gate for adapter bundles ─────────────────────────────
  // Adapters must contain real extraction logic before ship.
  // ADAPTER_MIN_BYTES = 0 during scaffold phase — flip to e.g. 500 when
  // real logic lands so empty stubs can never accidentally ship.
  // Adapter minimum size gate — set ADAPTER_MIN_BYTES env var to enforce.
  // Default is unset (disabled) during scaffold phase.
  // TODO(step-6+): set ADAPTER_MIN_BYTES=500 in CI once adapters have real logic.
  const adapterMinBytes = parseInt(process.env["ADAPTER_MIN_BYTES"] ?? "0", 10);

  if (adapterMinBytes > 0) {
    const adapterFilesAbs = distFilesAbs.filter(
      (p) => toDistRel(p).startsWith("adapters/") && p.endsWith(".js"),
    );
    for (const abs of adapterFilesAbs) {
      const { size } = await stat(abs);
      if (size < adapterMinBytes) {
        const rel = toDistRel(abs);
        die(
          `Adapter dist/${rel} is ${String(size)} bytes — below ADAPTER_MIN_BYTES (${String(adapterMinBytes)}). Stub detected, real logic required before ship.`,
        );
      }
    }
  }

  // ── 10. Scan JS bundles for banned primitives ─────────────────────────────
  const jsFilesAbs = distFilesAbs.filter((p) => p.endsWith(".js"));

  for (const abs of jsFilesAbs) {
    const txt = await readFile(abs, "utf8");
    const rel = toDistRel(abs);

    for (const rule of BANNED_JS_PATTERNS) {
      if (rule.re.test(txt)) {
        die(`Banned primitive [${rule.id}] in dist/${rel}: ${rule.why}`);
      }
    }

    if (rel.startsWith("adapters/")) {
      for (const rule of ADAPTER_BANNED_PATTERNS) {
        if (rule.re.test(txt)) {
          die(`Adapter network primitive [${rule.id}] in dist/${rel}: ${rule.why}`);
        }
      }
    }
  }

  // ── 11. Emit attestation summary ──────────────────────────────────────────
  console.log("\nATTEST OK — manifest contract satisfied\n");
  const summary = await Promise.all(
    requiredNorm.map(async (rel) => {
      const abs = resolve(DIST, rel);
      return { file: `dist/${rel}`, sha256: await sha256(abs) };
    }),
  );
  for (const s of summary) {
    console.log(`  ${s.file}`);
    console.log(`    sha256:${s.sha256}`);
  }
  console.log();
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
