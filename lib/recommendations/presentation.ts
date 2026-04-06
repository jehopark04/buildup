import {
  getRecommendationInputState,
  getTrackLabel,
  type RecommendationInputState,
  type UserProfile,
} from "@/lib/profile";
import { getRecommendedActivities } from "./engine";
import { getRecommendationSections } from "./sections";
import { getRecommendationTierLabel } from "./tier";
import type { RecommendationMatch, RecommendationTier } from "./types";

export type RecommendationDisplaySection = {
  id: string;
  tier: RecommendationTier | "trackOnly";
  title: string;
  description: string;
  items: RecommendationMatch[];
};

const unifiedRecommendationLabel = "활동 추천";

export function shouldUseUnifiedRecommendationPresentation(
  inputState: RecommendationInputState,
) {
  return inputState === "trackOnly";
}

export function getRecommendationDisplaySections(
  profile: UserProfile,
): RecommendationDisplaySection[] {
  const inputState = getRecommendationInputState(profile);

  if (!shouldUseUnifiedRecommendationPresentation(inputState)) {
    return getRecommendationSections(profile).map((section) => ({
      id: section.tier,
      ...section,
    }));
  }

  const items = getRecommendedActivities(profile);

  if (items.length === 0) {
    return [];
  }

  return [
    {
      id: "trackOnly",
      tier: "trackOnly",
      title: unifiedRecommendationLabel,
      description: `${getTrackLabel(profile.track)} 직무와 맞는 활동을 모두 모아봤습니다.`,
      items,
    },
  ];
}

export function getRecommendationDisplayTierLabel(
  inputState: RecommendationInputState,
  tier: RecommendationTier,
) {
  if (shouldUseUnifiedRecommendationPresentation(inputState)) {
    return unifiedRecommendationLabel;
  }

  return getRecommendationTierLabel(tier);
}
