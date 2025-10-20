"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function PromptsPage() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState<string>("");

  const handleDownload = (kitName: string) => {
    setSelectedKit(kitName);
    setShowDownloadModal(true);
  };

  const kits = [
    {
      id: 1,
      icon: "🎬",
      name: "영상 제작 프롬프트 생성기",
      price: "₩24,900",
      originalPrice: "₩39,900",
      badge: "인기 🔥",
      category: ["영상기획", "유튜브"],
      description: "유튜브 영상 기획부터 스크립트, 썸네일 문구까지 AI로 자동 생성",
      features: [
        "주제 입력 시 영상 컨셉 자동 생성",
        "대본 스크립트 자동 작성",
        "썸네일 문구 추천",
        "SEO 키워드 자동 추출",
        "영상 길이별 구성안 제공"
      ],
      included: ["프롬프트 템플릿 50개", "활용 가이드", "예시 결과물", "영상 튜토리얼"],
      difficulty: 1
    },
    {
      id: 2,
      icon: "💬",
      name: "ChatGPT 업무용 프롬프트 팩",
      price: "₩19,900",
      originalPrice: "",
      badge: "베스트",
      category: ["업무자동화", "ChatGPT"],
      description: "보고서, 이메일, 회의록 등 업무에 바로 쓸 수 있는 200+ 프롬프트",
      features: [
        "보고서 자동 작성 프롬프트",
        "이메일 초안 생성",
        "회의록 요약 템플릿",
        "데이터 분석 프롬프트",
        "프레젠테이션 기획안"
      ],
      included: ["프롬프트 200개", "카테고리별 분류", "사용 예시", "PDF 가이드"],
      difficulty: 1
    },
    {
      id: 3,
      icon: "🎨",
      name: "이미지 생성 프롬프트",
      price: "₩22,900",
      originalPrice: "",
      badge: "",
      category: ["AI이미지", "Midjourney"],
      description: "Midjourney, DALL-E, Stable Diffusion에 최적화된 프롬프트 템플릿",
      features: [
        "스타일별 프롬프트 (사실적, 일러스트, 3D 등)",
        "프롬프트 파라미터 최적화",
        "부정 프롬프트 템플릿",
        "화질 향상 프롬프트",
        "AI 도구별 가이드"
      ],
      included: ["프롬프트 150개", "스타일 가이드", "예시 이미지 100개"],
      difficulty: 2
    },
    {
      id: 4,
      icon: "✍️",
      name: "마케팅 카피 자동 생성기",
      price: "₩27,900",
      originalPrice: "",
      badge: "추천",
      category: ["마케팅", "카피라이팅"],
      description: "광고 문구, SNS 카피, 상품 설명을 AI로 자동 생성",
      features: [
        "제품명 입력 시 카피 자동 생성",
        "타겟 고객별 맞춤 문구",
        "A/B 테스트용 여러 버전 제공",
        "감정 톤 조절 (진지함/경쾌함 등)",
        "SNS 플랫폼별 최적화"
      ],
      included: ["프롬프트 100개", "카피 예시 500개", "활용 가이드"],
      difficulty: 2
    },
    {
      id: 5,
      icon: "📝",
      name: "블로그 SEO 글쓰기 프롬프트",
      price: "₩21,900",
      originalPrice: "",
      badge: "",
      category: ["블로그", "SEO"],
      description: "검색 상위 노출을 위한 SEO 최적화 블로그 글 자동 생성",
      features: [
        "키워드 기반 글 구성",
        "제목 + 메타 설명 자동 생성",
        "내부 링크 전략 제안",
        "독자 참여 유도 문구",
        "글 길이별 템플릿"
      ],
      included: ["프롬프트 80개", "SEO 체크리스트", "예시 글 30개"],
      difficulty: 2
    },
    {
      id: 6,
      icon: "🎯",
      name: "퍼스널 브랜딩 프롬프트 세트",
      price: "₩18,900",
      originalPrice: "",
      badge: "할인 중",
      category: ["SNS", "브랜딩"],
      description: "인스타그램, 링크드인 등 SNS 콘텐츠 기획 및 작성 자동화",
      features: [
        "프로필 소개 자동 작성",
        "일주일치 포스팅 기획",
        "스토리 텔링 템플릿",
        "해시태그 자동 추천",
        "댓글 응답 가이드"
      ],
      included: ["프롬프트 120개", "콘텐츠 캘린더", "예시 포스팅 50개"],
      difficulty: 1
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-gray-950 dark:via-orange-950/30 dark:to-rose-950/30">
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
      <section className="bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 text-white py-24 px-6 text-center">
        <FadeIn>
          <div className="inline-block mb-6">
            <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold">
              🤖 AI 프롬프트
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            AI로 콘텐츠 제작 자동화
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
            영상, 이미지, 카피까지 AI가 대신 만들어드립니다
          </p>
        </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* 키트 리스트 */}
        <StaggerContainer staggerDelay={0.15} className="grid lg:grid-cols-2 gap-8">
          {kits.map((kit) => (
            <StaggerItem key={kit.id}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-orange-200 dark:border-orange-900">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{kit.icon}</div>
                    {kit.badge && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {kit.badge}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {kit.category.map((cat, idx) => (
                      <span key={idx} className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {kit.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {kit.description}
                  </p>

                  <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">✨ 주요 기능</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                      {kit.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📦 포함 내용</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {kit.included.map((item, idx) => (
                        <div key={idx}>• {item}</div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">난이도</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= kit.difficulty
                              ? "bg-orange-500"
                              : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{kit.price}</span>
                      {kit.originalPrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{kit.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(kit.name)}
                    className="w-full bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg"
                  >
                    구매하기
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 활용 가이드 */}
        <FadeIn delay={0.4}>
          <section className="mt-16 bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/10 dark:to-rose-900/10 rounded-3xl p-12 border-2 border-orange-200 dark:border-orange-900">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              🎯 이런 분들께 추천합니다
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">🎥</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">유튜버 / 크리에이터</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  영상 기획부터 스크립트까지 AI로 빠르게 준비
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">📢</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">마케터</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  광고 카피와 SNS 콘텐츠 대량 생산
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">블로거 / 작가</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  SEO 최적화된 글을 빠르게 작성
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 프롬프트 예시 */}
        <FadeIn delay={0.6}>
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              💡 프롬프트 활용 예시
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-orange-200 dark:border-orange-900">
              <div className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                  <div className="font-semibold text-orange-700 dark:text-orange-300 mb-2">📥 입력 예시</div>
                  <p className="text-gray-700 dark:text-gray-300">
                    &ldquo;30대 직장인을 위한 운동 유튜브 영상을 만들고 싶어요&rdquo;
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <div className="font-semibold text-green-700 dark:text-green-300 mb-2">📤 AI 생성 결과</div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>제목:</strong> &ldquo;하루 10분으로 끝! 직장인 맞춤 홈트레이닝&rdquo;
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>스크립트:</strong> &ldquo;안녕하세요! 오늘은 바쁜 직장인 여러분을 위한...&rdquo;
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>썸네일 문구:</strong> &ldquo;10분 투자로 건강 UP&rdquo;
                  </p>
                </div>
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

      {/* 다운로드 모달 */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 text-center max-w-[500px] w-full shadow-2xl">
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedKit}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              로그인 후 구매하실 수 있습니다.<br />
              베타 테스터는 무료로 다운로드 가능합니다!
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
              >
                로그인하기
              </Link>
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

