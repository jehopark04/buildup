import { activityCatalog } from "@/lib/activities";
import type { UserProfile } from "@/lib/profile";
import { getRecommendationEligibility } from "./eligibility";
import { getRecommendationFit } from "./fit";
import { getRecommendationReasonParts } from "./reasons";
import { getRecommendationScoreResult, sortRecommendationMatches } from "./score";
import {
  buildRecommendationDecision,
  getRawTierFromScore,
} from "./tier";
import type { RecommendationMatch } from "./types";

function buildRecommendationMatch(
  profile: UserProfile,
  activity: (typeof activityCatalog)[number],
): RecommendationMatch {
  const fit = getRecommendationFit(profile, activity);
  const scoreResult = getRecommendationScoreResult(activity, fit);
  const rawTier = getRawTierFromScore(scoreResult.score);
  const constraints = getRecommendationEligibility(profile, activity);
  const decision = buildRecommendationDecision(
    rawTier,
    scoreResult.confidence,
    constraints,
  );
  const breakdown = {
    ...scoreResult.breakdown,
    rawTier: decision.rawTier,
    confidenceTier: decision.confidenceTier,
    finalTier: decision.finalTier,
    limitedBy: decision.limitedBy,
    constraints,
  };

  const reasonParts = getRecommendationReasonParts(activity, profile, fit, {
    decision,
    breakdown,
    constraints,
  });
  const reasons = [
    reasonParts.constraintReason,
    reasonParts.primaryReason,
    ...reasonParts.supportingReasons,
  ].filter((reason): reason is string => Boolean(reason)).slice(0, 3);

  return {
    ...activity,
    score: scoreResult.score,
    confidence: scoreResult.confidence,
    rawTier: decision.rawTier,
    finalTier: decision.finalTier,
    decision,
    reasons,
    breakdown,
    constraints,
    tier: decision.finalTier,
    gradeFit: fit.gradeFit,
    levelFit: fit.levelFit,
  };
}

export function getRecommendedActivities(
  profile: UserProfile,
  limit = activityCatalog.length,
): RecommendationMatch[] {
  if (!profile.track) {
    return [];
  }

  const track = profile.track;

  return activityCatalog
    .filter((activity) => activity.tracks.includes(track))
    .map((activity) => buildRecommendationMatch(profile, activity))
    .sort(sortRecommendationMatches)
    .slice(0, limit);
}

export function getRecommendationForActivity(
  profile: UserProfile,
  activityId: string,
) {
  return getRecommendedActivities(profile).find((activity) => activity.id === activityId) ?? null;
}
