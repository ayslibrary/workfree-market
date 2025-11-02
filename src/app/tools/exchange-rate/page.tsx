"use client";

import { useState } from "react";
import Link from "next/link";
import MainNavigation from "@/components/MainNavigation";
import { FadeIn } from "@/components/animations";

interface ExchangeRate {
  currency: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  flag: string;
}

const CURRENCIES = [
  { code: "USD", name: "미국 달러", flag: "🇺🇸" },
  { code: "EUR", name: "유로", flag: "🇪🇺" },
  { code: "JPY", name: "일본 엔", flag: "🇯🇵" },
  { code: "CNY", name: "중국 위안", flag: "🇨🇳" },
  { code: "GBP", name: "영국 파운드", flag: "🇬🇧" },
  { code: "AUD", name: "호주 달러", flag: "🇦🇺" },
  { code: "CAD", name: "캐나다 달러", flag: "🇨🇦" },
  { code: "CHF", name: "스위스 프랑", flag: "🇨🇭" },
  { code: "HKD", name: "홍콩 달러", flag: "🇭🇰" },
  { code: "SGD", name: "싱가포르 달러", flag: "🇸🇬" },
];

export default function ExchangeRatePage() {
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(["USD", "EUR", "JPY", "CNY"]);
  const [emailList, setEmailList] = useState("");
  const [sendTime, setSendTime] = useState("09:00");
  const [includeBokReference, setIncludeBokReference] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<ExchangeRate[]>([]);

  const handleCurrencyToggle = (currency: string) => {
    setSelectedCurrencies(prev => 
      prev.includes(currency) 
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };

  const handlePreview = async () => {
    if (selectedCurrencies.length === 0) {
      setError("최소 1개 통화를 선택해주세요");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/exchange-rate/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currencies: selectedCurrencies,
          includeBokReference: includeBokReference 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "환율 조회 실패");
      }

      const data = await response.json();
      setPreviewData(data.rates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "환율 조회 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async () => {
    if (selectedCurrencies.length === 0) {
      setError("최소 1개 통화를 선택해주세요");
      return;
    }

    if (!emailList.trim()) {
      setError("이메일 목록을 입력해주세요");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/exchange-rate/send-real", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currencies: selectedCurrencies,
          emails: emailList.split('\n').map(email => email.trim()).filter(email => email),
          includeBokReference: includeBokReference
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "이메일 발송 실패");
      }

      const data = await response.json();
      setSuccess(true);
      alert(`✅ 이메일이 성공적으로 발송되었습니다!\n\n발송 대상: ${data.details.emailCount}명\n통화: ${data.details.currencies.join(', ')}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이메일 발송 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    if (selectedCurrencies.length === 0) {
      setError("최소 1개 통화를 선택해주세요");
      return;
    }

    if (!emailList.trim()) {
      setError("이메일 목록을 입력해주세요");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/exchange-rate/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currencies: selectedCurrencies,
          emails: emailList.split('\n').map(email => email.trim()).filter(email => email),
          sendTime,
          includeBokReference: includeBokReference
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "설정 실패");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "설정 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      <MainNavigation />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 pt-24 md:pt-20">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link
                href="/tools"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                ← 도구 목록으로
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              💱 WorkFree 환율 자동 공유
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              매일 아침 서울외환중개 매매기준율을 전사원에게 자동 발송
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              서울외환중개 매매기준율 기준 | 한국은행 환율 참고
            </p>
          </div>
        </FadeIn>

        {/* 설정 폼 */}
        <FadeIn delay={0.1}>
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span>⚙️</span>
                <span>매매기준율 자동화 설정</span>
              </h2>

              {/* 통화 선택 */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  📊 매매기준율 공유할 통화 선택 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {CURRENCIES.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencyToggle(currency.code)}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-left
                        ${selectedCurrencies.includes(currency.code)
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{currency.flag}</span>
                        <span className="font-bold text-sm">{currency.code}</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {currency.name}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  선택된 통화: {selectedCurrencies.length}개 (서울외환중개 매매기준율 기준)
                </p>
              </div>

              {/* 이메일 목록 */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  📧 전사원 이메일 목록 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                  placeholder="이메일을 한 줄에 하나씩 입력하세요&#10;예:&#10;user1@company.com&#10;user2@company.com&#10;user3@company.com"
                  className="w-full h-32 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white resize-none"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  각 이메일을 새 줄로 구분하여 입력하세요
                </p>
              </div>

              {/* 발송 시간 */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  ⏰ 발송 시간 설정
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="time"
                    value={sendTime}
                    onChange={(e) => setSendTime(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                    disabled={loading}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    매일 이 시간에 자동 발송됩니다
                  </span>
                </div>
              </div>

              {/* 한국은행 참고 정보 포함 여부 */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  📊 이메일 내용 설정
                </label>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="includeBokReference"
                      checked={includeBokReference}
                      onChange={(e) => setIncludeBokReference(e.target.checked)}
                      className="mt-1 h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      disabled={loading}
                    />
                    <div>
                      <label htmlFor="includeBokReference" className="text-base font-medium text-gray-900 dark:text-white cursor-pointer">
                        한국은행 환율 참고 정보 포함
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        이메일에 "참고: 한국은행 환율 1,351.90" 형태로 추가 정보를 포함합니다
                      </p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <strong>기본:</strong> 서울외환중개 매매기준율만 표시<br/>
                        <strong>포함 시:</strong> 서울외환중개 + 한국은행 환율 비교
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 미리보기 버튼 */}
              <div className="mb-6">
                <button
                  onClick={handlePreview}
                  disabled={selectedCurrencies.length === 0 || loading}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg transition-all mb-4
                    ${selectedCurrencies.length === 0 || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      환율 조회 중...
                    </span>
                  ) : (
                    "👀 미리보기 보기"
                  )}
                </button>
              </div>

              {/* 즉시 발송 버튼 */}
              <button
                onClick={handleSendNow}
                disabled={selectedCurrencies.length === 0 || !emailList.trim() || loading}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg transition-all mb-4
                  ${selectedCurrencies.length === 0 || !emailList.trim() || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:scale-[1.02]'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    발송 중...
                  </span>
                ) : (
                  "📧 지금 바로 발송하기"
                )}
              </button>

              {/* 설정 완료 버튼 */}
              <button
                onClick={handleSetup}
                disabled={selectedCurrencies.length === 0 || !emailList.trim() || loading}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg transition-all
                  ${selectedCurrencies.length === 0 || !emailList.trim() || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02]'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    설정 중...
                  </span>
                ) : (
                  "🚀 자동화 설정 완료"
                )}
              </button>

              {/* 에러 메시지 */}
              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              {/* 성공 메시지 */}
              {success && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl">
                  ✅ 환율 자동화가 설정되었습니다! 매일 {sendTime}에 전사원에게 발송됩니다.
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 미리보기 결과 */}
        {previewData.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="max-w-5xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                  <span>📊</span>
                  <span>매매기준율 미리보기</span>
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-2 font-bold text-gray-900 dark:text-white">통화</th>
                        <th className="text-right py-4 px-2 font-bold text-gray-900 dark:text-white">매매기준율</th>
                        <th className="text-right py-4 px-2 font-bold text-gray-900 dark:text-white">변동</th>
                        <th className="text-right py-4 px-2 font-bold text-gray-900 dark:text-white">변동률</th>
                        {includeBokReference && (
                          <th className="text-right py-4 px-2 font-bold text-gray-900 dark:text-white">한국은행</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((rate) => (
                        <tr key={rate.currency} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{rate.flag}</span>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white">{rate.currency}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{rate.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-4 px-2 font-bold text-lg text-gray-900 dark:text-white">
                            {rate.rate.toLocaleString()}원
                          </td>
                          <td className="text-right py-4 px-2">
                            <span className={`font-bold ${rate.change >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                              {rate.change >= 0 ? '+' : ''}{rate.change.toFixed(2)}원
                            </span>
                          </td>
                          <td className="text-right py-4 px-2">
                            <span className={`font-bold ${rate.changePercent >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                              {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                            </span>
                          </td>
                          {includeBokReference && (
                            <td className="text-right py-4 px-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {(rate as any).bokRate?.toLocaleString() || 'N/A'}원
                              </span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* 주요 기능 */}
        <FadeIn delay={0.25}>
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                주요 기능
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🌍 실시간 환율 데이터 (한국은행 기준)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>⏰ 매일 정해진 시간 자동 발송</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📊 이전일 대비 변동률 표시</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📧 예쁜 HTML 이메일 템플릿</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🎯 원하는 통화만 선택 가능</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* 실무 활용 */}
        <FadeIn delay={0.3}>
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-8 border-2 border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💼</span>
                이런 분들이 사용해요
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <span className="font-semibold">재무팀</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    매일 환율 모니터링 / 외화 거래
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    <span className="font-semibold">해외영업팀</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    수출입 가격 산정 / 고객 견적
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span className="font-semibold">경영진</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    시장 동향 파악 / 의사결정
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">✈️</span>
                    <span className="font-semibold">출장자</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    출장비 환산 / 현지 지출
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
