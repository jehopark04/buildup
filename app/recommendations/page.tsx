import type { Route } from "next";
import Link from "next/link";
import { RecommendationCard } from "@/components/recommendation-card";
import {
  buildProfileFromSearchParams,
  buildProfileSearchParams,
  getProfileSummary,
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

  return (
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
        <div className="card-shadow rounded-[30px] border border-line bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            BuildUp Result
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            입력한 조건 기준으로
            <br />
            활동을 나눠봤어요.
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
            빌드업은 지금 단계에서 먼저 볼 활동과 뒤로 미뤄도 되는 활동을 분리해서 보여줍니다.
          </div>
        </div>

        <div className="card-shadow rounded-[30px] border border-line bg-brand p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">
            How To Read
          </p>
          <div className="mt-4 space-y-4 text-sm leading-6 text-white/80">
            <p>가장 추천: 지금 바로 검토하거나 지원해도 되는 활동</p>
            <p>그 다음 추천: 조건은 맞지만 이번 우선순위에서는 한 단계 뒤</p>
            <p>비추천: 현재 입력 기준으로는 우선순위가 낮은 활동</p>
          </div>
          <Link
            href={editHref}
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand"
          >
            입력값 수정
          </Link>
        </div>
      </section>

      {!ready ? (
        <section className="card-shadow rounded-[30px] border border-dashed border-line bg-surface p-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            추천에 필요한 정보가 아직 부족합니다.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            희망 직무, 학년, 현재 수준, 시간 여유는 최소한 있어야 추천 결과가 의미 있게 나옵니다.
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            입력하러 가기
          </Link>
        </section>
      ) : (
        <div className="space-y-10">
          {sections.map((section) => (
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
                <p className="text-sm text-muted">{section.items.length}개 활동</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {section.items.map((activity) => (
                  <RecommendationCard
                    key={activity.id}
                    activity={activity}
                    tier={section.tier}
                    profileQuery={profileQuery}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
