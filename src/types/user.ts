// 사용자 타입 정의

export type UserRole = 'buyer' | 'seller' | 'admin';

export type SellerLevel = 'standard' | 'verified' | 'top-creator';

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'business';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  sellerLevel?: SellerLevel;
  createdAt: Date;
  updatedAt: Date;
}

// 게이미피케이션 확장 사용자 프로필
export interface GamifiedUser extends User {
  // 기본 게이미피케이션 데이터
  level: number;
  xp: number;
  credits: number;
  plan: SubscriptionPlan;
  
  // 시간 절약 관련
  time_bank_minutes: number;
  cumulative_minutes: number;
  monthly_minutes: number;
  lastLevelUp: Date;
  
  // 성취 및 미션
  achievements: string[];
  weeklyMissions: WeeklyMission[];
  
  // 통계
  totalToolsUsed: number;
  totalTimeSaved: number;
  totalMoneySaved: number;
  currentStreak: number;
  longestStreak: number;
}

// 주간 미션 타입 (간단 버전)
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

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}
















