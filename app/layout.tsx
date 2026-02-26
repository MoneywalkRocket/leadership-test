import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "리더십 유형 테스트 | Leadership Type Test",
  description:
    "논문 기반 30문항으로 알아보는 나의 리더십 유형. Full-Range Leadership + Servant Leadership 이론에 기반한 16가지 리더십 스타일 진단.",
  openGraph: {
    title: "리더십 유형 테스트",
    description: "논문 기반 30문항으로 알아보는 나의 리더십 유형 (16가지 스타일)",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <footer className="text-center text-sm text-gray-400 py-6">
            Based on Full-Range Leadership &amp; Servant Leadership research
          </footer>
        </div>
      </body>
    </html>
  );
}
