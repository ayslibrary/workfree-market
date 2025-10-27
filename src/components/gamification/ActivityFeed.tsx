'use client';

import React from 'react';
import { Activity } from '@/types/gamification';

interface ActivityFeedProps {
  activities: Activity[];
  onViewAllActivities: () => void;
}

export default function ActivityFeed({ activities, onViewAllActivities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'tool_run': return '⚡';
      case 'level_up': return '🎉';
      case 'mission_complete': return '🎯';
      case 'review_write': return '✍️';
      case 'time_conversion': return '💎';
      default: return '📝';
    }
  };
  
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'tool_run': return 'text-blue-600 bg-blue-50';
      case 'level_up': return 'text-purple-600 bg-purple-50';
      case 'mission_complete': return 'text-green-600 bg-green-50';
      case 'review_write': return 'text-orange-600 bg-orange-50';
      case 'time_conversion': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };
  
  const formatTimeSaved = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span>최근 활동</span>
        </h2>
        <button
          onClick={onViewAllActivities}
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          전체보기 →
        </button>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <div className="text-gray-600 mb-2">아직 활동이 없습니다</div>
          <div className="text-sm text-gray-500">자동화 도구를 사용해보세요!</div>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* 아이콘 */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg
                ${getActivityColor(activity.type)}
              `}>
                {getActivityIcon(activity.type)}
              </div>
              
              {/* 활동 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-800">
                    {activity.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                
                {/* 보상 정보 */}
                <div className="flex items-center gap-3 text-xs">
                  {activity.xpEarned > 0 && (
                    <span className="text-green-600 font-medium">
                      +{activity.xpEarned} XP
                    </span>
                  )}
                  {activity.creditsEarned && activity.creditsEarned > 0 && (
                    <span className="text-blue-600 font-medium">
                      +{activity.creditsEarned} 크레딧
                    </span>
                  )}
                  {activity.creditsSpent && activity.creditsSpent > 0 && (
                    <span className="text-red-600 font-medium">
                      -{activity.creditsSpent} 크레딧
                    </span>
                  )}
                  {activity.timeSaved && (
                    <span className="text-purple-600 font-medium">
                      {formatTimeSaved(activity.timeSaved)} 절약
                    </span>
                  )}
                  {activity.toolUsed && (
                    <span className="text-gray-500">
                      {activity.toolUsed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 활동 통계 요약 */}
      {activities.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-800">
                {activities.filter(a => a.type === 'tool_run').length}
              </div>
              <div className="text-xs text-gray-600">도구 실행</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {activities.reduce((sum, a) => sum + (a.xpEarned || 0), 0)}
              </div>
              <div className="text-xs text-gray-600">총 XP</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">
                {formatTimeSaved(activities.reduce((sum, a) => sum + (a.timeSaved || 0), 0))}
              </div>
              <div className="text-xs text-gray-600">총 절약</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
