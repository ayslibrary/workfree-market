'use client';

import { useState } from 'react';
import { calculateResult, type Question, type Answer, type TestResult, type ResultType } from '@/lib/workExitTest';

export default function WorkExitTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Record<ResultType, TestResult> | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finalResult, setFinalResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  // 데이터 로드
  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsRes, resultsRes] = await Promise.all([
        fetch('/data/work-exit-test/questions.json'),
        fetch('/data/work-exit-test/results.json')
      ]);
      
      const questionsData = await questionsRes.json();
      const resultsData = await resultsRes.json();
      
      setQuestions(questionsData);
      setResults(resultsData);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 시작하기
  const handleStart = () => {
    loadData();
  };

  // 답변 선택
  const handleAnswer = (type: ResultType, weight: number) => {
    const newAnswers = [...answers, { type, weight }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 결과 계산
      const resultType = calculateResult(newAnswers);
      if (results) {
        setFinalResult(results[resultType]);
      }
    }
  };

  // 다시하기
  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setFinalResult(null);
  };

  // SNS 공유
  const handleShare = (platform: string) => {
    if (!finalResult) return;
    
    const text = encodeURIComponent(finalResult.share_text + '\n\n워크프리에서 나의 퇴근 유형 알아보기 →');
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'kakao':
        alert('카카오톡 공유는 SDK 설정이 필요합니다.');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // 시작 화면
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🕐 퇴근 유형 테스트
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              조직행동학 기반 퇴근 성향 분석
            </p>
            <p className="text-sm text-gray-500">
              McClelland, Kolb, Herzberg 이론 적용
            </p>
          </div>
          
          <div className="my-8 p-6 bg-gray-50 rounded-xl">
            <p className="text-gray-700 leading-relaxed">
              총 <strong>5개의 질문</strong>을 통해<br />
              당신의 퇴근 철학과 행동 패턴을 분석합니다.
            </p>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로딩 중...' : '시작하기'}
          </button>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (finalResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {finalResult.title}
            </h2>
            <p className="text-xl text-gray-600 italic">
              {finalResult.subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {/* 이론적 배경 */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                📚 이론적 배경
              </h3>
              <p className="text-gray-700">{finalResult.theory}</p>
            </div>

            {/* 시간 철학 */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                ⏰ 시간 철학
              </h3>
              <p className="text-gray-700 text-lg font-semibold">
                "{finalResult.time_philosophy}"
              </p>
            </div>

            {/* 행동 특성 */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-3">🎯 특성 분석</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">행동적:</span>
                  <p className="text-gray-600 mt-1">{finalResult.traits.behavioral}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">정서적:</span>
                  <p className="text-gray-600 mt-1">{finalResult.traits.emotional}</p>
                </div>
              </div>
            </div>

            {/* 강점/약점 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="font-bold text-yellow-900 mb-2">💪 강점</h3>
                <p className="text-gray-700">{finalResult.strength}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="font-bold text-red-900 mb-2">⚠️ 약점</h3>
                <p className="text-gray-700">{finalResult.weakness}</p>
              </div>
            </div>

            {/* 추천 키트 */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">🎁 추천 키트</h3>
              <p className="text-lg font-semibold text-purple-700">
                {finalResult.recommended_kit}
              </p>
            </div>
          </div>

          {/* 공유 및 재시도 버튼 */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleShare('twitter')}
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                트위터 공유
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="px-6 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
              >
                페이스북 공유
              </button>
              <button
                onClick={() => handleShare('kakao')}
                className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-full hover:bg-yellow-500 transition-colors"
              >
                카카오톡 공유
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-semibold"
              >
                다시 테스트하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 질문 화면
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              질문 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center leading-relaxed">
          {question.text}
        </h2>

        {/* 선택지 */}
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.type, option.weight)}
              className="w-full p-5 text-left bg-gray-50 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-purple-300"
            >
              <span className="text-lg text-gray-800">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

