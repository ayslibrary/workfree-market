'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getUserCredits, getCreditTransactions } from '@/lib/creditSystem';
import { UserCredits, CreditTransaction } from '@/types/credit';
import SimpleHeader from '@/components/SimpleHeader';
import TimeSavingsCard from '@/components/TimeSavingsCard';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function MyDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadData();
    }
  }, [user, isLoading, router]);

  const loadData = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    const [userCredits, userTransactions] = await Promise.all([
      getUserCredits(user.uid),
      getCreditTransactions(user.uid, 10)
    ]);
    
    setCredits(userCredits);
    setTransactions(userTransactions);
    setLoading(false);
  };

  if (isLoading || loading || !user) {
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
        {/* 헤더 */}
        <FadeIn>
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl">
                {user.displayName ? user.displayName[0] : '👤'}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {user.displayName}님, 환영합니다!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {credits?.isBetaTester && '🎁 베타 테스터'}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 크레딧 정보 */}
        {credits && (
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
                  {credits.balance}
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
                  {credits.monthlyUsed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  총 {credits.totalSpent} 크레딧 사용
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
                  {credits.subscriptionTier === 'free' && '무료 베타'}
                  {credits.subscriptionTier === 'starter' && 'Starter'}
                  {credits.subscriptionTier === 'pro' && 'Pro'}
                </div>
                {credits.isBetaTester && credits.betaExpiryDate && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    만료: {new Date(credits.betaExpiryDate).toLocaleDateString()}
                  </div>
                )}
                <Link
                  href="/my/subscription"
                  className="text-sm text-green-600 dark:text-green-400 hover:underline"
                >
                  플랜 변경 →
                </Link>
              </div>
            </div>
          </FadeIn>
        )}

        {/* 시간 절약 통계 */}
        {user && (
          <FadeIn delay={0.2}>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                ⏰ 절약한 시간
              </h2>
              <TimeSavingsCard userId={user.uid} />
            </div>
          </FadeIn>
        )}

        {/* 최근 사용 내역 */}
        <FadeIn delay={0.3}>
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📋 최근 사용 내역
              </h2>
              <Link
                href="/my/transactions"
                className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold"
              >
                전체 보기 →
              </Link>
            </div>

            {transactions.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900/20 rounded-2xl p-12 text-center border-2 border-gray-200 dark:border-gray-800">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  아직 사용 내역이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  자동화 도구를 사용해보세요!
                </p>
                <Link
                  href="/tools"
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                  도구 둘러보기
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {transactions.map((transaction, idx) => (
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
                              {transaction.createdAt && new Date(transaction.createdAt).toLocaleString('ko-KR')}
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
            )}
          </div>
        </FadeIn>

        {/* 빠른 액션 */}
        <FadeIn delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/tools"
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
              href="/my/reviews"
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

