import { activityCatalog } from "@/lib/activities";
import type { UserProfile } from "@/lib/profile";
import { getRecommendationEligibility } from "./eligibility";
import { getRecommendationFit } from "./fit";
import { getRecommendationReasons } from "./reasons";
import { getRecommendationScoreResult, sortRecommendationMatches } from "./score";
import {
  applyTierConstraints,
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
  const finalTier = applyTierConstraints(rawTier, constraints);
  const breakdown = {
    ...scoreResult.breakdown,
    rawTier,
    finalTier,
    constraints,
  };

  const reasons = getRecommendationReasons(activity, profile, fit, {
    breakdown,
    constraints,
  }).slice(0, 3);

  return {
    ...activity,
    score: scoreResult.score,
    rawTier,
    finalTier,
    reasons,
    breakdown,
    constraints,
    tier: finalTier,
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
