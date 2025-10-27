'use client';

import React from 'react';
import { getPopularServices } from '@/lib/services';

interface QuickLaunchProps {
  onToolRun: (toolId: string, toolName: string, cost: number, minutes: number) => void;
  userCredits?: number;
}

export default function QuickLaunch({ onToolRun, userCredits = 10 }: QuickLaunchProps) {
  const popularServices = getPopularServices();
  
  const handleToolClick = (service: typeof popularServices[0]) => {
    if (userCredits >= service.cost) {
      onToolRun(service.id, service.name, service.cost, service.timeSaved);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🚀</span>
        <span>빠른 실행</span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularServices.map((service) => {
          const canUse = userCredits >= service.cost;
          
          return (
            <button
              key={service.id}
              onClick={() => handleToolClick(service)}
              disabled={!canUse}
              className={`
                relative p-4 rounded-xl transition-all duration-200 transform hover:scale-105
                ${canUse 
                  ? 'bg-gradient-to-br from-[#6A5CFF]/10 to-[#5A4CE8]/10 hover:from-[#6A5CFF]/20 hover:to-[#5A4CE8]/20 border-2 border-[#6A5CFF]/30 hover:border-[#6A5CFF] shadow-md hover:shadow-lg' 
                  : 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed opacity-60'
                }
              `}
            >
              {/* 크레딧 배지 */}
              <div className="absolute -top-2 -right-2 bg-[#6A5CFF] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                {service.cost}C
              </div>
              
              {/* 아이콘 */}
              <div className="text-4xl mb-3">
                {service.icon}
              </div>
              
              {/* 서비스명 */}
              <div className="font-bold text-sm text-[#1E1B33] mb-1 line-clamp-2">
                {service.name}
              </div>
              
              {/* 절약 시간 */}
              <div className="text-xs text-[#1E1B33]/70 mb-2">
                {service.timeSaved}분 절약
              </div>
              
              {/* 상태 표시 */}
              {!canUse && (
                <div className="text-xs text-red-500 font-medium">
                  크레딧 부족
                </div>
              )}
              
              {canUse && (
                <div className="text-xs text-green-600 font-medium">
                  사용 가능
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* 추가 도구 보기 링크 */}
      <div className="mt-4 text-center">
        <button className="text-indigo-600 text-sm font-medium hover:underline">
          모든 도구 보기 →
        </button>
      </div>
    </div>
  );
}
