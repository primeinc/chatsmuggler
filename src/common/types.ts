/**
 * src/common/types.ts
 *
 * Canonical conversation schema. Every adapter must produce this shape.
 * No adapter may import platform-specific types into this file.
 *
 * Design principles:
 *  - Discriminated unions over loose strings for all enums.
 *  - All fields are readonly — schema objects are never mutated after construction.
 *  - Optional fields use exactOptionalPropertyTypes semantics: absent !== undefined.
 *  - Content is extensible via MessageContent discriminated union without breaking adapters.
 */

// ---------------------------------------------------------------------------
// Schema version — bump when semantics change, not just when fields are added
// ---------------------------------------------------------------------------

/**
 * Current schema version. Increment the major when a field meaning changes
 * or a required field is removed. Increment the minor when new optional
 * fields are added. Consumers can compare against this constant to detect
 * incompatible exports without parsing adapterVersion.
 */
export const SCHEMA_VERSION = "1.0.0" as const;
export type SchemaVersion = typeof SCHEMA_VERSION;

// ---------------------------------------------------------------------------
// Branded primitives
// ---------------------------------------------------------------------------

/**
 * Branded ISO-8601 timestamp string. Runtime value is a plain string;
 * the brand forces callers to go through `toIso8601` rather than passing
 * arbitrary strings where a timestamp is expected.
 *
 * Usage:
 *   const ts = toIso8601(new Date());   // only valid construction path
 *   const msg: Message = { ..., timestamp: ts };
 */
export type Iso8601String = string & { readonly __brand: "Iso8601String" };

/**
 * Construct an Iso8601String from a Date or a unix millisecond timestamp.
 * This is the only place where `as Iso8601String` is allowed — it is the
 * single validation gate for the brand.
 */
export function toIso8601(value: Date | number): Iso8601String {
  const d = typeof value === "number" ? new Date(value) : value;
  return d.toISOString() as Iso8601String;
}

// ---------------------------------------------------------------------------
// Platform identifiers
// ---------------------------------------------------------------------------

export type Platform = "chatgpt" | "gemini" | "grok" | "claude" | "deepseek";

// ---------------------------------------------------------------------------
// Message roles
// ---------------------------------------------------------------------------

/**
 * Standard roles present on all platforms.
 *
 * "thinking" — only emitted when the platform explicitly renders the
 * reasoning steps in the UI (e.g. DeepSeek's visible <think> block).
 * Never inferred, never scraped from hidden DOM nodes. If it's not
 * visible to the user, it doesn't exist in the schema.
 *
 * "system" covers Claude's system prompt when visible in the UI.
 */
export type MessageRole = "user" | "assistant" | "thinking" | "system";

// ---------------------------------------------------------------------------
// Message content — discriminated union, extensible without breaking adapters
// ---------------------------------------------------------------------------

/** Plain text content. The common case for all platforms. */
export interface TextContent {
  readonly type: "text";
  readonly text: string;
}

/**
 * Fenced code block extracted as a distinct content node.
 * `language` is the hint from the fence (e.g. "python", "typescript").
 * May be absent if the platform does not annotate language.
 */
export interface CodeContent {
  readonly type: "code";
  readonly code: string;
  readonly language?: string;
}

/**
 * Union of all content node types.
 * Adapters that only extract plain text always emit TextContent[].
 * Richer adapters may emit a mix.
 */
export type MessageContent = TextContent | CodeContent;

// ---------------------------------------------------------------------------
// Message
// ---------------------------------------------------------------------------

export interface Message {
  /** Discriminated role — never a raw string. */
  readonly role: MessageRole;

  /**
   * Ordered list of content nodes within this message.
   * A message with a single text block has content.length === 1.
   */
  readonly content: readonly MessageContent[];

  /**
   * Wall-clock timestamp of the message, if extractable from the DOM.
   * Absent when the platform does not expose timestamps.
   * Construct via toIso8601() — never assign a raw string.
   */
  readonly timestamp?: Iso8601String;
}

// ---------------------------------------------------------------------------
// Conversation
// ---------------------------------------------------------------------------

export interface Conversation {
  /** Platform that produced this conversation. */
  readonly platform: Platform;

  /**
   * Platform-native conversation identifier, if extractable from the URL
   * or DOM. Format is platform-specific and opaque to consumers.
   * Absent when the platform does not expose a stable ID.
   */
  readonly id?: string;

  /**
   * Conversation title as shown in the UI sidebar or page heading.
   * Absent when not extractable.
   */
  readonly title?: string;

  /** Ordered message turns. May be empty for a new/blank conversation. */
  readonly messages: readonly Message[];

  /**
   * Schema version at the time of export. Compare against SCHEMA_VERSION
   * to detect incompatible exports without parsing adapterVersion.
   */
  readonly schemaVersion: SchemaVersion;

  /**
   * Timestamp of when the export was performed.
   * Set by the adapter via toIso8601(Date.now()). Always present.
   */
  readonly exportedAt: Iso8601String;

  /**
   * Semver string of the adapter that produced this export.
   * Allows consumers to detect build-level drift across extension versions.
   */
  readonly adapterVersion: string;
}

// ---------------------------------------------------------------------------
// Adapter interface — every platform adapter must implement this
// ---------------------------------------------------------------------------

/**
 * The contract every content script adapter must satisfy.
 * `extract()` reads the live DOM and returns a Conversation or null
 * if the page is not in a state where extraction is possible
 * (e.g. loading, empty, or wrong URL).
 *
 * Adapters must never:
 *  - Make network requests
 *  - Mutate the DOM
 *  - Use `any` or type assertions without a narrowing guard
 *  - Import from other adapters
 */
export interface Adapter {
  readonly platform: Platform;
  readonly version: string;
  extract(): Conversation | null;
}

// ---------------------------------------------------------------------------
// Export result — what the adapter returns to the popup/background
// ---------------------------------------------------------------------------

export type ExportResult =
  | { readonly ok: true; readonly conversation: Conversation }
  | { readonly ok: false; readonly error: string };
