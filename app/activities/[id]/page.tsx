import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activityCatalog, getActivityById } from "@/lib/activities";
import {
  buildProfileFromSearchParams,
  buildProfileSearchParams,
  getActivityTypeLabel,
  getProfileSummary,
  hasCompleteProfile,
} from "@/lib/profile";
import {
  getRecommendationTierForActivity,
  getRecommendationTierLabel,
} from "@/lib/recommendations";

type ActivityDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return activityCatalog.map((activity) => ({
    id: activity.id,
  }));
}

export default async function ActivityDetailPage({
  params,
  searchParams,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const activity = getActivityById(id);

  if (!activity) {
    notFound();
  }

  const profile = buildProfileFromSearchParams(await searchParams);
  const profileQuery = buildProfileSearchParams(profile);
  const backHref = (
    profileQuery ? `/recommendations?${profileQuery}` : "/recommendations"
  ) as Route;
  const tier = hasCompleteProfile(profile)
    ? getRecommendationTierForActivity(profile, activity.id)
    : null;

  return (
    <main className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
      <section className="card-shadow rounded-[32px] border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            {activity.category}
          </span>
          {tier ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
              {getRecommendationTierLabel(tier)}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight">{activity.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted">{activity.summary}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-5">
            <p className="text-sm font-semibold text-foreground">활동 설명</p>
            <p className="mt-3 text-sm leading-6 text-muted">{activity.details}</p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5">
            <p className="text-sm font-semibold text-foreground">어디서 찾나</p>
            <p className="mt-3 text-sm leading-6 text-muted">{activity.sourceHint}</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-brand p-5 text-sm leading-6 text-white/85">
          <p>
            <span className="font-semibold text-white">추천 주기</span> {activity.cadence}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-white">다음 액션</span> {activity.nextStep}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="card-shadow rounded-[32px] border border-line bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            선택한 조건
          </p>
          <div className="mt-4 space-y-3">
            {getProfileSummary(profile).map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-line bg-white px-4 py-3 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="card-shadow rounded-[32px] border border-line bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            활동 유형
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activity.activityTypes.map((activityType) => (
              <span
                key={activityType}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
              >
                {getActivityTypeLabel(activityType)}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">
            {tier
              ? `현재 조건 기준 이 활동은 "${getRecommendationTierLabel(tier)}" 구간에 들어갑니다.`
              : "아직 조건 입력이 없어 추천 구간은 계산하지 않았습니다."}
          </p>
          <Link
            href={backHref}
            className="mt-6 inline-flex rounded-full border border-line px-5 py-3 text-sm font-semibold hover:border-foreground/15 hover:bg-white"
          >
            추천 결과로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
