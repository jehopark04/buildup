import type { Metadata } from "next";
import { LayoutShell } from "@/components/layout-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BUILDUP",
    template: "%s | BUILDUP",
  },
  description:
    "학생의 희망 직무와 현재 상황을 바탕으로 활동을 추천하는 BUILDUP입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
