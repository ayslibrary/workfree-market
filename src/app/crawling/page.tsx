"use client";

import { useState, useEffect } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Schedule {
  user_id: string;
  email: string;
  keywords: string[];
  time: string;
  weekdays: number[];
  next_run: string | null;
}

const CRAWLER_API_URL = process.env.NEXT_PUBLIC_CRAWLER_API_URL || 'http://localhost:8000';

export default function NewsCrawlingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // 즉시 검색 모드
  const [keyword, setKeyword] = useState('');
  const [email, setEmail] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 스케줄 모드
  const [scheduleMode, setScheduleMode] = useState(false);
  const [keywords, setKeywords] = useState(['']);
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);

  const weekdayNames = ['월', '화', '수', '목', '금', '토', '일'];

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      loadUserSchedule();
    }
  }, [user]);

  const loadUserSchedule = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${CRAWLER_API_URL}/api/schedule/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentSchedule(data);
      }
    } catch (error) {
      console.log('스케줄 없음');
    }
  };

  const handleInstantSearch = async () => {
    if (!keyword.trim()) {
      setMessage('검색어를 입력하세요');
      return;
    }

    if (!email.trim()) {
      setMessage('이메일을 입력하세요');
      return;
    }

    setLoading(true);
    setMessage('검색 중...');

    try {
      const response = await fetch(`${CRAWLER_API_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          recipient_email: email,
          engines: ['naver'],
          max_results: maxResults
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 이메일 발송 완료! (${data.results_count}개 결과)`);
      } else {
        setMessage(`❌ 오류: ${data.detail}`);
      }
    } catch (error) {
      setMessage('❌ 네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!user) {
      setMessage('로그인이 필요합니다');
      return;
    }

    const validKeywords = keywords.filter(k => k.trim() !== '');
    if (validKeywords.length === 0) {
      setMessage('최소 1개 이상의 키워드를 입력하세요');
      return;
    }

    if (selectedWeekdays.length === 0) {
      setMessage('최소 1일 이상 선택하세요');
      return;
    }

    setLoading(true);
    setMessage('스케줄 등록 중...');

    try {
      const response = await fetch(`${CRAWLER_API_URL}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          email: user.email,
          keywords: validKeywords,
          time: scheduleTime,
          weekdays: selectedWeekdays,
          max_results: maxResults,
          engines: ['naver']
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 스케줄 등록 완료! 다음 실행: ${new Date(data.next_run).toLocaleString('ko-KR')}`);
        setCurrentSchedule(data);
      } else {
        setMessage(`❌ 오류: ${data.detail}`);
      }
    } catch (error) {
      setMessage('❌ 네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!user) return;

    if (!confirm('스케줄을 삭제하시겠습니까?')) return;

    setLoading(true);

    try {
      const response = await fetch(`${CRAWLER_API_URL}/api/schedule/${user.uid}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage('✅ 스케줄이 삭제되었습니다');
        setCurrentSchedule(null);
      } else {
        setMessage('❌ 삭제 실패');
      }
    } catch (error) {
      setMessage('❌ 네트워크 오류');
    } finally {
      setLoading(false);
    }
  };

  const addKeywordField = () => {
    setKeywords([...keywords, '']);
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const toggleWeekday = (day: number) => {
    if (selectedWeekdays.includes(day)) {
      setSelectedWeekdays(selectedWeekdays.filter(d => d !== day));
    } else {
      setSelectedWeekdays([...selectedWeekdays, day].sort());
    }
  };

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
              <span className="text-4xl">📰</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                검색어 기반 뉴스 자동 크롤링
              </h1>
            </div>
            <p className="text-gray-600">
              네이버 최신 뉴스를 자동으로 수집하고 이메일로 받아보세요
            </p>
          </div>

          {/* 모드 선택 탭 */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setScheduleMode(false)}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                !scheduleMode
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔍 검색만 하기
            </button>
            <button
              onClick={() => setScheduleMode(true)}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                scheduleMode
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              ⏰ 검색 + 이메일 발송
            </button>
          </div>

          {/* 즉시 검색 모드 */}
          {!scheduleMode && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">즉시 검색</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">검색어</label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="예: 워크프리, 자동화 도구"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">이메일 주소</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="결과를 받을 이메일 주소"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    결과 개수: {maxResults}개
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5개</span>
                    <span>10개</span>
                    <span>15개</span>
                    <span>20개</span>
                  </div>
                </div>

                <button
                  onClick={handleInstantSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? '🔄 검색만 하기' : '🚀 검색만 하기'}
                </button>
              </div>
            </div>
          )}

          {/* 스케줄 모드 */}
          {scheduleMode && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">자동 발송 스케줄 설정</h2>

              {currentSchedule && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-blue-900 mb-2">✅ 스케줄이 등록되어 있습니다</p>
                      <p className="text-sm text-blue-700">
                        다음 실행: {currentSchedule.next_run ? new Date(currentSchedule.next_run).toLocaleString('ko-KR') : '없음'}
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteSchedule}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* 키워드 입력 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">검색 키워드</label>
                  {keywords.map((kw, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={kw}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        placeholder={`키워드 ${index + 1}`}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      />
                      {keywords.length > 1 && (
                        <button
                          onClick={() => removeKeyword(index)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addKeywordField}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-500 hover:text-purple-600"
                  >
                    + 키워드 추가
                  </button>
                </div>

                {/* 시간 선택 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">⏰ 브리핑 발송 시간</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                  />
                </div>

                {/* 요일 선택 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">📅 발송 요일</label>
                  <div className="flex gap-2">
                    {weekdayNames.map((name, index) => (
                      <button
                        key={index}
                        onClick={() => toggleWeekday(index)}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          selectedWeekdays.includes(index)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 결과 개수 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    결과 개수: {maxResults}개
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* 예상 비용 */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <p className="text-sm text-purple-900 font-semibold mb-2">💰 예상 크레딧 소진</p>
                  <p className="text-purple-700">
                    일일: 3C (3,000원) | 월간: 약 {selectedWeekdays.length * 4 * 3}C ({selectedWeekdays.length * 4 * 3000}원)
                  </p>
                </div>

                <button
                  onClick={handleCreateSchedule}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? '⏳ 등록 중...' : '📬 자동 발송 시작'}
                </button>
              </div>
            </div>
          )}

          {/* 메시지 표시 */}
          {message && (
            <div className="mt-6 bg-white border-2 border-purple-200 rounded-xl p-4 text-center">
              <p className="text-gray-700">{message}</p>
            </div>
          )}

          {/* 안내사항 */}
          <div className="mt-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">📋 이용 안내</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ 네이버 뉴스에서 최신순으로 검색됩니다</li>
              <li>✓ Excel 파일로 이메일에 첨부되어 발송됩니다</li>
              <li>✓ 스케줄 등록 시 매일 자동으로 발송됩니다</li>
              <li>✓ 검색 1회당 3C (3,000원) 크레딧 차감</li>
              <li>✓ 키워드는 최대 5개까지 등록 가능합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

