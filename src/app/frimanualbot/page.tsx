'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CopilotLandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/tools/frimanualbot');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* 네비게이션 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-indigo-600">WorkFree</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGetStarted}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                바로 시작하기
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
              🚀 NEW! AI 업무 어시스턴트
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Fri Manual Bot
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
            업무 매뉴얼 AI 어시스턴트
          </p>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            매뉴얼 찾느라 30분? 이제 <span className="text-indigo-600 font-semibold">AI에게 질문하면 2분 안에 답변</span>받으세요.<br />
            당신의 모든 업무 문서를 학습한 개인 AI 비서가 24시간 대기 중입니다.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={handleGetStarted}
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl"
            >
              무료로 시작하기 →
            </button>
            <a
              href="#how-it-works"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all border-2 border-indigo-600"
            >
              작동 방식 보기
            </a>
          </div>

          {/* 데모 이미지 영역 */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-gray-600 text-lg">
                    "휴가 신청은 어떻게 하나요?"<br />
                    <span className="text-indigo-600 font-semibold">→ AI가 즉시 매뉴얼에서 찾아 답변</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 제안 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            왜 Fri Manual Bot인가?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">30분 → 2분</h3>
              <p className="text-gray-600">
                매뉴얼 찾고, Ctrl+F 하고, 관련 페이지 읽는 시간.<br />
                <span className="text-indigo-600 font-semibold">AI가 2분 안에 정확한 답변을 찾아드립니다.</span>
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">내 문서 학습</h3>
              <p className="text-gray-600">
                회사 매뉴얼, SOP, 가이드 모두 업로드.<br />
                <span className="text-purple-600 font-semibold">AI가 전부 학습해서 당신만의 전문가가 됩니다.</span>
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border border-pink-100">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">언제 어디서나</h3>
              <p className="text-gray-600">
                우측 하단 플로팅 버튼 클릭.<br />
                <span className="text-pink-600 font-semibold">어떤 페이지에서든 즉시 질문하세요.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 작동 방식 */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            3단계로 끝나는 간단한 시작
          </h2>

          <div className="space-y-8">
            <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">📤 매뉴얼 업로드</h3>
                <p className="text-gray-600 text-lg">
                  PDF, DOCX, TXT 파일을 드래그 앤 드롭. 회사 매뉴얼, 업무 가이드, SOP 등 모두 업로드하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🤖 AI가 자동 학습</h3>
                <p className="text-gray-600 text-lg">
                  업로드된 문서를 AI가 자동으로 분석하고 임베딩. RAG 기술로 정확한 검색이 가능해집니다.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">💬 질문하고 즉시 답변 받기</h3>
                <p className="text-gray-600 text-lg">
                  우측 하단 챗봇 버튼 클릭 → 질문 입력 → AI가 관련 문서에서 찾아 답변. 출처도 함께 표시됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 사례 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            이런 질문에 즉시 답변합니다
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "휴가 신청은 어떻게 하나요?", icon: "🏖️" },
              { q: "견적서 양식 어디서 받아요?", icon: "📄" },
              { q: "보고서 작성 절차 알려줘", icon: "📊" },
              { q: "경조사 신청 방법은?", icon: "🎁" },
              { q: "출장비 정산은 어떻게?", icon: "✈️" },
              { q: "신규 고객 등록 절차는?", icon: "👤" },
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{item.icon}</span>
                  <p className="text-lg font-medium text-gray-900">{item.q}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            간단한 가격
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 무료 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">무료</h3>
              <p className="text-gray-600 mb-6">시작하기 좋은 플랜</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                ₩0<span className="text-lg font-normal text-gray-600">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  문서 3개까지
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  질문 10개/일
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  기본 RAG 검색
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                무료로 시작
              </button>
            </div>

            {/* 프리미엄 */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-2xl border-2 border-indigo-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  인기
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">프리미엄</h3>
              <p className="text-indigo-100 mb-6">모든 기능 무제한</p>
              <div className="text-4xl font-bold text-white mb-6">
                ₩29,000<span className="text-lg font-normal text-indigo-100">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">무제한</span> 문서 업로드
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">무제한</span> 질문
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  음성 입력 (곧 출시)
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  대화 기록 저장
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  우선 지원
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                프리미엄 시작
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            매뉴얼 검색 스트레스,<br />
            이제 끝내세요
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            5분 안에 설정 완료. 지금 바로 시작하세요.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-indigo-600 px-12 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            무료로 시작하기 →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 WorkFree Market. All rights reserved.</p>
          <p className="mt-2 text-sm">
            문의: support@workfree.market
          </p>
        </div>
      </footer>
    </div>
  );
}

