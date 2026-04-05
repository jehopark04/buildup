import { describe, expect, it } from "vitest";
import type { UserProfile } from "@/lib/profile";
import { getRecommendedActivities } from "@/lib/recommendations";
import {
  getRecommendationDisplaySections,
  getRecommendationDisplayTierLabel,
} from "@/lib/recommendations/presentation";

describe("recommendation presentation", () => {
  it("collapses track-only recommendations into one activity section", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: null,
      level: null,
    };

    const sections = getRecommendationDisplaySections(profile);
    const activities = getRecommendedActivities(profile);

    expect(sections).toHaveLength(1);
    expect(sections[0]?.tier).toBe("trackOnly");
    expect(sections[0]?.title).toBe("활동 추천");
    expect(sections[0]?.items.map((activity) => activity.id)).toEqual(
      activities.map((activity) => activity.id),
    );
  });

  it("keeps tier labels for precise recommendations", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: "junior",
      level: "project",
    };

    const sections = getRecommendationDisplaySections(profile);

    expect(sections.length).toBeGreaterThan(0);
    expect(sections.some((section) => section.tier === "trackOnly")).toBe(false);
    expect(getRecommendationDisplayTierLabel("precise", "notNow")).toBe(
      "지금은 비추천",
    );
  });

  it("uses a unified label in track-only mode", () => {
    expect(getRecommendationDisplayTierLabel("trackOnly", "best")).toBe(
      "활동 추천",
    );
    expect(getRecommendationDisplayTierLabel("trackOnly", "notNow")).toBe(
      "활동 추천",
    );
  });
});
