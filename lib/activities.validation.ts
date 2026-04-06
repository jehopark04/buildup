import type { Activity } from "@/lib/activities";
import { gradeRank, levelRank } from "@/lib/recommendations/constants/fit";
import { assertSafeExternalHttpUrl } from "@/lib/security/url";

const requiredTextFields = [
  "id",
  "title",
  "summary",
  "details",
  "cadence",
  "estimatedTime",
  "timeBasis",
  "nextStep",
  "sourceHint",
  "sourceName",
  "sourceUrl",
  "scheduleText",
  "lastVerifiedAt",
] as const satisfies ReadonlyArray<keyof Activity>;

function isNonEmptyString(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(`${value}T00:00:00Z`);

  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

function fail(activityId: string, field: string, reason: string): never {
  throw new Error(`[activity:${activityId}] ${field}: ${reason}`);
}

function validateUniqueValues(
  activityId: string,
  field: "tracks" | "grades" | "levels" | "activityTypes",
  values: string[],
) {
  if (values.length === 0) {
    fail(activityId, field, "must contain at least one value");
  }

  if (new Set(values).size !== values.length) {
    fail(activityId, field, "must not contain duplicate values");
  }
}

export function validateActivityCatalog(activities: Activity[]) {
  const activityIds = new Set<string>();

  for (const activity of activities) {
    if (!isNonEmptyString(activity.id)) {
      fail("(unknown)", "id", "must be a non-empty string");
    }

    if (activityIds.has(activity.id)) {
      fail(activity.id, "id", "must be unique");
    }

    activityIds.add(activity.id);

    for (const field of requiredTextFields) {
      if (!isNonEmptyString(activity[field])) {
        fail(activity.id, field, "must be a non-empty string");
      }
    }

    try {
      assertSafeExternalHttpUrl(activity.sourceUrl, "sourceUrl");
    } catch {
      fail(activity.id, "sourceUrl", "must be a valid absolute http(s) URL");
    }

    if (!isValidIsoDate(activity.lastVerifiedAt)) {
      fail(activity.id, "lastVerifiedAt", "must use YYYY-MM-DD and be a real date");
    }

    validateUniqueValues(activity.id, "tracks", activity.tracks);
    validateUniqueValues(activity.id, "grades", activity.grades);
    validateUniqueValues(activity.id, "levels", activity.levels);
    validateUniqueValues(activity.id, "activityTypes", activity.activityTypes);

    if (activity.eligibility?.notes?.some((note) => !isNonEmptyString(note))) {
      fail(activity.id, "eligibility.notes", "must not contain empty strings");
    }

    if (
      activity.eligibility?.minGrade &&
      activity.eligibility?.maxGrade &&
      gradeRank[activity.eligibility.minGrade] >
        gradeRank[activity.eligibility.maxGrade]
    ) {
      fail(activity.id, "eligibility", "minGrade must be less than or equal to maxGrade");
    }

    if (
      activity.eligibility?.minLevel &&
      activity.eligibility?.maxLevel &&
      levelRank[activity.eligibility.minLevel] >
        levelRank[activity.eligibility.maxLevel]
    ) {
      fail(activity.id, "eligibility", "minLevel must be less than or equal to maxLevel");
    }
  }
}

export function defineActivityCatalog(activities: Activity[]): Activity[] {
  validateActivityCatalog(activities);
  return activities;
}
