'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CopilotEnterprisePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    employees: '10-50',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Firebase에 기업 문의 저장
    console.log('기업 문의:', formData);
    
    setIsSubmitted(true);
    setTimeout(() => {
      alert('문의가 접수되었습니다!\n\n영업일 기준 1일 내로 담당자가 연락드리겠습니다.');
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* 네비게이션 */}
      <nav className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">WorkFree</span>
              <span className="text-sm text-indigo-300">Enterprise</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/frimanualbot" className="text-white/80 hover:text-white transition-colors">
                개인용 보기
              </Link>
              <a href="#contact" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                도입 문의
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="pt-20 pb-32 px-4 relative overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-6 py-2 rounded-full text-sm font-bold">
              🏢 Enterprise Solution
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            조직의 모든 지식을<br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI가 학습합니다
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto">
            Fri Manual Bot Enterprise
          </p>
          
          <p className="text-lg text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            수천 페이지의 매뉴얼, SOP, 가이드를 AI가 학습하여<br />
            신입부터 베테랑까지 모두가 즉시 활용할 수 있는 조직 지식 베이스를 구축하세요.
          </p>

          {/* 주요 통계 */}
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-indigo-300 mb-2">90%</div>
              <div className="text-white/80 text-sm">질문 검색 시간 단축</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-purple-300 mb-2">3개월</div>
              <div className="text-white/80 text-sm">신입 온보딩 기간 단축</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-pink-300 mb-2">24/7</div>
              <div className="text-white/80 text-sm">즉시 답변 가능</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-yellow-300 mb-2">100%</div>
              <div className="text-white/80 text-sm">지식 손실 방지</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#contact"
              className="bg-white text-indigo-900 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              무료 데모 신청
            </a>
            <a
              href="#features"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/20 transition-all"
            >
              기능 살펴보기
            </a>
          </div>
        </div>
      </section>

      {/* 기업의 문제점 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              이런 문제로 고민하고 계신가요?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                신입 온보딩에 3개월
              </h3>
              <p className="text-gray-700">
                매뉴얼 읽고, 선배에게 물어보고, 실수하면서 배우는 비효율적인 온보딩. 
                담당자도 본인 업무에 집중할 수 없어요.
              </p>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                매뉴얼 찾는데 하루 1시간
              </h3>
              <p className="text-gray-700">
                어디에 있는지 모르는 문서, 여러 버전의 SOP, 부서별로 흩어진 가이드. 
                찾기만 해도 30분이 걸려요.
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">💔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                베테랑 퇴사 = 지식 손실
              </h3>
              <p className="text-gray-700">
                10년차 직원이 퇴사하면 노하우도 함께 사라집니다. 
                문서화되지 않은 암묵지는 영영 복구 불가능해요.
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-8">
              <div className="text-4xl mb-4">🤦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                같은 질문 매일 반복
              </h3>
              <p className="text-gray-700">
                "휴가 어떻게 신청해요?" "경조사비 신청은?" 
                매일 같은 질문에 답변하느라 핵심 업무를 못해요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 솔루션 */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fri Manual Bot이 해결합니다
            </h2>
            <p className="text-xl text-gray-600">
              AI 기반 조직 지식 베이스로 모든 문제를 한번에
            </p>
          </div>

          <div className="space-y-12">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  Feature 1
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  🚀 신입 온보딩 3개월 → 2주
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  모든 매뉴얼을 AI가 학습. 신입사원이 궁금한 것을 바로 질문하면 즉시 답변. 
                  선배 시간 빼앗지 않고도 빠르게 적응할 수 있어요.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">회사 문화, 업무 프로세스 즉시 학습</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">24시간 언제든 질문 가능 (담당자 찾기 불필요)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">온보딩 비용 80% 절감</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                  <div className="text-sm text-gray-600 mb-2">신입사원 질문</div>
                  <div className="bg-indigo-600 text-white p-4 rounded-lg mb-4">
                    "휴가 신청 절차 알려주세요"
                  </div>
                  <div className="text-sm text-gray-600 mb-2">AI 즉시 답변</div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm mb-2">휴가 신청 절차는 다음과 같습니다:</p>
                    <ol className="text-xs space-y-1 list-decimal list-inside text-gray-700">
                      <li>그룹웨어 접속 → 전자결재</li>
                      <li>휴가신청서 작성 (3일 전)</li>
                      <li>팀장 승인 → 인사팀 최종 승인</li>
                    </ol>
                    <div className="mt-3 pt-2 border-t text-xs text-gray-500">
                      📚 참고: 인사규정.pdf, 전자결재가이드.pdf
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <span className="text-sm font-medium">마케팅팀</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">활성</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <span className="text-sm font-medium">개발팀</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">활성</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <span className="text-sm font-medium">영업팀</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">활성</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <span className="text-sm font-medium">인사팀</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">활성</span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  Feature 2
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  🏢 부서별 지식 베이스 통합
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  마케팅, 개발, 영업, 인사... 부서별로 흩어진 매뉴얼을 하나의 AI에 통합. 
                  부서 간 정보 사일로를 해소하고 협업을 강화하세요.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">부서별 권한 관리 (필요한 사람만 접근)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">크로스 팀 협업 시 정보 공유 간편화</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">실시간 문서 업데이트 반영</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  Feature 3
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  📊 사용량 분석 & 인사이트
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  어떤 매뉴얼이 가장 많이 검색되는지, 어떤 질문이 반복되는지 대시보드로 확인. 
                  데이터 기반으로 교육 프로그램과 문서를 개선하세요.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">팀원별 질문 통계 및 활용도 분석</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">자주 묻는 질문 TOP 10 자동 추출</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">문서 업데이트 필요 부분 자동 감지</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-900 mb-4">📈 이번 주 인기 질문</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <span className="text-sm">휴가 신청 방법</span>
                      <span className="text-xs font-bold text-indigo-600">127회</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <span className="text-sm">견적서 양식</span>
                      <span className="text-xs font-bold text-indigo-600">89회</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <span className="text-sm">경조사 신청</span>
                      <span className="text-xs font-bold text-indigo-600">64회</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <span className="text-sm">출장비 정산</span>
                      <span className="text-xs font-bold text-indigo-600">52회</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-xs text-gray-600">💡 추천: "휴가 신청" FAQ 작성 권장</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI 계산기 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              당신 회사의 ROI는?
            </h2>
            <p className="text-xl text-gray-600">
              Fri Manual Bot 도입으로 얼마나 절감할 수 있는지 계산해보세요
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">직원 수</label>
                <input
                  type="number"
                  defaultValue={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">평균 급여 (만원/월)</label>
                <input
                  type="number"
                  defaultValue={400}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">일일 매뉴얼 검색 시간 절감</span>
                <span className="text-2xl font-bold text-indigo-600">50분/인</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">월간 절감 시간</span>
                <span className="text-2xl font-bold text-purple-600">1,000시간</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                <span className="text-lg font-semibold text-gray-900">월간 절감 비용</span>
                <span className="text-3xl font-bold text-green-600">₩12,500,000</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Fri Manual Bot 비용: <span className="font-bold">₩299,000/월</span>
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                💰 ROI: <span className="text-green-600">4,185%</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise 가격
            </h2>
            <p className="text-xl text-gray-600">
              기업 규모에 맞는 유연한 요금제
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">소규모 팀용</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                ₩299,000<span className="text-lg font-normal text-gray-600">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  10명까지
                </li>
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  문서 100개
                </li>
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  무제한 질문
                </li>
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  이메일 지원
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors"
              >
                시작하기
              </a>
            </div>

            {/* Professional */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl border-2 border-indigo-600 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  추천
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <p className="text-indigo-100 mb-6">중견 기업용</p>
              <div className="text-4xl font-bold text-white mb-6">
                ₩899,000<span className="text-lg font-normal text-indigo-100">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  50명까지
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  무제한 문서
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  부서별 권한 관리
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  사용량 대시보드
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  우선 지원
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors"
              >
                시작하기
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">대기업용</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                맞춤 견적
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  무제한 사용자
                </li>
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  온프레미스 설치 가능
                </li>
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  맞춤형 통합 (API)
                </li>
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  전담 CS팀
                </li>
                <li className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SLA 보장
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-800 transition-colors"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 도입 문의 폼 */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              무료 데모 신청
            </h2>
            <p className="text-xl text-gray-600">
              30분 안에 직접 체험해보세요. 영업일 기준 1일 내로 연락드립니다.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      회사명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                      placeholder="(주)워크프리"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      담당자명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                      placeholder="홍길동"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                      placeholder="hello@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    직원 수 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="10-50">10-50명</option>
                    <option value="51-100">51-100명</option>
                    <option value="101-500">101-500명</option>
                    <option value="500+">500명 이상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    문의 내용
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                    placeholder="도입 목적, 원하시는 기능 등을 자유롭게 작성해주세요"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
                >
                  무료 데모 신청하기
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-12 text-center border-2 border-green-200">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                신청이 완료되었습니다!
              </h3>
              <p className="text-gray-700 mb-6">
                {formData.companyName} {formData.name}님,<br />
                영업일 기준 1일 내로 담당자가 연락드리겠습니다.
              </p>
              <p className="text-sm text-gray-600">
                문의: enterprise@workfree.market
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Fri Manual Bot</h4>
              <p className="text-sm">
                AI 기반 조직 지식 베이스<br />
                업무 매뉴얼 검색 시간 90% 단축
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/frimanualbot" className="hover:text-white">개인용</Link></li>
                <li><Link href="/frimanualbot/enterprise" className="hover:text-white">기업용</Link></li>
                <li><Link href="/pricing" className="hover:text-white">가격</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>기업 문의: enterprise@workfree.market</li>
                <li>기술 지원: support@workfree.market</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-sm">&copy; 2025 WorkFree Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

