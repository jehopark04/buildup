import { formatVerifiedDate, type Activity } from "@/lib/activities";
import {
  getActivityTypeLabel,
  getGradeLabel,
  getLevelLabel,
  type UserProfile,
} from "@/lib/profile";
import type { FitState, RecommendationFit } from "./types";

function getGradeReason(
  activity: Activity,
  profile: UserProfile,
  gradeFit: FitState,
) {
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

function getLevelReason(
  activity: Activity,
  profile: UserProfile,
  levelFit: FitState,
) {
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

export function getRecommendationReasons(
  activity: Activity,
  profile: UserProfile,
  fit: RecommendationFit,
) {
  return [
    getGradeReason(activity, profile, fit.gradeFit),
    getLevelReason(activity, profile, fit.levelFit),
    fit.typeMatched
      ? `관심 활동 유형인 ${fit.normalizedTypes.map(getActivityTypeLabel).join(", ")}와도 맞습니다.`
      : getStatusReason(activity),
  ].filter((reason): reason is string => Boolean(reason));
}
