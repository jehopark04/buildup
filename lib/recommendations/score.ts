import { getRecruitmentStatusPriority, type Activity } from "@/lib/activities";
import {
  activityTypeMatchBonus,
  fitScoreMap,
  openStatusBonus,
  statusWeight,
} from "./constants/score";
import { tierPriorityMap } from "./constants/tier";
import type {
  BreakdownDirection,
  RecommendationBreakdown,
  RecommendationFit,
  RecommendationMatch,
} from "./types";

function getDirection(value: number): BreakdownDirection {
  if (value > 0) {
    return "positive";
  }

  if (value < 0) {
    return "negative";
  }

  return "neutral";
}

export function getRecommendationScoreResult(
  activity: Activity,
  fit: RecommendationFit,
) {
  const breakdown: RecommendationBreakdown[] = [
    {
      key: "gradeFit",
      label: "학년 적합도",
      value: fitScoreMap[fit.gradeFit].grade,
      direction: getDirection(fitScoreMap[fit.gradeFit].grade),
    },
    {
      key: "levelFit",
      label: "수준 적합도",
      value: fitScoreMap[fit.levelFit].level,
      direction: getDirection(fitScoreMap[fit.levelFit].level),
    },
    {
      key: "recruitmentStatus",
      label: "모집 상태",
      value:
        getRecruitmentStatusPriority(activity.recruitmentStatus) * statusWeight +
        (activity.recruitmentStatus === "open" ? openStatusBonus : 0),
      direction: getDirection(
        getRecruitmentStatusPriority(activity.recruitmentStatus) * statusWeight +
          (activity.recruitmentStatus === "open" ? openStatusBonus : 0),
      ),
    },
    {
      key: "activityType",
      label: "관심 활동 유형",
      value: fit.typeMatched ? activityTypeMatchBonus : 0,
      direction: getDirection(fit.typeMatched ? activityTypeMatchBonus : 0),
    },
  ];

  const score = breakdown.reduce((sum, item) => sum + item.value, 0);

  return {
    score,
    breakdown,
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
