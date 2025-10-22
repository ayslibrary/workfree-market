'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserCredits } from '@/lib/creditSystem';
import { UserCredits, SUBSCRIPTION_PLANS } from '@/types/credit';
import SimpleHeader from '@/components/SimpleHeader';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function CreditsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadCredits();
    }
  }, [user, isLoading, router]);

  const loadCredits = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    const userCredits = await getUserCredits(user.uid);
    setCredits(userCredits);
    setLoading(false);
  };

  if (isLoading || loading || !user) {
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
      <SimpleHeader />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              💎 크레딧 & 구독
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              필요한 만큼만 사용하고, 시간은 절약하세요
            </p>
          </div>
        </FadeIn>

        {/* 현재 크레딧 */}
        {credits && (
          <FadeIn delay={0.1}>
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-90 mb-2">보유 크레딧</div>
                    <div className="text-5xl font-bold">{credits.balance}</div>
                    {credits.isBetaTester && (
                      <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        🎁 베타 테스터
                      </div>
                    )}
                  </div>
                  <div className="text-8xl opacity-20">💎</div>
                </div>
                
                {credits.balance < 5 && (
                  <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm">
                      ⚠️ 크레딧이 부족합니다. 아래에서 충전하세요!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        )}

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
                        <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                          ₩{plan.price.toLocaleString()}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-gray-500 dark:text-gray-400">/월</span>
                        )}
                      </div>
                      <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                        {plan.credits} 크레딧
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
                      disabled={plan.comingSoon || (plan.id === 'free' && credits?.isBetaTester)}
                      className={`
                        w-full py-4 rounded-xl font-bold transition-all
                        ${plan.comingSoon || (plan.id === 'free' && credits?.isBetaTester)
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                          : plan.recommended
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      {plan.comingSoon ? '출시 예정' : 
                       plan.id === 'free' && credits?.isBetaTester ? '이미 가입됨' :
                       plan.id === 'free' ? '무료로 시작하기' :
                       plan.id === credits?.subscriptionTier ? '현재 플랜' :
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

