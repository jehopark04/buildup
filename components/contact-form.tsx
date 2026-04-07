"use client";

import { useState } from "react";
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
} from "@/lib/contact";

type ContactFormState =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

function SuccessIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5.5 12.5 4 4 9-9" />
    </svg>
  );
}

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<ContactFormState>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const company = String(formData.get("company") ?? "");

    setIsSubmitting(true);
    setState({ kind: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          company,
        }),
      });

      const result = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        setState({
          kind: "error",
          message: result.error ?? "문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
        return;
      }

      setMessage("");
      setState({
        kind: "success",
        message: "문의가 성공적으로 전송되었습니다.",
      });
    } catch {
      setState({
        kind: "error",
        message: "네트워크 문제로 전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const remaining = CONTACT_MESSAGE_MAX_LENGTH - message.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="card-shadow rounded-[32px] border border-line bg-surface p-6 sm:p-8"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
          Contact
        </p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          궁금한 점을 편하게 적어주세요.
        </h2>
        <p className="text-sm leading-6 text-muted sm:text-base">
          제목이나 이메일은 따로 받지 않습니다. 답장을 원하면 본문에 연락처를 함께
          남겨주세요.
        </p>
      </div>

      <div className="mt-6">
        <label htmlFor="contact-message" className="sr-only">
          문의 내용
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          minLength={CONTACT_MESSAGE_MIN_LENGTH}
          maxLength={CONTACT_MESSAGE_MAX_LENGTH}
          required
          placeholder="문의 내용을 적어주세요. 답장이 필요하면 연락받을 이메일이나 오픈채팅 링크도 함께 남겨주세요."
          className="min-h-56 w-full rounded-[24px] border border-line bg-white px-5 py-4 text-base leading-7 outline-none transition focus:border-accent"
        />
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted">
          <p>최소 {CONTACT_MESSAGE_MIN_LENGTH}자 이상 적어주세요.</p>
          <p>{remaining}자 남음</p>
        </div>
      </div>

      <div className="sr-only">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {state.kind !== "idle" ? (
        <div
          className={`mt-6 rounded-[24px] border px-5 py-4 text-sm leading-6 ${
            state.kind === "success"
              ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-700"
              : "border-rose-500/20 bg-rose-500/8 text-rose-700"
          }`}
        >
          {state.kind === "success" ? (
            <div className="flex items-center gap-3">
              <SuccessIcon />
              <span>{state.message}</span>
            </div>
          ) : (
            state.message
          )}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted">
          스팸 방지를 위해 짧은 시간 안에 너무 많이 보내면 잠시 제한될 수 있습니다.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-40 items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-brand/92 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "전송 중..." : "문의하기"}
        </button>
      </div>
    </form>
  );
}
