import type { Route } from "next";
import Link from "next/link";
import { getActivityTypeLabel } from "@/lib/profile";
import type {
  RecommendationMatch,
  RecommendationTier,
} from "@/lib/recommendations";

type RecommendationCardProps = {
  activity: RecommendationMatch;
  tier: RecommendationTier;
  profileQuery?: string;
};

const tierStyles: Record<RecommendationTier, string> = {
  best: "border-accent/30 bg-white",
  next: "border-line bg-surface",
  low: "border-line bg-surface-strong/75 opacity-92",
};

const tierBadges: Record<RecommendationTier, string> = {
  best: "bg-accent text-white",
  next: "bg-brand text-white",
  low: "bg-white text-muted border border-line",
};

export function RecommendationCard({
  activity,
  tier,
  profileQuery,
}: RecommendationCardProps) {
  const detailHref = (
    profileQuery
      ? `/activities/${activity.id}?${profileQuery}`
      : `/activities/${activity.id}`
  ) as Route;

  return (
    <Link href={detailHref} className="block">
      <article
        className={`card-shadow h-full rounded-[30px] border p-6 hover:-translate-y-1 ${tierStyles[tier]}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tierBadges[tier]}`}>
            {tier === "best" ? "우선 확인" : tier === "next" ? "후보 유지" : "낮은 우선순위"}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            {activity.category}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            매칭 점수 {activity.score}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">{activity.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{activity.summary}</p>
          </div>
          <div className="space-y-2">
            {activity.reasons.slice(0, 2).map((reason) => (
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
          </div>
          <span className="font-semibold text-brand">상세 보기</span>
        </div>
      </article>
    </Link>
  );
}
