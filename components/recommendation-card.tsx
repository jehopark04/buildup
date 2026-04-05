import type { Route } from "next";
import Link from "next/link";
import { getRecruitmentStatusLabel, type RecruitmentStatus } from "@/lib/activities";
import type {
  RecommendationMatch,
  RecommendationTier,
} from "@/lib/recommendations";

type RecommendationCardProps = {
  activity: RecommendationMatch;
  tier: RecommendationTier;
  profileQuery?: string;
  className?: string;
  badgeLabel?: string;
  presentation?: "tiered" | "unified";
};

const tierStyles: Record<RecommendationTier, string> = {
  best: "border-accent/35 bg-white",
  conditional: "border-line bg-surface",
  notNow: "border-line bg-surface-strong/80",
};

const tierBadges: Record<RecommendationTier, string> = {
  best: "bg-accent text-white",
  conditional: "bg-brand text-white",
  notNow: "border border-line bg-white text-muted",
};

const tierNames: Record<RecommendationTier, string> = {
  best: "가장 추천",
  conditional: "조건부 추천",
  notNow: "지금은 비추천",
};

const unifiedCardStyle = "border-line bg-white";
const unifiedBadgeStyle = "bg-accent text-white";

const statusBadges: Record<RecruitmentStatus, string> = {
  open: "bg-emerald-500/12 text-emerald-700 border border-emerald-500/20",
  upcoming: "bg-amber-500/12 text-amber-700 border border-amber-500/20",
  rolling: "bg-surface-strong text-muted border border-line",
};

export function RecommendationCard({
  activity,
  tier,
  profileQuery,
  className,
  badgeLabel,
  presentation = "tiered",
}: RecommendationCardProps) {
  const detailHref = (
    profileQuery
      ? `/activities/${activity.id}?${profileQuery}`
      : `/activities/${activity.id}`
  ) as Route;
  const isUnified = presentation === "unified";
  const cardStyle = isUnified ? unifiedCardStyle : tierStyles[tier];
  const resolvedBadgeLabel = badgeLabel ?? tierNames[tier];
  const resolvedBadgeStyle = isUnified ? unifiedBadgeStyle : tierBadges[tier];

  return (
    <Link href={detailHref} className={`block ${className ?? ""}`.trim()}>
      <article
        className={`card-shadow h-full rounded-[30px] border p-6 transition hover:-translate-y-1 ${cardStyle}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${resolvedBadgeStyle}`}
          >
            {resolvedBadgeLabel}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadges[activity.recruitmentStatus]}`}
          >
            {getRecruitmentStatusLabel(activity.recruitmentStatus)}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            {activity.category}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            예상 소요시간 {activity.estimatedTime}
          </span>
          {activity.isKauInternal ? (
            <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              항공대 내부
            </span>
          ) : null}
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold tracking-tight">{activity.title}</h3>
          <p className="mt-4 overflow-hidden text-base leading-8 text-muted [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {activity.summary}
          </p>
        </div>
      </article>
    </Link>
  );
}
