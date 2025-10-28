'use client';

import { motion } from 'framer-motion';

interface TitleSystemProps {
  timeSaved: number;
  completedMissions: number;
  totalMissions: number;
}

interface Title {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'time' | 'missions' | 'completion';
    value: number;
  };
  color: string;
}

const TITLES: Title[] = [
  {
    id: 'overtime_worker',
    name: '야근러',
    description: '아직 자동화의 세계에 발을 들여놓은 초보자',
    icon: '🌙',
    requirement: { type: 'time', value: 0 },
    color: 'text-gray-600'
  },
  {
    id: 'work_life_balancer',
    name: '워라밸러',
    description: '자동화로 시간을 절약하기 시작한 균형잡힌 직장인',
    icon: '⚖️',
    requirement: { type: 'time', value: 60 },
    color: 'text-blue-600'
  },
  {
    id: 'commute_master',
    name: '퇴근 마스터',
    description: 'AI 자동화로 완벽한 퇴근을 실현한 전문가',
    icon: '🏆',
    requirement: { type: 'completion', value: 100 },
    color: 'text-purple-600'
  },
  {
    id: 'early_leaver',
    name: '조기퇴근자',
    description: '매일 1시간 이상 일찍 퇴근하는 효율의 달인',
    icon: '🚀',
    requirement: { type: 'time', value: 300 },
    color: 'text-green-600'
  }
];

export default function TitleSystem({ timeSaved, completedMissions, totalMissions }: TitleSystemProps) {
  const completionRate = (completedMissions / totalMissions) * 100;
  
  // 현재 칭호 계산
  const getCurrentTitle = (): Title => {
    // 완주율 100%면 퇴근 마스터
    if (completionRate >= 100) {
      return TITLES.find(t => t.id === 'commute_master') || TITLES[0];
    }
    
    // 시간 기준으로 칭호 결정
    const timeBasedTitle = TITLES
      .filter(t => t.requirement.type === 'time')
      .sort((a, b) => b.requirement.value - a.requirement.value)
      .find(t => timeSaved >= t.requirement.value);
    
    return timeBasedTitle || TITLES[0];
  };

  // 다음 칭호 계산
  const getNextTitle = (): Title | null => {
    const currentTitle = getCurrentTitle();
    const currentIndex = TITLES.findIndex(t => t.id === currentTitle.id);
    
    if (currentIndex < TITLES.length - 1) {
      return TITLES[currentIndex + 1];
    }
    
    return null;
  };

  const currentTitle = getCurrentTitle();
  const nextTitle = getNextTitle();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
        🏅 현재 칭호
      </h3>
      
      {/* 현재 칭호 */}
      <motion.div
        className="text-center mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`text-4xl mb-2 ${currentTitle.color}`}>
          {currentTitle.icon}
        </div>
        <h4 className={`text-2xl font-bold ${currentTitle.color} mb-2`}>
          {currentTitle.name}
        </h4>
        <p className="text-gray-600 text-sm">
          {currentTitle.description}
        </p>
      </motion.div>

      {/* 다음 칭호까지의 진행률 */}
      {nextTitle && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              다음 칭호: {nextTitle.name}
            </span>
            <span className="text-sm text-gray-500">
              {nextTitle.requirement.type === 'time' 
                ? `${timeSaved}분 / ${nextTitle.requirement.value}분`
                : `${Math.round(completionRate)}% / ${nextTitle.requirement.value}%`
              }
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full bg-gradient-to-r ${currentTitle.color.includes('purple') ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-purple-500'}`}
              initial={{ width: 0 }}
              animate={{ 
                width: nextTitle.requirement.type === 'time' 
                  ? `${Math.min((timeSaved / nextTitle.requirement.value) * 100, 100)}%`
                  : `${Math.min(completionRate, 100)}%`
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="text-xs text-gray-500 mt-1 text-center">
            {nextTitle.requirement.type === 'time' 
              ? `${nextTitle.requirement.value - timeSaved}분 더 절약하면 달성!`
              : `${nextTitle.requirement.value - Math.round(completionRate)}% 더 완료하면 달성!`
            }
          </div>
        </div>
      )}

      {/* 칭호 히스토리 */}
      <div className="border-t pt-4">
        <h5 className="text-sm font-semibold text-gray-700 mb-3">칭호 히스토리</h5>
        <div className="space-y-2">
          {TITLES.map((title, index) => {
            const isUnlocked = title.requirement.type === 'time' 
              ? timeSaved >= title.requirement.value
              : completionRate >= title.requirement.value;
            
            return (
              <motion.div
                key={title.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  isUnlocked 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`text-lg ${isUnlocked ? title.color : 'text-gray-400'}`}>
                  {isUnlocked ? title.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isUnlocked ? title.color : 'text-gray-400'}`}>
                    {title.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {title.description}
                  </div>
                </div>
                {isUnlocked && (
                  <div className="text-green-500 text-xs font-semibold">
                    ✓ 달성
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 특별 메시지 */}
      {currentTitle.id === 'commute_master' && (
        <motion.div
          className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-purple-800 font-medium">
            🎉 축하합니다! 퇴근 마스터가 되셨습니다!
          </p>
          <p className="text-xs text-purple-600 mt-1">
            AI 자동화로 완벽한 워라밸을 실현하셨네요!
          </p>
        </motion.div>
      )}
    </div>
  );
}
