import { describe, expect, it } from "vitest";
import { scanTextForDangerousRendering } from "../../lib/security/render-scan.mjs";

describe("dangerous rendering scan rules", () => {
  it("detects dangerous jsx rendering helpers", () => {
    const findings = scanTextForDangerousRendering({
      filePath: "components/example.tsx",
      contents: "<div dangerouslySetInnerHTML={{ __html: html }} />",
    });

    expect(findings).toEqual([
      expect.objectContaining({
        lineNumber: 1,
        severity: "fail",
        label: "dangerouslySetInnerHTML",
      }),
    ]);
  });

  it("detects direct DOM HTML assignment", () => {
    const findings = scanTextForDangerousRendering({
      filePath: "components/example.ts",
      contents: "node.innerHTML = userProvidedMarkup;",
    });

    expect(findings).toEqual([
      expect.objectContaining({
        lineNumber: 1,
        severity: "fail",
        label: "innerHTML assignment",
      }),
    ]);
  });

  it("allows an explicitly annotated exception line", () => {
    const findings = scanTextForDangerousRendering({
      filePath: "components/example.tsx",
      contents: [
        "// security-scan: allow approved sanitizer wrapper",
        "<div dangerouslySetInnerHTML={{ __html: trustedHtml }} />",
      ].join("\n"),
    });

    expect(findings).toEqual([]);
  });
});
