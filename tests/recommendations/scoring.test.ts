import { describe, expect, it } from "vitest";
import type { Activity } from "@/lib/activities";
import type { UserProfile } from "@/lib/profile";
import { getRecommendationFit } from "@/lib/recommendations/fit";
import {
  getRecommendationScoreResult,
  sortRecommendationMatches,
} from "@/lib/recommendations/score";
import {
  buildRecommendationDecision,
  getRawTierFromScore,
} from "@/lib/recommendations/tier";
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

describe("recommendation scoring", () => {
  it("uses only grade, level, and recruitment status in score calculation", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: null,
      level: "ready",
    };
    const activity: Activity = {
      ...baseActivity,
      levels: ["project"],
    };

    const result = getRecommendationScoreResult(
      activity,
      getRecommendationFit(profile, activity),
    );

    expect(result.breakdown.gradeScore).toBe(0.5);
    expect(result.breakdown.levelScore).toBe(2);
    expect(result.breakdown.recruitmentStatusScore).toBe(0);
    expect(result.breakdown.rawScore).toBe(2.5);
    expect(result.breakdown.rankingScore).toBe(2.5);
    expect(result.score).toBe(2.5);
  });

  it("falls back to recency when tier and score are tied", () => {
    const profile: UserProfile = {
      track: "frontend",
      grade: "junior",
      level: "project",
    };
    const older = toMatch(baseActivity, profile, "older");
    const newer = toMatch(
      {
        ...baseActivity,
        lastVerifiedAt: "2026-04-10",
      },
      profile,
      "newer",
    );

    const sorted = [older, newer].sort(sortRecommendationMatches);

    expect(older.finalTier).toBe(newer.finalTier);
    expect(older.score).toBe(newer.score);
    expect(sorted[0]?.id).toBe("newer");
    expect(sorted[1]?.id).toBe("older");
  });
});
