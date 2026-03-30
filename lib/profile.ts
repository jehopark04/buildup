export const trackOptions = [
  { value: "frontend", label: "프론트엔드" },
  { value: "backend", label: "백엔드" },
  { value: "product", label: "기획 / PM" },
  { value: "design", label: "디자인" },
  { value: "ai", label: "AI / 데이터" },
] as const;

export const gradeOptions = [
  { value: "freshman", label: "1학년" },
  { value: "sophomore", label: "2학년" },
  { value: "junior", label: "3학년" },
  { value: "senior", label: "4학년 이상" },
] as const;

export const levelOptions = [
  { value: "explore", label: "아직 탐색 중" },
  { value: "basic", label: "기초 학습 중" },
  { value: "project", label: "프로젝트 경험 있음" },
  { value: "ready", label: "실전 지원 직전" },
] as const;

export const activityTypeOptions = [
  { value: "all", label: "전체" },
  { value: "project", label: "교내 프로젝트" },
  { value: "government", label: "정부지원 프로그램" },
  { value: "bootcamp", label: "부트캠프" },
  { value: "club", label: "동아리 / 커뮤니티" },
  { value: "course", label: "강의 / 학습" },
  { value: "contest", label: "공모전" },
  { value: "opensource", label: "오픈소스" },
] as const;

export type Track = (typeof trackOptions)[number]["value"];
export type Grade = (typeof gradeOptions)[number]["value"];
export type Level = (typeof levelOptions)[number]["value"];
export type ActivityType = (typeof activityTypeOptions)[number]["value"];

export type UserProfile = {
  track: Track | null;
  grade: Grade | null;
  level: Level | null;
  activityTypes: ActivityType[];
};

type SearchParamsMap = Record<string, string | string[] | undefined>;

export const emptyProfile: UserProfile = {
  track: null,
  grade: null,
  level: null,
  activityTypes: ["all"],
};

const trackValues = new Set(trackOptions.map((option) => option.value));
const gradeValues = new Set(gradeOptions.map((option) => option.value));
const levelValues = new Set(levelOptions.map((option) => option.value));
const activityTypeValues = new Set(activityTypeOptions.map((option) => option.value));

function normalizeArray(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function isTrack(value: string): value is Track {
  return trackValues.has(value as Track);
}

export function isGrade(value: string): value is Grade {
  return gradeValues.has(value as Grade);
}

export function isLevel(value: string): value is Level {
  return levelValues.has(value as Level);
}

export function isActivityType(value: string): value is ActivityType {
  return activityTypeValues.has(value as ActivityType);
}

export function normalizeActivityTypes(activityTypes: ActivityType[]) {
  if (activityTypes.length === 0 || activityTypes.includes("all")) {
    return ["all"] as ActivityType[];
  }

  return Array.from(new Set(activityTypes));
}

export function buildProfileFromSearchParams(
  params: SearchParamsMap,
): UserProfile {
  const track =
    typeof params.track === "string" && isTrack(params.track) ? params.track : null;
  const grade =
    typeof params.grade === "string" && isGrade(params.grade) ? params.grade : null;
  const level =
    typeof params.level === "string" && isLevel(params.level) ? params.level : null;
  const activityTypes = normalizeActivityTypes(
    normalizeArray(params.activityTypes).filter(isActivityType),
  );

  return {
    track,
    grade,
    level,
    activityTypes,
  };
}

export function buildProfileSearchParams(profile: UserProfile) {
  const params = new URLSearchParams();

  if (profile.track) {
    params.set("track", profile.track);
  }

  if (profile.grade) {
    params.set("grade", profile.grade);
  }

  if (profile.level) {
    params.set("level", profile.level);
  }

  for (const activityType of normalizeActivityTypes(profile.activityTypes)) {
    params.append("activityTypes", activityType);
  }

  return params.toString();
}

export function hasCompleteProfile(
  profile: UserProfile,
): profile is UserProfile & {
  track: Track;
  grade: Grade;
  level: Level;
} {
  return Boolean(profile.track && profile.grade && profile.level);
}

export function getTrackLabel(value: Track | null) {
  return trackOptions.find((option) => option.value === value)?.label ?? "미선택";
}

export function getGradeLabel(value: Grade | null) {
  return gradeOptions.find((option) => option.value === value)?.label ?? "미선택";
}

export function getLevelLabel(value: Level | null) {
  return levelOptions.find((option) => option.value === value)?.label ?? "미선택";
}

export function getActivityTypeLabel(value: ActivityType) {
  return activityTypeOptions.find((option) => option.value === value)?.label ?? value;
}

export function getProfileSummary(profile: UserProfile) {
  return [
    `희망 직무: ${getTrackLabel(profile.track)}`,
    `현재 학년: ${getGradeLabel(profile.grade)}`,
    `현재 수준: ${getLevelLabel(profile.level)}`,
    `관심 활동 유형: ${
      normalizeActivityTypes(profile.activityTypes).includes("all")
        ? "전체"
        : normalizeActivityTypes(profile.activityTypes)
            .map(getActivityTypeLabel)
            .join(", ")
    }`,
  ];
}
