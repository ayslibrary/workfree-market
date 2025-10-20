"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function VisualizationPage() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState<string>("");

  const handleDownload = (kitName: string) => {
    setSelectedKit(kitName);
    setShowDownloadModal(true);
  };

  const kits = [
    {
      id: 1,
      icon: "📊",
      name: "Excel → 대시보드 자동 생성",
      price: "₩32,900",
      originalPrice: "₩49,900",
      badge: "인기 🔥",
      category: ["대시보드", "Excel"],
      description: "엑셀 데이터를 입력하면 자동으로 인터랙티브 대시보드 생성 (Power BI 스타일)",
      features: [
        "Excel 데이터 자동 읽기",
        "차트 자동 생성 (막대, 선, 원형, 산점도)",
        "슬라이서/필터 자동 추가",
        "반응형 레이아웃",
        "PDF/이미지 자동 내보내기"
      ],
      included: ["Python 스크립트", "대시보드 템플릿 5종", "샘플 데이터", "튜토리얼 영상"],
      difficulty: 3
    },
    {
      id: 2,
      icon: "📈",
      name: "Streamlit 실시간 대시보드",
      price: "₩27,900",
      originalPrice: "",
      badge: "추천",
      category: ["웹대시보드", "Python"],
      description: "CSV 파일을 웹 브라우저에서 실시간으로 시각화. 팀원들과 공유 가능",
      features: [
        "CSV/Excel 파일 업로드",
        "실시간 데이터 업데이트",
        "다양한 차트 자동 생성",
        "필터/검색 기능",
        "웹에서 즉시 확인 가능"
      ],
      included: ["Streamlit 앱", "requirements.txt", "배포 가이드", "영상 튜토리얼"],
      difficulty: 2
    },
    {
      id: 3,
      icon: "📉",
      name: "Python 차트 자동생성기",
      price: "₩19,900",
      originalPrice: "",
      badge: "",
      category: ["차트생성", "Python"],
      description: "코드 없이 데이터만 입력하면 다양한 차트를 자동으로 생성",
      features: [
        "20+ 차트 타입 지원",
        "자동 색상 테마 적용",
        "고해상도 이미지 저장",
        "HTML 인터랙티브 차트",
        "배치 처리 지원"
      ],
      included: ["Python 스크립트", "차트 템플릿", "샘플 데이터"],
      difficulty: 2
    },
    {
      id: 4,
      icon: "⚡",
      name: "Power BI 자동 리포트",
      price: "₩39,900",
      originalPrice: "",
      badge: "",
      category: ["PowerBI", "자동화"],
      description: "데이터 소스 연동 후 Power BI 리포트 자동 생성 및 업데이트",
      features: [
        "SQL/Excel 자동 연동",
        "템플릿 기반 리포트 생성",
        "스케줄 자동 업데이트",
        "이메일 자동 발송",
        "모바일 최적화"
      ],
      included: ["Power BI 템플릿", "Python 스크립트", "연동 가이드"],
      difficulty: 4
    },
    {
      id: 5,
      icon: "📺",
      name: "실시간 KPI 모니터링 대시보드",
      price: "₩29,900",
      originalPrice: "",
      badge: "",
      category: ["실시간", "KPI"],
      description: "TV 화면에 띄워놓고 실시간 KPI를 모니터링하는 대시보드",
      features: [
        "실시간 데이터 자동 갱신",
        "전체화면 모드 지원",
        "주요 지표 강조 표시",
        "알림 임계값 설정",
        "다크모드 지원"
      ],
      included: ["웹 대시보드", "샘플 데이터", "설치 가이드", "커스터마이징 가이드"],
      difficulty: 3
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
              📈 데이터 시각화
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            데이터를 한눈에 보는 대시보드
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
            엑셀 데이터를 멋진 차트와 대시보드로 자동 변환
          </p>
        </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* 키트 리스트 */}
        <StaggerContainer staggerDelay={0.15} className="grid lg:grid-cols-2 gap-8">
          {kits.map((kit) => (
            <StaggerItem key={kit.id}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-purple-200 dark:border-purple-900">
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
                      <span key={idx} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
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
                          <span className="text-purple-500 mt-0.5">•</span>
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
                              ? "bg-purple-500"
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
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg"
                  >
                    구매하기
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 활용 예시 */}
        <FadeIn delay={0.4}>
          <section className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-3xl p-12 border-2 border-purple-200 dark:border-purple-900">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              💡 이런 데이터를 시각화할 수 있어요
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">매출 데이터</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  월별/분기별 매출 추이, 제품별 매출 비교
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">고객 분석</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  연령대별, 지역별 고객 분포 및 구매 패턴
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">마케팅 성과</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  광고 성과, 전환율, ROI 대시보드
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
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

