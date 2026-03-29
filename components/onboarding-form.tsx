import {
  activityTypeOptions,
  availabilityOptions,
  gradeOptions,
  levelOptions,
  trackOptions,
  type UserProfile,
} from "@/lib/profile";

type OnboardingFormProps = {
  defaults: UserProfile;
};

export function OnboardingForm({ defaults }: OnboardingFormProps) {
  return (
    <form
      action="/recommendations"
      className="card-shadow space-y-8 rounded-[32px] border border-line bg-surface p-6 sm:p-8"
    >
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-accent">01</p>
          <h2 className="text-2xl font-semibold tracking-tight">희망 직무</h2>
          <p className="text-sm leading-6 text-muted">
            어떤 역할로 경험을 쌓고 싶은지 먼저 정합니다.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {trackOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-3xl border border-line bg-surface-strong px-4 py-4 hover:border-foreground/15 hover:bg-white"
            >
              <input
                type="radio"
                name="track"
                value={option.value}
                required
                defaultChecked={defaults.track === option.value}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-accent">02</p>
            <h2 className="text-xl font-semibold tracking-tight">학년</h2>
          </div>
          <select
            name="grade"
            required
            defaultValue={defaults.grade ?? ""}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="" disabled>
              현재 학년을 선택하세요
            </option>
            {gradeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-accent">03</p>
            <h2 className="text-xl font-semibold tracking-tight">현재 수준</h2>
          </div>
          <select
            name="level"
            required
            defaultValue={defaults.level ?? ""}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="" disabled>
              지금 어느 단계인지 선택하세요
            </option>
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-accent">04</p>
          <h2 className="text-xl font-semibold tracking-tight">시간 여유</h2>
          <p className="text-sm leading-6 text-muted">
            무리 없이 지속할 수 있는 주간 기준으로 선택하세요.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {availabilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-3xl border border-line bg-surface-strong px-4 py-4 hover:border-foreground/15 hover:bg-white"
            >
              <input
                type="radio"
                name="availability"
                value={option.value}
                required
                defaultChecked={defaults.availability === option.value}
                className="h-4 w-4 accent-accent"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-accent">05</p>
          <h2 className="text-xl font-semibold tracking-tight">관심 활동 유형</h2>
          <p className="text-sm leading-6 text-muted">
            지금 끌리는 형식이 있다면 여러 개 선택해도 됩니다.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {activityTypeOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-3xl border border-line bg-surface-strong px-4 py-4 hover:border-foreground/15 hover:bg-white"
            >
              <input
                type="checkbox"
                name="activityTypes"
                value={option.value}
                defaultChecked={defaults.activityTypes.includes(option.value)}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted">
          빌드업은 이 다섯 가지 정보만으로 우선순위 높은 활동부터 먼저 정리합니다.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-brand/92"
        >
          추천 결과 보기
        </button>
      </div>
    </form>
  );
}
