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
        <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          지금 상태만 알려주면,
          <br />
          빌드업이 추려줄게요.
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted">
          빌드업은 당신의 맞춤형 활동을 찾으려고 노력하는 중...
        </p>
        <div className="space-y-3 rounded-[30px] border border-line bg-surface p-5">
          <p className="text-sm font-semibold text-foreground">
            입력은 짧게, 추천은 더 정확하게
          </p>
          <ul className="space-y-2 text-sm leading-6 text-muted">
            <li>희망 직무만 넣어도 추천은 바로 시작돼요</li>
            <li>학년과 현재 수준을 더하면 지금 해볼 활동이 더 또렷해져요</li>
            <li>관심 활동 유형은 추천 순서를 가볍게 다듬는 데 반영돼요</li>
          </ul>
        </div>
      </section>

      <OnboardingForm defaults={defaults} />
    </main>
  );
}
