"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import MainNavigation from "@/components/MainNavigation";

export default function MicrosoftPage() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState<string>("");

  const handleDownload = (kitName: string) => {
    setSelectedKit(kitName);
    setShowDownloadModal(true);
  };

  const kits = [
    {
      id: 1,
      icon: "📧",
      name: "Outlook 자동회신 시스템",
      price: "₩29,900",
      originalPrice: "₩49,900",
      badge: "인기 🔥",
      category: ["메일자동화", "VBA"],
      description: "특정 조건의 메일 수신 시 자동으로 회신 + PDF 첨부. HTML 템플릿 포함",
      features: [
        "조건별 자동 회신 (발신자, 제목, 키워드)",
        "PDF 파일 자동 첨부",
        "HTML 메일 템플릿 커스터마이징",
        "회신 로그 자동 저장",
        "여러 계정 동시 관리"
      ],
      included: ["VBA 코드", "HTML 템플릿 3종", "10분 설치 가이드", "영상 튜토리얼"],
      difficulty: 2
    },
    {
      id: 2,
      icon: "📊",
      name: "Excel 자동 보고서 생성기",
      price: "₩34,900",
      originalPrice: "",
      badge: "",
      category: ["엑셀자동화", "VBA"],
      description: "원본 데이터를 넣으면 보고서 양식에 맞춰 자동으로 생성. 차트와 표 포함",
      features: [
        "데이터 자동 정리 및 분류",
        "차트 자동 생성 (막대, 선, 원형)",
        "피벗테이블 자동 생성",
        "보고서 템플릿 커스터마이징",
        "PDF 자동 내보내기"
      ],
      included: [".xlam 파일", "보고서 템플릿 5종", "데이터 샘플", "설정 가이드"],
      difficulty: 3
    },
    {
      id: 3,
      icon: "📑",
      name: "PPT 자동 템플릿 적용기",
      price: "₩24,900",
      originalPrice: "",
      badge: "",
      category: ["PPT자동화", "VBA"],
      description: "여러 개의 PPT 파일에 회사 템플릿을 일괄 적용. 로고, 폰트, 색상 통일",
      features: [
        "일괄 템플릿 적용",
        "폰트 자동 변경",
        "슬라이드 마스터 적용",
        "로고 자동 삽입",
        "폴더 내 모든 파일 처리"
      ],
      included: ["VBA 매크로", "템플릿 샘플", "실행 가이드"],
      difficulty: 2
    },
    {
      id: 4,
      icon: "📝",
      name: "Word 일괄 서식 변환기",
      price: "₩19,900",
      originalPrice: "",
      badge: "할인 중",
      category: ["Word자동화", "VBA"],
      description: "수백 개의 Word 문서 서식을 한 번에 통일. 목차 자동 생성 포함",
      features: [
        "제목/본문 서식 일괄 적용",
        "목차 자동 생성",
        "머리글/바닥글 통일",
        "페이지 번호 자동 설정",
        "스타일 자동 적용"
      ],
      included: ["VBA 코드", "서식 템플릿", "영상 가이드"],
      difficulty: 2
    },
    {
      id: 5,
      icon: "📈",
      name: "Excel 피벗테이블 자동화",
      price: "₩27,900",
      originalPrice: "",
      badge: "",
      category: ["엑셀자동화", "VBA"],
      description: "데이터를 정리하면 자동으로 피벗테이블 생성 및 차트 시각화",
      features: [
        "데이터 범위 자동 감지",
        "피벗테이블 자동 생성",
        "슬라이서 자동 추가",
        "피벗차트 자동 생성",
        "월별/분기별 자동 그룹화"
      ],
      included: [".xlam 파일", "샘플 데이터", "튜토리얼 영상"],
      difficulty: 3
    },
    {
      id: 6,
      icon: "💾",
      name: "Outlook 첨부파일 자동 저장",
      price: "₩22,900",
      originalPrice: "",
      badge: "",
      category: ["메일자동화", "VBA"],
      description: "받은 메일의 첨부파일을 발신자/날짜별로 자동 분류 저장",
      features: [
        "첨부파일 자동 감지",
        "발신자별 폴더 자동 생성",
        "파일명 규칙 커스터마이징",
        "중복 파일 자동 처리",
        "저장 로그 기록"
      ],
      included: ["VBA 코드", "폴더 구조 템플릿", "설정 가이드"],
      difficulty: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
      <MainNavigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pt-24 md:pt-20 pb-16 md:pb-20 px-6 text-center">
        <FadeIn>
          <div className="inline-block mb-6">
            <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold">
              📊 Microsoft Office 자동화
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Excel · Outlook · PPT 완전 자동화
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
            반복되는 오피스 업무, 이제 클릭 한 번으로
          </p>
        </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-16 max-w-7xl">
        {/* 키트 리스트 */}
        <StaggerContainer staggerDelay={0.15} className="grid lg:grid-cols-2 gap-8">
          {kits.map((kit) => (
            <StaggerItem key={kit.id}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-blue-200 dark:border-blue-900">
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
                      <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
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
                          <span className="text-blue-500 mt-0.5">•</span>
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
                              ? "bg-blue-500"
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
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg"
                  >
                    구매하기
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 사용 가이드 */}
        <FadeIn delay={0.4}>
          <section className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-3xl p-12 border-2 border-blue-200 dark:border-blue-900">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              💡 설치 및 사용법
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">다운로드</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  구매 후 VBA 파일과 가이드를 다운로드
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">설치</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  영상 가이드를 보며 5~10분 내 설치 완료
                </p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">사용</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  버튼 클릭만으로 자동화 실행
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
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

