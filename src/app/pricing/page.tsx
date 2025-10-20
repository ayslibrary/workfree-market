'use client';

import { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { FadeIn } from '@/components/animations';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'credits'>('plans');

  const creditPackages = [
    {
      credits: 2400,
      baseCredits: 1800,
      bonusCredits: 600,
      price: 180000,
      popular: false,
    },
    {
      credits: 1500,
      baseCredits: 1200,
      bonusCredits: 300,
      price: 120000,
      popular: true,
    },
    {
      credits: 4000,
      baseCredits: 3000,
      bonusCredits: 1000,
      price: 300000,
      popular: false,
    },
    {
      credits: 11000,
      baseCredits: 8000,
      bonusCredits: 3000,
      price: 800000,
      popular: false,
    },
    {
      credits: 14000,
      baseCredits: 10000,
      bonusCredits: 4000,
      price: 1000000,
      popular: false,
    },
    {
      credits: 17000,
      baseCredits: 12000,
      bonusCredits: 5000,
      price: 1200000,
      popular: false,
    },
  ];

  const plans = [
    {
      name: 'Starter',
      subtitle: '무료',
      price: 0,
      credits: '30 크레딧',
      creditsDetail: '최대 5개 키트 다운로드',
      features: [
        '인기 자동화 키트 무료 체험',
        'AI 커스터마이징 미포함',
        '설치 가이드 & 문서 제공',
      ],
      highlights: [
        { icon: '✅', text: '무료 시작 가능' },
        { icon: '🚫', text: 'AI 수정/의뢰 기능 제한' },
      ],
      badge: null,
      color: 'gray',
    },
    {
      name: 'Pro',
      subtitle: '프로 실무자용',
      price: 14900,
      credits: '300 크레딧',
      creditsDetail: '최대 30개 키트 다운로드',
      features: [
        'AI 커스터마이징 1:1 지원',
        'Outlook/Excel 자동 연동 키트',
        '맞춤형 추천 자동화 제공',
        '실무 전용 챗봇 가이드 포함',
      ],
      highlights: [
        { icon: '⭐', text: '실무자에게 가장 인기' },
        { icon: '📈', text: '효율 10배 상승' },
      ],
      badge: '가장 인기 있는 플랜',
      color: 'indigo',
    },
    {
      name: 'Business',
      subtitle: '팀/기업용',
      price: 49000,
      credits: '무제한 크레딧',
      creditsDetail: '팀 계정 5인 기준',
      features: [
        '전용 관리자 대시보드',
        '사내 자동화 배포/버전관리 지원',
        '맞춤형 기업 커스터마이징 제공',
        'API 연동 (Google, MS365, SAP 등)',
      ],
      highlights: [
        { icon: '🧩', text: '기업 전용 SLA 지원' },
        { icon: '🛡️', text: '보안 암호화 & 전용 서버 가능' },
      ],
      badge: null,
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SimpleHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30">
        <div className="container mx-auto max-w-6xl text-center">
          <FadeIn>
            <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg mb-6">
              🎉 현재 베타테스트 기간 — 모든 플랜 무료 오픈 중!
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              💼 WorkFree Market 요금제
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              직장인의 자동화를 위한, 합리적이고 실속 있는 선택.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  activeTab === 'plans'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                💼 플랜
              </button>
              <button
                onClick={() => setActiveTab('credits')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  activeTab === 'credits'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                💎 크레딧
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      {activeTab === 'plans' && (
        <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <FadeIn key={plan.name} delay={index * 0.1}>
                <div
                  className={`relative rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    plan.color === 'indigo'
                      ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 shadow-xl'
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan Name */}
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        ₩{plan.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">/월</span>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {plan.credits}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.creditsDetail}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      주요 기능
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-indigo-600 dark:text-indigo-400 text-lg">✓</span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6 space-y-2">
                    {plan.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span>{highlight.icon}</span>
                        <span>{highlight.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      plan.color === 'indigo'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    }`}
                  >
                    {plan.price === 0 ? '무료로 시작하기' : '지금 구독하기'}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Credits Section */}
      {activeTab === 'credits' && (
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
          <div className="container mx-auto max-w-7xl">
            <FadeIn>
              <h2 className="text-4xl font-bold text-center mb-4 text-white">
                💎 크레딧 구매
              </h2>
              <p className="text-center text-gray-400 mb-16 text-lg">
                크레딧으로 원하는 키트를 자유롭게 다운로드하세요.<br />
                많이 구매할수록 보너스 크레딧이 증정됩니다!
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditPackages.map((pkg, index) => (
                <FadeIn key={pkg.credits} delay={index * 0.1}>
                  <div
                    className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                      pkg.popular
                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.5)]'
                        : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full">
                          인기
                        </span>
                      </div>
                    )}

                    {/* Credits Display */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-2 mb-3">
                        <span className="text-4xl">💎</span>
                        <span className="text-5xl font-bold text-white">
                          {pkg.credits.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        총가: <span className="text-blue-400">{pkg.baseCredits.toLocaleString()}</span> + <span className="text-purple-400">{pkg.bonusCredits.toLocaleString()} 보너스</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white">
                        ₩{pkg.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <button
                      className={`w-full py-4 rounded-xl font-semibold transition-all ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      지금 구매
                    </button>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Credit Info */}
            <FadeIn delay={0.5}>
              <div className="mt-16 p-8 bg-gray-800/30 border border-gray-700 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  💡 크레딧 사용 안내
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl mb-2">🎯</div>
                    <h4 className="font-semibold text-white mb-2">유효 기간 없음</h4>
                    <p className="text-sm text-gray-400">구매한 크레딧은 영구적으로 사용 가능합니다</p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">🔄</div>
                    <h4 className="font-semibold text-white mb-2">자유로운 사용</h4>
                    <p className="text-sm text-gray-400">원하는 키트를 자유롭게 다운로드하세요</p>
                  </div>
                  <div>
                    <div className="text-3xl mb-2">🎁</div>
                    <h4 className="font-semibold text-white mb-2">보너스 적립</h4>
                    <p className="text-sm text-gray-400">많이 구매할수록 더 많은 보너스!</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Additional Info */}
      {activeTab === 'plans' && (
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              💡 추가 안내
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  💰 AI 커스터마이징 추가요금
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ₩3,000 /건
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  🤝 커스터마이즈 의뢰 수수료
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  판매자 거래 금액의 15%
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  💳 결제 방식
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  월 구독 또는 크레딧 단위 선결제
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  🎉 베타테스트 기간
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  현재 모든 플랜 무료 오픈 중!
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              WorkFree Market
            </h2>
            <p className="text-xl text-white/90 mb-8">
              &quot;당신의 시간을 되돌려드립니다.&quot;
            </p>
            <a
              href="/"
              className="inline-block px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              지금 바로 무료로 시작하기 →
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

