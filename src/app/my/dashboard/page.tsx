'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SimpleHeader from '@/components/SimpleHeader';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

// 데모 데이터
const DEMO_USER = {
  displayName: '베타 테스터',
  email: 'beta@workfree.ai',
};

const DEMO_CREDITS = {
  balance: 10,
  monthlyUsed: 3,
  totalSpent: 3,
  isBetaTester: true,
  subscriptionTier: 'free' as const,
  betaExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

const DEMO_TRANSACTIONS = [
  {
    id: '1',
    type: 'spend' as const,
    amount: -1,
    balance: 9,
    reason: 'PDF → Word 변환',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'spend' as const,
    amount: -1,
    balance: 10,
    reason: 'Outlook 자동 회신 설정',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'spend' as const,
    amount: -1,
    balance: 11,
    reason: '텍스트 일괄 변환',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'earn' as const,
    amount: 10,
    balance: 12,
    reason: '베타 테스터 가입 보상',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEMO_SAVINGS = {
  totalMinutes: 137,
  totalMoney: 45600,
  thisMonth: {
    minutes: 90,
    money: 30000,
  },
  avgPerUse: {
    minutes: 30,
    money: 10000,
  },
};

export default function MyDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로딩 시뮬레이션
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <SimpleHeader />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* 베타 안내 배너 */}
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-bold text-gray-900">데모 모드로 표시 중입니다</p>
              <p className="text-sm text-gray-600">실제 서비스에서는 로그인 후 본인의 데이터를 확인하실 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* 헤더 */}
        <FadeIn>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl text-white font-bold">
                {DEMO_USER.displayName[0]}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {DEMO_USER.displayName}님, 환영합니다!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  🎁 베타 테스터
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 크레딧 정보 */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 보유 크레딧 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  💎
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  보유 크레딧
                </h3>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {DEMO_CREDITS.balance}
              </div>
              <Link
                href="/my/credits"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                충전하기 →
              </Link>
            </div>

            {/* 이번 달 사용량 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  이번 달 사용
                </h3>
              </div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {DEMO_CREDITS.monthlyUsed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                총 {DEMO_CREDITS.totalSpent} 크레딧 사용
              </div>
            </div>

            {/* 구독 플랜 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl">
                  ⭐
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  현재 플랜
                </h3>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                무료 베타
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                만료: {new Date(DEMO_CREDITS.betaExpiryDate).toLocaleDateString('ko-KR')}
              </div>
              <Link
                href="/my/credits"
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                플랜 변경 →
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* 시간 절약 통계 */}
        <FadeIn delay={0.2}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ⏰ 절약한 시간
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">총 절약 시간</div>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {Math.floor(DEMO_SAVINGS.totalMinutes / 60)}시간 {DEMO_SAVINGS.totalMinutes % 60}분
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    약 ₩{DEMO_SAVINGS.totalMoney.toLocaleString()} 절감
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">이번 달</div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {DEMO_SAVINGS.thisMonth.minutes}분
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    약 ₩{DEMO_SAVINGS.thisMonth.money.toLocaleString()} 절감
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">평균 (1회당)</div>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {DEMO_SAVINGS.avgPerUse.minutes}분
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    약 ₩{DEMO_SAVINGS.avgPerUse.money.toLocaleString()} 절감
                  </div>
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  🎉 지금까지 <strong className="text-green-600">{DEMO_SAVINGS.totalMinutes}분</strong>을 절약하셨습니다!
                  {' '}이는 약 <strong className="text-green-600">₩{DEMO_SAVINGS.totalMoney.toLocaleString()}</strong>의 가치입니다.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 최근 사용 내역 */}
        <FadeIn delay={0.3}>
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📋 최근 사용 내역
              </h2>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {DEMO_TRANSACTIONS.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          transaction.type === 'earn'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {transaction.type === 'earn' ? '➕' : '➖'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {transaction.reason}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.createdAt).toLocaleString('ko-KR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          transaction.type === 'earn'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'earn' ? '+' : ''}{transaction.amount}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          잔액: {transaction.balance}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 빠른 액션 */}
        <FadeIn delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/#kits"
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 transition-all text-center"
            >
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                자동화 도구
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                도구 사용하기
              </p>
            </Link>

            <Link
              href="/my/blog-history"
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105 transition-all text-center"
            >
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                블로그 히스토리
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                생성 기록 보기
              </p>
            </Link>

            <Link
              href="/my/credits"
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 transition-all text-center"
            >
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                크레딧 충전
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                크레딧 구매하기
              </p>
            </Link>

            <Link
              href="/#beta"
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 transition-all text-center"
            >
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                후기 작성
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                +5 크레딧 받기
              </p>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
