'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WeeklyChallengeProps {
  completedMissions: number;
  timeSaved: number;
  onClaimReward: (challengeId: string) => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: {
    credits: number;
    badge?: string;
  };
  type: 'missions' | 'time' | 'streak';
  icon: string;
  color: string;
}

const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'automation_master',
    title: '자동화 마스터',
    description: '이번 주에 3회 이상 자동화 성공',
    target: 3,
    current: 0,
    reward: { credits: 50, badge: '🔥' },
    type: 'missions',
    icon: '🤖',
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'time_saver',
    title: '시간 절약왕',
    description: '이번 주에 2시간 이상 시간 절약',
    target: 120,
    current: 0,
    reward: { credits: 100, badge: '⏰' },
    type: 'time',
    icon: '💎',
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'early_bird',
    title: '조기퇴근러',
    description: '연속 3일 조기퇴근 달성',
    target: 3,
    current: 0,
    reward: { credits: 75, badge: '🚀' },
    type: 'streak',
    icon: '🌅',
    color: 'from-orange-500 to-pink-500'
  }
];

export default function WeeklyChallenge({ completedMissions, timeSaved, onClaimReward }: WeeklyChallengeProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(WEEKLY_CHALLENGES);
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());

  // 챌린지 진행률 업데이트
  useEffect(() => {
    setChallenges(prev => prev.map(challenge => {
      let current = 0;
      
      switch (challenge.type) {
        case 'missions':
          current = completedMissions;
          break;
        case 'time':
          current = timeSaved;
          break;
        case 'streak':
          // 연속 조기퇴근 일수 (Mock 데이터)
          current = Math.min(Math.floor(timeSaved / 60), 3);
          break;
      }
      
      return { ...challenge, current };
    }));
  }, [completedMissions, timeSaved]);

  const handleClaimReward = (challengeId: string) => {
    setClaimedRewards(prev => new Set([...prev, challengeId]));
    onClaimReward(challengeId);
  };

  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.current / challenge.target) * 100, 100);
  };

  const isCompleted = (challenge: Challenge) => {
    return challenge.current >= challenge.target;
  };

  const isClaimed = (challengeId: string) => {
    return claimedRewards.has(challengeId);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          🏆 이번 주 챌린지
        </h3>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ko-KR', { 
            month: 'long', 
            week: 'numeric' 
          })} 주차
        </div>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => {
          const progress = getProgressPercentage(challenge);
          const completed = isCompleted(challenge);
          const claimed = isClaimed(challenge.id);
          
          return (
            <motion.div
              key={challenge.id}
              className={`border-2 rounded-xl p-4 transition-all ${
                completed 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`text-2xl ${completed ? 'animate-bounce' : ''}`}>
                    {challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {challenge.description}
                    </p>
                    
                    {/* 진행률 바 */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">
                          {challenge.type === 'time' 
                            ? `${challenge.current}분 / ${challenge.target}분`
                            : `${challenge.current} / ${challenge.target}`
                          }
                        </span>
                        <span className="text-xs font-semibold text-gray-600">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${challenge.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* 보상 정보 */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-purple-600 font-semibold">
                        💰 +{challenge.reward.credits} 크레딧
                      </span>
                      {challenge.reward.badge && (
                        <span className="text-orange-600 font-semibold">
                          {challenge.reward.badge} 배지
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 완료/수령 버튼 */}
                <div className="flex flex-col gap-2">
                  {completed && !claimed ? (
                    <motion.button
                      onClick={() => handleClaimReward(challenge.id)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      보상 수령
                    </motion.button>
                  ) : claimed ? (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm text-center">
                      ✓ 수령완료
                    </div>
                  ) : (
                    <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-bold text-sm text-center">
                      진행중
                    </div>
                  )}
                  
                  {completed && (
                    <div className="text-xs text-green-600 font-semibold text-center">
                      🎉 달성!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 주간 챌린지 안내 */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center">
          <p className="text-sm text-purple-800 font-medium mb-2">
            💡 챌린지 팁
          </p>
          <p className="text-xs text-purple-600">
            매일 조금씩 자동화를 활용하면 주간 챌린지를 쉽게 달성할 수 있어요!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
