import { formatVerifiedDate, type Activity } from "@/lib/activities";
import {
  getGradeLabel,
  getLevelLabel,
  type UserProfile,
} from "@/lib/profile";
import type {
  FitState,
  RecommendationConfidence,
  RecommendationFit,
  RecommendationResult,
  RecommendationTier,
} from "./types";

export type RecommendationReasonParts = {
  constraintReason: string | null;
  primaryReason: string | null;
  supportingReasons: string[];
};

function getGradeReason(
  activity: Activity,
  profile: UserProfile,
  gradeFit: FitState,
) {
  if (gradeFit === "unknown" || !profile.grade) {
    return "학년 정보가 없어 학년 적합도는 보수적으로만 판단했습니다.";
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
  if (levelFit === "unknown" || !profile.level) {
    return "현재 수준 정보가 없어 요구 수준 적합도는 보수적으로만 판단했습니다.";
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

function trimPeriod(text: string) {
  return text.replace(/[.]$/u, "");
}

function getStageReason(
  activity: Activity,
  profile: UserProfile,
  fit: RecommendationFit,
  levelScore: number,
  gradeScore: number,
) {
  if (fit.gradeFit === "unknown" && fit.levelFit === "unknown") {
    return "학년과 현재 수준 정보가 모두 없어 단계 적합도는 보수적으로만 봤습니다.";
  }

  if (fit.gradeFit === "unknown" && fit.levelFit !== "unknown") {
    return "현재 수준은 반영했지만 학년 정보가 없어 단계 적합도는 보수적으로만 봤습니다.";
  }

  if (fit.levelFit === "unknown" && fit.gradeFit !== "unknown") {
    return "학년은 반영했지만 현재 수준 정보가 없어 단계 적합도는 보수적으로만 봤습니다.";
  }

  if (fit.gradeFit === "fit" && fit.levelFit === "fit") {
    return "학년과 현재 수준이 모두 잘 맞습니다.";
  }

  if (fit.gradeFit === "near" && fit.levelFit === "near") {
    return "학년과 현재 수준이 모두 한 단계 정도 차이납니다.";
  }

  if (fit.levelFit === "far") {
    return trimPeriod(getLevelReason(activity, profile, fit.levelFit));
  }

  if (fit.gradeFit === "far") {
    return trimPeriod(getGradeReason(activity, profile, fit.gradeFit));
  }

  if (levelScore >= gradeScore) {
    return trimPeriod(getLevelReason(activity, profile, fit.levelFit));
  }

  return trimPeriod(getGradeReason(activity, profile, fit.gradeFit));
}

function getTierConclusion(tier: RecommendationTier) {
  if (tier === "best") {
    return "그래서 현재 입력 기준 가장 추천입니다.";
  }

  if (tier === "conditional") {
    return "그래서 현재 입력 기준 조건부 추천입니다.";
  }

  return "그래서 현재 입력 기준 지금은 비추천입니다.";
}

function withoutLeadingConnector(text: string) {
  return text.replace(/^그래서\s/u, "");
}

function getConstraintReason(
  decision: RecommendationResult["decision"],
  constraints: RecommendationResult["constraints"],
) {
  const primaryConstraintNote = constraints?.notes[0] ?? null;

  if (decision.limitedBy.includes("blocked")) {
    return primaryConstraintNote
      ? `${primaryConstraintNote} ${getTierConclusion(decision.finalTier)}`
      : `현재 지원 가능 조건을 충족하지 못해 ${withoutLeadingConnector(getTierConclusion(decision.finalTier))}`;
  }

  if (decision.limitedBy.includes("maxAllowedTier")) {
    return primaryConstraintNote
      ? `${primaryConstraintNote} ${getTierConclusion(decision.finalTier)}`
      : `활동 권장 조건을 반영해 ${withoutLeadingConnector(getTierConclusion(decision.finalTier))}`;
  }

  if (decision.limitedBy.includes("confidence")) {
    return `입력 정보가 부족해 ${withoutLeadingConnector(getTierConclusion(decision.finalTier))}`;
  }

  return null;
}

function getPrimaryReason(
  activity: Activity,
  profile: UserProfile,
  fit: RecommendationFit,
  result: Pick<RecommendationResult, "breakdown" | "decision">,
  hasConstraintReason: boolean,
) {
  const stageReason = getStageReason(
    activity,
    profile,
    fit,
    result.breakdown.levelScore,
    result.breakdown.gradeScore,
  );

  if (hasConstraintReason) {
    return stageReason;
  }

  return `${stageReason} ${getTierConclusion(result.decision.finalTier)}`;
}

function getConfidenceReason(confidence: RecommendationConfidence) {
  if (confidence === "high") {
    return null;
  }

  if (confidence === "medium") {
    return "입력 정보가 일부 비어 있어 추천 신뢰도는 중간 수준입니다.";
  }

  return "입력 정보가 부족해 추천 신뢰도는 낮은 편입니다.";
}

export function getRecommendationReasonParts(
  activity: Activity,
  profile: UserProfile,
  fit: RecommendationFit,
  result: Pick<RecommendationResult, "breakdown" | "constraints" | "decision">,
): RecommendationReasonParts {
  const constraintReason = getConstraintReason(result.decision, result.constraints);
  const usedConstraintNotes = constraintReason
    ? result.constraints?.notes.slice(0, 1) ?? []
    : [];
  const primaryReason = getPrimaryReason(
    activity,
    profile,
    fit,
    result,
    Boolean(constraintReason),
  );
  const supportingReasons = [
    result.decision.limitedBy.includes("confidence")
      ? null
      : getConfidenceReason(result.breakdown.confidence),
    fit.typeMatched
      ? "관심 활동 유형과도 맞아 같은 tier 안에서는 우선순위를 높였습니다."
      : getStatusReason(activity),
    ...(
      result.constraints?.blocked ||
      result.breakdown.rawTier !== result.breakdown.finalTier
        ? result.constraints?.notes.filter((note) => !usedConstraintNotes.includes(note)) ?? []
        : []
    ),
  ].filter((reason): reason is string => Boolean(reason));

  return {
    constraintReason,
    primaryReason,
    supportingReasons,
  };
}
