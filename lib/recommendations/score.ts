import { getRecruitmentStatusPriority, type Activity } from "@/lib/activities";
import {
  activityTypeMatchBonus,
  fitScoreMap,
  openStatusBonus,
  statusWeight,
} from "./constants/score";
import { tierPriorityMap } from "./constants/tier";
import {
  getRecommendationConfidence,
} from "./fit";
import type {
  RecommendationBreakdown,
  RecommendationFit,
  RecommendationMatch,
} from "./types";

export function getRecommendationScoreResult(
  activity: Activity,
  fit: RecommendationFit,
) {
  const confidence = getRecommendationConfidence(fit);
  const gradeScore = fitScoreMap[fit.gradeFit].grade;
  const levelScore = fitScoreMap[fit.levelFit].level;
  const recruitmentStatusScore =
    getRecruitmentStatusPriority(activity.recruitmentStatus) * statusWeight +
    (activity.recruitmentStatus === "open" ? openStatusBonus : 0);
  const activityTypeScore = fit.typeMatched ? activityTypeMatchBonus : 0;
  const rawScore = gradeScore + levelScore + recruitmentStatusScore;
  const rankingScore = rawScore + activityTypeScore;

  return {
    score: rankingScore,
    confidence,
    breakdown: {
      gradeFit: fit.gradeFit,
      levelFit: fit.levelFit,
      gradeScore,
      levelScore,
      recruitmentStatusScore,
      activityTypeScore,
      rawScore,
      rankingScore,
      confidence,
      rawTier: "notNow",
      confidenceTier: "notNow",
      finalTier: "notNow",
      limitedBy: [],
    } satisfies RecommendationBreakdown,
  };
}

export function sortRecommendationMatches(
  left: RecommendationMatch,
  right: RecommendationMatch,
) {
  const tierDiff = tierPriorityMap[right.finalTier] - tierPriorityMap[left.finalTier];

  if (tierDiff !== 0) {
    return tierDiff;
  }

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
