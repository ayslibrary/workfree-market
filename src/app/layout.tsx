import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WorkFree Market - AI 실무 자동화 스튜디오",
    template: "%s | WorkFree Market"
  },
  description: "퇴근을 앞당기는 가장 확실한 방법. 설치 없이 웹에서 바로 실행하는 AI 자동화. 블로그 생성, 이미지 검색, 보고서 작성을 클릭 한 번으로 완성하세요.",
  keywords: ["AI 자동화", "업무 자동화", "블로그 생성기", "AI 보고서", "이미지 검색", "워크프리", "직장인 도구", "생산성 도구"],
  authors: [{ name: "WorkFree Market" }],
  creator: "WorkFree Market",
  publisher: "WorkFree Market",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://workfreemarket.com'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://workfreemarket.com',
    title: 'WorkFree Market - AI 실무 자동화 스튜디오',
    description: '퇴근을 앞당기는 가장 확실한 방법. 클릭 한 번으로 완성하는 AI 자동화',
    siteName: 'WorkFree Market',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WorkFree Market - AI 자동화 스튜디오',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkFree Market - AI 실무 자동화 스튜디오',
    description: '퇴근을 앞당기는 가장 확실한 방법. 클릭 한 번으로 완성하는 AI 자동화',
    images: ['/og-image.png'],
    creator: '@workfreemarket',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console 인증 (실제 값으로 교체 필요)
    google: 'your-google-verification-code',
    // Naver Search Advisor 인증
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#6A5CFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
