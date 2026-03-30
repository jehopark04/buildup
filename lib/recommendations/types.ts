import type { Activity } from "@/lib/activities";
import type { ActivityType } from "@/lib/profile";

export type RecommendationTier = "best" | "conditional" | "notNow";
export type FitState = "fit" | "near" | "far";
export type BreakdownDirection = "positive" | "negative" | "neutral";

export type RecommendationFit = {
  gradeFit: FitState;
  levelFit: FitState;
  normalizedTypes: ActivityType[];
  typeMatched: boolean;
};

export type RecommendationBreakdown = {
  key:
    | "gradeFit"
    | "levelFit"
    | "recruitmentStatus"
    | "activityType";
  label: string;
  value: number;
  direction: BreakdownDirection;
};

export type RecommendationConstraints = {
  maxAllowedTier?: RecommendationTier;
  blocked?: boolean;
  notes?: string[];
};

export type RecommendationResult = {
  score: number;
  rawTier: RecommendationTier;
  finalTier: RecommendationTier;
  reasons: string[];
  breakdown: RecommendationBreakdown[];
  constraints?: RecommendationConstraints;
};

export type RecommendationMatch = Activity & {
  score: RecommendationResult["score"];
  rawTier: RecommendationResult["rawTier"];
  finalTier: RecommendationResult["finalTier"];
  reasons: RecommendationResult["reasons"];
  breakdown: RecommendationResult["breakdown"];
  constraints?: RecommendationResult["constraints"];
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
