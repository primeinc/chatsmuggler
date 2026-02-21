// Background service worker (MV3)
// Minimal stub — no logic yet, just proves the build graph is wired.
// No postMessage, no DOM, no dynamic imports.

chrome.runtime.onInstalled.addListener(() => {
  // Intentionally empty — onInstalled handler required by MV3 best practice
  // to prevent "ghost" service worker warnings in chrome://extensions.
});
