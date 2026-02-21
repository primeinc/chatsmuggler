import { resolve } from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const src = (p: string) => resolve(__dirname, "src", p);

/**
 * Rewrite HTML output paths to strip the "src/" prefix that Vite preserves
 * when input files are under a subdirectory of the project root.
 *
 * Without this: dist/src/popup/index.html (wrong — manifest references popup/index.html)
 * With this:    dist/popup/index.html      (correct)
 */
function rewriteHtmlOutputPaths(): Plugin {
  return {
    name: "chatsmuggler:rewrite-html-output-paths",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.startsWith("src/") && chunk.type === "asset" && fileName.endsWith(".html")) {
          const newFileName = fileName.slice("src/".length);
          bundle[newFileName] = { ...chunk, fileName: newFileName };
          delete bundle[fileName];
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [rewriteHtmlOutputPaths()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // No code splitting — each entrypoint must be a single self-contained file.
    // Content scripts cannot import() at runtime; splitting would break them.
    rollupOptions: {
      input: {
        // Background service worker (MV3)
        "background/index": src("background/index.ts"),
        // Popup page — HTML entry; JS output controlled by entryFileNames below
        "popup/index": src("popup/index.html"),
        // Content script adapters — one per platform, matching manifest.json exactly
        "adapters/chatgpt": src("adapters/chatgpt.ts"),
        "adapters/gemini": src("adapters/gemini.ts"),
        "adapters/grok": src("adapters/grok.ts"),
        "adapters/claude": src("adapters/claude.ts"),
        "adapters/deepseek": src("adapters/deepseek.ts"),
      },
      output: {
        // Deterministic output paths — must match manifest.json exactly.
        // No hashes. No content-addressable filenames.
        // The manifest is the contract; the build must satisfy it.
        entryFileNames: (chunk) => {
          // chunk.name is the input key: "background/index", "adapters/chatgpt", etc.
          return `${chunk.name}.js`;
        },
        chunkFileNames: "chunks/[name].js",
        assetFileNames: (asset) => {
          if (asset.name?.endsWith(".css")) return "popup/[name][extname]";
          return "assets/[name][extname]";
        },
      },
    },
  },
  // Vite is type-check-free — tsc --noEmit handles types separately.
  // Do not add @vitejs/plugin-legacy or any polyfill plugin.
  // Target: Chrome 110+ (MV3 minimum). All ES2022 is native.
  esbuild: {
    target: "chrome110",
  },
});
