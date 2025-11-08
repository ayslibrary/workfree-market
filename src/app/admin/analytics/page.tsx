'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [popularQuestions, setPopularQuestions] = useState<any[]>([]);
  const [lowSimilarity, setLowSimilarity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/stats?days=${days}`);
      
      if (!response.ok) throw new Error('API 호출 실패');
      
      const data = await response.json();

      setStats(data.stats);
      setPopularQuestions(data.popularQuestions || []);
      setLowSimilarity(data.lowSimilarity || []);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📊 RAG Analytics Dashboard
              </h1>
              <p className="text-gray-600">WorkFree AI 챗봇 성능 분석</p>
            </div>
            
            {/* 기간 선택 */}
            <div className="flex gap-2">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    days === d
                      ? 'bg-blue-600 text-white'
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

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">데이터 로딩 중...</p>
          </div>
        ) : (
          <>
            {/* 전체 통계 */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">총 대화 수</p>
                  <p className="text-4xl font-bold text-blue-600">{stats.totalChats}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">평균 신뢰도</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {(stats.avgConfidence * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-1">평균 응답시간</p>
                  <p className="text-4xl font-bold text-green-600">{stats.avgResponseTime}ms</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">총 피드백</p>
                  <p className="text-4xl font-bold text-orange-600">{stats.totalFeedback}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200">
                  <p className="text-sm text-gray-600 mb-1">긍정 비율</p>
                  <p className="text-4xl font-bold text-pink-600">{stats.positiveRate}%</p>
                </div>
              </div>
            )}

            {/* 인기 질문 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🔥 인기 질문 Top 10
                </h2>
                
                {popularQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {popularQuestions.map((q, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {i + 1}. {q.question}
                          </p>
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                            {q.frequency}회
                          </span>
                        </div>
                        <div className="flex gap-3 text-xs text-gray-600">
                          <span>신뢰도: {(q.avg_confidence * 100).toFixed(1)}%</span>
                          <span>최근: {new Date(q.last_asked).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">아직 데이터가 없습니다</p>
                )}
              </div>

              {/* 검색 실패 키워드 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ⚠️ 검색 실패 키워드
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  유사도 40% 미만 또는 결과 없음 → Knowledge base 개선 필요
                </p>

                {lowSimilarity.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {lowSimilarity.map((item, i) => (
                      <div key={i} className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {item.message}
                        </p>
                        <div className="flex gap-3 text-xs text-gray-600">
                          <span className="text-red-600">
                            유사도: {(item.avg_similarity * 100).toFixed(1)}%
                          </span>
                          <span>결과: {item.result_count}개</span>
                          <span>{new Date(item.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">검색 실패 없음! 👍</p>
                )}
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">🔗 빠른 링크</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Link
                  href="https://wsrxpwntlpesdqygkujx.supabase.co"
                  target="_blank"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
                >
                  <div className="text-3xl mb-2">🗄️</div>
                  <p className="font-medium">Supabase DB</p>
                </Link>

                <Link
                  href="https://console.firebase.google.com/project/workfree-market"
                  target="_blank"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
                >
                  <div className="text-3xl mb-2">🔥</div>
                  <p className="font-medium">Firebase Console</p>
                </Link>

                <Link
                  href="/admin"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-colors"
                >
                  <div className="text-3xl mb-2">👨‍💼</div>
                  <p className="font-medium">관리자 메인</p>
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

