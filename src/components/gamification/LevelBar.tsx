'use client';

import React from 'react';
import { UserProfile, getLevelProgress, formatTime } from '@/types/gamification';

interface LevelBarProps {
  userProfile: UserProfile;
  onStartAutomation?: () => void;
  onViewGuide?: () => void;
}

export default function LevelBar({ userProfile, onStartAutomation, onViewGuide }: LevelBarProps) {
  const { progressPercent, xpToNext, xpFromStart } = getLevelProgress(userProfile.xp, userProfile.level);
  
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6A5CFF] via-[#8B7CFF] to-[#6A5CFF] p-6 shadow-2xl border-2 border-[#AFA6FF]/50">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 text-6xl">🤖</div>
        <div className="absolute -bottom-2 -left-2 text-4xl">⚡</div>
        <div className="absolute top-1/2 right-8 text-3xl">🎯</div>
      </div>
      
      <div className="relative z-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-5xl font-black text-white">
              LV.{userProfile.level}
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-bold text-white">
                {userProfile.plan === 'free' ? '🎁 베타' : 
                 userProfile.plan === 'starter' ? '⭐ 스타터' :
                 userProfile.plan === 'pro' ? '💎 프로' : '🏢 비즈니스'}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {userProfile.name}
            </div>
            <div className="text-white/80 text-sm">
              시간 절약 마스터
            </div>
          </div>
        </div>
        
        {/* XP 진행바 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">
              진행률 {progressPercent.toFixed(0)}%
            </span>
            <span className="text-white/70 text-xs">
              다음 레벨까지 {xpToNext} XP
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            {/* 진행률 퍼센트 표시 */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {xpFromStart} / {xpToNext + xpFromStart} XP
              </span>
            </div>
          </div>
        </div>
        
        {/* 통계 요약 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {userProfile.credits}
            </div>
            <div className="text-white/70 text-xs">
              크레딧
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatTime(userProfile.time_bank_minutes)}
            </div>
            <div className="text-white/70 text-xs">
              절약 시간
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatTime(userProfile.cumulative_minutes)}
            </div>
            <div className="text-white/70 text-xs">
              누적 절약
            </div>
          </div>
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={onStartAutomation || (() => {})}
            className="flex-1 bg-white text-[#6A5CFF] font-bold py-3 px-6 rounded-xl hover:bg-[#f5f0ff] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚀 새 자동화 시작
          </button>
          
          <button
            onClick={onViewGuide || (() => {})}
            className="px-6 py-3 border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
          >
            📖 가이드 보기
          </button>
        </div>
      </div>
    </div>
  );
}
