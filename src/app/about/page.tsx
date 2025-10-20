"use client";

import Link from "next/link";
import { FadeIn } from "@/components/animations";

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
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

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        {/* Hero */}
        <FadeIn>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              WorkFree
            </span>
          </h1>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 px-4 leading-relaxed break-keep">
            &quot;일 안 하고도 일하는<br className="md:hidden" /> 사람들의 비밀도구&quot;
          </h2>
          <div className="max-w-3xl mx-auto text-sm md:text-base lg:text-lg text-gray-700 space-y-2 px-4">
            <p className="font-semibold break-keep">직장인을 위한 AI 자동화 생태계</p>
            <p className="break-keep">반복 업무를 자동화하고, 당신의 시간을 되돌려드립니다.</p>
          </div>
        </FadeIn>

        {/* 1. Pain Point */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            🚨 Pain Point — 우리가 해결하려는 문제
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            하루에도 수십 번 반복하는 루틴 업무들.<br />
            메일 확인, 엑셀 정리, 보고서 수정…
          </p>
          <p className="text-lg text-gray-700 mb-6 font-semibold">
            이런 상황, 익숙하지 않나요?
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-red-500 text-xl">•</span>
              <span>자동화 툴은 많지만 <strong>우리 회사 환경에는 안 맞는다.</strong></span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-red-500 text-xl">•</span>
              <span>IT 지식이 없어도 <strong>손쉽게 쓸 수 있는 도구가 없다.</strong></span>
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="text-red-500 text-xl">•</span>
              <span>그래서 결국, <strong>사람이 다시 손으로 한다.</strong></span>
            </li>
          </ul>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
            <p className="text-xl font-bold text-gray-900 mb-2">
              WorkFree는 이 문제를 해결합니다.
            </p>
            <p className="text-lg text-gray-700">
              누구나 직접 &apos;일을 자동화&apos;할 수 있는 시대.
            </p>
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
            &quot;직장인이 만든 자동화 키트를 사고팔고, AI가 커스터마이징을 돕는다.&quot;
          </p>
          <p className="text-lg text-gray-700 mb-6">
            WorkFree는 <strong>직장인 실무자 중심의 자동화 생태계</strong>입니다.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">🧩</div>
              <p className="text-gray-700">직장인들이 직접 만든<br />자동화 키트 마켓</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-gray-700">AI가 환경에 맞게<br />자동 커스터마이징</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
              <div className="text-4xl mb-3">🧠</div>
              <p className="text-gray-700">복잡한 업무는<br />판매자에게 직접 의뢰</p>
            </div>
          </div>
          <div className="bg-green-100 rounded-xl p-6 border-2 border-green-300">
            <p className="text-xl font-bold text-gray-900">
              📈 결과: 반복 업무는 사라지고, 생산성은 3배 이상 향상됩니다.
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 3. Market Impact */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-indigo-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            📊 Market Impact — 경제적 효과
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:scale-105 transition-transform">
              <p className="font-bold text-gray-900 mb-2">창작자 월평균 수익</p>
              <p className="text-sm text-gray-600 mb-3">30개 키트 기준</p>
              <p className="text-3xl font-bold text-blue-600">₩500,000~₩1,500,000</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 hover:scale-105 transition-transform">
              <p className="font-bold text-gray-900 mb-2">구매자 효율 효과</p>
              <p className="text-sm text-gray-600 mb-3">1인당 월 8시간 절감</p>
              <p className="text-3xl font-bold text-purple-600">약 ₩200,000 절감</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-green-200 hover:scale-105 transition-transform">
              <p className="font-bold text-gray-900 mb-2">자동화 의뢰 시장</p>
              <p className="text-sm text-gray-600 mb-3">2025년 한국 기준</p>
              <p className="text-3xl font-bold text-green-600">₩5조+</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-8 border-2 border-indigo-300">
            <p className="text-2xl font-bold text-gray-900 text-center">
              WorkFree는 &apos;전문가의 자동화&apos;를<br />
              &apos;직장인의 자동화&apos;로 재정의합니다.
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 4. How It Works */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-blue-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            ⚙️ How It Works — 거래 흐름
          </h2>
          <div className="space-y-4">
            {[
              { step: "1️⃣", text: "구매자" },
              { step: "↓", text: "무료/유료 키트 선택 (₩0~₩19,000)" },
              { step: "↓", text: "AI 커스터마이징 (+₩3,000)" },
              { step: "↓", text: "더 복잡한 요구 → \"커스터마이즈 의뢰\" 클릭" },
              { step: "↓", text: "판매자 제안서 + 단가 수령 (₩50,000~₩300,000)" },
              { step: "↓", text: "1:1 거래 성사 (WorkFree 수수료 15~20%)" },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border-2 border-blue-200 text-center">
                <p className="text-xl font-bold text-gray-900">
                  {item.step} {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-blue-100 rounded-xl p-6 border-2 border-blue-300">
            <p className="text-lg text-gray-700">
              AI가 당신의 &apos;사무보조&apos;가 되어,<br />
              누구나 쉽고 빠르게 자동화를 시작할 수 있도록 돕습니다.
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 5. Pricing */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            💰 Pricing — 서비스 가격
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            필요한 만큼만, 합리적인 가격으로 시작하세요.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🧩</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">자동화 키트</h3>
              <p className="text-gray-700 mb-4">즉시 다운로드 가능한<br />완성형 자동화 파일</p>
              <p className="text-3xl font-bold text-blue-600 mb-2">₩3,000~</p>
              <p className="text-sm text-gray-600">무료 키트도 많아요!</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI 커스터마이징</h3>
              <p className="text-gray-700 mb-4">내 환경에 맞게<br />AI가 자동 수정</p>
              <p className="text-3xl font-bold text-purple-600 mb-2">+₩3,000</p>
              <p className="text-sm text-gray-600">키트당 추가 옵션</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200 hover:scale-105 transition-transform">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">맞춤 제작 의뢰</h3>
              <p className="text-gray-700 mb-4">복잡한 업무는<br />전문가에게 직접 의뢰</p>
              <p className="text-3xl font-bold text-orange-600 mb-2">협의</p>
              <p className="text-sm text-gray-600">프로젝트 규모에 따라</p>
            </div>
          </div>
          <div className="mt-8 bg-green-100 rounded-xl p-6 border-2 border-green-300 text-center">
            <p className="text-lg font-bold text-gray-900">
              💡 지금은 베타테스트 기간으로 대부분의 키트를 <span className="text-green-600">무료</span>로 제공합니다!
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 6. Vision */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🔭 Vision — 우리의 목표
          </h2>
          <p className="text-2xl font-bold text-indigo-600 mb-6">
            &quot;직장인 모두가 &apos;자동화 제작자&apos;가 되는 세상.&quot;
          </p>
          <p className="text-lg text-gray-700 mb-6">
            WorkFree는 단순히 도구를 파는 곳이 아닙니다.<br />
            <strong>&apos;일의 창의성&apos;을 되돌리는 혁신 문화</strong>를 만듭니다.
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3 text-gray-700 text-lg">
              <span className="text-indigo-500 text-xl">•</span>
              <span>더 적게 일하고, 더 똑똑하게 성장하기.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-700 text-lg">
              <span className="text-indigo-500 text-xl">•</span>
              <span>효율을 넘어, 의미 있는 일에 집중하기.</span>
            </li>
          </ul>
          <div className="text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white">
            <p className="text-3xl font-bold">Work Less. Create More.</p>
          </div>
          </section>
        </FadeIn>

        {/* 7. Creator Economy */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-yellow-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🧑‍💻 Creator Economy — WorkFree 크리에이터
          </h2>
          <p className="text-2xl font-bold text-orange-600 mb-8">
            &quot;자동화를 이해하는 직장인이 곧 창작자.&quot;
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-yellow-200">
              <p className="font-bold text-gray-900 mb-2">🧩 키트 크리에이터</p>
              <p className="text-gray-700">자동화 코드·템플릿 제작 및 판매</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-yellow-200">
              <p className="font-bold text-gray-900 mb-2">👩‍🏫 교육형 크리에이터</p>
              <p className="text-gray-700">코드 공개 + 실무 강의 제작</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-yellow-200">
              <p className="font-bold text-gray-900 mb-2">🧠 커스터마이즈 전문가</p>
              <p className="text-gray-700">AI가 처리 못하는 고급 로직 대응</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-yellow-200">
              <p className="font-bold text-gray-900 mb-2">🧾 기업형 개발자</p>
              <p className="text-gray-700">B2B 자동화 프로젝트 수주</p>
            </div>
          </div>
          <div className="bg-orange-100 rounded-xl p-6 border-2 border-orange-300">
            <p className="text-xl font-bold text-gray-900 mb-4">💬 인센티브 정책</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-orange-500">•</span>
                <span>첫 3개월 수수료 0%</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-orange-500">•</span>
                <span>리뷰·다운로드 수에 따라 상위 노출</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-orange-500">•</span>
                <span>&quot;Featured Creator&quot; 뱃지 부여</span>
              </li>
            </ul>
          </div>
          </section>
        </FadeIn>

        {/* 8. Technology */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-indigo-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🔐 Technology & Differentiation — 기술적 차별점
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">🤖 AI 커스터마이징 엔진</p>
              <p className="text-gray-700">자연어 → 코드 수정 파이프라인</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">🧠 사용자 맞춤 추천</p>
              <p className="text-gray-700">수정 패턴 기반 자동화 제안</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">🪄 지식거래 생태계</p>
              <p className="text-gray-700">판매자·구매자·AI의 삼각 연결</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
              <p className="font-bold text-gray-900 mb-2">🔒 코드 보호기술</p>
              <p className="text-gray-700">락버전 / 암호화 파일 배포</p>
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
              <span>지식 창작자 수익화 → 창조경제 활성화</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>비개발자 접근성 향상 → 기술 민주화 실현</span>
            </li>
            <li className="flex items-start gap-3 text-lg text-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span>AI와 인간의 협업 → 지속 가능한 업무 문화 확립</span>
            </li>
          </ul>
          <div className="mt-8 bg-green-100 rounded-xl p-6 border-2 border-green-300">
            <p className="text-xl font-bold text-gray-900 text-center">
              📈 WorkFree는 생산성과 창의성을 동시에 확장시키는 사회형 플랫폼입니다.
            </p>
          </div>
          </section>
        </FadeIn>

        {/* 10. Service Architecture */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            🧱 Service Architecture — 서비스 구조
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            * 자세한 기술 구조가 궁금하신 분들을 위한 섹션
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-purple-100">
                  <th className="border-2 border-indigo-200 px-6 py-4 text-left font-bold">구분</th>
                  <th className="border-2 border-indigo-200 px-6 py-4 text-left font-bold">설명</th>
                  <th className="border-2 border-indigo-200 px-6 py-4 text-left font-bold">포지션</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-2 border-gray-200 px-6 py-4 font-semibold">① 키트 마켓 (상품형)</td>
                  <td className="border-2 border-gray-200 px-6 py-4">직장인들이 만든 자동화 키트 판매</td>
                  <td className="border-2 border-gray-200 px-6 py-4">Gumroad형 / 저가 반복 매출</td>
                </tr>
                <tr>
                  <td className="border-2 border-gray-200 px-6 py-4 font-semibold">② AI 커스터마이징 (옵션형)</td>
                  <td className="border-2 border-gray-200 px-6 py-4">AI가 사용자 환경에 맞게 코드 수정</td>
                  <td className="border-2 border-gray-200 px-6 py-4">Zapier + ChatGPT형</td>
                </tr>
                <tr>
                  <td className="border-2 border-gray-200 px-6 py-4 font-semibold">③ 커스터마이즈 의뢰 (프로젝트형)</td>
                  <td className="border-2 border-gray-200 px-6 py-4">판매자에게 직접 의뢰, 단가 협의</td>
                  <td className="border-2 border-gray-200 px-6 py-4">크몽형 / 고가 수주 매출</td>
                </tr>
              </tbody>
            </table>
          </div>
          </section>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.2}>
          <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-center text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            🚀 베타테스트 무료 참여하기 →
          </h2>
          <p className="text-xl mb-8">
            지금은 베타테스트 기간으로 무료로 참여하실 수 있습니다.<br />
            실제 키트를 체험하고 효율화 데이터를 함께 남겨주세요.
          </p>
          <Link
            href="/beta"
            className="inline-block bg-white text-purple-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            지금 바로 참여하기
          </Link>
          </section>
        </FadeIn>

        {/* Footer */}
        <footer className="text-center text-gray-600 py-8 border-t border-gray-200">
          <p className="mb-2">© 2025 WorkFree — Work Less, Create More.</p>
          <p>문의: contact@workfree.ai</p>
        </footer>
      </div>
    </div>
  );
}
