"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";

type LayoutShellProps = {
  children: React.ReactNode;
};

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isRecommendationsPage = pathname === "/recommendations";
  const isActivityDetail = pathname.startsWith("/activities/");
  const showContactOnlyAction =
    isHome || isRecommendationsPage || isActivityDetail;
  const hideHeaderActions = pathname === "/onboarding";
  const hasHeaderActions = !hideHeaderActions;
  const headerClassName = hasHeaderActions
    ? "flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
    : "justify-start";
  const contactButtonClassName =
    "rounded-full bg-accent px-3.5 py-2 text-white hover:-translate-y-0.5 hover:bg-accent/92 sm:px-4";

  return (
    <div
      className={
        isHome
          ? "flex min-h-screen w-full flex-col bg-background px-5 py-6 sm:px-8 lg:px-10"
          : "mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10"
      }
    >
      <header className={`flex py-2 ${headerClassName}`}>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-brand sm:gap-3"
        >
          <BrandMark className="h-10 w-10" />
          <span className="font-display text-xl font-semibold tracking-[0.14em] sm:text-2xl sm:tracking-[0.18em]">
            BUILDUP
          </span>
        </Link>
        {hasHeaderActions ? (
          showContactOnlyAction ? (
            <nav className="flex w-full flex-wrap gap-2 text-sm font-medium sm:w-auto">
              <Link href="/contact" className={contactButtonClassName}>
                문의하기
              </Link>
            </nav>
          ) : (
            <nav className="flex w-full flex-wrap gap-2 text-sm font-medium sm:w-auto">
              <Link
                href="/onboarding"
                className="rounded-full border border-line px-3.5 py-2 hover:border-foreground/15 hover:bg-white sm:px-4"
              >
                입력 시작
              </Link>
              <Link
                href="/recommendations"
                className="rounded-full border border-line px-3.5 py-2 hover:border-foreground/15 hover:bg-white sm:px-4"
              >
                추천 결과
              </Link>
              <Link href="/contact" className={contactButtonClassName}>
                문의하기
              </Link>
            </nav>
          )
        ) : null}
      </header>
      <div className={`flex-1 ${isHome ? "py-4 sm:py-6" : "py-6 sm:py-8"}`}>
        {children}
      </div>
    </div>
  );
}
