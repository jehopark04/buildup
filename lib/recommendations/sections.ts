import { getTrackLabel, type UserProfile } from "@/lib/profile";
import { sectionTitleMap, tierOrder } from "./constants/tier";
import { getRecommendedActivities } from "./engine";
import type {
  RecommendationSection,
  RecommendationTier,
} from "./types";

function getSectionDescription(
  tier: RecommendationTier,
  trackLabel: string,
) {
  if (tier === "best") {
    return `${trackLabel} 관련 활동 중 지금 학년과 수준에 바로 맞는 카드입니다.`;
  }

  if (tier === "conditional") {
    return `${trackLabel} 관련 활동이지만 지금 시점에서는 한 단계 조정이 필요한 카드입니다.`;
  }

  return `${trackLabel} 관련 활동이지만 현재 단계에서는 효율이 낮은 카드입니다.`;
}

export function getRecommendationSections(
  profile: UserProfile,
): RecommendationSection[] {
  const ranked = getRecommendedActivities(profile);
  const trackLabel = getTrackLabel(profile.track);

  return tierOrder
    .map((tier) => ({
      tier,
      title: sectionTitleMap[tier],
      description: getSectionDescription(tier, trackLabel),
      items: ranked.filter((activity) => activity.finalTier === tier),
    }))
    .filter((section) => section.items.length > 0);
}
