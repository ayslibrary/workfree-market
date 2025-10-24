"use client";

import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function GalleryPage() {
  const examples = [
    {
      id: 1,
      title: "Vogue 매거진 커버",
      style: "고급스러운 패션 매거진",
      before: "일반 프로필 사진",
      after: "Vogue 커버 스타일",
      tags: ["패션", "매거진", "고급"]
    },
    {
      id: 2,
      title: "비즈니스 프로필",
      style: "전문적인 LinkedIn 스타일",
      before: "캐주얼 사진",
      after: "프로페셔널 헤드샷",
      tags: ["비즈니스", "프로필", "전문"]
    },
    {
      id: 3,
      title: "영화 포스터",
      style: "할리우드 시네마틱",
      before: "일반 사진",
      after: "영화 포스터 스타일",
      tags: ["시네마틱", "드라마틱", "영화"]
    },
    {
      id: 4,
      title: "빈티지 1950s",
      style: "레트로 빈티지",
      before: "현대적 사진",
      after: "빈티지 필름 스타일",
      tags: ["빈티지", "레트로", "클래식"]
    },
    {
      id: 5,
      title: "유화 초상화",
      style: "클래식 아트",
      before: "디지털 사진",
      after: "유화 페인팅 스타일",
      tags: ["아트", "페인팅", "클래식"]
    },
    {
      id: 6,
      title: "샤넬 하이패션",
      style: "럭셔리 패션",
      before: "일반 패션 사진",
      after: "샤넬 브랜드 스타일",
      tags: ["럭셔리", "하이패션", "샤넬"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-purple-950/30 dark:to-pink-950/30">
      {/* 헤더 */}
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">W</span>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              WorkFree Market
            </div>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-24 px-6 text-center">
          <FadeIn>
          <div className="inline-block mb-6">
            <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold">
              🎨 AI 화보 갤러리
                </span>
              </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            5분 만에 Vogue 커버 모델
              </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto mb-8">
            AI가 만든 프로페셔널 화보 스타일 갤러리
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://ai-portrait-maker.streamlit.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all inline-block"
            >
              ✨ 무료로 만들어보기
            </a>
            <Link
              href="/kits/ai-portrait"
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all inline-block"
            >
              📦 프롬프트 키트 다운로드
            </Link>
            </div>
          </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* 갤러리 소개 */}
          <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              다양한 스타일로 변신하세요
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Google Gemini AI가 당신의 사진을 프로페셔널 화보로 변환합니다
            </p>
          </div>
          </FadeIn>

        {/* Before & After 갤러리 */}
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <StaggerItem key={example.id}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-purple-200 dark:border-purple-900">
                {/* 이미지 플레이스홀더 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Before</div>
                    <div className="text-gray-800 dark:text-gray-200 font-semibold mb-4">{example.before}</div>
                    <div className="text-3xl mb-4">→</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">After</div>
                    <div className="text-gray-800 dark:text-gray-200 font-semibold">{example.after}</div>
            </div>
          </div>

                {/* 정보 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {example.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {example.style}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {example.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {tag}
                        </span>
                    ))}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

        {/* CTA 섹션 */}
        <FadeIn delay={0.4}>
          <div className="mt-16 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              당신의 화보도 만들어보세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              완전 무료로 6가지 프리미엄 스타일 사용 가능
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://ai-portrait-maker.streamlit.app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                🚀 지금 무료로 시작하기
              </a>
            <Link
              href="/kits/ai-portrait"
                className="bg-white/20 backdrop-blur-sm border-2 border-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all"
            >
                📚 프롬프트 가이드 보기
            </Link>
            </div>
          </div>
        </FadeIn>

        {/* 사용 가이드 */}
        <FadeIn delay={0.6}>
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              💡 사용 방법
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-900">
                <div className="text-5xl mb-4">1️⃣</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  사진 업로드
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AI 화보 메이커에 인물 사진을 업로드하세요
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-pink-200 dark:border-pink-900">
                <div className="text-5xl mb-4">2️⃣</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  스타일 선택
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  원하는 화보 스타일을 선택하면 AI가 프롬프트 생성
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-rose-200 dark:border-rose-900">
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  이미지 생성
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  생성된 프롬프트를 이미지 AI에 적용해 완성!
                </p>
              </div>
        </div>
      </section>
        </FadeIn>
        </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 text-center text-gray-600 dark:text-gray-400">
        <p className="mb-2">© 2025 WorkFree Market — Work Less, Create More.</p>
        <p>문의: contact@workfree.ai</p>
      </footer>
    </div>
  );
}
