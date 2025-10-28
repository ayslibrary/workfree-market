'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import type { BetaTester, MissionProgress } from '@/types/beta';

interface CommuteJourneyProps {
  tester: BetaTester;
  missions: MissionProgress[];
}

interface Stage {
  id: string;
  name: string;
  icon: string;
  theme: string;
  position: number;
  missionIds: number[];
  description: string;
  rewardCredits: number;
  timeSaved: number;
}

const COMMUTE_STAGES: Stage[] = [
  {
    id: 'office',
    name: '🏢 회사 사무실',
    icon: '🏢',
    theme: 'office',
    position: 0,
    missionIds: [1, 2, 3],
    description: '엑셀 보고서 자동 요약으로 업무 마무리',
    rewardCredits: 500,
    timeSaved: 60
  },
  {
    id: 'cafe',
    name: '☕ 사무실 앞 카페',
    icon: '☕',
    theme: 'cafe',
    position: 25,
    missionIds: [4, 5],
    description: '메일 자동회신으로 커피 타임 즐기기',
    rewardCredits: 500,
    timeSaved: 25
  },
  {
    id: 'subway',
    name: '🚇 지하철 이동 중',
    icon: '🚇',
    theme: 'subway',
    position: 50,
    missionIds: [6, 7],
    description: 'PDF 변환기로 이동 중 업무 처리',
    rewardCredits: 700,
    timeSaved: 70
  },
  {
    id: 'home',
    name: '🏠 집 도착 (퇴근 완료!)',
    icon: '🏠',
    theme: 'home',
    position: 75,
    missionIds: [8, 9, 10],
    description: '대시보드로 오늘의 효율 확인',
    rewardCredits: 1500,
    timeSaved: 0
  }
];

export default function CommuteJourney({ tester, missions }: CommuteJourneyProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [rabbitPosition, setRabbitPosition] = useState(0);

  // 현재 진행 상황 계산
  const completedMissions = tester.completedMissions.length;
  const totalMissions = missions.length;
  const progressPercentage = (completedMissions / totalMissions) * 100;

  // 토끼 위치 계산
  useEffect(() => {
    const stageIndex = Math.floor(progressPercentage / 25);
    const stageProgress = (progressPercentage % 25) / 25;
    const newPosition = COMMUTE_STAGES[stageIndex]?.position + (stageProgress * 25) || 0;
    setRabbitPosition(newPosition);
    setCurrentStage(Math.min(stageIndex, COMMUTE_STAGES.length - 1));
  }, [progressPercentage]);

  // 스테이지별 완료 상태 계산
  const getStageStatus = (stage: Stage) => {
    const stageMissions = missions.filter(m => stage.missionIds.includes(m.mission.order));
    const completedCount = stageMissions.filter(m => m.isCompleted).length;
    const totalCount = stageMissions.length;
    
    return {
      completed: completedCount === totalCount,
      inProgress: completedCount > 0 && completedCount < totalCount,
      locked: completedCount === 0 && stage.missionIds[0] > 1,
      progress: (completedCount / totalCount) * 100
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 헤더 */}
      <FadeIn>
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🚶‍♀️ AI로 퇴근하는 법
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-2">
            야근을 줄이는 가장 스마트한 방법
          </p>
          <div className="text-xs sm:text-sm text-purple-600 font-semibold">
            퇴근까지 남은 거리: {4 - currentStage}단계 🚶‍♀️
          </div>
        </div>
      </FadeIn>

      {/* 진행률 바 */}
      <FadeIn delay={0.1}>
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8 mx-4 sm:mx-0">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 sm:gap-0">
            <div className="text-xs sm:text-sm text-gray-600">
              퇴근 진행률: {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {completedMissions} / {totalMissions} 미션 완료
            </div>
          </div>
          <div className="relative">
            {/* 배경 경로 */}
            <div className="w-full h-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-1000"
                   style={{ width: `${progressPercentage}%` }} />
            </div>
            
            {/* 토끼 캐릭터 */}
            <motion.div
              className="absolute -top-2 transform -translate-x-1/2"
              style={{ left: `${rabbitPosition}%` }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-xl sm:text-2xl">🐰</div>
            </motion.div>
          </div>
        </div>
      </FadeIn>

      {/* 퇴근 경로 */}
      <FadeIn delay={0.2}>
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg mx-4 sm:mx-0">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            퇴근 경로
          </h3>
          
          <div className="relative">
            {/* 경로 라인 */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-full transform -translate-y-1/2" />
            
            {/* 스테이지들 */}
            <div className="relative flex justify-between px-2 sm:px-0">
              {COMMUTE_STAGES.map((stage, index) => {
                const status = getStageStatus(stage);
                
                return (
                  <motion.div
                    key={stage.id}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* 스테이지 아이콘 */}
                    <div className={`
                      w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3
                      transition-all duration-300 cursor-pointer
                      ${status.completed 
                        ? 'bg-green-500 text-white shadow-lg scale-110' 
                        : status.inProgress
                        ? 'bg-yellow-500 text-white shadow-lg scale-105'
                        : status.locked
                        ? 'bg-gray-300 text-gray-500'
                        : 'bg-blue-500 text-white hover:scale-105 hover:shadow-lg'
                      }
                    `}>
                      {status.completed ? '✅' : stage.icon}
                    </div>
                    
                    {/* 스테이지 정보 */}
                    <div className="text-center max-w-[80px] sm:max-w-[100px]">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 mb-1 leading-tight">
                        {stage.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 leading-tight">
                        {stage.description}
                      </p>
                      
                      {/* 보상 정보 */}
                      <div className="text-xs space-y-1">
                        <div className="text-purple-600 font-semibold">
                          +{stage.rewardCredits}
                        </div>
                        {stage.timeSaved > 0 && (
                          <div className="text-green-600 font-semibold">
                            {stage.timeSaved}분
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* 현재 스테이지 상세 정보 */}
      <FadeIn delay={0.3}>
        <div className="mt-8">
          <StaggerContainer>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMMUTE_STAGES.map((stage, index) => {
                const status = getStageStatus(stage);
                const isCurrentStage = index === currentStage;
                
                return (
                  <StaggerItem key={stage.id}>
                    <div className={`
                      bg-white rounded-xl p-6 shadow-lg border-2 transition-all
                      ${isCurrentStage 
                        ? 'border-purple-400 bg-purple-50' 
                        : status.completed
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200'
                      }
                    `}>
                      <div className="text-center">
                        <div className="text-3xl mb-3">
                          {status.completed ? '✅' : stage.icon}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          {stage.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          {stage.description}
                        </p>
                        
                        {/* 진행률 */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                              style={{ width: `${status.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round(status.progress)}% 완료
                          </div>
                        </div>
                        
                        {/* 상태 표시 */}
                        <div className="text-xs font-semibold">
                          {status.completed && (
                            <span className="text-green-600">✅ 완료</span>
                          )}
                          {status.inProgress && (
                            <span className="text-yellow-600">🔄 진행중</span>
                          )}
                          {status.locked && (
                            <span className="text-gray-500">🔒 잠금</span>
                          )}
                          {!status.completed && !status.inProgress && !status.locked && (
                            <span className="text-blue-600">⏳ 대기</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* 퇴근 완료 축하 메시지 */}
      {progressPercentage >= 100 && (
        <FadeIn delay={0.4}>
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-center text-white shadow-2xl mx-4 sm:mx-0">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              퇴근 완료! 🏠
            </h3>
            <p className="text-sm sm:text-base lg:text-xl mb-4 px-2">
              오늘도 WorkFree 덕분에 <span className="font-semibold">{Math.floor(tester.timeSaved / 60)}시간 {tester.timeSaved % 60}분</span> 일찍 퇴근했습니다!
            </p>
            <div className="bg-white/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="text-base sm:text-lg font-semibold mb-2">
                🏆 오늘의 성과
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <div className="text-yellow-300">⏰ 절약 시간</div>
                  <div className="font-bold">{tester.timeSaved}분</div>
                </div>
                <div>
                  <div className="text-yellow-300">💎 획득 크레딧</div>
                  <div className="font-bold">{tester.totalCreditsEarned}개</div>
                </div>
              </div>
            </div>
            <div className="text-xs sm:text-sm opacity-90 px-2">
              "AI로 퇴근하는 법을 완벽하게 마스터하셨습니다!" 🚀
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
