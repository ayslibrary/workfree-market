'use client';

import React from 'react';
import { AUTOMATION_TOOLS } from '@/types/credit';

interface QuickLaunchProps {
  onToolRun: (toolId: string, toolName: string, cost: number, minutes: number) => void;
  userCredits: number;
}

export default function QuickLaunch({ onToolRun, userCredits }: QuickLaunchProps) {
  const availableTools = AUTOMATION_TOOLS.filter(tool => tool.available).slice(0, 4);
  
  const handleToolClick = (tool: typeof AUTOMATION_TOOLS[0]) => {
    if (userCredits >= tool.creditCost) {
      onToolRun(tool.id, tool.nameKo, tool.creditCost, tool.timeSavedMinutes);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🚀</span>
        <span>빠른 실행</span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {availableTools.map((tool) => {
          const canUse = userCredits >= tool.creditCost;
          
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              disabled={!canUse}
              className={`
                relative p-4 rounded-xl transition-all duration-200 transform hover:scale-105
                ${canUse 
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-indigo-200 hover:border-indigo-300 shadow-md hover:shadow-lg' 
                  : 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed opacity-60'
                }
              `}
            >
              {/* 크레딧 배지 */}
              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                {tool.creditCost}C
              </div>
              
              {/* 아이콘 */}
              <div className="text-4xl mb-3">
                {tool.icon}
              </div>
              
              {/* 도구명 */}
              <div className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">
                {tool.nameKo}
              </div>
              
              {/* 절약 시간 */}
              <div className="text-xs text-gray-600 mb-2">
                {Math.floor(tool.timeSavedMinutes / 60)}h {tool.timeSavedMinutes % 60}m 절약
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
