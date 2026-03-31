import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, Space_Grotesk } from "next/font/google";
import { LayoutShell } from "@/components/layout-shell";
import "./globals.css";

const uiFont = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui",
});

const wordmarkFont = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-wordmark",
});

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
    <html
      lang="ko"
      className={`${uiFont.variable} ${wordmarkFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
