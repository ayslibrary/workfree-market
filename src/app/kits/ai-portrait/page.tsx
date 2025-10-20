"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function AIPortraitKitPage() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

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
              📸 AI 화보 메이커 프롬프트 키트
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            20개 프리미엄 화보 스타일
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
            Vogue · Chanel · LinkedIn 프로필까지 5분 만에 완성
          </p>
        </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* 키트 정보 */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <FadeIn>
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-900">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                키트 구성
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl">✓</span>
                  <div>
                    <strong>20개 프리미엄 스타일 프롬프트</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vogue, Chanel, 영화 포스터, 비즈니스 프로필 등
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl">✓</span>
                  <div>
                    <strong>Gemini Vision AI 최적화</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Google AI Studio에서 즉시 사용 가능
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl">✓</span>
                  <div>
                    <strong>상세 사용 가이드 PDF</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      단계별 튜토리얼 포함
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl">✓</span>
                  <div>
                    <strong>예시 결과물 30개</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      스타일별 레퍼런스 이미지
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl">✓</span>
                  <div>
                    <strong>무료 웹 앱 사용권</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI 화보 메이커 평생 무료
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white rounded-3xl p-8 md:p-12">
              <div className="text-6xl mb-6">💎</div>
              <h2 className="text-3xl font-bold mb-6">
                특별 가격
              </h2>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2">₩19,900</div>
                <div className="text-xl opacity-80 line-through">₩39,900</div>
                <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  🎉 런칭 기념 50% 할인
                </div>
              </div>
              <button
                onClick={() => setShowDownloadModal(true)}
                className="w-full bg-white text-purple-600 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all mb-4"
              >
                지금 구매하기 →
              </button>
              <p className="text-sm opacity-90 text-center">
                ✨ 베타 테스터는 무료 다운로드 가능
              </p>
            </div>
          </FadeIn>
        </div>

        {/* 실제 결과물 갤러리 */}
        <FadeIn delay={0.3}>
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              ✨ 한 장의 사진으로 만드는 3가지 스타일
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              중앙의 원본 사진이 다양한 화보 스타일로 변신합니다
            </p>
            
            {/* 중앙 원본 + 주변 스타일 레이아웃 */}
            <div className="max-w-6xl mx-auto relative">
              {/* 중앙 원본 사진 */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500 p-4 relative z-10">
                    <div className="aspect-[3/4] w-64 md:w-80 relative overflow-hidden rounded-2xl">
                      <Image 
                        src="/examples/ai-portrait/기본사진.jpg" 
                        alt="원본 사진" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold text-sm">
                        📸 원본 사진
                      </div>
                    </div>
                  </div>
                  
                  {/* 중앙에서 퍼지는 점선 원 */}
                  <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-full -z-0 animate-pulse"></div>
                </div>
              </div>

              {/* 변환 화살표 텍스트 */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-6 py-3 rounded-full">
                  <span className="text-2xl">⬇️</span>
                  <span className="font-bold text-gray-900 dark:text-white">AI로 변환</span>
                  <span className="text-2xl">⬇️</span>
                </div>
              </div>

              {/* 주변 3개 스타일 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {/* Vogue Style */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 group">
                  <div className="aspect-[3/4] bg-black relative overflow-hidden">
                    <Image 
                      src="/examples/ai-portrait/보그화보.jpg" 
                      alt="Vogue Korea Style" 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-4xl mb-1">👑</div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Vogue Korea</h3>
                      <p className="text-xs text-white/80">파워풀 매거진</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-gray-900 to-black text-white text-center">
                    <p className="text-xs font-semibold">✓ 프롬프트 포함</p>
                  </div>
                </div>

                {/* Vintage Retro Style */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 group">
                  <div className="aspect-[3/4] bg-amber-900 relative overflow-hidden">
                    <Image 
                      src="/examples/ai-portrait/레트로.png" 
                      alt="Vintage Retro Style" 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-4xl mb-1">📻</div>
                      <h3 className="text-lg font-bold text-white mb-0.5">Vintage Retro</h3>
                      <p className="text-xs text-white/80">레트로 감성</p>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-700 text-white text-center">
                    <p className="text-xs font-semibold">✓ 프롬프트 포함</p>
                  </div>
                </div>

                {/* LinkedIn Style */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 group">
                  <div className="aspect-[3/4] bg-blue-900 relative overflow-hidden">
                    <Image 
                      src="/examples/ai-portrait/링크드인.jpg" 
                      alt="LinkedIn Professional" 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-4xl mb-1">💼</div>
                      <h3 className="text-lg font-bold text-white mb-0.5">LinkedIn</h3>
                      <p className="text-xs text-white/80">전문가 프로필</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-700 text-white text-center">
                    <p className="text-xs font-semibold">✓ 프롬프트 포함</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 20개 스타일 목록 */}
        <FadeIn delay={0.4}>
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              📸 포함된 20가지 스타일
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "🎨 Vogue 매거진 커버",
                "💎 Chanel 하이패션",
                "💼 LinkedIn 비즈니스",
                "🎬 영화 포스터",
                "📸 빈티지 1950s",
                "🖼️ 유화 초상화",
                "✨ 드라마틱 포트레이트",
                "🌟 셀럽 스타일",
                "📰 뉴스 헤드샷",
                "🎭 아티스트 프로필",
                "👔 포멀 비즈니스",
                "🌸 소프트 로맨틱",
                "🔥 다이나믹 액션",
                "❄️ 미니멀 모던",
                "🎨 팝아트 스타일",
                "🌙 무드 있는 야경",
                "☀️ 자연광 화보",
                "💫 글래머러스",
                "🎪 에디토리얼",
                "🏆 어워드 시즌"
              ].map((style, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-900 hover:border-purple-400 dark:hover:border-purple-700 transition-all hover:scale-105"
                >
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {style}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* 사용 예시 */}
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 mb-16">
          <StaggerItem>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-900">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                유튜버 / 크리에이터
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                썸네일, 프로필 사진을 프로페셔널하게 제작
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-pink-200 dark:border-pink-900">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                직장인 / 프리랜서
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                LinkedIn, 명함, 포트폴리오용 프로필 사진
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-rose-200 dark:border-rose-900">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                인플루언서 / 모델
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                SNS용 고급 화보 스타일 콘텐츠 제작
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* FAQ */}
        <FadeIn delay={0.4}>
          <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-900">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              ❓ 자주 묻는 질문
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  Q. 무료 웹 앱으로도 사용할 수 있나요?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A. 네! AI 화보 메이커 웹 앱은 완전 무료입니다. 프롬프트 키트는 더 많은 스타일과 상세 가이드가 포함되어 있습니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  Q. 어떤 AI 도구와 호환되나요?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A. Gemini Vision, Midjourney, DALL-E, Stable Diffusion 등 대부분의 이미지 생성 AI와 호환됩니다.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  Q. 베타 테스터 무료 혜택은 어떻게 받나요?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A. 베타 테스터로 가입하시면 자동으로 무료 다운로드 코드가 발급됩니다.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.6}>
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all inline-block"
            >
              🚀 지금 바로 시작하기
            </button>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              평생 사용 가능 | 즉시 다운로드 | 환불 보장
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 text-center text-gray-600 dark:text-gray-400">
        <p className="mb-2">© 2025 WorkFree Market — Work Less, Create More.</p>
        <p>문의: contact@workfree.ai</p>
      </footer>

      {/* 다운로드 모달 */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 text-center max-w-[500px] w-full shadow-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              AI 화보 메이커 프롬프트 키트
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              로그인 후 구매하실 수 있습니다.<br />
              베타 테스터는 무료로 다운로드 가능합니다!
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
              >
                로그인하기
              </Link>
              <a
                href="https://ai-portrait-maker.streamlit.app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
              >
                무료 웹 앱 사용하기
              </a>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
