'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getBetaTester } from '@/lib/beta/missions';
import { formatTimeSaved } from '@/lib/beta/missions';
import Link from 'next/link';

interface TimeSavingsCounterProps {
  showDetail?: boolean;
}

export default function TimeSavingsCounter({
  showDetail = false,
}: TimeSavingsCounterProps) {
  const { user } = useAuthStore();
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [displayMinutes, setDisplayMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTimeSavings();
    }
  }, [user, loadTimeSavings]);

  // 카운터 애니메이션
  useEffect(() => {
    if (totalMinutes === 0) return;

    const duration = 2000; // 2초
    const steps = 60;
    const increment = totalMinutes / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(totalMinutes, Math.floor(increment * step));
      setDisplayMinutes(current);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalMinutes]);

  const loadTimeSavings = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const testerData = await getBetaTester(user.id);

      if (testerData) {
        setTotalMinutes(testerData.timeSaved);
      }
    } catch (error) {
      console.error('시간 절약 데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  if (!user || totalMinutes === 0) {
    return null;
  }

  const hours = Math.floor(displayMinutes / 60);
  const minutes = displayMinutes % 60;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 text-center border-2 border-green-300 dark:border-green-700">
        <div className="animate-pulse">
          <div className="h-8 bg-green-200 dark:bg-green-800 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-green-200 dark:bg-green-800 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 text-center border-2 border-green-300 dark:border-green-700 shadow-lg">
      <div className="mb-3">
        <div className="text-5xl mb-2">⏱️</div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          내가 절약한 시간
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          WorkFree로 야근 시간을 줄였어요!
        </p>
      </div>

      {/* 메인 카운터 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-4">
        {showDetail ? (
          <>
            {days > 0 && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-green-600 dark:text-green-400">
                  {days}
                </span>
                <span className="text-2xl text-gray-600 dark:text-gray-400">
                  일
                </span>
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <div>
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {remainingHours}
                </span>
                <span className="text-xl text-gray-600 dark:text-gray-400 ml-1">
                  시간
                </span>
              </div>
              <div>
                <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {minutes}
                </span>
                <span className="text-xl text-gray-600 dark:text-gray-400 ml-1">
                  분
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold text-green-600 dark:text-green-400">
              {formatTimeSaved(displayMinutes)}
            </span>
          </div>
        )}
      </div>

      {/* 추가 정보 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            커피 시간으로는
          </div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ☕ {Math.floor(displayMinutes / 10)}잔
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            영화로는
          </div>
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            🎬 {Math.floor(displayMinutes / 120)}편
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/beta/dashboard"
        className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
      >
        더 많은 시간 절약하기 →
      </Link>
    </div>
  );
}


