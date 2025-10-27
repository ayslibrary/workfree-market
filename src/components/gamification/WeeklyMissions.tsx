'use client';

import React from 'react';
import { WeeklyMission } from '@/types/gamification';

interface WeeklyMissionsProps {
  missions: WeeklyMission[];
  onMissionComplete: (missionId: string) => void;
}

export default function WeeklyMissions({ missions, onMissionComplete }: WeeklyMissionsProps) {
  const completedMissions = missions.filter(mission => mission.completed);
  const activeMissions = missions.filter(mission => !mission.completed);
  const completionRate = missions.length > 0 ? (completedMissions.length / missions.length) * 100 : 0;
  
  const getMissionIcon = (type: WeeklyMission['type']) => {
    switch (type) {
      case 'tool_usage': return '🔧';
      case 'review': return '✍️';
      case 'community': return '💬';
      case 'streak': return '🔥';
      case 'time_saved': return '⏰';
      default: return '🎯';
    }
  };
  
  const getProgressColor = (mission: WeeklyMission) => {
    const progress = (mission.current / mission.target) * 100;
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-yellow-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-gray-300';
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span>주간 미션 & 보상</span>
        </h2>
        <div className="text-sm text-gray-600">
          {completedMissions.length}/{missions.length} 완료 ({completionRate.toFixed(0)}%)
        </div>
      </div>
      
      {/* 진행률 바 */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span className="font-medium">{completionRate.toFixed(0)}% 완료</span>
          <span>100%</span>
        </div>
      </div>
      
      {missions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <div className="text-gray-600 mb-2">이번 주 미션이 없습니다</div>
          <div className="text-sm text-gray-500">다음 주에 새로운 미션이 나타날 예정입니다</div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* 완료된 미션 */}
          {completedMissions.map((mission) => (
            <div
              key={mission.id}
              className="border-2 border-green-200 bg-green-50 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 line-through">
                      {mission.title}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      완료
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {mission.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>🎁 +{mission.reward.xp} XP</span>
                    {mission.reward.credits && (
                      <span>💎 +{mission.reward.credits} 크레딧</span>
                    )}
                    <span>
                      완료: {mission.completedAt?.toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* 진행 중인 미션 */}
          {activeMissions.map((mission) => {
            const progress = (mission.current / mission.target) * 100;
            
            return (
              <div
                key={mission.id}
                className="border-2 border-gray-200 bg-white rounded-xl p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getMissionIcon(mission.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800">
                        {mission.title}
                      </h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                        진행중
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {mission.description}
                    </p>
                    
                    {/* 진행률 */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>진행률</span>
                        <span>{mission.current}/{mission.target} ({progress.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(mission)}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* 보상 및 액션 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>🎁 +{mission.reward.xp} XP</span>
                        {mission.reward.credits && (
                          <span>💎 +{mission.reward.credits} 크레딧</span>
                        )}
                      </div>
                      
                      {progress >= 100 && (
                        <button
                          onClick={() => onMissionComplete(mission.id)}
                          className="bg-green-500 text-white px-4 py-1 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                        >
                          완료하기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* 주간 리셋 정보 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 text-center">
          📅 주간 미션은 매주 월요일 00:00에 새로 시작됩니다
        </div>
      </div>
    </div>
  );
}
