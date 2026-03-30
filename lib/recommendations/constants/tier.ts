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
