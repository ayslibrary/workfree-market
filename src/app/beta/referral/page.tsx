"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { CreditRewardPopup, CreditDisplay } from "@/components/beta/CreditDisplay";
import { CREDIT_REWARDS } from "@/types/beta-onboarding";

export default function BetaReferralPage() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("BETA-" + (user?.uid?.slice(0, 8) || "XXXX"));
  const [showCopied, setShowCopied] = useState(false);
  const [referredFriends, setReferredFriends] = useState<string[]>([]);
  const [showRewardPopup, setShowRewardPopup] = useState(false);

  const referralLink = `https://workfree.app/beta?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const shareToKakao = () => {
    alert("카카오톡 공유 기능은 곧 추가됩니다!");
  };

  const shareToTwitter = () => {
    const text = `WorkFree 베타 테스터 신청하고 크레딧 10개 받아가세요! 무료로 AI 자동화 도구 사용하는 기회 🎁`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

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
                친구 초대
              </div>
            </Link>
            <Link
              href="/beta/missions"
              className="text-gray-600 hover:text-gray-900 font-semibold"
            >
              ← 미션으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">👥</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            친구 초대하고<br />같이 크레딧 받아요!
          </h1>
          <p className="text-lg text-gray-600">
            친구가 가입하면 양쪽 모두 크레딧을 받아요
          </p>
        </div>

        {/* 보상 안내 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-8 border-2 border-indigo-200">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">
              나는
            </h3>
            <div className="mb-4">
              <CreditDisplay
                amount={CREDIT_REWARDS.REFERRAL}
                showValue={true}
                size="lg"
                className="text-indigo-600"
              />
            </div>
            <p className="text-gray-700">
              친구가 가입하면 즉시 지급!
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border-2 border-purple-200">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-2xl font-bold text-purple-900 mb-2">
              친구는
            </h3>
            <div className="mb-4">
              <CreditDisplay
                amount={CREDIT_REWARDS.REFERRAL_FRIEND}
                showValue={true}
                size="lg"
                className="text-purple-600"
              />
            </div>
            <p className="text-gray-700">
              가입 즉시 보너스 크레딧 지급!
            </p>
          </div>
        </div>

        {/* 초대 링크 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🔗 내 초대 링크
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              초대 코드
            </label>
            <div className="bg-gray-100 px-4 py-3 rounded-xl text-center">
              <div className="text-2xl font-bold text-indigo-600 tracking-wider">
                {referralCode}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              초대 링크
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-gray-800 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all whitespace-nowrap"
              >
                {showCopied ? '✅ 복사됨!' : '📋 복사'}
              </button>
            </div>
          </div>

          {/* 공유 버튼 */}
          <div className="space-y-3">
            <button
              onClick={shareToKakao}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">💬</span>
              카카오톡으로 공유하기
            </button>
            
            <button
              onClick={shareToTwitter}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🐦</span>
              트위터로 공유하기
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'WorkFree 베타 테스트 초대',
                    text: 'WorkFree 베타 테스터 신청하고 크레딧 10개 받아가세요!',
                    url: referralLink,
                  });
                } else {
                  copyToClipboard();
                }
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📤</span>
              다른 방법으로 공유하기
            </button>
          </div>
        </div>

        {/* 초대한 친구 목록 */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            👨‍👩‍👧‍👦 초대한 친구 ({referredFriends.length}명)
          </h2>

          {referredFriends.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">
                아직 초대한 친구가 없어요
              </p>
              <p className="text-gray-500 text-sm mt-2">
                위의 링크를 공유해보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {referredFriends.map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                      {friend.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{friend}</div>
                      <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('ko-KR')} 가입
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ✅ 완료
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
          <h3 className="font-bold text-gray-900 mb-3">📌 주의사항</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>친구가 초대 링크를 통해 가입해야 크레딧이 지급됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>가입 즉시 양쪽 모두 크레딧이 자동 지급됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>최대 10명까지 초대 가능합니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600">•</span>
              <span>부정한 방법으로 초대한 경우 크레딧이 회수될 수 있습니다</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 보상 팝업 */}
      {showRewardPopup && (
        <CreditRewardPopup
          amount={CREDIT_REWARDS.REFERRAL}
          reason="친구 초대 성공!"
          onClose={() => setShowRewardPopup(false)}
        />
      )}
    </div>
  );
}

