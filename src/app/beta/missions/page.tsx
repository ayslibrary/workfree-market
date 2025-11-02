"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { CreditBalanceCard, CreditRewardPopup } from "@/components/beta/CreditDisplay";
import {
  ONBOARDING_MISSIONS,
  OPTIONAL_MISSIONS,
  CREDIT_REWARDS,
  formatCredits,
} from "@/types/beta-onboarding";

export default function BetaMissionsPage() {
  const { user } = useAuth();
  const [currentStage, setCurrentStage] = useState<'stage1' | 'stage2' | 'completed'>('stage1');
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedOptional, setCompletedOptional] = useState<string[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [rewardInfo, setRewardInfo] = useState({ amount: 0, reason: '' });
  const [usageCount, setUsageCount] = useState(0);
  const [betaDay, setBetaDay] = useState(1);

  // 베타 시작일 (실제로는 DB에서 가져와야 함)
  const betaStartDate = new Date('2025-11-03');

  useEffect(() => {
    // 베타 며칠차인지 계산
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - betaStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setBetaDay(Math.min(diffDays, 7));

    // TODO: Firebase에서 실제 진행 상황 불러오기
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    // TODO: Firestore에서 사용자 진행 상황 로드
    // 임시 데이터
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('betaProgress');
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedMissions(data.completedMissions || []);
        setCompletedOptional(data.completedOptional || []);
        setTotalCredits(data.totalCredits || 0);
        setCurrentStage(data.currentStage || 'stage1');
        setUsageCount(data.usageCount || 0);
      }
    }
  };

  const saveProgress = (data: any) => {
    // TODO: Firestore에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('betaProgress', JSON.stringify(data));
    }
  };

  const completeMission = (missionId: string, creditReward: number) => {
    const newCompleted = [...completedMissions, missionId];
    const newCredits = totalCredits + creditReward;
    
    setCompletedMissions(newCompleted);
    setTotalCredits(newCredits);
    
    // 스테이지 진행
    if (missionId === 'stage1') {
      setCurrentStage('stage2');
    } else if (missionId === 'stage2') {
      setCurrentStage('completed');
    }

    saveProgress({
      completedMissions: newCompleted,
      completedOptional,
      totalCredits: newCredits,
      currentStage: missionId === 'stage2' ? 'completed' : currentStage,
      usageCount,
    });

    // 보상 팝업 표시
    const mission = ONBOARDING_MISSIONS.find(m => m.id === missionId);
    if (mission) {
      setRewardInfo({
        amount: creditReward,
        reason: `${mission.title} 완료!`,
      });
      setShowRewardPopup(true);
    }
  };

  const completeOptionalMission = (missionId: string, creditReward: number) => {
    if (completedOptional.includes(missionId)) return;

    const newCompleted = [...completedOptional, missionId];
    const newCredits = totalCredits + creditReward;
    
    setCompletedOptional(newCompleted);
    setTotalCredits(newCredits);

    saveProgress({
      completedMissions,
      completedOptional: newCompleted,
      totalCredits: newCredits,
      currentStage,
      usageCount,
    });

    const mission = OPTIONAL_MISSIONS.find(m => m.id === missionId);
    if (mission) {
      setRewardInfo({
        amount: creditReward,
        reason: `${mission.title} 완료!`,
      });
      setShowRewardPopup(true);
    }
  };

  const day1Completed = currentStage === 'completed';
  const totalOptionalCredits = completedOptional.reduce((sum, id) => {
    const mission = OPTIONAL_MISSIONS.find(m => m.id === id);
    return sum + (mission?.creditReward || 0);
  }, 0);

  const maxPossibleCredits = CREDIT_REWARDS.MAX_TOTAL;
  const progressPercentage = (totalCredits / maxPossibleCredits) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/beta" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">W</span>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                WorkFree Beta
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Day {betaDay}/7
              </div>
              <Link
                href="/beta/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all"
              >
                대시보드
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* 프로그레스 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎮 베타 미션
          </h1>
          <p className="text-lg text-gray-600">
            7일간의 여정을 함께해요! 최대 {formatCredits(maxPossibleCredits).withValue} 획득 가능
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 왼쪽: 미션 목록 */}
          <div className="md:col-span-2 space-y-6">
            {/* Day 1 필수 미션 */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-indigo-600">
                  ⚡ Day 1: 25분 집중 체험 (필수)
                </h2>
                {day1Completed && (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    ✅ 완료
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {ONBOARDING_MISSIONS.map((mission) => {
                  const isCompleted = completedMissions.includes(mission.id);
                  const isCurrent = mission.stage === currentStage && !isCompleted;
                  const isLocked = !isCurrent && !isCompleted;

                  return (
                    <div
                      key={mission.id}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : isCurrent
                          ? 'bg-indigo-50 border-indigo-300 shadow-md'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{mission.icon}</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {mission.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {mission.description}
                            </p>
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="text-2xl">✅</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>⏱️ {mission.estimatedMinutes}분</span>
                          <span className="font-semibold text-indigo-600">
                            💎 {formatCredits(mission.creditReward).formatted}
                          </span>
                        </div>

                        {isCurrent && !isCompleted && (
                          <button
                            onClick={() => {
                              // 실제로는 해당 미션 페이지로 이동
                              if (mission.id === 'stage1') {
                                window.location.href = '/tools/qr-generator';
                              } else {
                                window.location.href = '/tools/blog-generator';
                              }
                            }}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            시작하기 →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {day1Completed && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    Day 1 완료!
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {formatCredits(CREDIT_REWARDS.DAY_1_TOTAL).withValue} 획득 완료
                  </p>
                  <div className="text-sm text-gray-600">
                    이제부터 7일간 자유롭게 사용해보세요!
                  </div>
                </div>
              )}
            </section>

            {/* Day 2-7 선택 미션 */}
            <section className="bg-white rounded-3xl shadow-xl p-8 border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-600 mb-2">
                🎁 Day 2-7: 보너스 미션 (선택)
              </h2>
              <p className="text-gray-600 mb-6">
                하고 싶은 것만 하세요! 강제 없어요.
              </p>

              <div className="space-y-4">
                {OPTIONAL_MISSIONS.map((mission) => {
                  const isCompleted = completedOptional.includes(mission.id);
                  const credits = formatCredits(mission.creditReward);

                  return (
                    <div
                      key={mission.id}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-purple-50 border-purple-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{mission.icon}</div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {mission.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {mission.description}
                            </p>
                          </div>
                        </div>
                        {isCompleted && (
                          <div className="text-2xl">✅</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{mission.day}</span>
                          <span className="text-sm font-semibold text-purple-600">
                            💎 {credits.formatted}
                          </span>
                        </div>

                        {!isCompleted && (
                          <Link
                            href={
                              mission.id === 'three_uses'
                                ? '/tools'
                                : mission.id === 'referral'
                                ? '/beta/referral'
                                : mission.id === 'review'
                                ? '/beta/review'
                                : '/beta/feedback'
                            }
                            className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                          >
                            하러 가기 →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* 오른쪽: 크레딧 & 진행 상황 */}
          <div className="space-y-6">
            {/* 크레딧 잔액 */}
            <CreditBalanceCard
              balance={totalCredits}
              earned={totalCredits}
              spent={0}
              showEstimates={true}
            />

            {/* 진행 상황 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📊 진행 상황
              </h3>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">전체 진행률</span>
                  <span className="font-semibold text-indigo-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {totalCredits} / {maxPossibleCredits} 크레딧
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">✅ Day 1 완료</span>
                  <span className={day1Completed ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                    {day1Completed ? '완료' : '진행 중'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">🎁 선택 미션</span>
                  <span className="font-semibold text-purple-600">
                    {completedOptional.length} / {OPTIONAL_MISSIONS.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">💎 획득 크레딧</span>
                  <span className="font-semibold text-indigo-600">
                    {totalCredits}개
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">📅 남은 기간</span>
                  <span className="font-semibold text-gray-900">
                    {7 - betaDay}일
                  </span>
                </div>
              </div>
            </div>

            {/* 빠른 링크 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🚀 빠른 링크
              </h3>
              <div className="space-y-2">
                <Link
                  href="/tools"
                  className="block bg-white hover:bg-indigo-50 text-gray-900 px-4 py-3 rounded-xl font-semibold transition-all text-center"
                >
                  도구 사용하기
                </Link>
                <Link
                  href="/beta/review"
                  className="block bg-white hover:bg-purple-50 text-gray-900 px-4 py-3 rounded-xl font-semibold transition-all text-center"
                >
                  리뷰 작성
                </Link>
                <Link
                  href="/beta/feedback"
                  className="block bg-white hover:bg-pink-50 text-gray-900 px-4 py-3 rounded-xl font-semibold transition-all text-center"
                >
                  피드백 남기기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 보상 팝업 */}
      {showRewardPopup && (
        <CreditRewardPopup
          amount={rewardInfo.amount}
          reason={rewardInfo.reason}
          onClose={() => setShowRewardPopup(false)}
        />
      )}
    </div>
  );
}

