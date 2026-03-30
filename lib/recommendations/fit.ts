import type { Activity } from "@/lib/activities";
import {
  normalizeActivityTypes,
  type Grade,
  type Level,
  type UserProfile,
} from "@/lib/profile";
import { gradeRank, levelRank } from "./constants/fit";
import type { FitState, RecommendationFit } from "./types";

function getDistance<T extends Grade | Level>(
  current: T,
  allowed: T[],
  ranks: Record<T, number>,
) {
  return Math.min(...allowed.map((value) => Math.abs(ranks[current] - ranks[value])));
}

function getFitState<T extends Grade | Level>(
  current: T,
  allowed: T[],
  ranks: Record<T, number>,
): FitState {
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
  const gradeFit = profile.grade
    ? getFitState(profile.grade, activity.grades, gradeRank)
    : "far";
  const levelFit = profile.level
    ? getFitState(profile.level, activity.levels, levelRank)
    : "far";
  const normalizedTypes = normalizeActivityTypes(profile.activityTypes);
  const typeMatched =
    !normalizedTypes.includes("all") &&
    normalizedTypes.some((activityType) => activity.activityTypes.includes(activityType));

  return {
    gradeFit,
    levelFit,
    normalizedTypes,
    typeMatched,
  };
}
