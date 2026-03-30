import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  activityCatalog,
  formatVerifiedDate,
  getActivityById,
  getRecruitmentStatusLabel,
} from "@/lib/activities";
import {
  buildProfileFromSearchParams,
  buildProfileSearchParams,
  getActivityTypeLabel,
  getRecommendationInputState,
  getProfileSummary,
  hasRecommendationTrack,
  hasCompleteProfile,
} from "@/lib/profile";
import {
  getRecommendationForActivity,
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
  const hasTrack = hasRecommendationTrack(profile);
  const isPrecise = hasCompleteProfile(profile);
  const inputState = getRecommendationInputState(profile);
  const missingDetails = [
    !profile.grade ? "학년" : null,
    !profile.level ? "현재 수준" : null,
  ].filter((item): item is string => Boolean(item));
  const recommendation = hasTrack
    ? getRecommendationForActivity(profile, activity.id)
    : null;
  const tierLabel = recommendation
    ? getRecommendationTierLabel(recommendation.tier)
    : null;

  return (
    <main className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
      <section className="card-shadow rounded-[32px] border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            {activity.category}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            {getRecruitmentStatusLabel(activity.recruitmentStatus)}
          </span>
          {activity.isKauInternal ? (
            <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
              항공대 내부
            </span>
          ) : null}
          {tierLabel ? (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
              {tierLabel}
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

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-brand p-5 text-sm leading-6 text-white/85">
            <p>
              <span className="font-semibold text-white">예상 소요시간</span>{" "}
              {activity.estimatedTime}
            </p>
            <p className="mt-2 text-white/75">{activity.timeBasis}</p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5 text-sm leading-6 text-muted">
            <p className="font-semibold text-foreground">일정과 확인 포인트</p>
            <p className="mt-3">
              <span className="font-medium text-foreground">일정</span> {activity.scheduleText}
            </p>
            {activity.deadlineText ? (
              <p className="mt-2">
                <span className="font-medium text-foreground">마감</span>{" "}
                {activity.deadlineText}
              </p>
            ) : null}
            <p className="mt-2">
              <span className="font-medium text-foreground">최종 확인</span>{" "}
              {formatVerifiedDate(activity.lastVerifiedAt)}
            </p>
            <p className="mt-2">
              <span className="font-medium text-foreground">다음 액션</span> {activity.nextStep}
            </p>
          </div>
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
          {!isPrecise && hasTrack ? (
            <div className="mt-5 rounded-2xl border border-dashed border-line bg-white px-4 py-4 text-sm leading-6 text-muted">
              <p className="font-medium text-foreground">
                {inputState === "trackOnly" ? "기본 추천 상태" : "부분 입력 추천 상태"}
              </p>
              <p className="mt-2">
                {missingDetails.join(", ")} 정보가 비어 있어 현재는 보수적으로 추천을 계산했습니다.
                남은 정보를 채우면 추천 신뢰도가 더 올라갑니다.
              </p>
            </div>
          ) : null}
        </div>

        <div className="card-shadow rounded-[32px] border border-line bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            추천 이유
          </p>
          <div className="mt-4 space-y-3">
            {recommendation ? (
              recommendation.reasons.map((reason) => (
                <div
                  key={reason}
                  className="rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-6"
                >
                  {reason}
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted">
                희망 직무가 없거나, 현재 선택한 직무 기준 후보가 아니어서 추천 이유를 계산하지 않았습니다.
              </p>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {activity.activityTypes.map((activityType) => (
              <span
                key={activityType}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
              >
                {getActivityTypeLabel(activityType)}
              </span>
            ))}
          </div>
          <a
            href={activity.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full border border-line px-5 py-3 text-sm font-semibold hover:border-foreground/15 hover:bg-white"
          >
            공식 공고 / 안내 보기
          </a>
          <p className="mt-4 text-sm leading-6 text-muted">
            출처: {activity.sourceName}
          </p>
          <Link
            href={backHref}
            className="mt-3 inline-flex rounded-full border border-line px-5 py-3 text-sm font-semibold hover:border-foreground/15 hover:bg-white"
          >
            추천 결과로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
