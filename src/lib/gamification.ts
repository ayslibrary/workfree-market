// 게이미피케이션 핵심 로직

import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { 
  UserProfile, 
  Activity, 
  LedgerCredits, 
  Routine,
  CommunityPost,
  GAMIFICATION_CONSTANTS,
  getXPToNextLevel,
  getLevelProgress,
  calculateTimeToCredits
} from '@/types/gamification';

// 사용자 프로필 조회
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) return null;
  
  try {
    const docRef = doc(db, 'user_profiles', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        lastLevelUp: data.lastLevelUp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        weeklyMissions: data.weeklyMissions?.map((mission: any) => ({
          ...mission,
          weekStart: mission.weekStart?.toDate() || new Date(),
          weekEnd: mission.weekEnd?.toDate() || new Date(),
          completedAt: mission.completedAt?.toDate(),
        })) || [],
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error);
    return null;
  }
}

// 사용자 프로필 생성/업데이트
export async function upsertUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
  if (!db) return false;
  
  try {
    const docRef = doc(db, 'user_profiles', profile.userId!);
    const docSnap = await getDoc(docRef);
    
    const profileData = {
      ...profile,
      updatedAt: serverTimestamp(),
      ...(docSnap.exists() ? {} : { createdAt: serverTimestamp() }),
    };
    
    await setDoc(docRef, profileData, { merge: true });
    return true;
  } catch (error) {
    console.error('사용자 프로필 저장 오류:', error);
    return false;
  }
}

// 도구 실행 처리 (Mock)
export async function handleToolRun(
  userId: string, 
  toolId: string, 
  toolName: string, 
  cost: number = 1, 
  minutes: number = 7
): Promise<{ success: boolean; newLevel?: number; levelUp?: boolean }> {
  if (!db) return { success: false };
  
  try {
    const profileRef = doc(db, 'user_profiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (!profileSnap.exists()) {
      return { success: false };
    }
    
    const currentProfile = profileSnap.data() as UserProfile;
    const newXP = currentProfile.xp + GAMIFICATION_CONSTANTS.XP_PER_TOOL_RUN;
    const newCredits = currentProfile.credits - cost;
    const newTimeBank = currentProfile.time_bank_minutes + minutes;
    const newCumulative = currentProfile.cumulative_minutes + minutes;
    const newMonthly = currentProfile.monthly_minutes + minutes;
    
    // 레벨업 체크
    const currentLevel = currentProfile.level;
    const xpToNext = getXPToNextLevel(currentLevel);
    const newLevel = newXP >= xpToNext ? currentLevel + 1 : currentLevel;
    const levelUp = newLevel > currentLevel;
    
    // 프로필 업데이트
    await updateDoc(profileRef, {
      xp: newXP,
      credits: newCredits,
      time_bank_minutes: newTimeBank,
      cumulative_minutes: newCumulative,
      monthly_minutes: newMonthly,
      level: newLevel,
      ...(levelUp ? { lastLevelUp: serverTimestamp() } : {}),
    });
    
    // 활동 기록
    await addActivity({
      userId,
      type: 'tool_run',
      title: `${toolName} 실행`,
      description: `${minutes}분 절약`,
      xpEarned: GAMIFICATION_CONSTANTS.XP_PER_TOOL_RUN,
      creditsSpent: cost,
      timeSaved: minutes,
      toolUsed: toolId,
    });
    
    // 크레딧 거래 기록
    await addLedgerEntry({
      userId,
      type: 'spend',
      amount: -cost,
      balance: newCredits,
      reason: `${toolName} 사용`,
      toolUsed: toolId,
    });
    
    return { success: true, newLevel, levelUp };
  } catch (error) {
    console.error('도구 실행 처리 오류:', error);
    return { success: false };
  }
}

// 레벨업 시 시간→크레딧 전환
export async function handleLevelUpConversion(userId: string): Promise<{ success: boolean; creditsAwarded: number }> {
  if (!db) return { success: false, creditsAwarded: 0 };
  
  try {
    const profileRef = doc(db, 'user_profiles', userId);
    const profileSnap = await getDoc(profileRef);
    
    if (!profileSnap.exists()) {
      return { success: false, creditsAwarded: 0 };
    }
    
    const currentProfile = profileSnap.data() as UserProfile;
    const timeBank = currentProfile.time_bank_minutes;
    
    if (timeBank <= 0) {
      return { success: false, creditsAwarded: 0 };
    }
    
    const creditsAwarded = calculateTimeToCredits(timeBank, currentProfile.plan);
    const newCredits = currentProfile.credits + creditsAwarded;
    
    // 프로필 업데이트
    await updateDoc(profileRef, {
      credits: newCredits,
      time_bank_minutes: 0,
    });
    
    // 활동 기록
    await addActivity({
      userId,
      type: 'time_conversion',
      title: '시간→크레딧 전환',
      description: `${timeBank}분을 ${creditsAwarded}크레딧으로 전환`,
      xpEarned: 0,
      creditsEarned: creditsAwarded,
    });
    
    // 크레딧 거래 기록
    await addLedgerEntry({
      userId,
      type: 'conversion',
      amount: creditsAwarded,
      balance: newCredits,
      reason: '시간→크레딧 전환',
    });
    
    return { success: true, creditsAwarded };
  } catch (error) {
    console.error('레벨업 전환 처리 오류:', error);
    return { success: false, creditsAwarded: 0 };
  }
}

// 활동 기록 추가
async function addActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<void> {
  if (!db) return;
  
  try {
    await addDoc(collection(db, 'activities'), {
      ...activity,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('활동 기록 추가 오류:', error);
  }
}

// 크레딧 거래 기록 추가
async function addLedgerEntry(entry: Omit<LedgerCredits, 'id' | 'createdAt'>): Promise<void> {
  if (!db) return;
  
  try {
    await addDoc(collection(db, 'ledger_credits'), {
      ...entry,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('크레딧 거래 기록 추가 오류:', error);
  }
}

// 최근 활동 조회
export async function getRecentActivities(userId: string, limitCount: number = 5): Promise<Activity[]> {
  if (!db) return [];
  
  try {
    const q = query(
      collection(db, 'activities'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const activities: Activity[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Activity);
    });
    
    return activities;
  } catch (error) {
    console.error('최근 활동 조회 오류:', error);
    return [];
  }
}

// 주간 미션 조회
export async function getWeeklyMissions(userId: string): Promise<any[]> {
  if (!db) return [];
  
  try {
    const profile = await getUserProfile(userId);
    return profile?.weeklyMissions || [];
  } catch (error) {
    console.error('주간 미션 조회 오류:', error);
    return [];
  }
}

// 커뮤니티 핫 포스트 조회
export async function getHotCommunityPosts(limitCount: number = 3): Promise<CommunityPost[]> {
  if (!db) return [];
  
  try {
    const q = query(
      collection(db, 'community_posts'),
      where('isHot', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts: CommunityPost[] = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as CommunityPost);
    });
    
    return posts;
  } catch (error) {
    console.error('커뮤니티 포스트 조회 오류:', error);
    return [];
  }
}

// 사용자 프로필 실시간 구독
export function subscribeToUserProfile(
  userId: string, 
  callback: (profile: UserProfile | null) => void
): Unsubscribe {
  if (!db) {
    callback(null);
    return () => {};
  }
  
  const docRef = doc(db, 'user_profiles', userId);
  
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const profile: UserProfile = {
        ...data,
        lastLevelUp: data.lastLevelUp?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        weeklyMissions: data.weeklyMissions?.map((mission: any) => ({
          ...mission,
          weekStart: mission.weekStart?.toDate() || new Date(),
          weekEnd: mission.weekEnd?.toDate() || new Date(),
          completedAt: mission.completedAt?.toDate(),
        })) || [],
      } as UserProfile;
      callback(profile);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('사용자 프로필 구독 오류:', error);
    callback(null);
  });
}

// Mock 데이터 생성 (개발용)
export function createMockUserProfile(userId: string): UserProfile {
  return {
    userId,
    name: "프리(Fri) 마스터",
    plan: "starter",
    level: 8,
    xp: 620,
    credits: 127,
    time_bank_minutes: 180,
    cumulative_minutes: 2890,
    monthly_minutes: 750,
    lastLevelUp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
    achievements: ["첫 자동화", "레벨 5 달성", "주간 미션 완료"],
    weeklyMissions: [
      {
        id: "mission-1",
        title: "3개 도구 실행",
        description: "이번 주에 3개의 자동화 도구를 실행하세요",
        type: "tool_usage",
        target: 3,
        current: 2,
        reward: { xp: 10 },
        completed: false,
        weekStart: new Date(),
        weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "mission-2",
        title: "후기 1건 작성",
        description: "사용한 도구에 대한 후기를 작성하세요",
        type: "review",
        target: 1,
        current: 0,
        reward: { xp: 15, credits: 3 },
        completed: false,
        weekStart: new Date(),
        weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
    updatedAt: new Date(),
  };
}
