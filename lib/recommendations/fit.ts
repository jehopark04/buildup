import type { Activity } from "@/lib/activities";
import {
  type Grade,
  type Level,
  type UserProfile,
} from "@/lib/profile";
import { gradeRank, levelRank } from "./constants/fit";
import type {
  FitState,
  RecommendationConfidence,
  RecommendationFit,
} from "./types";

function getDistance<T extends Grade | Level>(
  current: T,
  allowed: T[],
  ranks: Record<T, number>,
) {
  return Math.min(...allowed.map((value) => Math.abs(ranks[current] - ranks[value])));
}

function getFitState<T extends Grade | Level>(
  current: T | null,
  allowed: T[],
  ranks: Record<T, number>,
): FitState {
  if (!current) {
    return "unknown";
  }

  const distance = getDistance(current, allowed, ranks);

  if (distance === 0) {
    return "fit";
  }

  if (distance === 1) {
    return "near";
  }

  return "far";
}

export function getRecommendationFit(
  profile: UserProfile,
  activity: Activity,
): RecommendationFit {
  const gradeFit = getFitState(profile.grade, activity.grades, gradeRank);
  const levelFit = getFitState(profile.level, activity.levels, levelRank);

  return {
    gradeFit,
    levelFit,
  };
}

export function getRecommendationConfidence(
  fit: Pick<RecommendationFit, "gradeFit" | "levelFit">,
): RecommendationConfidence {
  const unknownCount = [fit.gradeFit, fit.levelFit].filter(
    (state) => state === "unknown",
  ).length;

  if (unknownCount >= 2) {
    return "low";
  }

  if (unknownCount === 1) {
    return "medium";
  }

  return "high";
}
