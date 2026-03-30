import type { Route } from "next";
import Link from "next/link";
import {
  buildProfileSearchParams,
  type UserProfile,
} from "@/lib/profile";

const sampleProfile: UserProfile = {
  track: "frontend",
  grade: "junior",
  level: "project",
  activityTypes: ["all"],
};

const sampleRecommendationsHref = `/recommendations?${buildProfileSearchParams(sampleProfile)}` as Route;

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-132px)] flex-col items-center justify-center">
      <section className="w-full max-w-4xl space-y-8 text-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            BuildUp
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            지금 너한테 맞는 활동,
            <br />
            빌드업이 먼저 좁혀줄게.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-muted sm:text-lg">
            희망 직무, 학년, 현재 수준, 관심 활동 유형만 알려주면
            지금 바로 볼 카드와 아직은 미뤄도 되는 카드를 한 번에 정리해 줍니다.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="card-shadow mx-auto block max-w-3xl rounded-[34px] border border-line bg-white px-6 py-6 text-left hover:border-foreground/12"
        >
          <div className="text-lg font-medium text-muted">
            예: 백엔드 3학년이고 프로젝트 경험이 있어요.
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["희망 직무", "학년", "현재 수준", "관심 활동 유형"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-line bg-surface-strong px-3 py-1.5 text-xs font-medium text-muted"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm leading-6 text-muted">
              입력은 1분 내로 끝납니다. 한국항공대 학생 기준으로 공식 활동 채널과 함께 보여줍니다.
            </p>
            <span className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white">
              시작하기
            </span>
          </div>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
          <span>빌드업이 물어보는 것</span>
          <span className="rounded-full border border-line px-3 py-1.5">희망 직무</span>
          <span className="rounded-full border border-line px-3 py-1.5">학년</span>
          <span className="rounded-full border border-line px-3 py-1.5">현재 수준</span>
        </div>

        <div className="pt-2">
          <Link
            href={sampleRecommendationsHref}
            className="text-sm font-semibold text-accent hover:text-accent/80"
          >
            샘플 결과 먼저 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
