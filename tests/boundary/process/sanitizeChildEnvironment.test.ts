import { describe, expect, it } from "vitest";
import { sanitizeChildEnvironment } from "../../../src/process/ProviderProcess.js";

describe("sanitizeChildEnvironment", () => {
  it("filters sensitive auth tokens and credentials from child process environment", () => {
    const raw = {
      PATH: "/usr/bin:/bin",
      HOME: "/home/user",
      NRE_HTTP_AUTH_TOKEN: "super-secret-123",
      REA_HTTP_AUTH_TOKEN: "legacy-secret-456",
      MCP_AUTH_TOKEN: "secret-789",
      CUSTOM_AUTH_TOKEN: "custom-secret",
      API_SECRET_KEY: "secret-key",
      OPENAI_API_KEY: "sk-proj-xyz",
      AWS_SECRET_ACCESS_KEY: "aws-secret",
      GITHUB_TOKEN: "ghp_123456",
      GH_TOKEN: "ghp_abcdef",
      SAFE_CONFIG_FLAG: "true",
    };

    const sanitized = sanitizeChildEnvironment(raw);

    expect(sanitized.PATH).toBe("/usr/bin:/bin");
    expect(sanitized.HOME).toBe("/home/user");
    expect(sanitized.SAFE_CONFIG_FLAG).toBe("true");

    expect(sanitized.NRE_HTTP_AUTH_TOKEN).toBeUndefined();
    expect(sanitized.REA_HTTP_AUTH_TOKEN).toBeUndefined();
    expect(sanitized.MCP_AUTH_TOKEN).toBeUndefined();
    expect(sanitized.CUSTOM_AUTH_TOKEN).toBeUndefined();
    expect(sanitized.API_SECRET_KEY).toBeUndefined();
    expect(sanitized.OPENAI_API_KEY).toBeUndefined();
    expect(sanitized.AWS_SECRET_ACCESS_KEY).toBeUndefined();
    expect(sanitized.GITHUB_TOKEN).toBeUndefined();
    expect(sanitized.GH_TOKEN).toBeUndefined();
  });
});

