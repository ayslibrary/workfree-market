'use client';

import React from 'react';
import { UserProfile, formatTime, formatMoney, GAMIFICATION_CONSTANTS } from '@/types/gamification';

interface StatsRowProps {
  userProfile: UserProfile;
  onTimeToCreditConversion?: () => void;
  weeklyStats?: {
    documentsCreated: number;
    automationsRun: number;
    recommendations: number;
  };
  onViewWeeklyMissions?: () => void;
}

export default function StatsRow({ 
  userProfile, 
  onTimeToCreditConversion, 
  weeklyStats = { documentsCreated: 12, automationsRun: 8, recommendations: 3 },
  onViewWeeklyMissions 
}: StatsRowProps) {
  const monthlyHours = Math.floor(userProfile.monthly_minutes / 60);
  const monthlyMinutes = userProfile.monthly_minutes % 60;
  const cumulativeHours = Math.floor(userProfile.cumulative_minutes / 60);
  const cumulativeMinutes = userProfile.cumulative_minutes % 60;
  
  const moneySaved = Math.floor((userProfile.cumulative_minutes / 60) * GAMIFICATION_CONSTANTS.HOURLY_RATE);
  
  return (
    <div className="space-y-6">
      {/* 절약 시간 섹션 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#AFA6FF]/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1E1B33] flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <span>내가 절약한 시간</span>
          </h2>
          {userProfile.time_bank_minutes > 0 && (
            <button
              onClick={onTimeToCreditConversion || (() => {})}
              className="bg-[#6A5CFF] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#5A4CE8] transition-colors"
            >
              시간→크레딧 전환
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 이번 달 */}
          <div className="text-center p-4 bg-[#f5f0ff] rounded-xl border-2 border-[#AFA6FF]/30">
            <div className="text-3xl font-bold text-[#6A5CFF] mb-1">
              {monthlyHours}h {monthlyMinutes}m
            </div>
            <div className="text-sm text-[#1E1B33]/70 mb-2">이번 달</div>
            <div className="text-xs text-[#1E1B33]/50">
              {formatMoney(Math.floor((userProfile.monthly_minutes / 60) * GAMIFICATION_CONSTANTS.HOURLY_RATE))} 절약
            </div>
          </div>
          
          {/* 누적 */}
          <div className="text-center p-4 bg-[#f5f0ff] rounded-xl border-2 border-[#AFA6FF]/30">
            <div className="text-3xl font-bold text-[#8B7CFF] mb-1">
              {cumulativeHours}h {cumulativeMinutes}m
            </div>
            <div className="text-sm text-[#1E1B33]/70 mb-2">누적</div>
            <div className="text-xs text-[#1E1B33]/50">
              {formatMoney(moneySaved)} 절약
            </div>
          </div>
          
          {/* 시간 뱅크 */}
          <div className="text-center p-4 bg-[#f5f0ff] rounded-xl border-2 border-[#AFA6FF]/30">
            <div className="text-3xl font-bold text-[#FF9A7A] mb-1">
              {formatTime(userProfile.time_bank_minutes)}
            </div>
            <div className="text-sm text-[#1E1B33]/70 mb-2">시간 뱅크</div>
            <div className="text-xs text-[#1E1B33]/50">
              레벨업 시 크레딧으로 전환
            </div>
          </div>
        </div>
      </div>
      
      {/* 이번 주 활동 섹션 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#AFA6FF]/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1E1B33] flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span>이번 주 활동</span>
          </h2>
          <button
            onClick={onViewWeeklyMissions || (() => {})}
            className="text-[#6A5CFF] text-sm font-medium hover:underline"
          >
            주간 미션 보기 →
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#f5f0ff] rounded-xl border-2 border-[#AFA6FF]/30">
            <div className="text-2xl mb-2">📄</div>
            <div className="text-2xl font-bold text-[#6A5CFF] mb-1">
              {weeklyStats.documentsCreated}
            </div>
            <div className="text-xs text-[#1E1B33]/70">생성한 문서</div>
          </div>
          
          <div className="text-center p-4 bg-[#f5f0ff] rounded-xl border-2 border-[#AFA6FF]/30">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-[#8B7CFF] mb-1">
              {weeklyStats.automationsRun}
            </div>
            <div className="text-xs text-[#1E1B33]/70">실행한 자동화</div>
          </div>
          
          <div className="text-center p-4 bg-[#f5f0ff] rounded-xl border-2 border-[#AFA6FF]/30">
            <div className="text-2xl mb-2">💡</div>
            <div className="text-2xl font-bold text-[#FF9A7A] mb-1">
              {weeklyStats.recommendations}
            </div>
            <div className="text-xs text-[#1E1B33]/70">추천 자동화</div>
          </div>
        </div>
      </div>
    </div>
  );
}
