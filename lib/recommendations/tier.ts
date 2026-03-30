import {
  confidenceTierCapMap,
  rawTierThresholds,
  tierLabelMap,
  tierPriorityMap,
} from "./constants/tier";
import type {
  RecommendationConfidence,
  RecommendationDecision,
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

export function applyConfidenceCap(
  rawTier: RecommendationTier,
  confidence: RecommendationConfidence,
): RecommendationTier {
  const maxAllowedTier = confidenceTierCapMap[confidence];

  if (!maxAllowedTier) {
    return rawTier;
  }

  return tierPriorityMap[rawTier] <= tierPriorityMap[maxAllowedTier]
    ? rawTier
    : maxAllowedTier;
}

export function getRecommendationTierLabel(tier: RecommendationTier) {
  return tierLabelMap[tier];
}

export function buildRecommendationDecision(
  rawTier: RecommendationTier,
  confidence: RecommendationConfidence,
  constraints?: RecommendationConstraints,
): RecommendationDecision {
  const confidenceTier = applyConfidenceCap(rawTier, confidence);
  const finalTier = applyTierConstraints(confidenceTier, constraints);
  const limitedBy: RecommendationDecision["limitedBy"] = [];

  if (confidenceTier !== rawTier) {
    limitedBy.push("confidence");
  }

  if (constraints?.blocked) {
    limitedBy.push("blocked");
  } else if (constraints?.maxAllowedTier && finalTier !== confidenceTier) {
    limitedBy.push("maxAllowedTier");
  }

  return {
    rawTier,
    confidenceTier,
    finalTier,
    limitedBy,
  };
}
