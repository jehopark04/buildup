import type { Route } from "next";
import Link from "next/link";
import { RecommendationCard } from "@/components/recommendation-card";
import { kauShortcutLinks } from "@/lib/kau-links";
import {
  buildProfileFromSearchParams,
  buildProfileSearchParams,
  getProfileSummary,
  getTrackLabel,
  hasCompleteProfile,
} from "@/lib/profile";
import { getRecommendationSections } from "@/lib/recommendations";

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
  const ready = hasCompleteProfile(profile);
  const profileQuery = buildProfileSearchParams(profile);
  const editHref = (
    profileQuery ? `/onboarding?${profileQuery}` : "/onboarding"
  ) as Route;
  const sections = ready ? getRecommendationSections(profile) : [];
  const trackLabel = getTrackLabel(profile.track);
  const groupedLinks = kauShortcutLinks.reduce<Record<string, typeof kauShortcutLinks>>(
    (accumulator, link) => {
      const current = accumulator[link.group] ?? [];
      accumulator[link.group] = [...current, link];
      return accumulator;
    },
    {},
  );

  return (
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="card-shadow rounded-[30px] border border-line bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            BuildUp Result
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {ready ? `${trackLabel} 관련 활동만` : "직무를 먼저 고르면"}
            <br />
            학년과 수준 기준으로 다시 나눕니다.
          </h1>
          <div className="mt-6 space-y-3">
            {getProfileSummary(profile).map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-line bg-white px-4 py-3 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-surface-strong p-4 text-sm leading-6 text-muted">
            직무는 먼저 필터로 쓰고, 실제 추천 / 조건부 추천 / 비추천은 학년과 현재 수준 중심으로 나눕니다.
          </div>
        </div>

        <section className="card-shadow rounded-[30px] border border-line bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            KAU Hub
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            한국항공대학교 활동 바로가기
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            학내 공지와 학생 참여 채널을 한 번에 모아둔 허브입니다.
          </p>

          <div className="mt-6 space-y-5">
            {Object.entries(groupedLinks).map(([group, links]) =>
              links ? (
                <div key={group} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                    {group}
                  </p>
                  <div className="grid gap-3">
                    {links.map((link) => (
                      <a
                        key={link.title}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-line bg-surface px-4 py-4 hover:border-foreground/15 hover:bg-white"
                      >
                        <p className="text-sm font-semibold text-foreground">{link.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{link.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </section>
      </section>

      {!ready ? (
        <section className="card-shadow rounded-[30px] border border-dashed border-line bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            추천에 필요한 정보가 아직 부족합니다.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            희망 직무, 학년, 현재 수준은 최소한 있어야 의미 있는 추천 구간을 나눌 수 있습니다.
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
          {sections.map((section) => {
            const isBestRow = section.tier === "best";

            return (
              <section key={section.tier} className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
                      {section.title}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                      {section.description}
                    </h2>
                  </div>
                  <p className="text-sm text-muted">
                    {section.items.length}개 활동
                    {isBestRow ? " · 좌우로 넘겨보세요" : ""}
                  </p>
                </div>

                {isBestRow ? (
                  <div className="-mx-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory">
                    <div className="flex min-w-full gap-4">
                      {section.items.map((activity) => (
                        <RecommendationCard
                          key={activity.id}
                          activity={activity}
                          tier={section.tier}
                          trackLabel={trackLabel}
                          profileQuery={profileQuery}
                          className="w-[320px] shrink-0 snap-start sm:w-[360px]"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {section.items.map((activity) => (
                      <RecommendationCard
                        key={activity.id}
                        activity={activity}
                        tier={section.tier}
                        trackLabel={trackLabel}
                        profileQuery={profileQuery}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
