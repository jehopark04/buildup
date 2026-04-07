"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const headerJustifyClassName = hasHeaderActions ? "justify-between" : "justify-start";
  const contactButtonClassName =
    "rounded-full bg-accent px-4 py-2 text-white hover:-translate-y-0.5 hover:bg-accent/92";

  return (
    <div
      className={
        isHome
          ? "flex min-h-screen w-full flex-col bg-background px-5 py-6 sm:px-8 lg:px-10"
          : "mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10"
      }
    >
      <header className={`flex items-center py-2 ${headerJustifyClassName}`}>
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-[0.18em] text-brand"
        >
          BUILDUP
        </Link>
        {hasHeaderActions ? (
          showContactOnlyAction ? (
            <nav className="flex flex-wrap gap-2 text-sm font-medium">
              <Link href="/contact" className={contactButtonClassName}>
                문의하기
              </Link>
            </nav>
          ) : (
            <nav className="flex flex-wrap gap-2 text-sm font-medium">
              <Link
                href="/onboarding"
                className="rounded-full border border-line px-4 py-2 hover:border-foreground/15 hover:bg-white"
              >
                입력 시작
              </Link>
              <Link
                href="/recommendations"
                className="rounded-full border border-line px-4 py-2 hover:border-foreground/15 hover:bg-white"
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
