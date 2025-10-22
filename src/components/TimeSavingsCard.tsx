'use client';

import { useEffect, useState } from 'react';
import { getTimeSavings } from '@/lib/creditSystem';
import { TimeSavings } from '@/types/credit';

interface TimeSavingsCardProps {
  userId: string;
}

export default function TimeSavingsCard({ userId }: TimeSavingsCardProps) {
  const [savings, setSavings] = useState<TimeSavings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavings = async () => {
      setLoading(true);
      const data = await getTimeSavings(userId);
      setSavings(data);
      setLoading(false);
    };
    
    loadSavings();
  }, [userId]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  if (!savings || (savings.monthlyMinutes === 0 && savings.totalMinutes === 0)) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 text-center">
        <div className="text-5xl mb-4">⏰</div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          첫 자동화를 시작하세요!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          도구를 사용하면 절약한 시간이 여기에 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 이번 달 절약 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
            📅
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            이번 달 절약
          </h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">시간</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {formatTime(savings.monthlyMinutes)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">금액</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₩{savings.monthlyMoneySaved.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 누적 절약 */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
            🏆
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            누적 절약
          </h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">시간</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatTime(savings.totalMinutes)}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">금액</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ₩{savings.totalMoneySaved.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 시각화 메시지 */}
      {savings.totalMinutes >= 60 && (
        <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎉</div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                대단합니다!
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatTime(savings.totalMinutes)}
                </span>
                를 절약했어요! 
                {savings.totalMinutes >= 480 && ' 하루 이상의 시간을 아끼셨네요! 🏆'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

