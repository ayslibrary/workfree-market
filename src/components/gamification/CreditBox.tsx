'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/gamification';

interface CreditBoxProps {
  userProfile: UserProfile;
  onViewPlans?: () => void;
  onRecharge?: () => void;
  onToggleAutoRecharge?: (enabled: boolean) => void;
  onTimeToCreditConversion?: () => void;
}

export default function CreditBox({ 
  userProfile, 
  onViewPlans, 
  onRecharge, 
  onToggleAutoRecharge,
  onTimeToCreditConversion: _onTimeToCreditConversion
}: CreditBoxProps) {
  const [autoRecharge, setAutoRecharge] = useState(false);
  
  const getPlanInfo = (plan: UserProfile['plan']) => {
    switch (plan) {
      case 'free':
        return { name: '무료 베타', color: 'bg-green-100 text-green-800', icon: '🎁' };
      case 'starter':
        return { name: '스타터', color: 'bg-blue-100 text-blue-800', icon: '⭐' };
      case 'pro':
        return { name: '프로', color: 'bg-purple-100 text-purple-800', icon: '💎' };
      case 'business':
        return { name: '비즈니스', color: 'bg-orange-100 text-orange-800', icon: '🏢' };
      default:
        return { name: '무료', color: 'bg-gray-100 text-gray-800', icon: '🆓' };
    }
  };
  
  const getRenewalDays = () => {
    // Mock: 구독 갱신까지 남은 일수 계산
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffTime = nextMonth.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const planInfo = getPlanInfo(userProfile.plan);
  const renewalDays = getRenewalDays();
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span>크레딧 & 결제</span>
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${planInfo.color}`}>
          {planInfo.icon} {planInfo.name}
        </div>
      </div>
      
      {/* 크레딧 잔액 */}
      <div className="mb-6">
        <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="text-4xl font-bold text-indigo-600 mb-2">
            {userProfile.credits}
          </div>
          <div className="text-gray-600 mb-4">크레딧 잔액</div>
          
          {/* 크레딧 사용량 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{ width: `${Math.min((userProfile.credits / 100) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            {userProfile.credits < 10 ? '크레딧이 부족합니다' : '충분한 크레딧이 있습니다'}
          </div>
        </div>
      </div>
      
      {/* 구독 정보 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium text-gray-800">
            현재 구독
          </div>
          <div className="text-sm text-gray-600">
            갱신 D-{renewalDays}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{planInfo.icon}</span>
          <span className="font-medium text-gray-800">{planInfo.name}</span>
        </div>
        
        {/* 자동충전 설정 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">자동충전</span>
          <button
            onClick={() => {
              setAutoRecharge(!autoRecharge);
              onToggleAutoRecharge?.(!autoRecharge);
            }}
            className={`
              relative w-12 h-6 rounded-full transition-colors duration-200
              ${autoRecharge ? 'bg-indigo-500' : 'bg-gray-300'}
            `}
          >
            <div
              className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
                ${autoRecharge ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
      
      {/* 액션 버튼들 */}
      <div className="space-y-3">
        <button
          onClick={onRecharge || (() => {})}
          className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
          💳 크레딧 충전하기
        </button>
        
        <button
          onClick={onViewPlans || (() => {})}
          className="w-full border-2 border-indigo-200 text-indigo-600 font-medium py-3 px-4 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          📋 충전 플랜 보기
        </button>
      </div>
      
      {/* 크레딧 사용 가이드 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">💡 크레딧 사용 팁</div>
          <div className="text-xs space-y-1">
            <div>• 기본 도구: 1크레딧</div>
            <div>• 고급 도구: 2-3크레딧</div>
            <div>• 후기 작성 시 +3크레딧 보상</div>
          </div>
        </div>
      </div>
      
      {/* 결제 내역 링크 */}
      <div className="mt-3 text-center">
        <button className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
          결제 내역 보기 →
        </button>
      </div>
    </div>
  );
}
