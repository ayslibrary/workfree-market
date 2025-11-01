'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

type ReportType = 'market' | 'industry' | 'project' | 'research';
type Audience = 'executive' | 'professional' | 'general';
type Length = 'short' | 'medium' | 'long';

export default function ReportGeneratorPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [reportType, setReportType] = useState<ReportType>('market');
  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');
  const [point3, setPoint3] = useState('');
  const [audience, setAudience] = useState<Audience>('executive');
  const [length, setLength] = useState<Length>('medium');
  const [useSearch, setUseSearch] = useState(true);
  const [additionalContent, setAdditionalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [isDemo, setIsDemo] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('보고서 주제를 입력해주세요.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          reportType,
          point1,
          point2,
          point3,
          audience,
          length,
          useSearch,
          additionalContent,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '보고서 생성에 실패했습니다.');
      }

      setResult(data.content);
      setTokensUsed(data.tokensUsed || 0);
      setIsDemo(data.isDemo || false);
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('보고서가 클립보드에 복사되었습니다! ✅');
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '_')}_보고서.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 보고서 유형별 포인트 예시
  const getPointPlaceholders = () => {
    const placeholders = {
      market: [
        '예: 2025년 국내 시장 규모 및 성장률 분석',
        '예: 주요 경쟁사 (A사, B사) 시장 점유율 비교',
        '예: 향후 3년간 시장 전망 및 기회 요인'
      ],
      industry: [
        '예: 산업 밸류체인 구조 및 주요 플레이어 분석',
        '예: 기술 발전 동향 및 혁신 사례',
        '예: 규제 환경 및 정책 변화 영향'
      ],
      project: [
        '예: 프로젝트 목표 대비 달성률 (90% 완료)',
        '예: 주요 이슈 및 리스크 관리 현황',
        '예: 향후 일정 및 추가 소요 자원'
      ],
      research: [
        '예: 연구 방법론 및 데이터 수집 과정',
        '예: 주요 발견사항 및 통계적 유의성',
        '예: 연구의 의의, 한계점 및 향후 연구 방향'
      ]
    };
    return placeholders[reportType] || placeholders.market;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
            📊 NEW!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📋 AI 보고서 자동 생성
          </h1>
          <p className="text-xl text-gray-600">
            최신 데이터 검색 + GPT-4o-mini로 전문 보고서 자동 작성
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 보고서 정보 입력</h2>

            {/* 보고서 주제 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                보고서 주제 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예: 2025년 AI 시장 동향 분석"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* 보고서 유형 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📂 보고서 유형
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'market', label: '시장 조사', emoji: '📈' },
                  { value: 'industry', label: '산업 분석', emoji: '🏭' },
                  { value: 'project', label: '프로젝트', emoji: '📊' },
                  { value: 'research', label: '연구', emoji: '🔬' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setReportType(type.value as ReportType)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      reportType === type.value
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.emoji} {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 주요 분석 포인트 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                💡 주요 분석 포인트 (선택사항)
              </label>
              <input
                type="text"
                value={point1}
                onChange={(e) => setPoint1(e.target.value)}
                placeholder={getPointPlaceholders()[0]}
                className="w-full px-4 py-2 mb-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={point2}
                onChange={(e) => setPoint2(e.target.value)}
                placeholder={getPointPlaceholders()[1]}
                className="w-full px-4 py-2 mb-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                value={point3}
                onChange={(e) => setPoint3(e.target.value)}
                placeholder={getPointPlaceholders()[2]}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* 타겟 독자 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                👥 타겟 독자
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'executive', label: '경영진' },
                  { value: 'professional', label: '실무자' },
                  { value: 'general', label: '일반인' },
                ].map((aud) => (
                  <button
                    key={aud.value}
                    onClick={() => setAudience(aud.value as Audience)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      audience === aud.value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 보고서 길이 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📄 보고서 길이
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'short', label: '짧게 (5p)' },
                  { value: 'medium', label: '보통 (10p)' },
                  { value: 'long', label: '길게 (20p)' },
                ].map((len) => (
                  <button
                    key={len.value}
                    onClick={() => setLength(len.value as Length)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      length === len.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 최신 데이터 검색 */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSearch}
                  onChange={(e) => setUseSearch(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-bold text-gray-700">
                  🔍 최신 데이터 자동 검색 (Google/Naver)
                </span>
              </label>
              <p className="text-xs text-gray-500 ml-8 mt-1">
                체크 시 주제 관련 최신 뉴스/자료를 자동으로 검색해 보고서에 반영합니다
              </p>
            </div>

            {/* 추가 참고 자료 */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📎 추가 참고 자료 (선택사항)
              </label>
              <textarea
                value={additionalContent}
                onChange={(e) => setAdditionalContent(e.target.value)}
                placeholder={`예시:
• 당사 내부 설문조사 결과 (2024년 4분기, 응답자 500명)
• 2024년 실적: 매출 150억원 (전년 대비 15% ↑), 영업이익률 8.2%
• 업계 전문가 김○○ 교수: "AI 시장은 2030년까지 연평균 25% 성장 전망"
• 정부 정책: AI 산업 육성 위한 5000억원 투자 계획 (2025.01 발표)
• 경쟁사 A사 사례: 자동화 도입으로 업무 효율 40% 향상`}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 구체적인 수치, 출처, 날짜를 포함하면 더 신뢰성 있는 보고서가 생성됩니다
              </p>
            </div>

            {/* 생성 버튼 */}
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                loading || !topic.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105'
              }`}
            >
              {loading ? '⏳ 보고서 생성 중... (30초-1분 소요)' : '🚀 보고서 생성하기'}
            </button>

            {tokensUsed > 0 && !isDemo && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                사용된 토큰: {tokensUsed.toLocaleString()}개
              </p>
            )}
          </div>

          {/* 결과 미리보기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">✨ 생성 결과</h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
                  >
                    📋 복사
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                  >
                    💾 다운로드
                  </button>
                </div>
              )}
            </div>

            {!result && !loading && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500">보고서를 생성하면 여기에 표시됩니다</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-20">
                <div className="animate-spin text-6xl mb-4">⚙️</div>
                <p className="text-gray-600 font-bold">AI가 보고서를 작성하고 있습니다...</p>
                <p className="text-sm text-gray-500 mt-2">최신 데이터를 검색하고 분석 중입니다</p>
              </div>
            )}

            {result && (
              <div className="prose max-w-none">
                {isDemo && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
                    <p className="text-sm text-yellow-800 font-bold">
                      ⚠️ 데모 모드로 생성되었습니다. OpenAI API 키를 설정하면 실제 AI가 생성합니다.
                    </p>
                  </div>
                )}
                <div
                  className="report-content"
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💡 보고서 생성기 사용 팁</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-gray-900 mb-2">명확한 주제 설정</h4>
              <p className="text-sm text-gray-600">
                구체적이고 명확한 주제를 입력하면 더 정확한 보고서가 생성됩니다
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-bold text-gray-900 mb-2">최신 데이터 활용</h4>
              <p className="text-sm text-gray-600">
                자동 검색 기능으로 실시간 뉴스와 최신 통계를 보고서에 반영합니다
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-gray-900 mb-2">전문적인 구성</h4>
              <p className="text-sm text-gray-600">
                서론, 분석, 결론이 체계적으로 구성된 전문 보고서가 자동 생성됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

