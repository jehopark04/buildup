import type { Route } from "next";
import Link from "next/link";
import { RecommendationCard } from "@/components/recommendation-card";
import {
  buildProfileFromSearchParams,
  buildProfileSearchParams,
  getRecommendationInputState,
  getTrackLabel,
  hasRecommendationTrack,
  hasCompleteProfile,
} from "@/lib/profile";
import {
  getRecommendationDisplaySections,
  shouldUseUnifiedRecommendationPresentation,
} from "@/lib/recommendations/presentation";

type RecommendationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "추천 결과",
};

export default async function RecommendationsPage({
  searchParams,
}: RecommendationsPageProps) {
  const profile = buildProfileFromSearchParams(await searchParams);
  const hasTrack = hasRecommendationTrack(profile);
  const ready = hasTrack;
  const isPrecise = hasCompleteProfile(profile);
  const inputState = getRecommendationInputState(profile);
  const isTrackOnlyRecommendation =
    shouldUseUnifiedRecommendationPresentation(inputState);
  const profileQuery = buildProfileSearchParams(profile);
  const editHref = (
    profileQuery ? `/onboarding?${profileQuery}` : "/onboarding"
  ) as Route;
  const kauHubHref = (
    profileQuery ? `/kau-hub?${profileQuery}` : "/kau-hub"
  ) as Route;
  const sections = ready ? getRecommendationDisplaySections(profile) : [];
  const trackLabel = getTrackLabel(profile.track);
  const missingDetails = [
    !profile.grade ? "학년" : null,
    !profile.level ? "현재 수준" : null,
  ].filter((item): item is string => Boolean(item));
  const heroByState = {
    missingTrack: {
      badge: "추천 준비 전",
      title: "직무를 먼저 고르면\n추천을 시작할 수 있어요.",
      description:
        "빌드업은 희망 직무를 기준으로 관련 활동만 먼저 추립니다. 직무가 없으면 추천을 시작할 수 없습니다.",
    },
    trackOnly: {
      badge: "기본 추천",
      title: `${trackLabel} 활동,\n이곳에 모아두었습니다.`,
      description:
        "지금은 희망 직무만 반영한 기본 추천입니다. 학년과 현재 수준을 넣으면 더 정밀하게 다시 나눕니다.",
    },
    partial: {
      badge: "부분 입력 추천",
      title: `${trackLabel} 활동,\n이곳에 모아두었습니다.`,
      description:
        "입력된 정보만 반영해 먼저 정리했습니다. 학년과 현재 수준을 모두 채우면 추천 신뢰도가 더 올라갑니다.",
    },
    precise: {
      badge: "정밀 추천",
      title: `${trackLabel} 활동,\n이곳에 모아두었습니다.`,
      description:
        "직무 필터 후 학년과 현재 수준을 함께 반영해 추천 / 조건부 추천 / 비추천을 정리했습니다.",
    },
  } as const;
  const hero = heroByState[inputState];
  return (
    <main className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="px-1 py-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            {hero.badge}
          </p>
          <h1 className="mt-4 max-w-3xl text-xl font-semibold leading-tight tracking-tight sm:text-2xl lg:text-3xl">
            {hero.title.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          {!isPrecise && hasTrack ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {missingDetails.join(", ")} 정보를 더 입력하면 결과 순서와 설명이 더 정확해집니다.
            </p>
          ) : null}
        </div>

        <Link href={kauHubHref} className="block">
          <section className="card-shadow rounded-[30px] border border-line bg-white p-6 transition hover:-translate-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
              KAU Hub
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              한국항공대학교 활동 바로가기
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              학내 공지와 학생 참여 채널을 한 번에 모아둔 허브입니다.
            </p>
          </section>
        </Link>
      </section>

      {!ready ? (
        <section className="card-shadow rounded-[30px] border border-dashed border-line bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            희망 직무를 먼저 골라야 추천할 수 있습니다.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            학년과 현재 수준은 나중에 채워도 되지만, 직무는 있어야 관련 활동만 먼저 추릴 수 있습니다.
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            입력하러 가기
          </Link>
        </section>
      ) : sections.length === 0 ? (
        <section className="card-shadow rounded-[30px] border border-dashed border-line bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            아직 이 직무로 묶어둔 활동이 없습니다.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            지금은 다른 직무를 선택하거나, 항공대 허브 카드에서 직접 공지를 탐색하는 편이 낫습니다.
          </p>
          <Link
            href={editHref}
            className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            입력값 수정
          </Link>
        </section>
      ) : (
        <div className="space-y-10">
          {!isPrecise ? (
            <section className="card-shadow rounded-[30px] border border-dashed border-line bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                Recommendation Tone
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                지금은 {inputState === "trackOnly" ? "기본 추천" : "부분 입력 추천"}으로 보고 있습니다.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                {inputState === "trackOnly"
                  ? "희망 직무만으로 관련 활동을 먼저 모아 보여주고 있습니다. 학년과 현재 수준을 추가하면 정밀 추천으로 더 세밀하게 나눌 수 있습니다."
                  : `${missingDetails.join(", ")} 정보가 빠져 있어 일부 조건만 반영했습니다. 남은 정보를 채우면 추천 신뢰도와 이유 설명이 더 또렷해집니다.`}
              </p>
              <Link
                href={editHref}
                className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
              >
                정밀 추천으로 바꾸기
              </Link>
            </section>
          ) : null}
          {sections.map((section) => {
            const showSectionDescription =
              section.tier === "trackOnly" || section.tier === "notNow";

            return (
              <section
                key={section.id}
                className={showSectionDescription ? "space-y-4" : "space-y-3"}
              >
                <div
                  className={`flex flex-col sm:flex-row sm:justify-between ${showSectionDescription ? "gap-2 sm:items-end" : "gap-1 sm:items-center"}`}
                >
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                      {section.title}
                    </p>
                    {showSectionDescription ? (
                      <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                        {section.description}
                      </h2>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted">
                    {section.items.length}개 활동
                  </p>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory">
                  <div className="flex min-w-full gap-4">
                    {section.items.map((activity) => (
                      <RecommendationCard
                        key={activity.id}
                        activity={activity}
                        tier={activity.finalTier}
                        profileQuery={profileQuery}
                        badgeLabel={isTrackOnlyRecommendation ? "활동 추천" : undefined}
                        className="w-[85vw] max-w-[320px] shrink-0 snap-start sm:w-[360px] sm:max-w-none"
                        presentation={isTrackOnlyRecommendation ? "unified" : "tiered"}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
