import { describe, expect, it } from "vitest";
import { buildProfileFromSearchParams } from "@/lib/profile";

describe("search params parsing", () => {
  it("preserves valid allowlisted values", () => {
    const profile = buildProfileFromSearchParams({
      track: "backend",
      grade: "junior",
      level: "project",
    });

    expect(profile).toEqual({
      track: "backend",
      grade: "junior",
      level: "project",
    });
  });

  it("ignores array values instead of trusting the first entry", () => {
    const profile = buildProfileFromSearchParams({
      track: ["frontend"],
      grade: ["junior"],
      level: ["project"],
    });

    expect(profile).toEqual({
      track: null,
      grade: null,
      level: null,
    });
  });

  it("trims valid values and discards empty or unknown values", () => {
    const profile = buildProfileFromSearchParams({
      track: " frontend ",
      grade: "   ",
      level: "unknown",
    });

    expect(profile).toEqual({
      track: "frontend",
      grade: null,
      level: null,
    });
  });

  it("returns null for garbage or xss-like input without throwing", () => {
    const profile = buildProfileFromSearchParams({
      track: "<script>alert(1)</script>",
      grade: "x".repeat(2048),
      level: undefined,
    });

    expect(profile).toEqual({
      track: null,
      grade: null,
      level: null,
    });
  });

  it("keeps null-like inputs as null", () => {
    const profile = buildProfileFromSearchParams({
      track: undefined,
      grade: "",
      level: "   ",
    });

    expect(profile).toEqual({
      track: null,
      grade: null,
      level: null,
    });
  });
});
