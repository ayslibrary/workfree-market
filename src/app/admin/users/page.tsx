'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/admin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginLog {
  id: string;
  user_id: string;
  email: string;
  login_type: string;
  success: boolean;
  error_message?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  created_at: string;
}

interface UserStats {
  totalLogins: number;
  successfulLogins: number;
  failedLogins: number;
  uniqueUsers: number;
  googleLogins: number;
  emailLogins: number;
}

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  // 관리자 권한 체크
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin(user.email))) {
      alert('관리자만 접근할 수 있습니다.');
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user && isAdmin(user.email)) {
      loadData();
    }
  }, [days, authLoading, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // 로그인 로그 가져오기
      const { data: logs, error } = await supabase
        .from('login_logs')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('로그인 로그 조회 실패:', error);
      } else {
        setLoginLogs(logs || []);

        // 통계 계산
        const totalLogins = logs?.length || 0;
        const successfulLogins = logs?.filter(l => l.success).length || 0;
        const uniqueUsers = new Set(logs?.filter(l => l.user_id).map(l => l.user_id)).size;
        const googleLogins = logs?.filter(l => l.login_type === 'google').length || 0;
        const emailLogins = logs?.filter(l => l.login_type === 'email').length || 0;

        setStats({
          totalLogins,
          successfulLogins,
          failedLogins: totalLogins - successfulLogins,
          uniqueUsers,
          googleLogins,
          emailLogins,
        });
      }
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = loginLogs.filter(log => {
    if (filter === 'success') return log.success;
    if (filter === 'failed') return !log.success;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                👥 회원 & 로그인 관리
              </h1>
              <p className="text-gray-600">회원가입 및 로그인 기록을 확인합니다</p>
            </div>
            
            {/* 기간 선택 */}
            <div className="flex gap-2">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    days === d
                      ? 'bg-[#6A5CFF] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {d}일
                </button>
              ))}
              <button
                onClick={loadData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🔄 새로고침
              </button>
            </div>
          </div>
        </div>

        {authLoading || !user || !isAdmin(user.email) ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔐</div>
            <p className="text-gray-600">권한 확인 중...</p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">데이터 로딩 중...</p>
          </div>
        ) : (
          <>
            {/* 통계 카드 */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">총 로그인</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalLogins}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-1">성공</p>
                  <p className="text-3xl font-bold text-green-600">{stats.successfulLogins}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
                  <p className="text-sm text-gray-600 mb-1">실패</p>
                  <p className="text-3xl font-bold text-red-600">{stats.failedLogins}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">고유 사용자</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.uniqueUsers}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">Google 로그인</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.googleLogins}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200">
                  <p className="text-sm text-gray-600 mb-1">이메일 로그인</p>
                  <p className="text-3xl font-bold text-pink-600">{stats.emailLogins}</p>
                </div>
              </div>
            )}

            {/* 필터 */}
            <div className="flex gap-2 mb-4">
              {[
                { key: 'all', label: '전체', icon: '📋' },
                { key: 'success', label: '성공', icon: '✅' },
                { key: 'failed', label: '실패', icon: '❌' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f.key
                      ? 'bg-[#6A5CFF] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>

            {/* 로그인 로그 테이블 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">시간</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">이메일</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">방식</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">상태</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">기기</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">브라우저</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(log.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {log.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              log.login_type === 'google'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {log.login_type === 'google' ? '🔵 Google' : '📧 Email'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {log.success ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                ✅ 성공
                              </span>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  ❌ 실패
                                </span>
                                {log.error_message && (
                                  <p className="text-xs text-red-500 mt-1">{log.error_message}</p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {log.device_type || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {log.browser || '-'} / {log.os || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          로그인 기록이 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 빠른 링크 */}
            <div className="mt-8 bg-gradient-to-r from-[#6A5CFF] to-[#AFA6FF] rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">🔗 빠른 링크</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Link
                  href="/admin"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
                >
                  <div className="text-3xl mb-2">👨‍💼</div>
                  <p className="font-medium">관리자 메인</p>
                </Link>

                <Link
                  href="/admin/analytics"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
                >
                  <div className="text-3xl mb-2">📊</div>
                  <p className="font-medium">RAG 분석</p>
                </Link>

                <Link
                  href="/admin/credits"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
                >
                  <div className="text-3xl mb-2">💎</div>
                  <p className="font-medium">크레딧 관리</p>
                </Link>

                <Link
                  href="/"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
                >
                  <div className="text-3xl mb-2">🏠</div>
                  <p className="font-medium">홈으로</p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

