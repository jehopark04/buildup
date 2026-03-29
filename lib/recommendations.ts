import { activityCatalog, type Activity } from "@/lib/activities";
import {
  getActivityTypeLabel,
  getAvailabilityLabel,
  getGradeLabel,
  getLevelLabel,
  getTrackLabel,
  type UserProfile,
} from "@/lib/profile";

export type RecommendationMatch = Activity & {
  score: number;
  reasons: string[];
};

export type RecommendationTier = "best" | "next" | "low";

export type RecommendationSection = {
  tier: RecommendationTier;
  title: string;
  description: string;
  items: RecommendationMatch[];
};

export function getRecommendedActivities(
  profile: UserProfile,
  limit = activityCatalog.length,
): RecommendationMatch[] {
  return activityCatalog
    .map<RecommendationMatch>((activity) => {
      const reasons: string[] = [];
      let score = 0;

      if (profile.track && activity.tracks.includes(profile.track)) {
        score += 4;
        reasons.push(`${getTrackLabel(profile.track)} 직무와 직접 연결됩니다.`);
      }

      if (profile.grade && activity.grades.includes(profile.grade)) {
        score += 2;
        reasons.push(`${getGradeLabel(profile.grade)} 시점에 시도하기 좋습니다.`);
      }

      if (profile.level && activity.levels.includes(profile.level)) {
        score += 2;
        reasons.push(`${getLevelLabel(profile.level)} 단계와 잘 맞습니다.`);
      }

      if (profile.availability && activity.availabilities.includes(profile.availability)) {
        score += 2;
        reasons.push(`${getAvailabilityLabel(profile.availability)} 기준으로 소화 가능합니다.`);
      }

      const matchedTypes = profile.activityTypes.filter((activityType) =>
        activity.activityTypes.includes(activityType),
      );

      if (matchedTypes.length > 0) {
        score += Math.min(3, matchedTypes.length * 2);
        reasons.push(
          `${matchedTypes.map(getActivityTypeLabel).join(", ")} 유형 선호와 맞습니다.`,
        );
      }

      if (score <= 3) {
        reasons.push("현재 조건에서는 우선순위가 낮지만 탐색용으로는 볼 수 있습니다.");
      }

      return {
        ...activity,
        score,
        reasons,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function getRecommendationSections(profile: UserProfile): RecommendationSection[] {
  const ranked = getRecommendedActivities(profile);
  const best = ranked.slice(0, 2);
  const next = ranked.slice(2, 5);
  const low = ranked.slice(5);

  const sections: RecommendationSection[] = [
    {
      tier: "best",
      title: "가장 추천",
      description: "지금 바로 검토하거나 지원해도 되는 활동입니다.",
      items: best,
    },
    {
      tier: "next",
      title: "그 다음 추천",
      description: "조건은 잘 맞지만 이번 우선순위에서는 한 단계 뒤입니다.",
      items: next,
    },
    {
      tier: "low",
      title: "비추천",
      description: "현재 입력 기준으로는 우선순위가 낮은 활동입니다.",
      items: low,
    },
  ];

  return sections.filter((section) => section.items.length > 0);
}

export function getRecommendationTierLabel(tier: RecommendationTier) {
  if (tier === "best") {
    return "가장 추천";
  }

  if (tier === "next") {
    return "그 다음 추천";
  }

  return "비추천";
}

export function getRecommendationTierForActivity(
  profile: UserProfile,
  activityId: string,
): RecommendationTier | null {
  const section = getRecommendationSections(profile).find((item) =>
    item.items.some((activity) => activity.id === activityId),
  );

  return section?.tier ?? null;
}
