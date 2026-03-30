import {
  activityCatalog,
  formatVerifiedDate,
  getRecruitmentStatusPriority,
  type Activity,
} from "@/lib/activities";
import {
  getActivityTypeLabel,
  getGradeLabel,
  getLevelLabel,
  getTrackLabel,
  normalizeActivityTypes,
  type Grade,
  type Level,
  type UserProfile,
} from "@/lib/profile";

export type RecommendationTier = "best" | "conditional" | "notNow";
export type FitState = "fit" | "near" | "far";

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

const gradeRank: Record<Grade, number> = {
  freshman: 1,
  sophomore: 2,
  junior: 3,
  senior: 4,
};

const levelRank: Record<Level, number> = {
  explore: 1,
  basic: 2,
  project: 3,
  ready: 4,
};

function getDistance<T extends Grade | Level>(
  current: T,
  allowed: T[],
  ranks: Record<T, number>,
) {
  return Math.min(...allowed.map((value) => Math.abs(ranks[current] - ranks[value])));
}

function getFitState<T extends Grade | Level>(
  current: T,
  allowed: T[],
  ranks: Record<T, number>,
): FitState {
  const distance = getDistance(current, allowed, ranks);

  if (distance === 0) {
    return "fit";
  }

  if (distance === 1) {
    return "near";
  }

  return "far";
}

function getTier(gradeFit: FitState, levelFit: FitState): RecommendationTier {
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

function getScoreFromFit(fit: FitState, fitScore: number, nearScore: number, farScore: number) {
  if (fit === "fit") {
    return fitScore;
  }

  if (fit === "near") {
    return nearScore;
  }

  return farScore;
}

function getGradeReason(activity: Activity, profile: UserProfile, gradeFit: FitState) {
  if (!profile.grade) {
    return null;
  }

  if (gradeFit === "fit") {
    return `${getGradeLabel(profile.grade)} 시점에 바로 도전해볼 만합니다.`;
  }

  const recommendedGrades = activity.grades.map((grade) => getGradeLabel(grade)).join(", ");

  if (gradeFit === "near") {
    return `보통 ${recommendedGrades} 구간에서 많이 보는 활동이라 학년 타이밍이 한 단계 정도 차이납니다.`;
  }

  return `주로 ${recommendedGrades}에서 효율이 나는 활동이라 현재 학년에서는 우선순위를 낮추는 편이 낫습니다.`;
}

function getLevelReason(activity: Activity, profile: UserProfile, levelFit: FitState) {
  if (!profile.level) {
    return null;
  }

  if (levelFit === "fit") {
    return `${getLevelLabel(profile.level)} 단계에서 바로 활용하기 좋습니다.`;
  }

  const recommendedLevels = activity.levels.map((level) => getLevelLabel(level)).join(", ");

  if (levelFit === "near") {
    return `${recommendedLevels} 단계에 더 잘 맞아 지금은 약간 빠르거나 쉬울 수 있습니다.`;
  }

  return `${recommendedLevels} 단계에 더 맞는 카드라 지금 붙이면 효율이 낮을 수 있습니다.`;
}

function getStatusReason(activity: Activity) {
  if (activity.recruitmentStatus === "open") {
    return "현재 모집 중이라 바로 확인해도 됩니다.";
  }

  if (activity.recruitmentStatus === "upcoming") {
    return "차기 모집이 예정된 성격이라 미리 준비해 두기 좋습니다.";
  }

  return `상시 확인형 채널이라 ${formatVerifiedDate(activity.lastVerifiedAt)} 기준 링크를 저장해 두는 편이 좋습니다.`;
}

function scoreActivity(profile: UserProfile, activity: Activity): RecommendationMatch {
  const gradeFit = profile.grade
    ? getFitState(profile.grade, activity.grades, gradeRank)
    : "far";
  const levelFit = profile.level
    ? getFitState(profile.level, activity.levels, levelRank)
    : "far";
  const normalizedTypes = normalizeActivityTypes(profile.activityTypes);
  const typeMatched =
    !normalizedTypes.includes("all") &&
    normalizedTypes.some((activityType) => activity.activityTypes.includes(activityType));

  const score =
    getScoreFromFit(gradeFit, 6, 2, -6) +
    getScoreFromFit(levelFit, 5, 1, -5) +
    getRecruitmentStatusPriority(activity.recruitmentStatus) * 0.5 +
    (activity.recruitmentStatus === "open" ? 0.5 : 0) +
    (typeMatched ? 0.5 : 0);

  const reasons = [
    getGradeReason(activity, profile, gradeFit),
    getLevelReason(activity, profile, levelFit),
    typeMatched
      ? `관심 활동 유형인 ${normalizedTypes.map(getActivityTypeLabel).join(", ")}와도 맞습니다.`
      : getStatusReason(activity),
  ].filter((reason): reason is string => Boolean(reason));

  return {
    ...activity,
    score,
    reasons: reasons.slice(0, 3),
    tier: getTier(gradeFit, levelFit),
    gradeFit,
    levelFit,
  };
}

export function getRecommendedActivities(
  profile: UserProfile,
  limit = activityCatalog.length,
): RecommendationMatch[] {
  if (!profile.track) {
    return [];
  }

  const track = profile.track;

  return activityCatalog
    .filter((activity) => activity.tracks.includes(track))
    .map((activity) => scoreActivity(profile, activity))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      const statusDiff =
        getRecruitmentStatusPriority(right.recruitmentStatus) -
        getRecruitmentStatusPriority(left.recruitmentStatus);

      if (statusDiff !== 0) {
        return statusDiff;
      }

      return right.lastVerifiedAt.localeCompare(left.lastVerifiedAt);
    })
    .slice(0, limit);
}

export function getRecommendationSections(profile: UserProfile): RecommendationSection[] {
  const ranked = getRecommendedActivities(profile);

  const sectionMeta: Record<
    RecommendationTier,
    Omit<RecommendationSection, "items">
  > = {
    best: {
      tier: "best",
      title: "가장 추천",
      description: `${getTrackLabel(profile.track)} 관련 활동 중 지금 학년과 수준에 바로 맞는 카드입니다.`,
    },
    conditional: {
      tier: "conditional",
      title: "조건부 추천",
      description: `${getTrackLabel(profile.track)} 관련 활동이지만 지금 시점에서는 한 단계 조정이 필요한 카드입니다.`,
    },
    notNow: {
      tier: "notNow",
      title: "지금은 비추천",
      description: `${getTrackLabel(profile.track)} 관련 활동이지만 현재 단계에서는 효율이 낮은 카드입니다.`,
    },
  };

  return (Object.keys(sectionMeta) as RecommendationTier[])
    .map((tier) => ({
      ...sectionMeta[tier],
      items: ranked.filter((activity) => activity.tier === tier),
    }))
    .filter((section) => section.items.length > 0);
}

export function getRecommendationTierLabel(tier: RecommendationTier) {
  if (tier === "best") {
    return "가장 추천";
  }

  if (tier === "conditional") {
    return "조건부 추천";
  }

  return "지금은 비추천";
}

export function getRecommendationForActivity(
  profile: UserProfile,
  activityId: string,
) {
  return getRecommendedActivities(profile).find((activity) => activity.id === activityId) ?? null;
}
