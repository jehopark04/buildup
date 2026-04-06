import { describe, expect, it } from "vitest";
import type { Activity } from "@/lib/activities";
import { defineActivityCatalog } from "@/lib/activities.validation";

const baseActivity: Activity = {
  id: "sample-activity",
  title: "Sample Activity",
  category: "교내 활동",
  summary: "Summary",
  details: "Details",
  cadence: "수시",
  estimatedTime: "1주",
  timeBasis: "기준",
  nextStep: "지원",
  sourceHint: "공식 안내",
  sourceName: "테스트 출처",
  sourceUrl: "https://example.com/activity",
  recruitmentStatus: "open",
  scheduleText: "수시",
  lastVerifiedAt: "2026-03-30",
  isKauInternal: false,
  tracks: ["frontend"],
  grades: ["junior"],
  levels: ["project"],
  activityTypes: ["project"],
};

describe("activity catalog validation", () => {
  it("fails on duplicate ids", () => {
    expect(() =>
      defineActivityCatalog([baseActivity, { ...baseActivity }]),
    ).toThrow("[activity:sample-activity] id: must be unique");
  });

  it("fails on empty tracks", () => {
    expect(() =>
      defineActivityCatalog([{ ...baseActivity, tracks: [] }]),
    ).toThrow("[activity:sample-activity] tracks: must contain at least one value");
  });

  it("fails on malformed verification dates", () => {
    expect(() =>
      defineActivityCatalog([{ ...baseActivity, lastVerifiedAt: "2026-02-30" }]),
    ).toThrow(
      "[activity:sample-activity] lastVerifiedAt: must use YYYY-MM-DD and be a real date",
    );
  });

  it("fails on malformed source URLs", () => {
    expect(() =>
      defineActivityCatalog([{ ...baseActivity, sourceUrl: "/relative-path" }]),
    ).toThrow(
      "[activity:sample-activity] sourceUrl: must be a valid absolute http(s) URL",
    );
  });

  it("fails on dangerous URL schemes", () => {
    expect(() =>
      defineActivityCatalog([
        { ...baseActivity, sourceUrl: "javascript:alert('owned')" },
      ]),
    ).toThrow(
      "[activity:sample-activity] sourceUrl: must be a valid absolute http(s) URL",
    );
  });

  it("fails when eligibility grade bounds are inverted", () => {
    expect(() =>
      defineActivityCatalog([
        {
          ...baseActivity,
          eligibility: {
            minGrade: "senior",
            maxGrade: "junior",
          },
        },
      ]),
    ).toThrow(
      "[activity:sample-activity] eligibility: minGrade must be less than or equal to maxGrade",
    );
  });
});
