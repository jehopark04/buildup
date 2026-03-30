import type { Activity } from "@/lib/activities";
import type { ActivityType } from "@/lib/profile";

export type RecommendationTier = "best" | "conditional" | "notNow";
export type FitState = "fit" | "near" | "far";

export type RecommendationFit = {
  gradeFit: FitState;
  levelFit: FitState;
  normalizedTypes: ActivityType[];
  typeMatched: boolean;
};

export type RecommendationMatch = Activity & {
  score: number;
  reasons: string[];
  tier: RecommendationTier;
  gradeFit: FitState;
  levelFit: FitState;
};

export type RecommendationSection = {
  tier: RecommendationTier;
  title: string;
  description: string;
  items: RecommendationMatch[];
};
