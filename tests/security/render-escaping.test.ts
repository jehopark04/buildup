import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RecommendationCard } from "@/components/recommendation-card";
import type { RecommendationMatch } from "@/lib/recommendations";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => createElement("a", { href, className }, children),
}));

const maliciousActivity: RecommendationMatch = {
  id: "xss-test",
  title: "<script>alert(1)</script>",
  category: "교내 활동",
  summary: '<img src=x onerror="alert(1)">',
  details: "Details",
  cadence: "수시",
  estimatedTime: "1주",
  timeBasis: "기준",
  nextStep: "지원",
  sourceHint: "공식 안내",
  sourceName: "테스트 출처",
  sourceUrl: "https://example.com",
  recruitmentStatus: "open",
  scheduleText: "상시",
  lastVerifiedAt: "2026-03-30",
  isKauInternal: false,
  tracks: ["frontend"],
  grades: ["junior"],
  levels: ["project"],
  activityTypes: ["project"],
  score: 10,
  confidence: "high",
  rawTier: "best",
  finalTier: "best",
  decision: {
    rawTier: "best",
    confidenceTier: "best",
    finalTier: "best",
    limitedBy: [],
  },
  reasons: ["reason"],
  breakdown: {
    gradeFit: "fit",
    levelFit: "fit",
    gradeScore: 3,
    levelScore: 3,
    recruitmentStatusScore: 2,
    rawScore: 8,
    rankingScore: 10,
    confidence: "high",
    rawTier: "best",
    confidenceTier: "best",
    finalTier: "best",
    limitedBy: [],
  },
  tier: "best",
  gradeFit: "fit",
  levelFit: "fit",
};

describe("render escaping", () => {
  it("renders dangerous strings as escaped text instead of HTML", () => {
    const markup = renderToStaticMarkup(
      createElement(RecommendationCard, {
        activity: maliciousActivity,
        tier: "best",
      }),
    );

    expect(markup).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(markup).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(markup).not.toContain("<script>alert(1)</script>");
    expect(markup).not.toContain('<img src=x onerror="alert(1)">');
  });
});
