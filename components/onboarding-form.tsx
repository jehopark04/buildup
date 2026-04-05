"use client";

import { useState } from "react";
import {
  gradeOptions,
  levelOptions,
  trackOptions,
  type UserProfile,
} from "@/lib/profile";

type OnboardingFormProps = {
  defaults: UserProfile;
};

export function OnboardingForm({ defaults }: OnboardingFormProps) {
  const [track, setTrack] = useState(defaults.track ?? "");
  const [grade, setGrade] = useState(defaults.grade ?? "");
  const [level, setLevel] = useState(defaults.level ?? "");
  const isPreciseRecommendation = Boolean(track && grade && level);

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
            추천 화면에는 이 직무와 관련된 활동만 먼저 보여줍니다.
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
                checked={track === option.value}
                onChange={() => setTrack(option.value)}
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
            <h2 className="text-xl font-semibold tracking-tight">학년 선택</h2>
            <p className="text-sm leading-6 text-muted">
              선택 항목입니다. 넣으면 추천 구간이 더 정교해집니다.
            </p>
          </div>
          <select
            name="grade"
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="">선택 안 함</option>
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
            <p className="text-sm leading-6 text-muted">
              선택 항목입니다. 실제로 도전 가능한 단계인지 더 정확해집니다.
            </p>
          </div>
          <select
            name="level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="">선택 안 함</option>
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted sm:flex-1">
          <span className="block">
            희망 직무만 입력해도 기본적인 추천을 볼 수 있어요!
          </span>
          <span className="mt-1 block">
            학년과 현재 수준을 입력하면 정밀 추천으로 정밀도 있게 볼 수 있습니다.
          </span>
        </p>
        <button
          type="submit"
          className="inline-flex min-w-36 shrink-0 items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold whitespace-nowrap text-white hover:-translate-y-0.5 hover:bg-brand/92"
        >
          {isPreciseRecommendation ? "정밀추천" : "기본추천"}
        </button>
      </div>
    </form>
  );
}
