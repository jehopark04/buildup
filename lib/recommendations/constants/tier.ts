import type { RecommendationTier } from "../types";

export const tierLabelMap: Record<RecommendationTier, string> = {
  best: "가장 추천",
  conditional: "조건부 추천",
  notNow: "지금은 비추천",
};

export const sectionTitleMap: Record<RecommendationTier, string> = {
  best: "가장 추천",
  conditional: "조건부 추천",
  notNow: "지금은 비추천",
};

export const tierOrder: RecommendationTier[] = [
  "best",
  "conditional",
  "notNow",
];

export const rawTierThresholds = {
  best: 8.5,
  conditional: 3,
};

export const tierPriorityMap: Record<RecommendationTier, number> = {
  best: 2,
  conditional: 1,
  notNow: 0,
};
