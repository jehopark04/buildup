import { rawTierThresholds, tierLabelMap, tierPriorityMap } from "./constants/tier";
import type {
  RecommendationConstraints,
  RecommendationFit,
  RecommendationTier,
} from "./types";

export function getRawTierFromScore(score: number): RecommendationTier {
  if (score >= rawTierThresholds.best) {
    return "best";
  }

  if (score >= rawTierThresholds.conditional) {
    return "conditional";
  }

  return "notNow";
}

export function getRecommendationConstraints(
  fit: RecommendationFit,
): RecommendationConstraints | undefined {
  const notes: string[] = [];
  let maxAllowedTier: RecommendationTier | undefined;

  if (fit.gradeFit === "far" || fit.levelFit === "far") {
    maxAllowedTier = "notNow";
    notes.push("학년 또는 현재 수준 기준으로는 아직 이 활동을 상위 추천으로 올리기 어렵습니다.");
  } else if (fit.gradeFit === "near" && fit.levelFit === "near") {
    maxAllowedTier = "notNow";
    notes.push("학년과 현재 수준이 모두 한 단계씩 어긋나 현재 시점 효율이 낮습니다.");
  } else if (fit.gradeFit === "near" || fit.levelFit === "near") {
    maxAllowedTier = "conditional";
    notes.push("학년 또는 현재 수준 중 한 축이 한 단계 차이나 조건부 추천까지만 허용합니다.");
  }

  if (!maxAllowedTier && notes.length === 0) {
    return undefined;
  }

  return {
    maxAllowedTier,
    blocked: false,
    notes,
  };
}

export function applyTierConstraints(
  rawTier: RecommendationTier,
  constraints?: RecommendationConstraints,
): RecommendationTier {
  if (constraints?.blocked) {
    return "notNow";
  }

  if (!constraints?.maxAllowedTier) {
    return rawTier;
  }

  return tierPriorityMap[rawTier] <= tierPriorityMap[constraints.maxAllowedTier]
    ? rawTier
    : constraints.maxAllowedTier;
}

export function getRecommendationTierLabel(tier: RecommendationTier) {
  return tierLabelMap[tier];
}
