import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SocialShare, SocialPlatform } from '@/types/beta';
import { SOCIAL_SHARE_REWARDS } from '@/types/beta';

const SOCIAL_SHARES_COLLECTION = 'beta_social_shares';

// SNS 공유 기록
export async function recordSocialShare(
  userId: string,
  platform: SocialPlatform,
  url?: string
): Promise<{ success: boolean; credits: number; message: string }> {
  // 이미 해당 플랫폼에 공유했는지 확인
  const existingShare = await hasSharedOnPlatform(userId, platform);
  
  if (existingShare) {
    return {
      success: false,
      credits: 0,
      message: '이미 이 플랫폼에 공유하셨습니다.',
    };
  }

  // 공유 기록 저장
  const credits = SOCIAL_SHARE_REWARDS[platform];
  
  await addDoc(collection(db, SOCIAL_SHARES_COLLECTION), {
    userId,
    platform,
    sharedAt: Timestamp.now(),
    creditsAwarded: credits,
    url: url || null,
  });

  return {
    success: true,
    credits,
    message: `${credits} 크레딧이 지급되었습니다!`,
  };
}

// 특정 플랫폼에 공유했는지 확인
export async function hasSharedOnPlatform(
  userId: string,
  platform: SocialPlatform
): Promise<boolean> {
  const q = query(
    collection(db, SOCIAL_SHARES_COLLECTION),
    where('userId', '==', userId),
    where('platform', '==', platform)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// 사용자의 모든 공유 기록
export async function getUserShares(userId: string): Promise<SocialShare[]> {
  const q = query(
    collection(db, SOCIAL_SHARES_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as SocialShare));
}

// 총 공유 크레딧 계산
export async function getTotalShareCredits(userId: string): Promise<number> {
  const shares = await getUserShares(userId);
  return shares.reduce((total, share) => total + share.creditsAwarded, 0);
}

// 공유 URL 생성
export function generateShareText(betaNumber?: number): string {
  const text = betaNumber
    ? `WorkFree 베타테스터 #${betaNumber}로 참여 중! 지금까지 많은 시간을 절약했어요 ⏱️\n\n직장인을 위한 AI 자동화 스튜디오 WorkFree를 경험해보세요!\n\n#WorkFree #자동화 #시간절약 #베타테스터`
    : `WorkFree로 업무 자동화하고 시간을 절약하세요! ⏱️\n\n직장인을 위한 AI 자동화 스튜디오\n\n#WorkFree #자동화 #시간절약`;

  return text;
}

// 플랫폼별 공유 URL 생성
export function getShareUrl(
  platform: SocialPlatform,
  shareText: string,
  url: string = 'https://workfree.market'
): string {
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    case 'kakao':
      // 카카오톡은 JavaScript SDK 사용 필요
      return '#kakao';
    case 'blog':
      return '#blog';
    default:
      return url;
  }
}


