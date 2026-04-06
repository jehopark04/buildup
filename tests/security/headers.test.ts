import { describe, expect, it } from "vitest";
import { buildSecurityHeaders } from "@/lib/security/headers";

function getHeaderValue(
  headers: ReturnType<typeof buildSecurityHeaders>,
  key: string,
) {
  return headers.find((header) => header.key === key)?.value;
}

describe("security headers", () => {
  it("includes the baseline security headers", () => {
    const headers = buildSecurityHeaders({ isDev: false });

    expect(getHeaderValue(headers, "Strict-Transport-Security")).toBe(
      "max-age=31536000",
    );
    expect(getHeaderValue(headers, "X-Content-Type-Options")).toBe("nosniff");
    expect(getHeaderValue(headers, "Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(getHeaderValue(headers, "X-Frame-Options")).toBe("DENY");
    expect(getHeaderValue(headers, "Permissions-Policy")).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
  });

  it("uses a production-safe CSP by default", () => {
    const csp = getHeaderValue(
      buildSecurityHeaders({ isDev: false }),
      "Content-Security-Policy",
    );

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("http://");
    expect(csp).not.toContain("https://");
  });

  it("adds dev-only script allowances for local development", () => {
    const csp = getHeaderValue(
      buildSecurityHeaders({ isDev: true }),
      "Content-Security-Policy",
    );

    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });
});
