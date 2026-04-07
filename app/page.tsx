import Link from "next/link";

function SparkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3.5 14.2 9l5.3 2.2-5.3 2.1L12 18.5l-2.2-5.2-5.3-2.1L9.8 9 12 3.5Z" />
      <path d="M18.5 3.5v3" />
      <path d="M20 5h-3" />
      <path d="m5.5 16.5.8 2" />
      <path d="m3.8 18.2 2-.8" />
    </svg>
  );
}

function LaptopIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M2.5 18.5h19" />
      <path d="M9.5 18.5h5" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 16 5-5 4 4 5-6" />
      <path d="M14 9h5v5" />
    </svg>
  );
}

const featureCards = [
  {
    title: "맞춤 추천",
    description: "당신의 기술 스택과 관심사를 분석하여 최적의 활동을 추천합니다.",
    icon: SparkIcon,
    iconClassName: "bg-[#dbe7ff] text-accent",
  },
  {
    title: "다양한 활동",
    description: "같은 목표를 가진 개발자들과 함께 성장하세요.",
    icon: LaptopIcon,
    iconClassName: "bg-[#e5e8ff] text-[#4c5cf0]",
  },
  {
    title: "성장",
    description: "스터디와 프로젝트 활동으로 당신을 성장시켜드립니다.",
    icon: TrendIcon,
    iconClassName: "bg-[#f1e4ff] text-[#8b42ff]",
  },
] as const;

export default function HomePage() {
  return (
    <main className="relative flex min-h-[calc(100vh-132px)] flex-col justify-center bg-background py-4">
      <section className="flex items-center justify-center">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#dce8ff]/80 px-4 py-2.5 text-sm font-semibold text-accent shadow-[0_14px_30px_rgba(53,99,233,0.12)]">
            <span className="scale-90">
              <LaptopIcon />
            </span>
            <span>개발자를 위한 활동 매칭</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            당신에게 맞는 활동
            <br />
            한번에 찾아드릴게요
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted sm:text-lg sm:leading-8">
            개발자를 위한 맞춤형 활동, 스펙업의 기회를 발견하세요.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="inline-flex min-w-44 items-center justify-center rounded-[20px] bg-brand px-8 py-4 text-xl font-semibold text-white card-shadow hover:-translate-y-0.5 hover:bg-brand-deep"
            >
              시작하기
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 grid w-full max-w-4xl gap-3 lg:grid-cols-3">
        {featureCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="card-shadow rounded-[20px] bg-surface p-4 sm:p-[18px]"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-[14px] ${card.iconClassName}`}
              >
                <Icon />
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {card.title}
              </h2>
              <p className="mt-2 text-xs leading-5 text-muted sm:text-sm sm:leading-6">
                {card.description}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
