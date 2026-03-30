import { tierLabelMap } from "./constants/tier";
import type { FitState, RecommendationTier } from "./types";

export function getTier(
  gradeFit: FitState,
  levelFit: FitState,
): RecommendationTier {
  if (gradeFit === "fit" && levelFit === "fit") {
    return "best";
  }

  if (
    gradeFit === "far" ||
    levelFit === "far" ||
    (gradeFit === "near" && levelFit === "near")
  ) {
    return "notNow";
  }

  return "conditional";
}

export function getRecommendationTierLabel(tier: RecommendationTier) {
  return tierLabelMap[tier];
}
