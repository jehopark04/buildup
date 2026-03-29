import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "빌드업",
    template: "%s | 빌드업",
  },
  description:
    "학생의 희망 직무와 현재 상황을 바탕으로 활동을 추천하는 빌드업입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between py-2">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-brand">
              빌드업
            </Link>
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
            </nav>
          </header>
          <div className="flex-1 py-6 sm:py-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
