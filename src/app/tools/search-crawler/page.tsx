'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function SearchCrawlerPage() {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [email, setEmail] = useState('');
  const [engines, setEngines] = useState<string[]>(['naver']); // Google API는 나중에 연결 예정
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Railway API URL (배포 후 변경)
  const API_URL = process.env.NEXT_PUBLIC_SEARCH_CRAWLER_API || 'http://localhost:8000';

  const handleEngineToggle = (engine: string) => {
    if (engines.includes(engine)) {
      setEngines(engines.filter(e => e !== engine));
    } else {
      setEngines([...engines, engine]);
    }
  };

  const handleSearchOnly = async () => {
    if (!keyword) {
      setError('검색어를 입력하세요');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          engines,
          max_results: maxResults
        })
      });

      if (!response.ok) throw new Error('검색 실패');

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || '검색 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndEmail = async () => {
    if (!keyword) {
      setError('검색어를 입력하세요');
      return;
    }

    if (!email) {
      setError('이메일을 입력하세요');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recipient_email: email,
          engines,
          max_results: maxResults
        })
      });

      if (!response.ok) throw new Error('이메일 발송 실패');

      const data = await response.json();
      setResult(data);
      alert('이메일이 발송되었습니다! 📧');
    } catch (err: any) {
      setError(err.message || '이메일 발송 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            📰 검색어 기반 뉴스 자동 크롤링
          </h1>
          <p className="text-gray-600 text-lg">
            네이버 최신 뉴스를 자동으로 수집하고 이메일로 받아보세요
          </p>
        </div>

        {/* 메인 카드 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* 검색어 입력 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              검색어
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 워크프리, 자동화 도구"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* 이메일 입력 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              이메일 주소
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="결과를 받을 이메일 주소"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* 검색 엔진 선택 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3">
              검색 엔진
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-not-allowed opacity-50">
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                  className="w-5 h-5 mr-2 cursor-not-allowed"
                />
                <span className="text-gray-400">구글 (API 연결 예정)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={engines.includes('naver')}
                  onChange={() => handleEngineToggle('naver')}
                  className="w-5 h-5 mr-2 accent-purple-600"
                />
                <span className="text-gray-700">네이버</span>
              </label>
            </div>
          </div>

          {/* 결과 개수 */}
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-2">
              결과 개수: {maxResults}개
            </label>
            <input
              type="range"
              min="5"
              max="20"
              step="5"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>5개</span>
              <span>10개</span>
              <span>15개</span>
              <span>20개</span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={handleSearchOnly}
              disabled={loading || !keyword || engines.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '검색 중...' : '🔍 검색만 하기'}
            </button>
            <button
              onClick={handleSearchAndEmail}
              disabled={loading || !keyword || !email || engines.length === 0}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '발송 중...' : '📧 검색 + 이메일 발송'}
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* 결과 표시 */}
        {result && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">검색 결과</h2>
            
            {result.success ? (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-green-700 font-bold">✅ 이메일 발송 완료!</p>
                <p className="text-gray-600 mt-1">
                  {result.results_count}개의 결과를 {result.recipient}로 발송했습니다.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  총 {result.total_results}개 발견
                </p>
                <div className="space-y-4">
                  {result.results?.map((r: any, idx: number) => (
                    <div key={idx} className="p-4 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                          {r.engine.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">#{r.rank}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{r.title}</h3>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline block mb-2">
                        {r.url}
                      </a>
                      <p className="text-gray-600 text-sm">{r.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 기능 설명 */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">✨ 주요 기능</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ 네이버 뉴스 실시간 검색</li>
            <li>✅ Top 10~20 검색 결과 자동 수집</li>
            <li>✅ Excel 파일로 정리</li>
            <li>✅ 이메일 자동 발송</li>
            <li>🔜 구글 검색 API 연동 (예정)</li>
          </ul>
        </div>

        {/* 홈으로 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-bold">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

