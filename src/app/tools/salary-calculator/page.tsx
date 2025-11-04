'use client';

import { useState } from 'react';
import { 
  calculateTakeHomePay, 
  compareCompanies, 
  formatCurrency,
  type SalaryInput, 
  type TakeHomePayResult,
  type CompanyInput,
  type CompanyComparison 
} from '@/lib/salaryCalculator';

type TabType = 'free' | 'pro';

export default function SalaryCalculatorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('free');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            💰 WorkFree 연봉 실수령 계산기
          </h1>
          <p className="text-lg text-gray-600">
            정확한 실수령액 계산부터 이직 시뮬레이션까지
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('free')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'free'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="block mb-1">💰 실수령 계산기</span>
            <span className="text-sm font-normal opacity-80">Free</span>
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              activeTab === 'pro'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="block mb-1">🚀 이직 모드</span>
            <span className="text-sm font-normal opacity-80">Pro</span>
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {activeTab === 'free' ? <FreeCalculator /> : <ProMode />}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 1️⃣ FREE 탭: 단순 실수령 계산기
// ============================================
function FreeCalculator() {
  const [input, setInput] = useState<SalaryInput>({
    annualSalary: 0,
    region: '서울',
    yearsOfService: 0,
  });
  const [result, setResult] = useState<TakeHomePayResult | null>(null);

  const handleCalculate = () => {
    if (input.annualSalary <= 0) {
      alert('연봉을 입력해주세요');
      return;
    }
    const calculated = calculateTakeHomePay(input);
    setResult(calculated);
  };

  // 빠른 입력 버튼
  const addAmount = (amount: number) => {
    setInput({ ...input, annualSalary: input.annualSalary + amount });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* 입력 섹션 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 정보 입력</h2>
          
          {/* 연봉 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              연봉 (만원)
            </label>
            <input
              type="number"
              value={input.annualSalary || ''}
              onChange={(e) => setInput({ ...input, annualSalary: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              placeholder="예: 4200"
            />
            {/* 빠른 입력 버튼 */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addAmount(1000)}
                className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                +1000만
              </button>
              <button
                onClick={() => addAmount(100)}
                className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                +100만
              </button>
              <button
                onClick={() => setInput({ ...input, annualSalary: 0 })}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 지역 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              근무 지역
            </label>
            <select
              value={input.region}
              onChange={(e) => setInput({ ...input, region: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            >
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 근속연수 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              근속연수 (년)
            </label>
            <input
              type="number"
              value={input.yearsOfService || ''}
              onChange={(e) => setInput({ ...input, yearsOfService: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
              placeholder="예: 3"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            💰 계산하기
          </button>
        </div>

        {/* 결과 섹션 */}
        <div className="space-y-4">
          {result ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 계산 결과</h2>
              
              {/* 월 실수령액 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90 mb-1">월 실수령액</p>
                <p className="text-4xl font-bold">
                  {result.monthlyTakeHome.toLocaleString()}원
                </p>
                <p className="text-sm opacity-80 mt-2">
                  월 급여: {result.monthlyGross.toLocaleString()}원
                </p>
              </div>

              {/* 세금 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">공제율</p>
                  <p className="text-2xl font-bold text-gray-900">{result.taxRate}%</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">연간 총 공제액</p>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.floor(result.annualTax / 10000).toLocaleString()}만원
                  </p>
                </div>
              </div>

              {/* 상세 내역 */}
              <div className="bg-blue-50 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-blue-900 mb-3">📋 상세 공제 내역 (월)</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">국민연금</span>
                  <span className="font-semibold text-gray-900">
                    {result.breakdown.pension.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">건강보험</span>
                  <span className="font-semibold text-gray-900">
                    {result.breakdown.healthInsurance.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">장기요양보험</span>
                  <span className="font-semibold text-gray-900">
                    {result.breakdown.longTermCare.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">고용보험</span>
                  <span className="font-semibold text-gray-900">
                    {result.breakdown.employment.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">소득세</span>
                  <span className="font-semibold text-gray-900">
                    {result.breakdown.incomeTax.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">지방소득세</span>
                  <span className="font-semibold text-gray-900">
                    {result.breakdown.localIncomeTax.toLocaleString()}원
                  </span>
                </div>
                <div className="border-t-2 border-blue-200 mt-2 pt-2 flex justify-between font-bold">
                  <span className="text-gray-900">총 공제액</span>
                  <span className="text-red-600">
                    -{(result.monthlyGross - result.monthlyTakeHome).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 공유 버튼 */}
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const text = `연봉 ${input.annualSalary}만원 → 월 실수령액 ${result.monthlyTakeHome.toLocaleString()}원`;
                    navigator.clipboard.writeText(text);
                    alert('클립보드에 복사되었습니다!');
                  }}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  📋 결과 복사
                </button>
                <button className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium">
                  💬 카카오 공유
                </button>
              </div>

              {/* 법적 안전장치 */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-xs text-gray-600">
                <p className="font-semibold text-gray-700 mb-1">⚠️ 안내사항</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>본 계산기는 국세청 간이세액표 기준으로 제작되었습니다.</li>
                  <li>실제 수령액은 회사 급여 지급 조건에 따라 차이가 있을 수 있습니다.</li>
                  <li>본 계산 결과는 참고용이며 법적 효력이 없습니다.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg">정보를 입력하고<br />계산하기 버튼을 눌러주세요</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA: Pro 모드로 유도 */}
      {result && (
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-2">
                🚀 이직하면 수령액이 얼마나 늘어날까요?
              </h3>
              <p className="text-purple-700">
                목표 기업과 비교하고, AI 추천 기업까지 확인해보세요
              </p>
            </div>
            <button
              onClick={() => {
                const section = document.querySelector('button[data-tab="pro"]') as HTMLElement;
                section?.click();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
            >
              Pro 모드 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// 2️⃣ PRO 탭: 이직 모드
// ============================================
function ProMode() {
  const [comparison, setComparison] = useState<CompanyComparison | null>(null);
  const [formData, setFormData] = useState<CompanyInput>({
    currentCompany: '',
    currentSalary: 0,
    currentIndustry: '제조업',
    targetCompany: '',
    targetSalary: 0,
    targetIndustry: 'IT서비스',
    region: '서울',
  });

  const handleCompare = () => {
    if (!formData.currentCompany || !formData.targetCompany) {
      alert('회사명을 입력해주세요');
      return;
    }
    if (formData.currentSalary <= 0 || formData.targetSalary <= 0) {
      alert('연봉을 입력해주세요');
      return;
    }
    const result = compareCompanies(formData);
    setComparison(result);
  };

  return (
    <div className="space-y-6">
      {/* 프로 모드 안내 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚀</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">이직 모드 (Pro)</h2>
            <p className="opacity-90">
              현재 회사와 목표 회사를 비교하고, AI가 추천하는 최적의 기업을 찾아보세요
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 현재 회사 */}
        <div className="space-y-4 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-4">🏢 현재 회사</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">회사명</label>
            <input
              type="text"
              value={formData.currentCompany}
              onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="예: A사"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">연봉 (만원)</label>
            <input
              type="number"
              value={formData.currentSalary || ''}
              onChange={(e) => setFormData({ ...formData, currentSalary: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="예: 4200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">업종</label>
            <select
              value={formData.currentIndustry}
              onChange={(e) => setFormData({ ...formData, currentIndustry: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="제조업">제조업</option>
              <option value="IT서비스">IT서비스</option>
              <option value="금융">금융</option>
              <option value="유통">유통</option>
              <option value="건설">건설</option>
              <option value="의료">의료</option>
            </select>
          </div>
        </div>

        {/* 목표 회사 */}
        <div className="space-y-4 p-6 bg-pink-50 rounded-xl border-2 border-pink-200">
          <h3 className="text-xl font-bold text-pink-900 mb-4">🎯 목표 회사</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">회사명</label>
            <input
              type="text"
              value={formData.targetCompany}
              onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none"
              placeholder="예: B사"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">제시 연봉 (만원)</label>
            <input
              type="number"
              value={formData.targetSalary || ''}
              onChange={(e) => setFormData({ ...formData, targetSalary: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none"
              placeholder="예: 5000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">업종</label>
            <select
              value={formData.targetIndustry}
              onChange={(e) => setFormData({ ...formData, targetIndustry: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none"
            >
              <option value="제조업">제조업</option>
              <option value="IT서비스">IT서비스</option>
              <option value="금융">금융</option>
              <option value="유통">유통</option>
              <option value="건설">건설</option>
              <option value="의료">의료</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleCompare}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
      >
        🔍 비교 분석하기
      </button>

      {/* 비교 결과 */}
      {comparison && (
        <div className="space-y-6 mt-8">
          {/* 실수령액 차이 */}
          <div className={`bg-gradient-to-r ${comparison.monthlyDifference >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} rounded-2xl p-8 text-white`}>
            <h3 className="text-xl font-bold mb-4">💰 월 실수령액 차이</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">
                {comparison.monthlyDifference >= 0 ? '+' : ''}
                {comparison.monthlyDifference.toLocaleString()}원
              </span>
              <span className="text-xl opacity-90">/ 월</span>
            </div>
            <p className="mt-3 text-lg opacity-90">
              연간 {comparison.annualDifference >= 0 ? '+' : ''}
              {comparison.annualDifference.toLocaleString()}원 {comparison.monthlyDifference >= 0 ? '증가' : '감소'}
            </p>
          </div>

          {/* 복지·연차 비교 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-4">📅 연차 비교</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">현재 ({formData.currentCompany})</span>
                  <span className="font-bold text-gray-900 text-xl">{comparison.benefits.current.annualLeave}일</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">목표 ({formData.targetCompany})</span>
                  <span className="font-bold text-green-600 text-xl">{comparison.benefits.target.annualLeave}일</span>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  {comparison.benefits.target.annualLeave - comparison.benefits.current.annualLeave >= 0 ? '+' : ''}
                  {comparison.benefits.target.annualLeave - comparison.benefits.current.annualLeave}일 차이
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h4 className="font-bold text-purple-900 mb-4">🎁 복지 포인트</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">현재</span>
                  <span className="font-bold text-gray-900">{(comparison.benefits.current.welfarePoints / 10000).toFixed(0)}만원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">목표</span>
                  <span className="font-bold text-green-600">{(comparison.benefits.target.welfarePoints / 10000).toFixed(0)}만원</span>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  {comparison.benefits.target.welfarePoints - comparison.benefits.current.welfarePoints >= 0 ? '+' : ''}
                  {((comparison.benefits.target.welfarePoints - comparison.benefits.current.welfarePoints) / 10000).toFixed(0)}만원 차이
                </div>
              </div>
            </div>
          </div>

          {/* 기업 문화 매칭률 */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
            <h4 className="font-bold text-purple-900 mb-4">🎯 기업 문화 매칭률</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white rounded-full h-8 overflow-hidden border-2 border-purple-300">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-1000 flex items-center justify-end px-3"
                  style={{ width: `${comparison.cultureFitScore}%` }}
                >
                  <span className="text-white text-sm font-bold">{comparison.cultureFitScore}%</span>
                </div>
              </div>
              <span className="text-3xl font-bold text-purple-900 min-w-[80px] text-right">{comparison.cultureFitScore}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              AI가 분석한 기업 문화 적합도입니다
            </p>
          </div>

          {/* 시간 절약 */}
          {comparison.timeSavedPerYear > 0 && (
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h4 className="font-bold text-green-900 mb-3">⏰ 예상 절약 시간</h4>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-green-600">
                  +{comparison.timeSavedPerYear}시간
                </span>
                <span className="text-gray-600">/ 년</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                업종별 자동화 수준 차이에 따른 예상 시간 절약량
              </p>
            </div>
          )}

          {/* AI 추천 기업 */}
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">🤖 AI 추천 기업 Top 3</h4>
            <div className="space-y-3">
              {comparison.recommendedCompanies.map((company, index) => (
                <div key={index} className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow border-2 border-gray-200 hover:border-purple-300">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{index + 1}.</span>
                      <p className="font-bold text-gray-900">{company.name}</p>
                    </div>
                    <p className="text-sm text-gray-600">{company.industry} · {company.avgSalary}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">매칭률</p>
                    <p className="text-2xl font-bold text-purple-600">{company.matchScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
              📄 상세 리포트 보기
            </button>
            <button 
              onClick={() => {
                const text = `${formData.currentCompany} → ${formData.targetCompany} 이직 시 월 ${comparison.monthlyDifference >= 0 ? '+' : ''}${comparison.monthlyDifference.toLocaleString()}원`;
                navigator.clipboard.writeText(text);
                alert('결과가 복사되었습니다!');
              }}
              className="flex-1 py-4 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              📋 결과 공유
            </button>
          </div>
        </div>
      )}

      {/* 광고 영역 (placeholder) */}
      {comparison && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-8 border-2 border-yellow-300 text-center">
          <p className="text-xs text-gray-500 mb-2">Sponsored</p>
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {formData.targetIndustry} 분야 채용 중 🔥
          </h4>
          <p className="text-gray-700 mb-3">
            지금 지원하면 합격률 2배 ↑
          </p>
          <button className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">
            채용공고 보러가기 →
          </button>
        </div>
      )}
    </div>
  );
}


