import { OnboardingForm } from "@/components/onboarding-form";
import { buildProfileFromSearchParams } from "@/lib/profile";

type OnboardingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "입력 시작",
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const defaults = buildProfileFromSearchParams(await searchParams);

  return (
    <main className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
      <section className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
          BuildUp Input
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          지금 상태만 알려주면
          <br />
          활동 우선순위를 나눠서 보여줍니다.
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted">
          빌드업은 많은 정보를 요구하지 않습니다. 지금 단계에서 실제 추천 결과를 바꾸는 항목만 받아서 흐름을 단순하게 유지합니다.
        </p>
        <div className="space-y-3 rounded-[30px] border border-line bg-surface p-5">
          <p className="text-sm font-semibold text-foreground">
            이 화면에서 입력하는 정보
          </p>
          <ul className="space-y-2 text-sm leading-6 text-muted">
            <li>희망 직무: 어떤 방향으로 경험을 쌓을지</li>
            <li>학년 / 현재 수준: 지금 도전 가능한 난이도 판단</li>
            <li>시간 여유: 지속 가능한 활동 강도 판단</li>
            <li>관심 활동 유형: 해커톤, 공모전, 스터디 같은 선호 형식</li>
          </ul>
        </div>
      </section>

      <OnboardingForm defaults={defaults} />
    </main>
  );
}
