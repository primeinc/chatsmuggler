import { describe, expect, it } from "vitest";
import { SCHEMA_VERSION, toIso8601 } from "./types";

describe("toIso8601", () => {
  it("produces a valid ISO-8601 string from a Date", () => {
    const d = new Date("2024-01-15T12:00:00.000Z");
    expect(toIso8601(d)).toBe("2024-01-15T12:00:00.000Z");
  });

  it("produces a valid ISO-8601 string from a unix ms timestamp", () => {
    expect(toIso8601(0)).toBe("1970-01-01T00:00:00.000Z");
  });

  it("throws on NaN date", () => {
    expect(() => toIso8601(new Date(NaN))).toThrow(TypeError);
    expect(() => toIso8601(NaN)).toThrow(TypeError);
  });

  it("throws a descriptive message on NaN", () => {
    expect(() => toIso8601(NaN)).toThrow("toIso8601: invalid date value");
  });
});

describe("SCHEMA_VERSION", () => {
  it("is a semver string", () => {
    expect(SCHEMA_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
