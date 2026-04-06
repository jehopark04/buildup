import { notFound } from "next/navigation";
import {
  activityCatalog,
  formatVerifiedDate,
  getActivityById,
  type Activity,
  type RecruitmentStatus,
} from "@/lib/activities";
import {
  buildProfileFromSearchParams,
  getActivityTypeLabel,
  getGradeLabel,
  getRecommendationInputState,
  getLevelLabel,
  getProfileSummary,
  getTrackLabel,
  hasRecommendationTrack,
  hasCompleteProfile,
} from "@/lib/profile";
import {
  getRecommendationForActivity,
} from "@/lib/recommendations";
import {
  getRecommendationDisplayTierLabel,
  shouldUseUnifiedRecommendationPresentation,
} from "@/lib/recommendations/presentation";
import { normalizeActivityIdParam } from "@/lib/security/url";

type ActivityDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getDetailRecruitmentLabel(status: RecruitmentStatus) {
  if (status === "rolling") {
    return "상시 모집";
  }

  if (status === "upcoming") {
    return "추후 일정 안내";
  }

  return "모집 중";
}

function getScheduleLabel(status: RecruitmentStatus) {
  if (status === "rolling") {
    return "운영 방식";
  }

  if (status === "upcoming") {
    return "예정 일정";
  }

  return "모집 기간";
}

function getTimelineItems(activity: Activity) {
  const timelineItems = [
    `현재 상태는 ${getDetailRecruitmentLabel(activity.recruitmentStatus)}입니다.`,
    `운영 형태는 ${activity.cadence}입니다.`,
    `${getScheduleLabel(activity.recruitmentStatus)}은 ${activity.scheduleText}입니다.`,
    `예상 소요시간은 ${activity.estimatedTime}입니다.`,
    activity.timeBasis,
  ];

  if (activity.deadlineText) {
    timelineItems.splice(
      3,
      0,
      activity.recruitmentStatus === "upcoming"
        ? `세부 일정은 ${activity.deadlineText}에서 확인하면 됩니다.`
        : `마감 일정은 ${activity.deadlineText}입니다.`,
    );
  } else if (activity.recruitmentStatus === "upcoming") {
    timelineItems.splice(3, 0, "세부 모집 일정은 추후 공식 공고에서 안내됩니다.");
  }

  return timelineItems;
}

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
  const activityId = normalizeActivityIdParam(id);

  if (!activityId) {
    notFound();
  }

  const activity = getActivityById(activityId);

  if (!activity) {
    notFound();
  }

  const profile = buildProfileFromSearchParams(await searchParams);
  const hasTrack = hasRecommendationTrack(profile);
  const isPrecise = hasCompleteProfile(profile);
  const inputState = getRecommendationInputState(profile);
  const isTrackOnlyRecommendation =
    shouldUseUnifiedRecommendationPresentation(inputState);
  const missingDetails = [
    !profile.grade ? "학년" : null,
    !profile.level ? "현재 수준" : null,
  ].filter((item): item is string => Boolean(item));
  const recommendation = hasTrack
    ? getRecommendationForActivity(profile, activity.id)
    : null;
  const tierLabel = recommendation
    ? getRecommendationDisplayTierLabel(inputState, recommendation.tier)
    : null;
  const detailRecruitmentLabel = getDetailRecruitmentLabel(
    activity.recruitmentStatus,
  );
  const overviewItems = [
    activity.details,
    `${activity.sourceHint}를 중심으로 최신 공고와 운영 안내를 확인할 수 있습니다.`,
  ];
  const timelineItems = getTimelineItems(activity);
  const fitItems = [
    `${activity.tracks.map(getTrackLabel).join(", ")} 직무와 연결된 활동입니다.`,
    `권장 학년은 ${activity.grades.map(getGradeLabel).join(", ")}입니다.`,
    `권장 수준은 ${activity.levels.map(getLevelLabel).join(", ")}입니다.`,
    `활동 유형은 ${activity.activityTypes.map(getActivityTypeLabel).join(", ")}입니다.`,
  ];
  const preparationItems = [
    activity.nextStep,
    `${activity.sourceHint}에서 최신 공고를 확인하면 됩니다.`,
    `출처는 ${activity.sourceName}이며 마지막 확인일은 ${formatVerifiedDate(activity.lastVerifiedAt)}입니다.`,
  ];
  const detailSections = [
    {
      title: "주요 내용",
      items: overviewItems,
    },
    {
      title: "모집 정보",
      items: timelineItems,
    },
    {
      title: "참여 대상",
      items: fitItems,
    },
    {
      title: "준비 포인트",
      items: preparationItems,
    },
  ];

  return (
    <main className="space-y-12">
      <section className="border-b border-line pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            {activity.category}
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
            {detailRecruitmentLabel}
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

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <h1 className="text-[clamp(1.75rem,4.1vw,3.15rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              {activity.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
              {activity.summary}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.7fr)]">
        <section className="space-y-14">
          {detailSections.map((section) => (
            <section key={section.title} className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <ul className="space-y-3 pl-6 text-base leading-8 marker:text-accent list-disc">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </section>

        <aside className="space-y-10 lg:sticky lg:top-8 lg:self-start">
          <section className="border-t border-line pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              선택한 조건
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              {getProfileSummary(profile).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {!isPrecise && hasTrack ? (
              <p className="mt-5 text-sm leading-6 text-muted">
                {inputState === "trackOnly"
                  ? "희망 직무 기준으로 연결된 활동을 먼저 보여주고 있습니다. 학년과 현재 수준을 입력하면 정밀 추천으로 더 자세히 볼 수 있습니다."
                  : `${missingDetails.join(", ")} 정보가 비어 있어 현재는 보수적으로 추천을 계산했습니다. 남은 정보를 채우면 추천 신뢰도가 더 올라갑니다.`}
              </p>
            ) : null}
          </section>

          <section className="border-t border-line pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              {isTrackOnlyRecommendation ? "활동 메모" : "추천 메모"}
            </p>
            {!isTrackOnlyRecommendation ? (
              recommendation ? (
                <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
                  {recommendation.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-sm leading-6 text-muted">
                  희망 직무가 없거나, 현재 선택한 직무 기준 후보가 아니어서 추천 이유를 계산하지 않았습니다.
                </p>
              )
            ) : (
              <p className="mt-5 text-sm leading-6 text-muted">
                기본 추천에서는 희망 직무와 연결된 활동을 먼저 보여줍니다. 학년과 현재
                수준을 입력하면 추천 이유를 함께 확인할 수 있습니다.
              </p>
            )}
          </section>

          <section className="border-t border-line pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              출처 정보
            </p>
            <p className="mt-5 text-sm leading-6 text-muted">
              {activity.sourceName}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              최종 확인 {formatVerifiedDate(activity.lastVerifiedAt)}
            </p>
            <a
              href={activity.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(53,99,233,0.22)] hover:-translate-y-0.5 hover:bg-accent/92"
            >
              지원하기
            </a>
          </section>
        </aside>
      </div>
    </main>
  );
}
