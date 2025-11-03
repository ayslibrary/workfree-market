// 추천인 시스템 (Viral Marketing)

import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  updateDoc,
  increment,
  serverTimestamp 
} from 'firebase/firestore';

export interface ReferralData {
  userId: string;
  referralCode: string;
  referredBy?: string; // 누가 추천했는지
  referredUsers: string[]; // 내가 추천한 사람들
  creditsEarned: number; // 추천으로 받은 크레딧
  createdAt: Date;
}

// 고유한 추천 코드 생성 (6자리 영숫자)
export function generateReferralCode(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const code = Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
  return code.padEnd(6, '0');
}

// 사용자 추천 데이터 초기화
export async function initializeReferral(userId: string): Promise<string> {
  if (!db) throw new Error('Firebase not initialized');

  const referralCode = generateReferralCode(userId);
  const referralRef = doc(db, 'referrals', userId);

  await setDoc(referralRef, {
    userId,
    referralCode,
    referredUsers: [],
    creditsEarned: 0,
    createdAt: serverTimestamp(),
  });

  return referralCode;
}

// 추천 코드로 사용자 찾기
export async function findUserByReferralCode(referralCode: string): Promise<string | null> {
  if (!db) return null;

  const referralsRef = collection(db, 'referrals');
  const q = query(referralsRef, where('referralCode', '==', referralCode.toUpperCase()));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs[0].data().userId;
}

// 추천인 관계 설정 (회원가입 시 호출)
export async function setReferrer(
  newUserId: string, 
  referralCode: string
): Promise<{ success: boolean; referrerId?: string }> {
  if (!db) throw new Error('Firebase not initialized');

  // 1. 추천 코드로 추천인 찾기
  const referrerId = await findUserByReferralCode(referralCode);
  
  if (!referrerId) {
    return { success: false };
  }

  // 2. 새 사용자의 추천 데이터 생성
  const newUserCode = generateReferralCode(newUserId);
  await setDoc(doc(db, 'referrals', newUserId), {
    userId: newUserId,
    referralCode: newUserCode,
    referredBy: referrerId,
    referredUsers: [],
    creditsEarned: 0,
    createdAt: serverTimestamp(),
  });

  // 3. 추천인의 referredUsers 배열에 추가
  const referrerRef = doc(db, 'referrals', referrerId);
  const referrerDoc = await getDoc(referrerRef);
  
  if (referrerDoc.exists()) {
    const currentReferred = referrerDoc.data().referredUsers || [];
    await updateDoc(referrerRef, {
      referredUsers: [...currentReferred, newUserId],
    });
  }

  // 4. 추천 이벤트 로그
  await logReferralEvent(referrerId, newUserId, 'signup');

  return { success: true, referrerId };
}

// 추천 보상 지급
export async function grantReferralReward(
  referrerId: string,
  newUserId: string,
  rewardType: 'signup' | 'first_purchase' = 'signup'
): Promise<void> {
  if (!db) return;

  const rewards = {
    signup: 10, // 회원가입: 양쪽 모두 10 크레딧
    first_purchase: 50, // 첫 구매: 추천인 50 크레딧
  };

  const creditAmount = rewards[rewardType];

  // 추천인에게 크레딧 지급
  const referrerRef = doc(db, 'referrals', referrerId);
  await updateDoc(referrerRef, {
    creditsEarned: increment(creditAmount),
  });

  // 실제 크레딧 시스템에 반영 (기존 credits.ts 사용)
  const creditsRef = doc(db, 'credits', referrerId);
  const creditsDoc = await getDoc(creditsRef);

  if (creditsDoc.exists()) {
    await updateDoc(creditsRef, {
      balance: increment(creditAmount),
      lastUpdated: serverTimestamp(),
    });
  } else {
    await setDoc(creditsRef, {
      userId: referrerId,
      balance: creditAmount,
      lastUpdated: serverTimestamp(),
    });
  }

  // 추천받은 사용자도 가입 보상 (회원가입일 경우만)
  if (rewardType === 'signup') {
    const newUserCreditsRef = doc(db, 'credits', newUserId);
    const newUserCreditsDoc = await getDoc(newUserCreditsRef);

    if (newUserCreditsDoc.exists()) {
      await updateDoc(newUserCreditsRef, {
        balance: increment(creditAmount),
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(newUserCreditsRef, {
        userId: newUserId,
        balance: creditAmount,
        lastUpdated: serverTimestamp(),
      });
    }
  }

  // 보상 이벤트 로그
  await logReferralEvent(referrerId, newUserId, rewardType);
}

// 추천 이벤트 로그
async function logReferralEvent(
  referrerId: string,
  referredUserId: string,
  eventType: 'signup' | 'first_purchase'
): Promise<void> {
  if (!db) return;

  const eventId = `${referrerId}_${referredUserId}_${eventType}_${Date.now()}`;
  await setDoc(doc(db, 'referral_events', eventId), {
    referrerId,
    referredUserId,
    eventType,
    timestamp: serverTimestamp(),
  });
}

// 내 추천 통계 가져오기
export async function getReferralStats(userId: string): Promise<{
  referralCode: string;
  referredCount: number;
  creditsEarned: number;
  referredUsers: Array<{ userId: string; date: Date }>;
}> {
  if (!db) {
    return {
      referralCode: '',
      referredCount: 0,
      creditsEarned: 0,
      referredUsers: [],
    };
  }

  const referralRef = doc(db, 'referrals', userId);
  const referralDoc = await getDoc(referralRef);

  if (!referralDoc.exists()) {
    // 초기화
    const code = await initializeReferral(userId);
    return {
      referralCode: code,
      referredCount: 0,
      creditsEarned: 0,
      referredUsers: [],
    };
  }

  const data = referralDoc.data();

  return {
    referralCode: data.referralCode,
    referredCount: data.referredUsers?.length || 0,
    creditsEarned: data.creditsEarned || 0,
    referredUsers: data.referredUsers || [],
  };
}

// 추천 링크 생성
export function generateReferralLink(referralCode: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://workfreemarket.com';
  
  return `${baseUrl}/signup?ref=${referralCode}`;
}

// 카카오톡 공유 메시지 생성
export function generateKakaoShareMessage(referralCode: string, userName?: string): any {
  const referralLink = generateReferralLink(referralCode);
  
  return {
    objectType: 'feed',
    content: {
      title: '🎁 Fri Manual Bot 무료 체험 초대',
      description: `${userName || '친구'}님이 당신을 초대했어요!\n\n매뉴얼 검색 30분 → 2분으로 단축\n지금 가입하면 양쪽 모두 10 크레딧 증정!`,
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
  };
}

