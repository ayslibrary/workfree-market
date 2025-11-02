"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { CreditRewardPopup, CreditDisplay } from "@/components/beta/CreditDisplay";
import { CREDIT_REWARDS, TOOL_CREDIT_COSTS } from "@/types/beta-onboarding";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BetaFeedbackPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    usageCount: 0,
    usageCountConfirmed: true,
    top3Tools: [] as string[],
    purchaseIntention: '',
    maxMonthlyPayment: 0,
    npsScore: 5,
    comment: '',
  });

  const tools = [
    { id: 'blog-generator', name: '블로그 생성기', icon: '✍️' },
    { id: 'image-search', name: '이미지 검색', icon: '🔍' },
    { id: 'qr-generator', name: 'QR 코드 생성', icon: '📱' },
    { id: 'report-generator', name: '보고서 생성기', icon: '📊' },
    { id: 'email-automation', name: '메일 자동화', icon: '📧' },
  ];

  const handleToolSelect = (toolId: string) => {
    if (formData.top3Tools.includes(toolId)) {
      setFormData({
        ...formData,
        top3Tools: formData.top3Tools.filter(id => id !== toolId),
      });
    } else if (formData.top3Tools.length < 3) {
      setFormData({
        ...formData,
        top3Tools: [...formData.top3Tools, toolId],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Firebase에 저장
      await addDoc(collection(db, "beta_final_feedback"), {
        userId: user?.uid,
        ...formData,
        submittedAt: new Date(),
      });

      setSubmitted(true);
      setShowRewardPopup(true);

      // TODO: 실제로는 사용자 크레딧 잔액 업데이트
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="text-8xl mb-6">🎊</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            피드백 제출 완료!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            1주일간의 베타 테스트 여정을 완주하셨어요!
          </p>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
            <div className="text-sm text-gray-600 mb-2">획득 크레딧</div>
            <CreditDisplay
              amount={CREDIT_REWARDS.FINAL_FEEDBACK}
              showValue={true}
              size="lg"
              className="text-indigo-600 text-3xl"
            />
          </div>

          <div className="space-y-4">
            <Link
              href="/beta/missions"
              className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              미션 대시보드로 가기
            </Link>
            <Link
              href="/tools"
              className="block bg-gray-200 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
            >
              도구 계속 사용하기
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            🙏 소중한 피드백 감사합니다!<br />
            정식 런칭 시 우선 안내드릴게요.
          </div>
        </div>

        {showRewardPopup && (
          <CreditRewardPopup
            amount={CREDIT_REWARDS.FINAL_FEEDBACK}
            reason="최종 피드백 완료!"
            onClose={() => setShowRewardPopup(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/beta/missions" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">W</span>
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                최종 피드백
              </div>
            </Link>
            <div className="text-sm text-gray-600">
              Day 7 미션
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            1주일 체험 어땠나요?
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            마지막 3가지 질문만 답해주세요 (3분 소요)
          </p>
          <div className="inline-block bg-indigo-100 px-6 py-3 rounded-full">
            <CreditDisplay
              amount={CREDIT_REWARDS.FINAL_FEEDBACK}
              showValue={true}
              size="md"
              className="text-indigo-600 font-bold"
            />
            <span className="text-indigo-600"> 획득!</span>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          {/* 1. 사용 횟수 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              1️⃣ 이번 주 사용 횟수
            </label>
            <div className="bg-indigo-50 rounded-xl p-6 mb-4">
              <div className="text-sm text-gray-600 mb-2">자동 계산된 횟수</div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {formData.usageCount}회
              </div>
              <div className="text-sm text-gray-600">
                베타 기간 동안 도구를 사용한 횟수입니다
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="usageConfirm"
                checked={formData.usageCountConfirmed}
                onChange={(e) => setFormData({ ...formData, usageCountConfirmed: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <label htmlFor="usageConfirm" className="text-gray-700">
                맞아요 👍
              </label>
            </div>
            {!formData.usageCountConfirmed && (
              <div className="mt-4">
                <input
                  type="number"
                  min="0"
                  value={formData.usageCount}
                  onChange={(e) => setFormData({ ...formData, usageCount: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  placeholder="실제 사용 횟수를 입력해주세요"
                />
              </div>
            )}
          </div>

          {/* 2. TOP 3 도구 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              2️⃣ 가장 유용했던 도구 TOP 3
            </label>
            <p className="text-sm text-gray-600 mb-4">
              드래그로 순위를 정해주세요 (최대 3개)
            </p>
            <div className="space-y-3">
              {tools.map((tool) => {
                const isSelected = formData.top3Tools.includes(tool.id);
                const rank = formData.top3Tools.indexOf(tool.id) + 1;
                
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleToolSelect(tool.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{tool.icon}</div>
                        <div className="font-semibold text-gray-900">{tool.name}</div>
                      </div>
                      {isSelected && (
                        <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {rank}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-sm text-gray-500 text-center">
              {formData.top3Tools.length}/3 선택됨
            </div>
          </div>

          {/* 3. 구매 의향 */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              3️⃣ 정식 런칭하면 구매 의향이 있으신가요?
            </label>
            <div className="space-y-3">
              {[
                { value: 'buy_now', label: '바로 구매할게요', emoji: '💳', discount: '얼리버드 20% 할인' },
                { value: 'consider', label: '조금 더 고민해볼게요', emoji: '🤔', discount: null },
                { value: 'check_price', label: '가격 보고 판단할게요', emoji: '💰', discount: null },
                { value: 'free_only', label: '무료면 쓸게요', emoji: '🆓', discount: null },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, purchaseIntention: option.value })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.purchaseIntention === option.value
                      ? 'bg-indigo-50 border-indigo-300 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{option.emoji}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        {option.discount && (
                          <div className="text-sm text-indigo-600">{option.discount}</div>
                        )}
                      </div>
                    </div>
                    {formData.purchaseIntention === option.value && (
                      <div className="text-2xl">✅</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 추가 질문: 가격 */}
            {(formData.purchaseIntention === 'buy_now' || formData.purchaseIntention === 'check_price') && (
              <div className="mt-6 bg-gray-50 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  월 얼마까지 지불 가능하신가요?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3000, 5000, 10000, 20000, 30000, 50000].map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setFormData({ ...formData, maxMonthlyPayment: price })}
                      className={`py-3 rounded-xl font-semibold transition-all ${
                        formData.maxMonthlyPayment === price
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {price >= 10000 ? `${price / 10000}만원` : `${price.toLocaleString()}원`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. NPS */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              4️⃣ 최종 평가 (NPS)
            </label>
            <p className="text-sm text-gray-600 mb-4">
              동료에게 WorkFree를 추천하시겠어요?
            </p>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">전혀 추천 안함</span>
                <span className="text-sm text-gray-600">적극 추천</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.npsScore}
                onChange={(e) => setFormData({ ...formData, npsScore: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center mt-4">
                <div className="text-5xl font-bold text-indigo-600">{formData.npsScore}</div>
                <div className="text-sm text-gray-600 mt-1">/ 10</div>
              </div>
            </div>
          </div>

          {/* 5. 한 줄 평가 (선택) */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4">
              5️⃣ 한 줄 평가 (선택사항)
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              placeholder="자유롭게 의견을 남겨주세요..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
            />
            <div className="text-sm text-gray-500 mt-2">
              {formData.comment.length}자
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting || formData.top3Tools.length === 0 || !formData.purchaseIntention}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '제출 중...' : `제출하고 ${formatCredits(CREDIT_REWARDS.FINAL_FEEDBACK).formatted} 받기 →`}
          </button>

          <div className="text-center text-sm text-gray-500">
            제출 후 크레딧이 즉시 지급됩니다
          </div>
        </form>
      </div>
    </div>
  );
}

function formatCredits(amount: number) {
  return {
    formatted: `크레딧 ${amount}개`,
    withValue: `크레딧 ${amount}개 (${(amount * 1000).toLocaleString()}원 상당)`,
  };
}

