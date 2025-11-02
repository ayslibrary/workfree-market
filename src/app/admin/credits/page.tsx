'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import { addCredits } from '@/lib/credits';

export default function AdminCreditsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState('관리자 수동 지급');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 관리자 권한 확인
  if (!isLoading && (!user || user.role !== 'admin')) {
    router.push('/');
    return null;
  }

  const handleAddCredits = async () => {
    if (!userId || amount <= 0) {
      setError('사용자 ID와 유효한 금액을 입력하세요');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await addCredits(userId, amount, 'admin', description);
      
      if (result.success) {
        setMessage(`✅ ${userId}에게 ${amount} 크레딧을 지급했습니다. (새 잔액: ${result.newBalance})`);
        setUserId('');
        setAmount(10);
        setDescription('관리자 수동 지급');
      } else {
        setError(result.error || '크레딧 지급 실패');
      }
    } catch (err: any) {
      setError(err.message || '크레딧 지급 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <MainNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <MainNavigation />
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#1E1B33] mb-2">
            🔧 관리자 크레딧 관리
          </h1>
          <p className="text-gray-600 mb-8">
            사용자에게 크레딧을 수동으로 지급할 수 있습니다
          </p>

          <div className="space-y-6">
            {/* 사용자 ID */}
            <div>
              <label className="block text-sm font-bold text-[#1E1B33] mb-2">
                사용자 ID (Firebase UID)
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="예: abc123xyz..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6A5CFF] outline-none"
              />
            </div>

            {/* 크레딧 수량 */}
            <div>
              <label className="block text-sm font-bold text-[#1E1B33] mb-2">
                크레딧 수량
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6A5CFF] outline-none"
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-bold text-[#1E1B33] mb-2">
                지급 사유
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 베타 테스터 보상"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6A5CFF] outline-none"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-600 font-medium">❌ {error}</p>
              </div>
            )}

            {/* 성공 메시지 */}
            {message && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <p className="text-green-600 font-medium">{message}</p>
              </div>
            )}

            {/* 지급 버튼 */}
            <button
              onClick={handleAddCredits}
              disabled={loading || !userId || amount <= 0}
              className="w-full bg-gradient-to-r from-[#6A5CFF] to-[#AFA6FF] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : '💰 크레딧 지급하기'}
            </button>
          </div>

          {/* 빠른 지급 버튼 */}
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <h3 className="text-sm font-bold text-[#1E1B33] mb-3">빠른 지급</h3>
            <div className="grid grid-cols-3 gap-3">
              {[10, 50, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="px-4 py-2 bg-gray-100 hover:bg-[#6A5CFF] hover:text-white rounded-lg font-medium transition-all"
                >
                  {preset}개
                </button>
              ))}
            </div>
          </div>

          {/* 안내사항 */}
          <div className="mt-8 bg-blue-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-blue-800 mb-2">📋 안내사항</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 사용자 ID는 Firebase Authentication의 UID입니다</li>
              <li>• 크레딧은 즉시 사용자 계정에 반영됩니다</li>
              <li>• 모든 거래 내역은 Firestore에 기록됩니다</li>
              <li>• 음수 값을 입력하여 크레딧을 차감할 수도 있습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

