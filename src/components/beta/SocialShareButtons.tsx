'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { recordSocialShare, generateShareText, getShareUrl, hasSharedOnPlatform } from '@/lib/beta/social';
import { completeMissionByAction } from '@/lib/beta/missions';
import type { SocialPlatform } from '@/types/beta';
import { SOCIAL_SHARE_REWARDS } from '@/types/beta';

interface SocialShareButtonsProps {
  betaNumber?: number;
  onShareComplete?: () => void;
}

export default function SocialShareButtons({
  betaNumber,
  onShareComplete,
}: SocialShareButtonsProps) {
  const { user } = useAuthStore();
  const [sharedPlatforms, setSharedPlatforms] = useState<Set<SocialPlatform>>(
    new Set()
  );
  const [isChecking, setIsChecking] = useState(false);

  // 초기 공유 상태 확인
  useState(() => {
    if (user) {
      checkSharedPlatforms();
    }
  });

  const checkSharedPlatforms = async () => {
    if (!user) return;

    setIsChecking(true);
    try {
      const platforms: SocialPlatform[] = ['twitter', 'facebook', 'kakao', 'blog'];
      const shared = new Set<SocialPlatform>();

      for (const platform of platforms) {
        const hasShared = await hasSharedOnPlatform(user.id, platform);
        if (hasShared) {
          shared.add(platform);
        }
      }

      setSharedPlatforms(shared);
    } catch (error) {
      console.error('공유 상태 확인 실패:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleShare = async (platform: SocialPlatform) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (sharedPlatforms.has(platform)) {
      alert('이미 이 플랫폼에 공유하셨습니다.');
      return;
    }

    const shareText = generateShareText(betaNumber);
    const shareUrl = getShareUrl(platform, shareText);

    if (platform === 'blog') {
      // 블로그는 URL 입력받기
      const blogUrl = prompt(
        '블로그 게시글 URL을 입력해주세요:\n\n(공유 후 크레딧이 지급됩니다)'
      );
      
      if (!blogUrl) return;

      try {
        const result = await recordSocialShare(user.id, platform, blogUrl);
        
        if (result.success) {
          // 미션 완료 (첫 공유)
          if (sharedPlatforms.size === 0) {
            await completeMissionByAction(user.id, 'social_share');
          }

          alert(`✅ ${result.message}`);
          setSharedPlatforms(new Set([...sharedPlatforms, platform]));
          onShareComplete?.();
        } else {
          alert(result.message);
        }
      } catch (error: any) {
        console.error('공유 기록 실패:', error);
        alert('공유 기록에 실패했습니다.');
      }
      return;
    }

    if (platform === 'kakao') {
      alert('카카오톡 공유 기능은 준비 중입니다.');
      return;
    }

    // 다른 플랫폼은 새 창으로 열기
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      shareUrl,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // 공유 확인
    setTimeout(async () => {
      const confirmed = confirm(
        '공유를 완료하셨나요?\n\n공유를 완료하셨다면 "확인"을 눌러주세요.'
      );

      if (confirmed) {
        try {
          const result = await recordSocialShare(user.id, platform);
          
          if (result.success) {
            // 미션 완료 (첫 공유)
            if (sharedPlatforms.size === 0) {
              await completeMissionByAction(user.id, 'social_share');
            }

            alert(`✅ ${result.message}`);
            setSharedPlatforms(new Set([...sharedPlatforms, platform]));
            onShareComplete?.();
          } else {
            alert(result.message);
          }
        } catch (error: any) {
          console.error('공유 기록 실패:', error);
          alert('공유 기록에 실패했습니다.');
        }
      }
    }, 3000);
  };

  if (isChecking) {
    return (
      <div className="text-center text-gray-500">
        공유 상태 확인 중...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">
        📢 SNS 공유하고 크레딧 받기
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* 트위터 */}
        <button
          onClick={() => handleShare('twitter')}
          disabled={sharedPlatforms.has('twitter')}
          className={`flex items-center justify-between p-4 rounded-xl font-semibold transition-all ${
            sharedPlatforms.has('twitter')
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl">🐦</span>
            <span>트위터</span>
          </span>
          {sharedPlatforms.has('twitter') ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +{SOCIAL_SHARE_REWARDS.twitter}
            </span>
          )}
        </button>

        {/* 페이스북 */}
        <button
          onClick={() => handleShare('facebook')}
          disabled={sharedPlatforms.has('facebook')}
          className={`flex items-center justify-between p-4 rounded-xl font-semibold transition-all ${
            sharedPlatforms.has('facebook')
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl">📘</span>
            <span>페이스북</span>
          </span>
          {sharedPlatforms.has('facebook') ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +{SOCIAL_SHARE_REWARDS.facebook}
            </span>
          )}
        </button>

        {/* 카카오톡 */}
        <button
          onClick={() => handleShare('kakao')}
          disabled={sharedPlatforms.has('kakao')}
          className={`flex items-center justify-between p-4 rounded-xl font-semibold transition-all ${
            sharedPlatforms.has('kakao')
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 hover:shadow-lg hover:scale-105'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span>카카오톡</span>
          </span>
          {sharedPlatforms.has('kakao') ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
              +{SOCIAL_SHARE_REWARDS.kakao}
            </span>
          )}
        </button>

        {/* 블로그 */}
        <button
          onClick={() => handleShare('blog')}
          disabled={sharedPlatforms.has('blog')}
          className={`flex items-center justify-between p-4 rounded-xl font-semibold transition-all ${
            sharedPlatforms.has('blog')
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span>블로그</span>
          </span>
          {sharedPlatforms.has('blog') ? (
            <span className="text-green-500">✓</span>
          ) : (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +{SOCIAL_SHARE_REWARDS.blog}
            </span>
          )}
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800 text-sm">
        <p className="text-blue-800 dark:text-blue-300">
          💡 <strong>각 플랫폼당 1회씩</strong> 공유 가능합니다.
          <br />
          총 <strong>{Object.values(SOCIAL_SHARE_REWARDS).reduce((a, b) => a + b, 0)} 크레딧</strong>까지 받을 수 있어요!
        </p>
      </div>
    </div>
  );
}

