import { activityCatalog } from "@/lib/activities";
import type { UserProfile } from "@/lib/profile";
import { getRecommendationFit } from "./fit";
import { getRecommendationReasons } from "./reasons";
import { getRecommendationScore, sortRecommendationMatches } from "./score";
import { getTier } from "./tier";
import type { RecommendationMatch } from "./types";

function buildRecommendationMatch(
  profile: UserProfile,
  activity: (typeof activityCatalog)[number],
): RecommendationMatch {
  const fit = getRecommendationFit(profile, activity);

  return {
    ...activity,
    score: getRecommendationScore(activity, fit),
    reasons: getRecommendationReasons(activity, profile, fit).slice(0, 3),
    tier: getTier(fit.gradeFit, fit.levelFit),
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
