import type { Route } from "next";
import Link from "next/link";
import {
  formatVerifiedDate,
  getRecruitmentStatusLabel,
  type RecruitmentStatus,
} from "@/lib/activities";
import { getActivityTypeLabel } from "@/lib/profile";
import type {
  RecommendationMatch,
  RecommendationTier,
} from "@/lib/recommendations";

type RecommendationCardProps = {
  activity: RecommendationMatch;
  tier: RecommendationTier;
  trackLabel: string;
  profileQuery?: string;
  className?: string;
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

const statusBadges: Record<RecruitmentStatus, string> = {
  open: "bg-emerald-500/12 text-emerald-700 border border-emerald-500/20",
  upcoming: "bg-amber-500/12 text-amber-700 border border-amber-500/20",
  rolling: "bg-surface-strong text-muted border border-line",
};

export function RecommendationCard({
  activity,
  tier,
  trackLabel,
  profileQuery,
  className,
}: RecommendationCardProps) {
  const detailHref = (
    profileQuery
      ? `/activities/${activity.id}?${profileQuery}`
      : `/activities/${activity.id}`
  ) as Route;

  return (
    <Link href={detailHref} className={`block ${className ?? ""}`.trim()}>
      <article
        className={`card-shadow h-full rounded-[30px] border p-6 transition hover:-translate-y-1 ${tierStyles[tier]}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tierBadges[tier]}`}>
            {tierNames[tier]}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadges[activity.recruitmentStatus]}`}
          >
            {getRecruitmentStatusLabel(activity.recruitmentStatus)}
          </span>
          {activity.isKauInternal ? (
            <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              항공대 내부
            </span>
          ) : null}
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            {activity.category}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            예상 소요시간 {activity.estimatedTime}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {trackLabel} 관련 활동
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{activity.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{activity.summary}</p>
          </div>
          <div className="space-y-2">
            {activity.reasons.map((reason) => (
              <p
                key={reason}
                className="rounded-2xl bg-surface-strong px-4 py-3 text-sm leading-6 text-foreground"
              >
                {reason}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {activity.activityTypes.map((activityType) => (
            <span
              key={`${activity.id}-${activityType}`}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              {getActivityTypeLabel(activityType)}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
          <div className="space-y-1">
            <p className="font-medium text-foreground">다음 액션</p>
            <p className="text-muted">{activity.nextStep}</p>
            <p className="text-xs text-muted">
              최종 확인 {formatVerifiedDate(activity.lastVerifiedAt)}
            </p>
          </div>
          <span className="font-semibold text-brand">상세 보기</span>
        </div>
      </article>
    </Link>
  );
}
