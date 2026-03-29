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

export const availabilityOptions = [
  { value: "light", label: "주 2~4시간" },
  { value: "steady", label: "주 5~8시간" },
  { value: "focused", label: "주 9~12시간" },
  { value: "immersive", label: "주 12시간 이상" },
] as const;

export const activityTypeOptions = [
  { value: "hackathon", label: "해커톤" },
  { value: "club", label: "학회 / 스터디" },
  { value: "project", label: "산학 / 캡스톤" },
  { value: "contest", label: "공모전" },
  { value: "supporters", label: "서포터즈" },
  { value: "opensource", label: "오픈소스" },
  { value: "startup", label: "창업 프로그램" },
  { value: "global", label: "글로벌 프로그램" },
] as const;

export type Track = (typeof trackOptions)[number]["value"];
export type Grade = (typeof gradeOptions)[number]["value"];
export type Level = (typeof levelOptions)[number]["value"];
export type Availability = (typeof availabilityOptions)[number]["value"];
export type ActivityType = (typeof activityTypeOptions)[number]["value"];

export type UserProfile = {
  track: Track | null;
  grade: Grade | null;
  level: Level | null;
  availability: Availability | null;
  activityTypes: ActivityType[];
};

type SearchParamsMap = Record<string, string | string[] | undefined>;

export const emptyProfile: UserProfile = {
  track: null,
  grade: null,
  level: null,
  availability: null,
  activityTypes: [],
};

const trackValues = new Set(trackOptions.map((option) => option.value));
const gradeValues = new Set(gradeOptions.map((option) => option.value));
const levelValues = new Set(levelOptions.map((option) => option.value));
const availabilityValues = new Set(availabilityOptions.map((option) => option.value));
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

export function isAvailability(value: string): value is Availability {
  return availabilityValues.has(value as Availability);
}

export function isActivityType(value: string): value is ActivityType {
  return activityTypeValues.has(value as ActivityType);
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
  const availability =
    typeof params.availability === "string" && isAvailability(params.availability)
      ? params.availability
      : null;
  const activityTypes = normalizeArray(params.activityTypes).filter(isActivityType);

  return {
    track,
    grade,
    level,
    availability,
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

  if (profile.availability) {
    params.set("availability", profile.availability);
  }

  for (const activityType of profile.activityTypes) {
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
  availability: Availability;
} {
  return Boolean(
    profile.track && profile.grade && profile.level && profile.availability,
  );
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

export function getAvailabilityLabel(value: Availability | null) {
  return (
    availabilityOptions.find((option) => option.value === value)?.label ?? "미선택"
  );
}

export function getActivityTypeLabel(value: ActivityType) {
  return activityTypeOptions.find((option) => option.value === value)?.label ?? value;
}

export function getProfileSummary(profile: UserProfile) {
  return [
    `희망 직무: ${getTrackLabel(profile.track)}`,
    `현재 학년: ${getGradeLabel(profile.grade)}`,
    `현재 수준: ${getLevelLabel(profile.level)}`,
    `시간 여유: ${getAvailabilityLabel(profile.availability)}`,
    `관심 활동 유형: ${
      profile.activityTypes.length > 0
        ? profile.activityTypes.map(getActivityTypeLabel).join(", ")
        : "미선택"
    }`,
  ];
}
