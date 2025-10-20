"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function CrawlingPage() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState<string>("");

  const handleDownload = (kitName: string) => {
    setSelectedKit(kitName);
    setShowDownloadModal(true);
  };

  const kits = [
    {
      id: 1,
      icon: "🔍",
      name: "검색어 매일 자동검색 & 메일발송",
      price: "₩29,900",
      originalPrice: "₩49,900",
      badge: "인기 🔥",
      category: ["검색자동화", "메일발송", "Python"],
      description: "구글/네이버에서 특정 검색어를 매일 자동으로 검색하고 결과를 정리해서 이메일로 발송",
      features: [
        "구글, 네이버 동시 검색",
        "검색 결과 Top 10 자동 수집",
        "엑셀(CSV) 파일로 정리",
        "매일 아침 9시 자동 메일 발송",
        "여러 검색어 동시 모니터링"
      ],
      included: ["Python 스크립트 (.py)", "config.json 설정 파일", "자동 실행 스케줄러 (.bat)", "10분 설치 가이드 영상"],
      difficulty: 2
    },
    {
      id: 2,
      icon: "📰",
      name: "키워드 뉴스 자동수집기",
      price: "₩24,900",
      originalPrice: "",
      badge: "",
      category: ["뉴스수집", "Python"],
      description: "관심 키워드 관련 뉴스를 매일 자동으로 수집하고 AI로 요약해서 저장",
      features: [
        "네이버/다음 뉴스 자동 수집",
        "AI 요약 기능 포함 (ChatGPT API)",
        "Excel 파일로 자동 저장",
        "중복 제거 기능",
        "날짜별 자동 분류"
      ],
      included: ["Python 스크립트", "ChatGPT API 연동 가이드", "샘플 데이터", "튜토리얼 영상"],
      difficulty: 3
    },
    {
      id: 3,
      icon: "💰",
      name: "경쟁사 가격 자동 모니터링",
      price: "₩34,900",
      originalPrice: "",
      badge: "추천",
      category: ["가격비교", "Python"],
      description: "쿠팡, 네이버쇼핑 등 경쟁사 제품 가격을 매일 자동으로 확인하고 변동사항 알림",
      features: [
        "여러 쇼핑몰 동시 모니터링",
        "가격 변동 시 이메일/카톡 알림",
        "히스토리 자동 저장 (Excel)",
        "최저가 추적 기능",
        "차트로 가격 변동 시각화"
      ],
      included: ["Python 스크립트", "쇼핑몰 템플릿", "알림 설정 가이드", "영상 튜토리얼"],
      difficulty: 3
    },
    {
      id: 4,
      icon: "📱",
      name: "SNS 키워드 트래킹",
      price: "₩27,900",
      originalPrice: "",
      badge: "",
      category: ["SNS모니터링", "Python"],
      description: "인스타그램, 트위터에서 키워드 언급을 실시간으로 모니터링하고 알림",
      features: [
        "인스타그램 해시태그 추적",
        "트위터 키워드 모니터링",
        "멘션/댓글 자동 수집",
        "실시간 알림 기능",
        "감정 분석 (긍정/부정)"
      ],
      included: ["Python 스크립트", "SNS API 연동 가이드", "대시보드 템플릿"],
      difficulty: 4
    },
    {
      id: 5,
      icon: "🏠",
      name: "부동산 매물 자동 알림",
      price: "₩21,900",
      originalPrice: "",
      badge: "",
      category: ["부동산", "Python"],
      description: "직방, 다방, 네이버 부동산에서 원하는 조건의 매물이 나오면 즉시 알림",
      features: [
        "지역/가격 조건 설정",
        "신규 매물 자동 감지",
        "카톡/이메일 즉시 알림",
        "매물 정보 자동 저장",
        "가격 변동 추적"
      ],
      included: ["Python 스크립트", "조건 설정 템플릿", "알림 설정 가이드"],
      difficulty: 2
    },
    {
      id: 6,
      icon: "🛒",
      name: "이커머스 재고 모니터링",
      price: "₩19,900",
      originalPrice: "",
      badge: "할인 중",
      category: ["재고관리", "Python"],
      description: "원하는 제품의 품절 상태를 체크하고 재입고 시 즉시 알림",
      features: [
        "여러 쇼핑몰 동시 체크",
        "재입고 시 즉시 알림",
        "가격 변동도 함께 추적",
        "자동 구매 링크 전송",
        "알림 히스토리 저장"
      ],
      included: ["Python 스크립트", "쇼핑몰 템플릿", "설정 가이드"],
      difficulty: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-gray-950 dark:via-cyan-950/30 dark:to-teal-950/30">
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
      <section className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white py-24 px-6 text-center">
        <FadeIn>
          <div className="inline-block mb-6">
            <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold">
              🕷️ 웹 크롤링 자동화
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            웹 크롤링 & 데이터 자동수집
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
            검색부터 수집, 알림까지 완전 자동화
          </p>
        </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* 키트 리스트 */}
        <StaggerContainer staggerDelay={0.15} className="grid lg:grid-cols-2 gap-8">
          {kits.map((kit) => (
            <StaggerItem key={kit.id}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-cyan-200 dark:border-cyan-900">
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
                      <span key={idx} className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
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
                          <span className="text-cyan-500 mt-0.5">•</span>
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
                              ? "bg-cyan-500"
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
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg"
                  >
                    구매하기
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 사용 사례 */}
        <FadeIn delay={0.4}>
          <section className="mt-16 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/10 dark:to-teal-900/10 rounded-3xl p-12 border-2 border-cyan-200 dark:border-cyan-900">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              💼 이런 분들에게 추천합니다
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">마케터</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  경쟁사 모니터링, 트렌드 분석을 위한 데이터 자동 수집
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">온라인 쇼핑몰 운영자</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  가격 경쟁력 확보를 위한 경쟁사 가격 모니터링
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">📰</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">콘텐츠 크리에이터</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  트렌드 키워드 및 이슈 자동 수집으로 콘텐츠 아이디어 확보
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">리서치 담당자</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  시장 조사 및 데이터 분석을 위한 정보 자동 수집
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
                className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
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

