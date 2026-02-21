import type { Adapter, Conversation } from "../common/types.ts";

export const adapter: Adapter = {
  platform: "claude",
  version: "0.1.0",
  extract(): Conversation | null {
    // TODO: implement DOM extraction using toIso8601 + SCHEMA_VERSION
    return null;
  },
};
