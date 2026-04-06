import { describe, expect, it } from "vitest";
import type { Activity } from "@/lib/activities";
import type { UserProfile } from "@/lib/profile";
import { getRecommendationEligibility } from "@/lib/recommendations";
import { buildRecommendationDecision } from "@/lib/recommendations/tier";

const baseActivity: Activity = {
  id: "test-activity",
  title: "Test Activity",
  category: "교내 활동",
  summary: "Summary",
  details: "Details",
  cadence: "수시",
  estimatedTime: "1주",
  timeBasis: "기준",
  nextStep: "지원",
  sourceHint: "공식 안내",
  sourceName: "테스트 출처",
  sourceUrl: "https://example.com/activity",
  recruitmentStatus: "open",
  scheduleText: "수시",
  lastVerifiedAt: "2026-03-30",
  isKauInternal: false,
  tracks: ["frontend"],
  grades: ["junior"],
  levels: ["project"],
  activityTypes: ["project"],
};

describe("recommendation rules baseline", () => {
  it("caps low-confidence best recommendations to conditional", () => {
    const decision = buildRecommendationDecision("best", "low");

    expect(decision.confidenceTier).toBe("conditional");
    expect(decision.finalTier).toBe("conditional");
    expect(decision.limitedBy).toContain("confidence");
  });

  it("blocks a recommendation when grade eligibility is not met", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: "freshman",
      level: "project",
    };
    const activity: Activity = {
      ...baseActivity,
      eligibility: {
        minGrade: "junior",
      },
    };

    const constraints = getRecommendationEligibility(profile, activity);
    const decision = buildRecommendationDecision("best", "high", constraints);

    expect(constraints?.blocked).toBe(true);
    expect(constraints?.notes).toContain(
      "현재 학년 기준으로는 아직 지원 가능한 범위에 들어가지 않습니다.",
    );
    expect(decision.finalTier).toBe("notNow");
    expect(decision.limitedBy).toContain("blocked");
  });

  it("applies a maxAllowedTier cap when present", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: "junior",
      level: "project",
    };
    const activity: Activity = {
      ...baseActivity,
      eligibility: {
        maxAllowedTier: "conditional",
      },
    };

    const constraints = getRecommendationEligibility(profile, activity);
    const decision = buildRecommendationDecision("best", "high", constraints);

    expect(constraints?.blocked).toBe(false);
    expect(decision.confidenceTier).toBe("best");
    expect(decision.finalTier).toBe("conditional");
    expect(decision.limitedBy).toContain("maxAllowedTier");
  });
});
