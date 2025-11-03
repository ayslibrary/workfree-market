'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getReferralStats, generateReferralLink } from '@/lib/referral';
import toast from 'react-hot-toast';

export default function ReferralPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({
    referralCode: '',
    referredCount: 0,
    creditsEarned: 0,
    referredUsers: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadReferralStats();
  }, [user]);

  const loadReferralStats = async () => {
    if (!user?.uid) return;

    try {
      const data = await getReferralStats(user.uid);
      setStats(data);
    } catch (error) {
      console.error('추천 통계 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const referralLink = stats.referralCode 
    ? generateReferralLink(stats.referralCode) 
    : '';

  // 링크 복사
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('링크가 복사되었습니다!');
    setTimeout(() => setCopied(false), 2000);
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    if (typeof window === 'undefined' || !(window as any).Kakao) {
      toast.error('카카오톡 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const Kakao = (window as any).Kakao;
    
    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }

    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '🎁 Fri Manual Bot 무료 체험 초대',
        description: `${user?.displayName || '친구'}님이 당신을 초대했어요!\n\n매뉴얼 검색 30분 → 2분으로 단축\n지금 가입하면 양쪽 모두 10 크레딧 증정!`,
        imageUrl: 'https://workfreemarket.com/og-copilot.png',
        link: {
          mobileWebUrl: referralLink,
          webUrl: referralLink,
        },
      },
      buttons: [
        {
          title: '무료로 시작하기',
          link: {
            mobileWebUrl: referralLink,
            webUrl: referralLink,
          },
        },
      ],
    });

    toast.success('카카오톡 공유하기 열렸습니다!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎁 친구 초대하고 크레딧 받기
          </h1>
          <p className="text-gray-600">
            친구가 가입하면 <span className="font-bold text-indigo-600">둘 다 10 크레딧</span>을 받아요!
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-100">
            <div className="text-sm text-gray-600 mb-1">내 추천 코드</div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {stats.referralCode || '---'}
            </div>
            <div className="text-xs text-gray-500">친구에게 공유하세요</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
            <div className="text-sm text-gray-600 mb-1">초대한 친구</div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.referredCount}명
            </div>
            <div className="text-xs text-gray-500">지금까지 초대 성공!</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100">
            <div className="text-sm text-gray-600 mb-1">받은 크레딧</div>
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {stats.creditsEarned}개
            </div>
            <div className="text-xs text-gray-500">추천 보상으로 획득</div>
          </div>
        </div>

        {/* 공유 섹션 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">친구 초대 링크</h2>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-transparent text-white font-mono text-sm mr-4 outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* 카카오톡 */}
            <button
              onClick={handleKakaoShare}
              className="flex-1 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-2xl">💬</span>
              <span>카카오톡 공유</span>
            </button>

            {/* 페이스북 */}
            <button
              onClick={() => {
                const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
                window.open(fbUrl, '_blank', 'width=600,height=400');
              }}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-xl">📘</span>
              <span>페이스북</span>
            </button>

            {/* 트위터 */}
            <button
              onClick={() => {
                const tweetText = `Fri Manual Bot으로 매뉴얼 검색 시간 90% 단축! 지금 가입하면 10 크레딧 무료 증정 🎁`;
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(referralLink)}`;
                window.open(twitterUrl, '_blank', 'width=600,height=400');
              }}
              className="flex-1 bg-sky-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-600 transition-colors flex items-center justify-center space-x-2"
            >
              <span className="text-xl">🐦</span>
              <span>트위터</span>
            </button>
          </div>
        </div>

        {/* 어떻게 작동하나요? */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 어떻게 작동하나요?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600">1</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">친구에게 링크 공유</h3>
                <p className="text-gray-600 text-sm">
                  카카오톡, 페이스북, 트위터 등으로 초대 링크를 공유하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">친구가 가입</h3>
                <p className="text-gray-600 text-sm">
                  친구가 링크를 클릭해 회원가입하면 자동으로 추천 관계가 설정됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-pink-600">3</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">둘 다 10 크레딧 획득!</h3>
                <p className="text-gray-600 text-sm">
                  친구 가입이 완료되면 여러분과 친구 모두 10 크레딧을 즉시 받습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold">💰 추가 보너스:</span> 친구가 처음 결제하면 추가로 50 크레딧을 받아요!
            </p>
          </div>
        </div>

        {/* 초대한 친구 목록 (향후 구현) */}
        {stats.referredCount > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🎉 초대한 친구 ({stats.referredCount}명)
            </h2>
            <div className="text-gray-600 text-center py-8">
              친구 목록 기능은 곧 업데이트됩니다!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

