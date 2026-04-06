import { describe, expect, it } from "vitest";
import {
  assertSafeExternalHttpUrl,
  isSafeExternalHttpUrl,
  normalizeActivityIdParam,
} from "@/lib/security/url";

describe("URL and route param validation", () => {
  it("allows http and https external URLs", () => {
    expect(isSafeExternalHttpUrl("http://example.com")).toBe(true);
    expect(isSafeExternalHttpUrl("https://example.com/path?q=1")).toBe(true);
  });

  it("rejects dangerous or malformed URL schemes", () => {
    expect(isSafeExternalHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalHttpUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeExternalHttpUrl("/relative")).toBe(false);
  });

  it("throws on unsafe external URLs", () => {
    expect(() =>
      assertSafeExternalHttpUrl("javascript:alert(1)", "sourceUrl"),
    ).toThrow("sourceUrl: must be a valid absolute http(s) URL");
  });

  it("normalizes safe activity ids and rejects unsafe ones", () => {
    expect(normalizeActivityIdParam(" kau-project-x ")).toBe("kau-project-x");
    expect(normalizeActivityIdParam("")).toBeNull();
    expect(normalizeActivityIdParam("   ")).toBeNull();
    expect(normalizeActivityIdParam("<script>")).toBeNull();
    expect(normalizeActivityIdParam("kau/project")).toBeNull();
    expect(normalizeActivityIdParam("KauProject")).toBeNull();
  });
});
