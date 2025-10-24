'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

// 데모 데이터
const DEMO_CREDITS = {
  balance: 10,
  isBetaTester: true,
  subscriptionTier: 'free' as const,
};

const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    nameKo: '베타 테스터',
    badge: '🎁',
    price: 0,
    credits: 10,
    features: [
      '🎉 베타 기간 완전 무료!',
      '회원가입 시 10 크레딧 지급',
      '모든 기능 무제한 이용',
      '후기 작성 +5 크레딧',
      'SNS 공유 +10 크레딧',
      '피드백 제출 +15 크레딧',
    ],
    recommended: true,
    comingSoon: false,
  },
  {
    id: 'starter',
    nameKo: 'Starter (준비중)',
    badge: '💎',
    price: 0,
    credits: 200,
    features: [
      '정식 출시 후 이용 가능',
      '월 200 크레딧 제공 예정',
      '크레딧 이월 가능',
      '우선 지원',
      '신규 기능 우선 체험',
    ],
    recommended: false,
    comingSoon: true,
  },
  {
    id: 'pro',
    nameKo: 'Pro (준비중)',
    badge: '🚀',
    price: 0,
    credits: 1000,
    features: [
      '정식 출시 후 이용 가능',
      '월 1000 크레딧 제공 예정',
      '전담 고객 지원',
      'API 접근 권한',
      '커스텀 자동화 요청',
    ],
    recommended: false,
    comingSoon: true,
  },
];

export default function CreditsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로딩 시뮬레이션
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 pt-28">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
              🎉 베타 기간 완전 무료!
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              💎 크레딧 시스템
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              베타 기간 동안 모든 기능을 무료로 체험하세요
            </p>
          </div>
        </FadeIn>

        {/* 현재 크레딧 */}
        <FadeIn delay={0.1}>
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-2">보유 크레딧</div>
                  <div className="text-5xl font-bold">{DEMO_CREDITS.balance}</div>
                  {DEMO_CREDITS.isBetaTester && (
                    <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      🎁 베타 테스터
                    </div>
                  )}
                </div>
                <div className="text-8xl opacity-20">💎</div>
              </div>
              
              {DEMO_CREDITS.balance < 5 && (
                <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm">
                    ⚠️ 크레딧이 부족합니다. 아래에서 충전하세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 구독 플랜 */}
        <FadeIn delay={0.2}>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              구독 플랜
            </h2>

            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <StaggerItem key={plan.id}>
                  <div className={`
                    relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 
                    ${plan.recommended 
                      ? 'border-purple-500 shadow-2xl scale-105' 
                      : 'border-gray-200 dark:border-gray-800'
                    }
                    ${plan.comingSoon ? 'opacity-60' : 'hover:scale-105'}
                    transition-all
                  `}>
                    {plan.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                          추천
                        </span>
                      </div>
                    )}
                    
                    {plan.comingSoon && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm font-bold">
                          출시 예정
                        </span>
                      </div>
                    )}

                    {/* 플랜 정보 */}
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4">{plan.badge || '💼'}</div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.nameKo}
                      </h3>
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        {plan.id === 'free' ? (
                          <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            완전 무료
                          </span>
                        ) : (
                          <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                            정식 출시 후 공개
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        {plan.credits} 크레딧 {plan.id !== 'free' && '(예정)'}
                      </div>
                    </div>

                    {/* 기능 목록 */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA 버튼 */}
                    <button
                      disabled={plan.comingSoon || (plan.id === 'free' && DEMO_CREDITS.isBetaTester)}
                      className={`
                        w-full py-4 rounded-xl font-bold transition-all
                        ${plan.comingSoon || (plan.id === 'free' && DEMO_CREDITS.isBetaTester)
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                          : plan.recommended
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {plan.comingSoon ? '출시 예정' : 
                       plan.id === 'free' && DEMO_CREDITS.isBetaTester ? '이미 가입됨' :
                       plan.id === 'free' ? '무료로 시작하기' :
                       plan.id === DEMO_CREDITS.subscriptionTier ? '현재 플랜' :
                       '플랜 선택하기'}
                    </button>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>

        {/* 크레딧 사용 가이드 */}
        <FadeIn delay={0.3}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              💡 크레딧 사용 가이드
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  문서 변환 (1 크레딧)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  PDF → Word, 이미지 압축 등 문서 처리 도구
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">📧</span>
                  이메일 자동화 (1 크레딧)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Outlook 자동 회신, 메일 발송 자동화
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  데이터 처리 (2 크레딧)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  엑셀 병합, 데이터 분석 등 고급 처리
                </p>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6 border-2 border-pink-200 dark:border-pink-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  AI 생성 (3 크레딧)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  AI 화보 생성, 콘텐츠 제작 등 AI 도구
                </p>
              </div>
            </div>

            {/* 크레딧 적립 방법 */}
            <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-8 border-2 border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                무료 크레딧 받는 법
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✍️</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">후기 작성</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+5 크레딧</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">SNS 공유</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+10 크레딧</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">피드백 제출</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+15 크레딧</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">친구 초대</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+20 크레딧</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 적정 가격 설문 안내 */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                도와주세요! 적정 가격 의견을 구합니다
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                정식 출시 시 크레딧 가격을 정하려고 합니다.<br />
                <strong>후기 작성</strong> 시 &quot;크레딧 1개에 적정한 가격&quot;을 알려주시면 큰 도움이 됩니다!
              </p>
              <Link
                href="/reviews/write"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                후기 작성하고 의견 남기기 →
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* 하단 CTA */}
        <div className="text-center mt-12">
          <Link
            href="/my/dashboard"
            className="inline-block text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold"
          >
            ← 마이페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
