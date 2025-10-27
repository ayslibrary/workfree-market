'use client';

import React, { useState } from 'react';
import { Routine } from '@/types/gamification';

interface MyRoutinesProps {
  routines: Routine[];
  onToggleRoutine: (routineId: string, isActive: boolean) => void;
  onEditRoutine: (routineId: string) => void;
}

export default function MyRoutines({ routines, onToggleRoutine, onEditRoutine }: MyRoutinesProps) {
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);
  
  const formatSchedule = (routine: Routine) => {
    const { schedule } = routine;
    
    if (schedule.type === 'daily') {
      return `매일 ${schedule.time || '09:00'}`;
    } else if (schedule.type === 'weekly') {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const dayNames = schedule.days?.map(day => days[day]).join(', ') || '월';
      return `매주 ${dayNames} ${schedule.time || '09:00'}`;
    } else if (schedule.type === 'monthly') {
      return `매월 ${schedule.dayOfMonth || 1}일 ${schedule.time || '09:00'}`;
    }
    return '스케줄 없음';
  };
  
  const getNextRunTime = (routine: Routine) => {
    if (!routine.nextRun) return '예정 없음';
    
    const now = new Date();
    const nextRun = new Date(routine.nextRun);
    const diffMs = nextRun.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays < 7) return `${diffDays}일 후`;
    
    return nextRun.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🔄</span>
          <span>나만의 루틴 자동화</span>
        </h2>
        <button className="text-indigo-600 text-sm font-medium hover:underline">
          + 새 루틴 만들기
        </button>
      </div>
      
      {routines.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🤖</div>
          <div className="text-gray-600 mb-2">아직 루틴이 없습니다</div>
          <div className="text-sm text-gray-500">반복적인 작업을 자동화해보세요</div>
        </div>
      ) : (
        <div className="space-y-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                routine.isActive 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* 아이콘 */}
                  <div className="text-2xl">
                    {routine.icon}
                  </div>
                  
                  {/* 기본 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 truncate">
                        {routine.name}
                      </h3>
                      {routine.isActive && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          활성
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                      {routine.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {formatSchedule(routine)}</span>
                      <span>⏰ {getNextRunTime(routine)}</span>
                      <span>🔄 {routine.totalRuns}회 실행</span>
                    </div>
                  </div>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="flex items-center gap-2">
                  {/* 토글 스위치 */}
                  <button
                    onClick={() => onToggleRoutine(routine.id, !routine.isActive)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-200
                      ${routine.isActive ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
                        ${routine.isActive ? 'translate-x-7' : 'translate-x-1'}
                      `}
                    />
                  </button>
                  
                  {/* 편집 버튼 */}
                  <button
                    onClick={() => onEditRoutine(routine.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ⚙️
                  </button>
                  
                  {/* 확장 버튼 */}
                  <button
                    onClick={() => setExpandedRoutine(
                      expandedRoutine === routine.id ? null : routine.id
                    )}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedRoutine === routine.id ? '▲' : '▼'}
                  </button>
                </div>
              </div>
              
              {/* 확장된 정보 */}
              {expandedRoutine === routine.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">마지막 실행</div>
                      <div className="text-gray-600">
                        {routine.lastRun 
                          ? new Date(routine.lastRun).toLocaleString('ko-KR')
                          : '실행 기록 없음'
                        }
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-700 mb-1">다음 실행</div>
                      <div className="text-gray-600">
                        {routine.nextRun 
                          ? new Date(routine.nextRun).toLocaleString('ko-KR')
                          : '예정 없음'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-lg hover:bg-indigo-200 transition-colors">
                      지금 실행
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors">
                      로그 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
