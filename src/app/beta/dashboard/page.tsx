'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useAuthStore } from '@/store/authStore';
import {
  getBetaTester,
  getUserMissionProgress,
  getBetaCompletionRate,
  formatTimeSaved,
} from '@/lib/beta/missions';
import type { BetaTester, MissionProgress } from '@/types/beta';
import { COMPLETION_BONUS } from '@/types/beta';
import SocialShareButtons from '@/components/beta/SocialShareButtons';
import CommuteJourney from '@/components/beta/CommuteJourney';
import CommuteBackground from '@/components/beta/CommuteBackground';
import TimeSavingsVisualization from '@/components/beta/TimeSavingsVisualization';
import TitleSystem from '@/components/beta/TitleSystem';
import WeeklyChallenge from '@/components/beta/WeeklyChallenge';

export default function BetaDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tester, setTester] = useState<BetaTester | null>(null);
  const [missions, setMissions] = useState<MissionProgress[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 데모 모드: 고정된 사용자 ID 사용
      const demoUserId = user?.id || 'demo-user-123';
      
      const [testerData, missionProgress, rate] = await Promise.all([
        getBetaTester(demoUserId),
        getUserMissionProgress(demoUserId),
        getBetaCompletionRate(demoUserId),
      ]);

      if (!testerData) {
        // 베타테스터가 아니면 등록 페이지로
        router.push('/beta');
        return;
      }

      setTester(testerData);
      setMissions(missionProgress);
      setCompletionRate(rate);
    } catch (error) {
      console.error('대시보드 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // 챌린지 보상 수령 처리
  const handleClaimReward = (challengeId: string) => {
    setToastMessage('🎉 챌린지 보상을 수령했습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
        <MainNavigation />
        <div className="flex justify-center items-center py-20 pt-24 md:pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!tester) {
    return null;
  }

  const completedCount = tester.completedMissions.length;
  const totalCount = missions.length;
  const remainingBonus = COMPLETION_BONUS.credits;
  const progressPercentage = (completedCount / totalCount) * 100;
  const currentStage = Math.floor(progressPercentage / 25);

  return (
    <div className="min-h-screen relative">
      <CommuteBackground currentStage={currentStage} progressPercentage={progressPercentage} />
      <MainNavigation />

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 pt-24 md:pt-20">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-8">
            <Link
              href="/beta"
              className="text-purple-600 hover:text-purple-700 font-semibold mb-4 inline-block"
            >
              ← 베타 홈
            </Link>
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-4">
              🏅 베타테스터 #{tester.betaNumber}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              미션 대시보드
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
              완주하면 <span className="font-semibold text-purple-600">{remainingBonus.toLocaleString()} 크레딧</span> + <span className="font-semibold text-blue-600">VIP 등급</span>을 받아가세요!
            </p>
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-yellow-800 mb-2">
                  💡 데모 모드로 체험 중입니다
                </p>
                <Link
                  href="/login"
                  className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                >
                  로그인하여 실제 데이터로 체험하기 →
                </Link>
              </div>
            )}
          </div>
        </FadeIn>

        {/* 퇴근 여정 */}
        <FadeIn delay={0.1}>
          <div className="mb-12">
            <CommuteJourney tester={tester} missions={missions} />
          </div>
        </FadeIn>

        {/* 시간 절약 시각화 */}
        <FadeIn delay={0.2}>
          <div className="mb-12">
            <TimeSavingsVisualization 
              timeSaved={tester.timeSaved}
              dailyGoal={120} // 2시간 목표
              weeklyGoal={600} // 10시간 목표
            />
          </div>
        </FadeIn>

        {/* 칭호 시스템 & 주간 챌린지 */}
        <FadeIn delay={0.3}>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <TitleSystem 
              timeSaved={tester.timeSaved}
              completedMissions={completedCount}
              totalMissions={totalCount}
            />
            <WeeklyChallenge 
              completedMissions={completedCount}
              timeSaved={tester.timeSaved}
              onClaimReward={handleClaimReward}
            />
          </div>
        </FadeIn>

        {/* 통계 카드 */}
        <StaggerContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {/* 진행률 */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-purple-200">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">전체 진행률</div>
                <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-4">
                  {completionRate}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {completedCount} / {totalCount} 미션 완료
                </div>
              </div>
            </StaggerItem>

            {/* 획득 크레딧 */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-blue-200">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">획득한 크레딧</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-2 break-all">
                  {tester.totalCreditsEarned.toLocaleString()}
                </div>
                {!tester.isCompleted && (
                  <div className="text-xs text-green-600 font-semibold">
                    +{remainingBonus.toLocaleString()} 크레딧 대기 중!
                  </div>
                )}
              </div>
            </StaggerItem>

            {/* 절약한 시간 */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-green-200">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">절약한 시간</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                  {formatTimeSaved(tester.timeSaved)}
                </div>
                <div className="text-xs text-gray-500">
                  💼 야근 시간을 줄였어요!
                </div>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* 완주 보상 안내 */}
        {!tester.isCompleted && (
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 sm:p-6 mb-12 text-center shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                🎁 완주 보상
              </h3>
              <p className="text-sm sm:text-base text-gray-800 mb-4 px-2">
                모든 미션을 완료하면 추가로 받을 수 있어요!
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                <div className="bg-white rounded-xl px-4 sm:px-6 py-3 min-w-[100px]">
                  <div className="text-xs sm:text-sm text-gray-600">크레딧</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 break-all">
                    +{COMPLETION_BONUS.credits.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-xl px-4 sm:px-6 py-3 min-w-[100px]">
                  <div className="text-xs sm:text-sm text-gray-600">등급</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                    👑 VIP
                  </div>
                </div>
                <div className="bg-white rounded-xl px-4 sm:px-6 py-3 min-w-[100px]">
                  <div className="text-xs sm:text-sm text-gray-600">할인</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    평생 30%
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* 완주 축하 */}
        {tester.isCompleted && (
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-12 text-center text-white shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4">
                축하합니다! 미션 완주!
              </h2>
              <p className="text-xl mb-6">
                {COMPLETION_BONUS.credits.toLocaleString()} 크레딧과 VIP 등급이 지급되었습니다!
              </p>
              <Link
                href="/beta/certificate"
                className="inline-block bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                📜 인증서 받기
              </Link>
            </div>
          </FadeIn>
        )}

        {/* SNS 공유 섹션 */}
        <FadeIn delay={0.3}>
          <div id="share" className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <SocialShareButtons
              betaNumber={tester.betaNumber}
              onShareComplete={loadDashboard}
            />
          </div>
        </FadeIn>

        {/* 미션 목록 */}
        <FadeIn delay={0.4}>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📝 미션 목록
            </h2>
            <div className="space-y-4">
              {missions.map((progress) => {
                const { mission, isCompleted, isLocked } = progress;
                return (
                  <div
                    key={mission.id}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      isCompleted
                        ? 'border-green-300 bg-green-50'
                        : isLocked
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-purple-300 bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-3xl">{mission.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-gray-900">
                              {mission.order}. {mission.title}
                            </h3>
                            {isCompleted && (
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                완료
                              </span>
                            )}
                            {isLocked && (
                              <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full font-bold">
                                🔒 잠금
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {mission.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-purple-600 font-semibold">
                              💰 +{mission.rewardCredits} 크레딧
                            </span>
                            {mission.timeSaved > 0 && (
                              <span className="text-green-600 font-semibold">
                                ⏱️ {formatTimeSaved(mission.timeSaved)} 절약
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!isCompleted && !isLocked && (
                        <Link
                          href={getActionLink(mission.actionType)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all whitespace-nowrap"
                        >
                          시작하기 →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

// 미션 타입별 액션 링크
function getActionLink(actionType: string): string {
  const links: Record<string, string> = {
    signup: '/signup',
    use_portrait: '/maker',
    use_blog: '/tools/blog-generator',
    write_review: '/beta/review',
    post_community: '/community/write',
    use_automation: '/automation',
    write_review_2: '/beta/review',
    social_share: '/beta/dashboard#share',
    final_review: '/beta/review?type=final',
    survey: '/beta/survey',
  };
  return links[actionType] || '/beta/dashboard';
}

