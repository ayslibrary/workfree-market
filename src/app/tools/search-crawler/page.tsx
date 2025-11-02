'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function SearchCrawlerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [email, setEmail] = useState('');
  const [engines, setEngines] = useState<string[]>(['naver']); // Google API는 나중에 연결 예정
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // 스케줄 관련 state
  const [scheduleKeywords, setScheduleKeywords] = useState<string[]>(['']);
  const [scheduleEmail, setScheduleEmail] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [scheduleWeekdays, setScheduleWeekdays] = useState<number[]>([0, 1, 2, 3, 4]); // 월-금
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [mySchedule, setMySchedule] = useState<any>(null);
  const [scheduleError, setScheduleError] = useState('');

  // API URL - Railway 24/7 자동 발송 (이메일 O, 스케줄 O, 네이버 API O)
  const API_URL = process.env.NEXT_PUBLIC_SEARCH_CRAWLER_API || 'https://workfree-market-production.up.railway.app';

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

  // 스케줄 관련 함수들
  const handleAddKeyword = () => {
    setScheduleKeywords([...scheduleKeywords, '']);
  };

  const handleRemoveKeyword = (index: number) => {
    setScheduleKeywords(scheduleKeywords.filter((_, i) => i !== index));
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...scheduleKeywords];
    newKeywords[index] = value;
    setScheduleKeywords(newKeywords);
  };

  const handleWeekdayToggle = (day: number) => {
    if (scheduleWeekdays.includes(day)) {
      setScheduleWeekdays(scheduleWeekdays.filter(d => d !== day));
    } else {
      setScheduleWeekdays([...scheduleWeekdays, day].sort());
    }
  };

  const handleCreateSchedule = async () => {
    const validKeywords = scheduleKeywords.filter(k => k.trim() !== '');
    if (validKeywords.length === 0) {
      setScheduleError('최소 1개의 키워드를 입력하세요');
      return;
    }

    if (scheduleWeekdays.length === 0) {
      setScheduleError('최소 1개의 요일을 선택하세요');
      return;
    }

    // 이메일 확인
    if (!scheduleEmail || !scheduleEmail.includes('@')) {
      setScheduleError('올바른 이메일 주소를 입력해주세요');
      return;
    }

    // user 객체에서 id 또는 uid 가져오기
    const userId = user?.id || user?.uid || `user_${Date.now()}`;

    console.log('🔍 사용자 정보:', { userId, email: scheduleEmail, user });

    setScheduleLoading(true);
    setScheduleError('');

    try {
      console.log('스케줄 생성 요청:', {
        user_id: userId,
        email: scheduleEmail,
        keywords: validKeywords,
        time: scheduleTime,
        weekdays: scheduleWeekdays
      });

      const response = await fetch(`${API_URL}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          email: scheduleEmail,
          keywords: validKeywords,
          time: scheduleTime,
          weekdays: scheduleWeekdays,
          max_results: maxResults,
          engines
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('스케줄 생성 실패:', errorData);
        throw new Error(errorData.detail || '스케줄 생성 실패');
      }

      const data = await response.json();
      setMySchedule(data);
      
      alert('✅ 매일 자동 발송 스케줄이 등록되었습니다!');
    } catch (err: any) {
      console.error('스케줄 생성 오류:', err);
      setScheduleError(err.message || '스케줄 생성 중 오류가 발생했습니다');
    } finally {
      setScheduleLoading(false);
    }
  };

  const fetchMySchedule = async () => {
    const userId = user?.id || user?.uid;
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/api/schedule/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMySchedule(data);
      } else if (response.status === 404) {
        // 스케줄이 없는 경우 (정상)
        setMySchedule(null);
      }
    } catch (err) {
      // 네트워크 오류 등만 로그
      console.error('스케줄 조회 중 네트워크 오류:', err);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!confirm('정말 스케줄을 삭제하시겠습니까?')) return;

    const userId = user?.id || user?.uid || 'demo_user';

    try {
      const response = await fetch(`${API_URL}/api/schedule/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('스케줄 삭제 실패');

      setMySchedule(null);
      alert('스케줄이 삭제되었습니다');
    } catch (err: any) {
      alert(err.message || '스케줄 삭제 중 오류가 발생했습니다');
    }
  };

  // 컴포넌트 마운트 시 내 스케줄 조회
  useEffect(() => {
    const userId = user?.id || user?.uid;
    if (userId) {
      fetchMySchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

        {/* 매일 자동 발송 스케줄 설정 */}
        <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              ⏰ 매일 자동 발송 설정
            </h2>
            {user && (
              <span className="text-sm text-green-600 font-semibold">
                ✅ {user.email || user.displayName || '사용자'}
              </span>
            )}
          </div>

          {mySchedule ? (
            // 이미 스케줄이 있는 경우
            <div className="space-y-4">
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-green-800 text-lg mb-2">
                      ✅ 스케줄 활성화됨
                    </h3>
                    <p className="text-gray-600 text-sm">
                      매일 자동으로 뉴스를 수집해서 이메일로 보내드립니다
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteSchedule}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all"
                  >
                    삭제
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">이메일</p>
                    <p className="font-semibold text-gray-900">{mySchedule.email}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">발송 시간</p>
                    <p className="font-semibold text-gray-900">{mySchedule.time}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">발송 요일</p>
                    <p className="font-semibold text-gray-900">
                      {mySchedule.weekdays?.map((d: number) => 
                        ['월', '화', '수', '목', '금', '토', '일'][d]
                      ).join(', ')}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">검색 키워드</p>
                    <p className="font-semibold text-gray-900">
                      {mySchedule.keywords?.join(', ')}
                    </p>
                  </div>
                </div>

                {mySchedule.next_run && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      📅 다음 발송: <span className="font-bold text-blue-700">
                        {new Date(mySchedule.next_run).toLocaleString('ko-KR')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 스케줄 생성 폼
            <div className="space-y-6">
              {/* 이메일 입력 */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  수신 이메일 주소
                </label>
                <input
                  type="email"
                  value={scheduleEmail}
                  onChange={(e) => setScheduleEmail(e.target.value)}
                  placeholder="뉴스를 받을 이메일 주소 (예: your-email@example.com)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* 키워드 입력 */}
              <div>
                <label className="block text-gray-700 font-bold mb-3">
                  검색 키워드 (다중 입력 가능)
                </label>
                {scheduleKeywords.map((keyword, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder={`키워드 ${index + 1} (예: AI 투자, 스타트업)`}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                    {scheduleKeywords.length > 1 && (
                      <button
                        onClick={() => handleRemoveKeyword(index)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition-all"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddKeyword}
                  className="mt-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-semibold transition-all"
                >
                  + 키워드 추가
                </button>
              </div>

              {/* 발송 시간 */}
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  발송 시간
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* 요일 선택 */}
              <div>
                <label className="block text-gray-700 font-bold mb-3">
                  발송 요일
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { day: 0, label: '월' },
                    { day: 1, label: '화' },
                    { day: 2, label: '수' },
                    { day: 3, label: '목' },
                    { day: 4, label: '금' },
                    { day: 5, label: '토' },
                    { day: 6, label: '일' },
                  ].map(({ day, label }) => (
                    <button
                      key={day}
                      onClick={() => handleWeekdayToggle(day)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        scheduleWeekdays.includes(day)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setScheduleWeekdays([0, 1, 2, 3, 4])}
                    className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                  >
                    평일만
                  </button>
                  <button
                    onClick={() => setScheduleWeekdays([5, 6])}
                    className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                  >
                    주말만
                  </button>
                  <button
                    onClick={() => setScheduleWeekdays([0, 1, 2, 3, 4, 5, 6])}
                    className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                  >
                    매일
                  </button>
                </div>
              </div>

              {/* 스케줄 등록 버튼 */}
              <button
                onClick={handleCreateSchedule}
                disabled={scheduleLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {scheduleLoading ? '등록 중...' : '⏰ 매일 자동 발송 설정하기'}
              </button>

              {/* 에러 메시지 */}
              {scheduleError && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
                  ⚠️ {scheduleError}
                </div>
              )}

              {/* 안내 메시지 */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  💡 <strong>매일 자동 발송 기능:</strong> 설정한 시간과 요일에 자동으로 최신 뉴스를 수집해서 이메일로 보내드립니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 기능 설명 */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">✨ 주요 기능</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ 네이버 뉴스 실시간 검색</li>
            <li>✅ Top 10~20 검색 결과 자동 수집</li>
            <li>✅ Excel 파일로 정리</li>
            <li>✅ 이메일 자동 발송</li>
            <li>✅ 매일 자동 발송 스케줄 (NEW!)</li>
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

