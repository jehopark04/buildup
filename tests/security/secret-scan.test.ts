import { describe, expect, it } from "vitest";
import { scanTextForSecrets } from "../../lib/security/secret-scan.mjs";

describe("secret scan rules", () => {
  it("fails on high-confidence secret assignments", () => {
    const findings = scanTextForSecrets({
      filePath: "app/example.ts",
      contents: 'const value = "DATABASE_URL=postgres://user:pass@host/db";',
    });

    expect(findings).toEqual([
      expect.objectContaining({
        lineNumber: 1,
        severity: "fail",
        label: "DATABASE_URL assignment",
      }),
    ]);
  });

  it("warns on sensitive identifier mentions without failing", () => {
    const findings = scanTextForSecrets({
      filePath: "docs/example.md",
      contents: "Set JWT_SECRET in the deployment secret store.",
    });

    expect(findings).toEqual([
      expect.objectContaining({
        lineNumber: 1,
        severity: "warn",
        label: "JWT_SECRET identifier",
      }),
    ]);
  });

  it("allows an explicitly annotated example line", () => {
    const findings = scanTextForSecrets({
      filePath: "docs/example.md",
      contents: [
        "<!-- security-scan: allow documentation example -->",
        "Use DATABASE_URL=postgres://example for local docs only.",
      ].join("\n"),
    });

    expect(findings).toEqual([]);
  });
});
