'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn } from '@/components/animations';

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
    <>
      <MainNavigation />
      <div className="min-h-screen bg-[#f5f0ff] py-12 px-4" style={{ paddingTop: '100px' }}>
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            {/* 헤더 */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <h1 className="text-5xl font-bold text-[#1E1B33]">
                  📰 뉴스 브리핑
                </h1>
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg animate-pulse">
                  24/7 자동화
                </span>
              </div>
              <p className="text-[#1E1B33]/70 text-xl font-medium">
                원하는 키워드로 매일 최신 뉴스를 자동으로 수집해서 이메일로 받아보세요
              </p>
              
              {/* 혁신 포인트 강조 */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-[#AFA6FF]/30 hover:border-[#6A5CFF] transition-all hover:shadow-lg">
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="text-sm font-bold text-[#1E1B33]">24/7 자동</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-[#AFA6FF]/30 hover:border-[#6A5CFF] transition-all hover:shadow-lg">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="text-sm font-bold text-[#1E1B33]">다중 키워드</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-[#AFA6FF]/30 hover:border-[#6A5CFF] transition-all hover:shadow-lg">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-sm font-bold text-[#1E1B33]">요일 선택</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-[#AFA6FF]/30 hover:border-[#6A5CFF] transition-all hover:shadow-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-bold text-[#1E1B33]">Excel 정리</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-[#AFA6FF]/30 hover:border-[#6A5CFF] transition-all hover:shadow-lg">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="text-sm font-bold text-[#1E1B33]">실시간 뉴스</div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {/* 메인 카드 */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-[#AFA6FF]/20 hover:border-[#AFA6FF]/50 transition-all">
              {/* 검색어 입력 */}
              <div className="mb-6">
                <label className="block text-[#1E1B33] font-bold mb-2 text-lg">
                  검색어
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="예: AI 투자, 스타트업, 워크프리"
                  className="w-full px-5 py-4 border-2 border-[#AFA6FF]/30 rounded-xl focus:border-[#6A5CFF] focus:outline-none text-[#1E1B33] transition-all"
                />
              </div>

              {/* 이메일 입력 */}
              <div className="mb-6">
                <label className="block text-[#1E1B33] font-bold mb-2 text-lg">
                  이메일 주소
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="결과를 받을 이메일 주소 (예: your-email@example.com)"
                  className="w-full px-5 py-4 border-2 border-[#AFA6FF]/30 rounded-xl focus:border-[#6A5CFF] focus:outline-none text-[#1E1B33] transition-all"
                />
              </div>

              {/* 검색 엔진 선택 */}
              <div className="mb-6">
                <label className="block text-[#1E1B33] font-bold mb-3 text-lg">
                  검색 엔진
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-not-allowed opacity-50 bg-gray-50 px-4 py-3 rounded-lg">
                    <input
                      type="checkbox"
                      checked={false}
                      disabled
                      className="w-5 h-5 mr-2 cursor-not-allowed"
                    />
                    <span className="text-gray-400 font-medium">🔜 구글 (준비 중)</span>
                  </label>
                  <label className="flex items-center cursor-pointer bg-[#AFA6FF]/10 px-4 py-3 rounded-lg hover:bg-[#AFA6FF]/20 transition-all">
                    <input
                      type="checkbox"
                      checked={engines.includes('naver')}
                      onChange={() => handleEngineToggle('naver')}
                      className="w-5 h-5 mr-2 accent-[#6A5CFF]"
                    />
                    <span className="text-[#1E1B33] font-medium">✅ 네이버 뉴스</span>
                  </label>
                </div>
              </div>

              {/* 결과 개수 */}
              <div className="mb-8">
                <label className="block text-[#1E1B33] font-bold mb-3 text-lg">
                  결과 개수: <span className="text-[#6A5CFF]">{maxResults}개</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="5"
                  value={maxResults}
                  onChange={(e) => setMaxResults(parseInt(e.target.value))}
                  className="w-full h-3 bg-[#AFA6FF]/20 rounded-lg appearance-none cursor-pointer accent-[#6A5CFF]"
                />
                <div className="flex justify-between text-sm text-[#1E1B33]/60 mt-2 font-medium">
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
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {loading ? '🔄 검색 중...' : '🔍 검색만 하기'}
                </button>
                <button
                  onClick={handleSearchAndEmail}
                  disabled={loading || !keyword || !email || engines.length === 0}
                  className="flex-1 bg-gradient-to-r from-[#6A5CFF] to-[#AFA6FF] hover:from-[#5B4DEE] hover:to-[#9E95EE] text-white px-6 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {loading ? '📤 발송 중...' : '📧 검색 + 이메일 발송'}
                </button>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-medium">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </FadeIn>

          {/* 결과 표시 */}
          {result && (
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-[#AFA6FF]/20">
                <h2 className="text-3xl font-bold mb-6 text-[#1E1B33]">📊 검색 결과</h2>
                
                {result.success ? (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                    <p className="text-green-700 font-bold text-xl mb-2">✅ 이메일 발송 완료!</p>
                    <p className="text-[#1E1B33]/70 font-medium">
                      {result.results_count}개의 최신 뉴스를 <span className="font-bold text-[#6A5CFF]">{result.recipient}</span>로 발송했습니다.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-[#1E1B33]/70 mb-6 text-lg font-medium">
                      총 <span className="font-bold text-[#6A5CFF]">{result.total_results}개</span> 발견
                    </p>
                    <div className="space-y-4">
                      {result.results?.map((r: any, idx: number) => (
                        <div key={idx} className="p-5 border-2 border-[#AFA6FF]/20 rounded-xl hover:border-[#6A5CFF] transition-all hover:shadow-md bg-gradient-to-r from-white to-[#f5f0ff]/30">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-gradient-to-r from-[#6A5CFF] to-[#AFA6FF] text-white text-xs font-bold rounded-full">
                              {r.engine.toUpperCase()}
                            </span>
                            <span className="text-[#1E1B33]/50 text-sm font-bold">#{r.rank}</span>
                          </div>
                          <h3 className="font-bold text-[#1E1B33] mb-2 text-lg">{r.title}</h3>
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[#6A5CFF] text-sm hover:underline block mb-2 font-medium">
                            🔗 {r.url}
                          </a>
                          <p className="text-[#1E1B33]/70 text-sm leading-relaxed">{r.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </FadeIn>
          )}

          {/* 매일 자동 발송 스케줄 설정 */}
          <FadeIn delay={0.3}>
            <div className="mt-8 bg-gradient-to-br from-white to-[#f5f0ff] rounded-3xl shadow-xl p-8 border-2 border-[#AFA6FF]/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1E1B33] mb-2">
                    ⏰ 매일 자동 발송 설정
                  </h2>
                  <p className="text-[#1E1B33]/60 font-medium">PC 꺼져있어도 매일 자동으로 뉴스를 수집해서 보내드립니다</p>
                </div>
                {user && (
                  <span className="text-sm text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border-2 border-green-200">
                    ✅ {user.email || user.displayName || '로그인됨'}
                  </span>
                )}
              </div>

              {mySchedule ? (
                // 이미 스케줄이 있는 경우
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-green-800 text-2xl mb-2">
                          ✅ 스케줄 활성화됨
                        </h3>
                        <p className="text-[#1E1B33]/70 font-medium">
                          설정한 시간에 자동으로 뉴스를 수집해서 이메일로 보내드립니다
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteSchedule}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                      >
                        🗑️ 삭제
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-5 bg-white rounded-xl border-2 border-[#AFA6FF]/20 shadow-sm">
                        <p className="text-sm text-[#1E1B33]/60 mb-2 font-medium">📧 이메일</p>
                        <p className="font-bold text-[#1E1B33] text-lg">{mySchedule.email}</p>
                      </div>
                      <div className="p-5 bg-white rounded-xl border-2 border-[#AFA6FF]/20 shadow-sm">
                        <p className="text-sm text-[#1E1B33]/60 mb-2 font-medium">⏰ 발송 시간</p>
                        <p className="font-bold text-[#1E1B33] text-lg">{mySchedule.time}</p>
                      </div>
                      <div className="p-5 bg-white rounded-xl border-2 border-[#AFA6FF]/20 shadow-sm">
                        <p className="text-sm text-[#1E1B33]/60 mb-2 font-medium">📅 발송 요일</p>
                        <p className="font-bold text-[#1E1B33] text-lg">
                          {mySchedule.weekdays?.map((d: number) => 
                            ['월', '화', '수', '목', '금', '토', '일'][d]
                          ).join(', ')}
                        </p>
                      </div>
                      <div className="p-5 bg-white rounded-xl border-2 border-[#AFA6FF]/20 shadow-sm">
                        <p className="text-sm text-[#1E1B33]/60 mb-2 font-medium">🔍 검색 키워드</p>
                        <p className="font-bold text-[#1E1B33] text-lg">
                          {mySchedule.keywords?.join(', ')}
                        </p>
                      </div>
                    </div>

                    {mySchedule.next_run && (
                      <div className="mt-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                        <p className="text-[#1E1B33] font-medium">
                          📅 다음 발송 예정: <span className="font-bold text-blue-700 text-lg">
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
                    <label className="block text-[#1E1B33] font-bold mb-3 text-lg">
                      📧 수신 이메일 주소
                    </label>
                    <input
                      type="email"
                      value={scheduleEmail}
                      onChange={(e) => setScheduleEmail(e.target.value)}
                      placeholder="뉴스를 받을 이메일 주소 (예: your-email@example.com)"
                      className="w-full px-5 py-4 border-2 border-[#AFA6FF]/30 rounded-xl focus:border-[#6A5CFF] focus:outline-none text-[#1E1B33] transition-all"
                    />
                  </div>

                  {/* 키워드 입력 */}
                  <div>
                    <label className="block text-[#1E1B33] font-bold mb-3 text-lg">
                      🔍 검색 키워드 (다중 입력 가능)
                    </label>
                    {scheduleKeywords.map((keyword, index) => (
                      <div key={index} className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => handleKeywordChange(index, e.target.value)}
                          placeholder={`키워드 ${index + 1} (예: AI 투자, 스타트업, 워크프리)`}
                          className="flex-1 px-5 py-4 border-2 border-[#AFA6FF]/30 rounded-xl focus:border-[#6A5CFF] focus:outline-none text-[#1E1B33] transition-all"
                        />
                        {scheduleKeywords.length > 1 && (
                          <button
                            onClick={() => handleRemoveKeyword(index)}
                            className="px-5 py-3 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 rounded-xl font-bold transition-all"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleAddKeyword}
                      className="mt-2 px-5 py-3 bg-gradient-to-r from-[#AFA6FF]/20 to-[#6A5CFF]/20 hover:from-[#AFA6FF]/30 hover:to-[#6A5CFF]/30 text-[#6A5CFF] rounded-xl font-bold transition-all border-2 border-[#AFA6FF]/30"
                    >
                      ➕ 키워드 추가
                    </button>
                  </div>

                  {/* 발송 시간 */}
                  <div>
                    <label className="block text-[#1E1B33] font-bold mb-3 text-lg">
                      ⏰ 발송 시간
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="px-5 py-4 border-2 border-[#AFA6FF]/30 rounded-xl focus:border-[#6A5CFF] focus:outline-none text-[#1E1B33] text-lg font-bold transition-all"
                    />
                  </div>

                  {/* 요일 선택 */}
                  <div>
                    <label className="block text-[#1E1B33] font-bold mb-3 text-lg">
                      📅 발송 요일
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
                          className={`px-7 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                            scheduleWeekdays.includes(day)
                              ? 'bg-gradient-to-r from-[#6A5CFF] to-[#AFA6FF] text-white shadow-lg'
                              : 'bg-[#AFA6FF]/10 text-[#1E1B33]/60 hover:bg-[#AFA6FF]/20 border-2 border-[#AFA6FF]/20'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => setScheduleWeekdays([0, 1, 2, 3, 4])}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 rounded-xl font-bold transition-all"
                      >
                        📋 평일만
                      </button>
                      <button
                        onClick={() => setScheduleWeekdays([5, 6])}
                        className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 rounded-xl font-bold transition-all"
                      >
                        🏖️ 주말만
                      </button>
                      <button
                        onClick={() => setScheduleWeekdays([0, 1, 2, 3, 4, 5, 6])}
                        className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 rounded-xl font-bold transition-all"
                      >
                        🌍 매일
                      </button>
                    </div>
                  </div>

                  {/* 스케줄 등록 버튼 */}
                  <button
                    onClick={handleCreateSchedule}
                    disabled={scheduleLoading}
                    className="w-full bg-gradient-to-r from-[#6A5CFF] to-[#AFA6FF] hover:from-[#5B4DEE] hover:to-[#9E95EE] text-white px-6 py-5 rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
                  >
                    {scheduleLoading ? '⏳ 등록 중...' : '⏰ 매일 자동 발송 설정하기'}
                  </button>

                  {/* 에러 메시지 */}
                  {scheduleError && (
                    <div className="p-5 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-medium">
                      ⚠️ {scheduleError}
                    </div>
                  )}

                  {/* 안내 메시지 */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                    <p className="text-[#1E1B33] font-medium leading-relaxed">
                      <span className="text-2xl mr-2">💡</span>
                      <strong className="text-[#6A5CFF]">매일 자동 발송 기능:</strong> 설정한 시간과 요일에 자동으로 최신 뉴스를 수집해서 이메일로 보내드립니다. PC가 꺼져 있어도 Railway 서버에서 24/7 자동 실행됩니다!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* 기능 설명 */}
          <FadeIn delay={0.4}>
            <div className="mt-8 bg-gradient-to-r from-[#AFA6FF]/20 to-[#6A5CFF]/20 rounded-2xl p-8 border-2 border-[#AFA6FF]/30">
              <h3 className="font-bold text-[#1E1B33] mb-5 text-2xl">✨ 혁신적인 주요 기능</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-bold text-[#1E1B33]">네이버 뉴스 실시간 검색</div>
                    <div className="text-sm text-[#1E1B33]/70">최신 뉴스를 실시간으로 수집</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-bold text-[#1E1B33]">Top 10~20 결과 자동 수집</div>
                    <div className="text-sm text-[#1E1B33]/70">원하는 개수만큼 수집 가능</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-bold text-[#1E1B33]">Excel 파일로 정리</div>
                    <div className="text-sm text-[#1E1B33]/70">데이터 분석하기 쉽게 정리</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-bold text-[#1E1B33]">이메일 자동 발송</div>
                    <div className="text-sm text-[#1E1B33]/70">받은편지함으로 바로 전송</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-bold text-[#6A5CFF]">24/7 자동 발송 스케줄</div>
                    <div className="text-sm text-[#1E1B33]/70">PC 꺼져도 매일 자동 실행</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔜</span>
                  <div>
                    <div className="font-bold text-[#1E1B33]/60">구글 검색 API 연동 (예정)</div>
                    <div className="text-sm text-[#1E1B33]/50">더 많은 뉴스 소스 추가 예정</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

