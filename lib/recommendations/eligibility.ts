import type { Activity } from "@/lib/activities";
import type { UserProfile } from "@/lib/profile";
import { gradeRank, levelRank } from "./constants/fit";
import type { RecommendationConstraints } from "./types";

export function getRecommendationEligibility(
  profile: UserProfile,
  activity: Activity,
): RecommendationConstraints | undefined {
  const eligibility = activity.eligibility;

  if (!eligibility) {
    return undefined;
  }

  const notes: string[] = [...(eligibility.notes ?? [])];
  let blocked = Boolean(eligibility.blocked);

  if (profile.grade) {
    if (
      eligibility.minGrade &&
      gradeRank[profile.grade] < gradeRank[eligibility.minGrade]
    ) {
      blocked = true;
      notes.push("현재 학년 기준으로는 아직 지원 가능한 범위에 들어가지 않습니다.");
    }

    if (
      eligibility.maxGrade &&
      gradeRank[profile.grade] > gradeRank[eligibility.maxGrade]
    ) {
      blocked = true;
      notes.push("현재 학년 기준으로는 지원 권장 범위를 이미 지난 활동입니다.");
    }
  }

  if (profile.level) {
    if (
      eligibility.minLevel &&
      levelRank[profile.level] < levelRank[eligibility.minLevel]
    ) {
      blocked = true;
      notes.push("현재 수준 기준 필수 준비 단계를 아직 충족하지 못했습니다.");
    }

    if (
      eligibility.maxLevel &&
      levelRank[profile.level] > levelRank[eligibility.maxLevel]
    ) {
      blocked = true;
      notes.push("현재 수준보다 너무 기초적인 활동이라 추천 우선순위를 낮춥니다.");
    }
  }

  if (!blocked && !eligibility.maxAllowedTier && notes.length === 0) {
    return undefined;
  }

  return {
    blocked,
    maxAllowedTier: eligibility.maxAllowedTier,
    notes,
  };
}
