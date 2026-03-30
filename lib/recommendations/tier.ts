import { rawTierThresholds, tierLabelMap, tierPriorityMap } from "./constants/tier";
import type {
  RecommendationConstraints,
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
