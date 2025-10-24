'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SimpleHeader from '@/components/SimpleHeader';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useAuthStore } from '@/store/authStore';
import { registerBetaTester, getBetaTesterCount } from '@/lib/beta/missions';
import { MAX_BETA_TESTERS, COMPLETION_BONUS } from '@/types/beta';

export default function BetaPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [testerCount, setTesterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadTesterCount();
  }, []);

  const loadTesterCount = async () => {
    try {
      const count = await getBetaTesterCount();
      setTesterCount(count);
    } catch (error) {
      console.error('베타테스터 수 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinBeta = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      setIsJoining(true);
      const betaNumber = await registerBetaTester(user.id);

      if (betaNumber === null) {
        alert('죄송합니다. 베타 테스터 모집이 마감되었습니다.');
        return;
      }

      alert(`축하합니다! 베타테스터 #${betaNumber}로 등록되었습니다! 🎉`);
      router.push('/beta/dashboard');
    } catch (error: any) {
      console.error('베타 등록 실패:', error);
      alert(error.message || '베타 등록에 실패했습니다.');
    } finally {
      setIsJoining(false);
    }
  };

  const remainingSlots = MAX_BETA_TESTERS - testerCount;
  const isFull = testerCount >= MAX_BETA_TESTERS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <SimpleHeader />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* 메인 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">
              🔥 LIMITED BETA
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              베타테스터 100인 한정 모집
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              WorkFree Beta Mission 100에 참여하고
              <br />
              <span className="font-bold text-purple-600">
                10,000 크레딧 + VIP 등급
              </span>
              을 받아가세요!
            </p>

            {/* 카운터 */}
            {isLoading ? (
              <div className="inline-block bg-gray-100 rounded-2xl px-8 py-6">
                <div className="animate-pulse">로딩 중...</div>
              </div>
            ) : (
              <div className="inline-block bg-white rounded-2xl shadow-xl px-8 py-6 border-4 border-purple-200">
                <div className="text-sm text-gray-600 mb-2">현재 참여자</div>
                <div className="text-5xl font-bold">
                  <span className="text-purple-600">{testerCount}</span>
                  <span className="text-gray-400"> / {MAX_BETA_TESTERS}</span>
                </div>
                {!isFull && (
                  <div className="text-sm text-red-600 font-bold mt-2">
                    ⏰ 남은 자리 {remainingSlots}개!
                  </div>
                )}
              </div>
            )}
          </div>
        </FadeIn>

        {/* CTA 버튼 */}
        <FadeIn delay={0.1}>
          <div className="text-center mb-16">
            {isFull ? (
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-12 py-4 rounded-xl font-bold text-xl cursor-not-allowed"
              >
                마감되었습니다
              </button>
            ) : (
              <button
                onClick={handleJoinBeta}
                disabled={isJoining}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {isJoining ? '등록 중...' : '🚀 지금 바로 참여하기'}
              </button>
            )}
            <p className="text-sm text-gray-500 mt-4">
              * 로그인이 필요합니다
            </p>
          </div>
        </FadeIn>

        {/* 혜택 카드 */}
        <StaggerContainer>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <StaggerItem>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {COMPLETION_BONUS.credits.toLocaleString()} 크레딧
                </h3>
                <p className="text-gray-600">
                  10개 미션 완주 시<br />대량 크레딧 무료 제공
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  VIP 등급
                </h3>
                <p className="text-gray-600">
                  정식 런칭 시<br />평생 VIP 혜택 제공
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  특별 할인
                </h3>
                <p className="text-gray-600">
                  모든 서비스<br />평생 30% 할인
                </p>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* 미션 소개 */}
        <FadeIn delay={0.3}>
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl p-12 mb-16 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">
              🎮 10개 미션으로 완성하는 베타 여정
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">✅</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">1. 회원가입</h4>
                  <p className="text-purple-200 text-sm">+100 크레딧</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎨</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">2. AI 초상화 생성</h4>
                  <p className="text-purple-200 text-sm">+200 크레딧 | 30분 절약</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">✍️</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">3. AI 블로그 생성</h4>
                  <p className="text-purple-200 text-sm">+200 크레딧 | 30분 절약</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">📝</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">4. 첫 번째 후기</h4>
                  <p className="text-purple-200 text-sm">+300 크레딧</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">💬</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">5. 커뮤니티 참여</h4>
                  <p className="text-purple-200 text-sm">+200 크레딧</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔧</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">6. 자동화 도구</h4>
                  <p className="text-purple-200 text-sm">+300 크레딧 | 60분 절약</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">📝</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">7. 두 번째 후기</h4>
                  <p className="text-purple-200 text-sm">+400 크레딧</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">📢</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">8. SNS 공유</h4>
                  <p className="text-purple-200 text-sm">+500 크레딧</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">📝</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">9. 전체 후기</h4>
                  <p className="text-purple-200 text-sm">+500 크레딧</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎉</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">10. 베타 설문</h4>
                  <p className="text-purple-200 text-sm">+500 크레딧</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold">
                🎁 완주 보너스: +10,000 크레딧 + VIP 등급
              </div>
            </div>
          </div>
        </FadeIn>

        {/* FAQ */}
        <FadeIn delay={0.4}>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Q. 베타 테스트는 언제까지인가요?
                </h4>
                <p className="text-gray-600">
                  100명이 모두 모집되면 자동으로 마감됩니다. 서둘러 참여하세요!
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Q. 미션을 완료하지 못하면 어떻게 되나요?
                </h4>
                <p className="text-gray-600">
                  일부만 완료해도 해당 미션의 크레딧은 받을 수 있습니다. 하지만 완주 보너스는 10개 모두 완료 시에만 지급됩니다.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Q. VIP 등급의 혜택은 무엇인가요?
                </h4>
                <p className="text-gray-600">
                  정식 런칭 후 모든 서비스 평생 30% 할인, 신기능 우선 체험, 전용 고객 지원 등의 혜택이 제공됩니다.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
