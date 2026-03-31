import { describe, expect, it } from "vitest";
import type { Activity } from "@/lib/activities";
import type { UserProfile } from "@/lib/profile";
import { getRecommendationFit } from "@/lib/recommendations/fit";
import { getRecommendationScoreResult, sortRecommendationMatches } from "@/lib/recommendations/score";
import { buildRecommendationDecision, getRawTierFromScore } from "@/lib/recommendations/tier";
import type { RecommendationMatch } from "@/lib/recommendations/types";

const baseActivity: Activity = {
  id: "score-test-activity",
  title: "Score Test Activity",
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
  recruitmentStatus: "rolling",
  scheduleText: "수시",
  lastVerifiedAt: "2026-03-30",
  isKauInternal: false,
  tracks: ["frontend"],
  grades: ["junior"],
  levels: ["project"],
  activityTypes: ["project"],
};

function toMatch(
  activity: Activity,
  profile: UserProfile,
  activityId: string,
): RecommendationMatch {
  const fit = getRecommendationFit(profile, activity);
  const scoreResult = getRecommendationScoreResult(activity, fit);
  const rawTier = getRawTierFromScore(scoreResult.breakdown.rawScore);
  const decision = buildRecommendationDecision(rawTier, scoreResult.confidence);

  return {
    ...activity,
    id: activityId,
    score: scoreResult.score,
    confidence: scoreResult.confidence,
    rawTier: decision.rawTier,
    finalTier: decision.finalTier,
    decision,
    reasons: [],
    breakdown: {
      ...scoreResult.breakdown,
      rawTier: decision.rawTier,
      confidenceTier: decision.confidenceTier,
      finalTier: decision.finalTier,
      limitedBy: decision.limitedBy,
    },
    constraints: undefined,
    tier: decision.finalTier,
    gradeFit: fit.gradeFit,
    levelFit: fit.levelFit,
  };
}

describe("activity type bonus scoring", () => {
  it("does not change the final tier", () => {
    const profileWithoutTypeMatch: UserProfile = {
      track: "frontend",
      grade: null,
      level: "ready",
      activityTypes: ["all"],
    };
    const profileWithTypeMatch: UserProfile = {
      ...profileWithoutTypeMatch,
      activityTypes: ["project"],
    };
    const activity: Activity = {
      ...baseActivity,
      levels: ["project"],
    };

    const withoutTypeMatch = getRecommendationScoreResult(
      activity,
      getRecommendationFit(profileWithoutTypeMatch, activity),
    );
    const withTypeMatch = getRecommendationScoreResult(
      activity,
      getRecommendationFit(profileWithTypeMatch, activity),
    );
    const tierWithoutTypeMatch = buildRecommendationDecision(
      getRawTierFromScore(withoutTypeMatch.breakdown.rawScore),
      withoutTypeMatch.confidence,
    );
    const tierWithTypeMatch = buildRecommendationDecision(
      getRawTierFromScore(withTypeMatch.breakdown.rawScore),
      withTypeMatch.confidence,
    );

    expect(withoutTypeMatch.breakdown.rawScore).toBe(2.5);
    expect(withTypeMatch.breakdown.rawScore).toBe(2.5);
    expect(withoutTypeMatch.score).toBe(2.5);
    expect(withTypeMatch.score).toBe(3);
    expect(tierWithoutTypeMatch.finalTier).toBe("notNow");
    expect(tierWithTypeMatch.finalTier).toBe("notNow");
  });

  it("only improves ordering within the same tier", () => {
    const profileWithoutTypeMatch: UserProfile = {
      track: "frontend",
      grade: null,
      level: "ready",
      activityTypes: ["all"],
    };
    const profileWithTypeMatch: UserProfile = {
      ...profileWithoutTypeMatch,
      activityTypes: ["project"],
    };
    const activity: Activity = {
      ...baseActivity,
      levels: ["project"],
    };

    const withoutTypeMatch = toMatch(activity, profileWithoutTypeMatch, "without-type-match");
    const withTypeMatch = toMatch(activity, profileWithTypeMatch, "with-type-match");
    const sorted = [withoutTypeMatch, withTypeMatch].sort(sortRecommendationMatches);

    expect(withoutTypeMatch.finalTier).toBe(withTypeMatch.finalTier);
    expect(sorted[0].id).toBe("with-type-match");
    expect(sorted[1].id).toBe("without-type-match");
  });
});
