import type { Activity } from "@/lib/activities";
import type { ActivityType } from "@/lib/profile";

export type RecommendationTier = "best" | "conditional" | "notNow";
export type FitState = "fit" | "near" | "far" | "unknown";
export type RecommendationConfidence = "high" | "medium" | "low";

export type RecommendationFit = {
  gradeFit: FitState;
  levelFit: FitState;
  normalizedTypes: ActivityType[];
  typeMatched: boolean;
};

export type RecommendationBreakdown = {
  gradeFit: FitState;
  levelFit: FitState;
  gradeScore: number;
  levelScore: number;
  recruitmentStatusScore: number;
  activityTypeScore: number;
  rawScore: number;
  confidence: RecommendationConfidence;
  rawTier: RecommendationTier;
  finalTier: RecommendationTier;
  constraints?: RecommendationConstraints;
};

export type RecommendationConstraints = {
  maxAllowedTier?: RecommendationTier;
  blocked?: boolean;
  notes: string[];
};

export type RecommendationResult = {
  score: number;
  confidence: RecommendationConfidence;
  rawTier: RecommendationTier;
  finalTier: RecommendationTier;
  reasons: string[];
  breakdown: RecommendationBreakdown;
  constraints?: RecommendationConstraints;
};

export type RecommendationMatch = Activity & {
  score: RecommendationResult["score"];
  confidence: RecommendationResult["confidence"];
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
