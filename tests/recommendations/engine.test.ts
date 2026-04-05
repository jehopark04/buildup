import { describe, expect, it } from "vitest";
import {
  getRecommendationForActivity,
  getRecommendedActivities,
} from "@/lib/recommendations";
import type { UserProfile } from "@/lib/profile";

describe("recommendation engine baseline", () => {
  it("returns no activities when track is missing", () => {
    const profile: UserProfile = {
      track: null,
      grade: "junior",
      level: "project",
    };

    expect(getRecommendedActivities(profile)).toEqual([]);
    expect(getRecommendationForActivity(profile, "kau-project-x")).toBeNull();
  });

  it("returns a recommendation for a known activity id", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: "junior",
      level: "project",
    };

    const recommendation = getRecommendationForActivity(profile, "kau-project-x");

    expect(recommendation).not.toBeNull();
    expect(recommendation?.id).toBe("kau-project-x");
    expect(recommendation?.tier).toBe(recommendation?.finalTier);
    expect(recommendation?.reasons.length).toBeGreaterThan(0);
  });

  it("keeps results ordered by final tier and score", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: "junior",
      level: "project",
    };

    const recommendations = getRecommendedActivities(profile);

    expect(recommendations.length).toBeGreaterThan(0);

    for (let index = 0; index < recommendations.length - 1; index += 1) {
      const current = recommendations[index];
      const next = recommendations[index + 1];
      const currentPriority =
        current.finalTier === "best" ? 2 : current.finalTier === "conditional" ? 1 : 0;
      const nextPriority =
        next.finalTier === "best" ? 2 : next.finalTier === "conditional" ? 1 : 0;

      expect(currentPriority).toBeGreaterThanOrEqual(nextPriority);

      if (current.finalTier === next.finalTier) {
        expect(current.score).toBeGreaterThanOrEqual(next.score);
      }
    }
  });
});
