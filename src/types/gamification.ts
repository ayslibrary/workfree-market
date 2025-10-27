// 게이미피케이션 시스템 타입 정의

export interface UserProfile {
  userId: string;
  name: string;
  plan: 'free' | 'starter' | 'pro' | 'business';
  level: number;
  xp: number;
  credits: number;
  time_bank_minutes: number;
  cumulative_minutes: number;
  monthly_minutes: number;
  lastLevelUp: Date;
  achievements: string[];
  weeklyMissions: WeeklyMission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  type: 'tool_usage' | 'review' | 'community' | 'streak' | 'time_saved';
  target: number;
  current: number;
  reward: {
    xp: number;
    credits?: number;
  };
  completed: boolean;
  completedAt?: Date;
  weekStart: Date;
  weekEnd: Date;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'tool_run' | 'level_up' | 'mission_complete' | 'review_write' | 'time_conversion';
  title: string;
  description: string;
  xpEarned: number;
  creditsEarned?: number;
  creditsSpent?: number;
  timeSaved?: number;
  toolUsed?: string;
  createdAt: Date;
}

export interface LedgerCredits {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'conversion' | 'reward';
  amount: number;
  balance: number;
  reason: string;
  toolUsed?: string;
  missionId?: string;
  createdAt: Date;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  schedule: {
    type: 'daily' | 'weekly' | 'monthly';
    time?: string; // HH:MM 형식
    days?: number[]; // 0=일요일, 1=월요일, ...
    dayOfMonth?: number; // 월별 스케줄용
  };
  toolId: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  totalRuns: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userLevel: number;
  title: string;
  content: string;
  category: 'general' | 'tips' | 'showcase' | 'question';
  likes: number;
  comments: number;
  views: number;
  isHot: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 게이미피케이션 상수
export const GAMIFICATION_CONSTANTS = {
  // XP 관련
  XP_PER_TOOL_RUN: 15,
  XP_PER_REVIEW: 10,
  XP_PER_MISSION: 25,
  XP_PER_LEVEL_UP: 50,
  
  // 레벨업 XP 요구량 (레벨별)
  LEVEL_XP_REQUIREMENTS: {
    1: 100,
    2: 200,
    3: 350,
    4: 550,
    5: 800,
    6: 1100,
    7: 1450,
    8: 1850,
    9: 2300,
    10: 2800,
    // 10레벨 이후는 500씩 증가
  },
  
  // 시간→크레딧 전환 계수
  TIME_TO_CREDIT_CONVERSION: {
    free: 1.0,
    starter: 1.0,
    pro: 1.2,
    business: 1.5,
  },
  
  // 시간당 환산 금액 (원)
  HOURLY_RATE: 20000,
  
  // 미션 타입별 기본 설정
  MISSION_DEFAULTS: {
    tool_usage: {
      xp: 10,
      credits: 0,
    },
    review: {
      xp: 15,
      credits: 3,
    },
    community: {
      xp: 20,
      credits: 5,
    },
    streak: {
      xp: 30,
      credits: 10,
    },
    time_saved: {
      xp: 25,
      credits: 8,
    },
  },
} as const;

// 레벨업 XP 계산 함수
export function getXPToNextLevel(currentLevel: number): number {
  const requirements = GAMIFICATION_CONSTANTS.LEVEL_XP_REQUIREMENTS;
  
  if (currentLevel in requirements) {
    return requirements[currentLevel as keyof typeof requirements];
  }
  
  // 10레벨 이후는 500씩 증가
  return 2800 + (currentLevel - 10) * 500;
}

// 현재 레벨의 시작 XP 계산
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  const requirements = GAMIFICATION_CONSTANTS.LEVEL_XP_REQUIREMENTS;
  let totalXP = 0;
  
  for (let i = 1; i < level; i++) {
    if (i in requirements) {
      totalXP += requirements[i as keyof typeof requirements];
    } else {
      // 10레벨 이후
      totalXP += 2800 + (i - 10) * 500;
    }
  }
  
  return totalXP;
}

// 레벨 진행률 계산
export function getLevelProgress(currentXP: number, currentLevel: number): {
  progressPercent: number;
  xpToNext: number;
  xpFromStart: number;
} {
  const startXP = getXPForLevel(currentLevel);
  const targetXP = getXPForLevel(currentLevel + 1);
  const xpToNext = targetXP - currentXP;
  const xpFromStart = currentXP - startXP;
  const progressPercent = Math.min(100, (xpFromStart / (targetXP - startXP)) * 100);
  
  return {
    progressPercent,
    xpToNext,
    xpFromStart,
  };
}

// 시간→크레딧 전환 계산
export function calculateTimeToCredits(
  minutes: number, 
  plan: 'free' | 'starter' | 'pro' | 'business'
): number {
  const conversionFactor = GAMIFICATION_CONSTANTS.TIME_TO_CREDIT_CONVERSION[plan];
  return Math.floor((minutes / 15) * conversionFactor);
}

// 시간을 읽기 쉬운 형식으로 변환
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}시간 ${mins}분`;
  }
  return `${mins}분`;
}

// 금액을 읽기 쉬운 형식으로 변환
export function formatMoney(amount: number): string {
  return `₩${amount.toLocaleString()}`;
}
