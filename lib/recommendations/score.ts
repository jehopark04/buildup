import { getRecruitmentStatusPriority, type Activity } from "@/lib/activities";
import {
  activityTypeMatchBonus,
  fitScoreMap,
  openStatusBonus,
  statusWeight,
} from "./constants/score";
import type { RecommendationFit, RecommendationMatch } from "./types";

export function getRecommendationScore(
  activity: Activity,
  fit: RecommendationFit,
) {
  return (
    fitScoreMap[fit.gradeFit].grade +
    fitScoreMap[fit.levelFit].level +
    getRecruitmentStatusPriority(activity.recruitmentStatus) * statusWeight +
    (activity.recruitmentStatus === "open" ? openStatusBonus : 0) +
    (fit.typeMatched ? activityTypeMatchBonus : 0)
  );
}

export function sortRecommendationMatches(
  left: RecommendationMatch,
  right: RecommendationMatch,
) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  const statusDiff =
    getRecruitmentStatusPriority(right.recruitmentStatus) -
    getRecruitmentStatusPriority(left.recruitmentStatus);

  if (statusDiff !== 0) {
    return statusDiff;
  }

  return right.lastVerifiedAt.localeCompare(left.lastVerifiedAt);
}
