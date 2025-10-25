"use client";

import { FadeIn } from "@/components/animations";
import MainNavigation from "@/components/MainNavigation";
import Link from "next/link";

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      {/* 네비게이션 */}
      <MainNavigation />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl pt-40">
        {/* Hero */}
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  WorkFree
                </span>
              </h1>
              <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 px-4 leading-relaxed break-keep">
                &quot;퇴근을 앞당기는<br className="md:hidden" /> 가장 확실한 방법&quot;
              </h2>
              <div className="max-w-3xl mx-auto text-sm md:text-base lg:text-lg text-gray-700 space-y-2 px-4">
                <p className="font-semibold break-keep">당신의 시간을 되찾는 AI 자동화 스튜디오</p>
                <p className="break-keep">설치 없이 웹에서 바로 실행하는 실무 자동화 서비스</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-7xl">🚀</div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 1. Pain Point */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 mt-12">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                🐰 Pain Point — 우리가 해결하려는 문제
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                하루에도 수십 번 반복하는 루틴 업무들.<br />
                메일 확인, 엑셀 정리, 보고서 수정, PDF 변환…
              </p>
              <p className="text-lg text-gray-700 mb-6 font-semibold">
                이런 상황, 익숙하지 않나요?
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-orange-500 text-xl">●</span>
                  <span>자동화 툴은 많지만 <strong>설치가 복잡하고 배우기 어렵다.</strong></span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-orange-500 text-xl">●</span>
                  <span>유료 구독은 부담스럽고 <strong>사용 빈도가 낮아 아깝다.</strong></span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-orange-500 text-xl">●</span>
                  <span>그래서 결국, <strong>사람이 다시 손으로 한다.</strong></span>
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40 bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 rounded-full flex items-center justify-center shadow-xl">
                <div className="text-6xl">⚡</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white">
            <p className="text-xl font-bold mb-3">
              WorkFree는 이 문제를 해결합니다. 클릭 한 번으로 실무 다기능.
            </p>
            <Link
              href="/#beta"
              className="inline-block bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              WorkFree 본 이 문몬을 헬현하는 →
            </Link>
          </div>
          </section>
        </FadeIn>

        {/* 2. Solution */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-purple-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            💡 Solution — WorkFree는 이렇게 바꿉니다
          </h2>
          <p className="text-2xl font-bold text-purple-600 mb-6">
            &quot;설치 없이 웹에서 바로 실행. 크레딧으로 필요한 만큼만 사용.&quot;
          </p>
          <p className="text-lg text-gray-700 mb-6">
            WorkFree는 <strong>직장인을 위한 AI 실무 자동화 스튜디오</strong>입니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">⚡</div>
              <p className="text-gray-700 font-bold mb-2">웹에서 즉시 실행</p>
              <p className="text-sm text-gray-600">설치·다운로드 불필요<br />브라우저에서 바로 사용</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">💎</div>
              <p className="text-gray-700 font-bold mb-2">크레딧 시스템</p>
              <p className="text-sm text-gray-600">사용한 만큼만 차감<br />구독 부담 제로</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-gray-700 font-bold mb-2">AI 기반 자동화</p>
              <p className="text-sm text-gray-600">복잡한 작업도<br />클릭 한 번으로 처리</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-xl p-6 border-2 border-green-300">
            <p className="text-xl font-bold text-gray-900">
              📈 결과: 매일 137분 절약, 생산성 3배 향상
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 3. Beta Benefits */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-indigo-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🎁 베타 프로그램 — 지금 시작하면
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:scale-105 transition-transform">
              <p className="font-bold text-gray-900 mb-2 text-xl">무료 크레딧 10개</p>
              <p className="text-sm text-gray-600 mb-3">회원가입 즉시 지급</p>
              <p className="text-3xl font-bold text-purple-600">즉시 지급</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-green-200 hover:scale-105 transition-transform">
              <p className="font-bold text-gray-900 mb-2 text-xl">후기 작성 보상</p>
              <p className="text-sm text-gray-600 mb-3">서비스 사용 후 리뷰</p>
              <p className="text-3xl font-bold text-green-600">+5 크레딧</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-pink-200 hover:scale-105 transition-transform">
              <p className="font-bold text-gray-900 mb-2 text-xl">SNS 공유 보상</p>
              <p className="text-sm text-gray-600 mb-3">친구에게 알리기</p>
              <p className="text-3xl font-bold text-pink-600">+10 크레딧</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-8 border-2 border-indigo-300">
            <p className="text-2xl font-bold text-gray-900 text-center">
              최대 25 크레딧으로<br />모든 서비스를 무료로 체험하세요
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 4. How It Works */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-blue-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            ⚙️ How It Works — 사용 방법
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
              <p className="text-xl font-bold text-gray-900 mb-2">
                1️⃣ 회원가입 (무료 크레딧 10개 지급)
              </p>
              <p className="text-gray-600">이메일 또는 소셜 로그인으로 30초 완료</p>
            </div>
            <div className="text-center text-2xl text-gray-400">↓</div>
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
              <p className="text-xl font-bold text-gray-900 mb-2">
                2️⃣ 원하는 서비스 선택
              </p>
              <p className="text-gray-600">PDF 변환, 메일 자동화, AI 화보 생성 등</p>
            </div>
            <div className="text-center text-2xl text-gray-400">↓</div>
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
              <p className="text-xl font-bold text-gray-900 mb-2">
                3️⃣ 클릭 한 번으로 실행
              </p>
              <p className="text-gray-600">크레딧 자동 차감, 웹에서 즉시 결과 확인</p>
            </div>
            <div className="text-center text-2xl text-gray-400">↓</div>
            <div className="bg-white rounded-xl p-6 border-2 border-green-200">
              <p className="text-xl font-bold text-green-600 mb-2">
                ✅ 완료! 평균 30분 절약
              </p>
              <p className="text-gray-600">대시보드에서 절약한 시간/비용 확인</p>
            </div>
          </div>
          <div className="mt-8 bg-blue-100 rounded-xl p-6 border-2 border-blue-300">
            <p className="text-lg text-gray-700 text-center">
              <strong>설치, 설정, 학습 시간 제로.</strong><br />
              누구나 쉽고 빠르게 시작할 수 있습니다.
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 5. Pricing */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            💰 Pricing — 크레딧 시스템
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            필요한 만큼만 사용하는 합리적인 가격
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">베타 무료</h3>
              <p className="text-gray-700 mb-4">회원가입만 하면<br />즉시 사용 가능</p>
              <p className="text-3xl font-bold text-blue-600 mb-2">10 크레딧</p>
              <p className="text-sm text-gray-600">1개월 유효</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">단건 충전</h3>
              <p className="text-gray-700 mb-4">필요할 때만<br />크레딧 구매</p>
              <p className="text-3xl font-bold text-purple-600 mb-2">₩30/개</p>
              <p className="text-sm text-gray-600">10개 단위 구매</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">월간 구독</h3>
              <p className="text-gray-700 mb-4">매월 자동 충전<br />최대 40% 할인</p>
              <p className="text-3xl font-bold text-orange-600 mb-2">₩5,900~</p>
              <p className="text-sm text-gray-600">200~1000 크레딧</p>
            </div>
          </div>
          <div className="mt-8 bg-green-100 rounded-xl p-6 border-2 border-green-300 text-center">
            <p className="text-lg font-bold text-gray-900">
              💡 크레딧 1개 = 평균 30분 절약 = 약 ₩10,000 절감 효과
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 6. Time Savings */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-green-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            ⏰ Time Savings — 시간과 비용 절약
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-8 border-2 border-green-200">
              <p className="text-xl font-bold text-gray-900 mb-4">📊 절약 계산기</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">크레딧 1개 비용</span>
                  <span className="font-bold text-purple-600">₩30</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">평균 절약 시간</span>
                  <span className="font-bold text-pink-600">30분</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">시간당 환산 금액</span>
                  <span className="font-bold text-green-600">₩20,000</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 border-2 border-blue-200">
              <p className="text-xl font-bold text-gray-900 mb-4">✅ 사용자 혜택</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">실시간 웹 실행</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">자동 시간 절약 통계</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">크레딧 이월 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">무료 크레딧 보상</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-8 border-2 border-green-300">
            <p className="text-2xl font-bold text-gray-900 text-center">
              월 10회 사용 시 ₩100,000+ 절약 효과<br />
              <span className="text-lg text-gray-700">(평균 5시간 절약)</span>
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 7. Vision */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🔭 Vision — 우리의 목표
          </h2>
          <p className="text-2xl font-bold text-indigo-600 mb-6">
            &quot;직장인 모두가 시간을 되찾는 세상&quot;
          </p>
          <p className="text-lg text-gray-700 mb-6">
            WorkFree는 단순히 도구를 제공하는 곳이 아닙니다.<br />
            <strong>&apos;일의 창의성&apos;을 되돌리는 혁신 문화</strong>를 만듭니다.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3 text-gray-700 text-lg">
              <span className="text-indigo-500 text-xl">•</span>
              <span>반복 업무는 자동화하고, 의미 있는 일에 집중하기</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700 text-lg">
              <span className="text-indigo-500 text-xl">•</span>
              <span>하루 2시간 빠른 퇴근으로 삶의 질 향상하기</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700 text-lg">
              <span className="text-indigo-500 text-xl">•</span>
              <span>누구나 쉽게 AI 자동화를 사용하는 시대 만들기</span>
            </li>
          </ul>
          <div className="text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white">
            <p className="text-3xl font-bold">Work Less. Create More.</p>
          </div>
          </section>
        </FadeIn>

        {/* 8. Technology */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-indigo-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🔐 Technology — 기술적 차별점
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">⚡ 웹 기반 실시간 실행</p>
              <p className="text-gray-700">설치 없이 브라우저에서 즉시 실행 → 크로스 플랫폼 지원</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">💎 유연한 크레딧 시스템</p>
              <p className="text-gray-700">사용한 만큼만 차감 → 구독 부담 없이 경제적</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">🤖 AI 기반 자동화 엔진</p>
              <p className="text-gray-700">복잡한 작업도 클릭 한 번 → 학습 시간 제로</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">📊 자동 효율 추적</p>
              <p className="text-gray-700">시간/비용 절약 통계 자동 수집 → 대시보드에서 확인</p>
            </div>
          </div>
          </section>
        </FadeIn>

        {/* 9. Social Impact */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🌍 Social Impact — 사회적 가치
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>직장인의 생산성 향상 → 사회 전체 노동시간 절감</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>비개발자 접근성 향상 → 기술 민주화 실현</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>워라밸 개선 → 삶의 질 향상 및 행복 추구</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>AI와 인간의 협업 → 지속 가능한 업무 문화 확립</span>
            </li>
          </ul>
          <div className="mt-8 bg-green-100 rounded-xl p-6 border-2 border-green-300">
            <p className="text-xl font-bold text-gray-900 text-center">
              📈 WorkFree는 생산성과 창의성을 동시에 확장시키는 AI 자동화 플랫폼입니다.
            </p>
          </div>
          </section>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-center text-white mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="text-7xl">🎁</div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🎁 베타 무료 참여하기
          </h2>
          <p className="text-xl mb-8">
            지금 회원가입하면 <strong>무료 크레딧 10개</strong>를 즉시 지급합니다.<br />
            모든 서비스를 무료로 체험하고 절약 효과를 직접 확인하세요.
          </p>
          <Link
            href="/#beta"
            className="inline-block bg-white text-purple-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            무료로 시작하기 →
          </Link>
          </section>
        </FadeIn>

        {/* Footer */}
        <footer className="text-center text-gray-600 py-8 border-t border-gray-200">
          <p className="mb-2">© 2025 WorkFree — 당신의 시간을 되찾는 AI 자동화 스튜디오</p>
          <p className="text-sm">설치 없이, 클릭 한 번으로 끝. 자동화의 모든 것, 한 곳에.</p>
        </footer>
      </div>
    </div>
  );
}
