import { Timestamp } from 'firebase/firestore';

// 미션 타입 정의
export type MissionActionType =
  | 'signup'
  | 'use_portrait'
  | 'use_blog'
  | 'write_review'
  | 'post_community'
  | 'use_automation'
  | 'write_review_2'
  | 'social_share'
  | 'final_review'
  | 'survey';

// 미션 인터페이스
export interface Mission {
  id: string;
  order: number;
  title: string;
  description: string;
  rewardCredits: number;
  timeSaved: number; // 분 단위
  icon: string;
  actionType: MissionActionType;
  isActive: boolean;
}

// 베타테스터 인터페이스
export interface BetaTester {
  id: string;
  userId: string;
  betaNumber: number; // 1~100
  joinedAt: Timestamp;
  totalCreditsEarned: number;
  timeSaved: number; // 분 단위
  completedMissions: string[]; // 미션 ID 배열
  isCompleted: boolean;
  vipEligible: boolean;
}

// 미션 완료 기록
export interface MissionCompletion {
  id: string;
  userId: string;
  missionId: string;
  completedAt: Timestamp;
  creditsAwarded: number;
  proof?: string; // 증빙 링크 등
}

// SNS 플랫폼
export type SocialPlatform = 'twitter' | 'facebook' | 'kakao' | 'blog';

// SNS 공유 기록
export interface SocialShare {
  id: string;
  userId: string;
  platform: SocialPlatform;
  sharedAt: Timestamp;
  creditsAwarded: number;
  url?: string;
}

// 후기
export interface Review {
  id: string;
  userId: string;
  serviceType: string; // 'blog', 'portrait', 'automation' 등
  rating: number; // 1~5
  content: string;
  screenshot?: string;
  createdAt: Timestamp;
  isApproved: boolean;
}

// 설문조사 응답
export interface SurveyResponse {
  id: string;
  userId: string;
  answers: {
    question: string;
    answer: string;
  }[];
  completedAt: Timestamp;
}

// 미션 진행 상태
export interface MissionProgress {
  mission: Mission;
  isCompleted: boolean;
  isLocked: boolean;
  completedAt?: Timestamp;
}

// 베타 통계
export interface BetaStats {
  totalTesters: number;
  activeTesters: number;
  completedTesters: number;
  averageCompletionRate: number;
  totalCreditsAwarded: number;
  totalTimeSaved: number; // 분 단위
  missionCompletionRates: {
    [missionId: string]: number;
  };
}

// 랭킹 항목
export interface RankingEntry {
  userId: string;
  userName: string;
  betaNumber: number;
  rank: number;
  score: number; // 크레딧 또는 시간
  timeSaved?: number;
  creditsEarned?: number;
}

// 인증서 데이터
export interface Certificate {
  userName: string;
  betaNumber: number;
  completedAt: Date;
  totalMissions: number;
  timeSaved: number;
  creditsEarned: number;
}

// 기본 미션 데이터 (초기 설정용)
export const DEFAULT_MISSIONS: Omit<Mission, 'id'>[] = [
  {
    order: 1,
    title: '회원가입 완료',
    description: 'WorkFree 계정을 만들고 베타테스터로 등록하세요',
    rewardCredits: 100,
    timeSaved: 0,
    icon: '✅',
    actionType: 'signup',
    isActive: true,
  },
  {
    order: 2,
    title: 'AI 초상화 생성',
    description: 'AI 초상화 메이커로 프로필 사진을 만들어보세요',
    rewardCredits: 200,
    timeSaved: 30,
    icon: '🎨',
    actionType: 'use_portrait',
    isActive: true,
  },
  {
    order: 3,
    title: 'AI 블로그 생성',
    description: 'AI 블로그 생성기로 콘텐츠를 만들어보세요',
    rewardCredits: 200,
    timeSaved: 30,
    icon: '✍️',
    actionType: 'use_blog',
    isActive: true,
  },
  {
    order: 4,
    title: '첫 번째 후기 작성',
    description: '사용한 서비스에 대한 솔직한 후기를 남겨주세요',
    rewardCredits: 300,
    timeSaved: 0,
    icon: '📝',
    actionType: 'write_review',
    isActive: true,
  },
  {
    order: 5,
    title: '커뮤니티 게시글 작성',
    description: '커뮤니티에서 다른 직장인들과 소통해보세요',
    rewardCredits: 200,
    timeSaved: 0,
    icon: '💬',
    actionType: 'post_community',
    isActive: true,
  },
  {
    order: 6,
    title: '자동화 도구 사용',
    description: '업무 자동화 도구를 활용해보세요',
    rewardCredits: 300,
    timeSaved: 60,
    icon: '🔧',
    actionType: 'use_automation',
    isActive: true,
  },
  {
    order: 7,
    title: '두 번째 후기 작성',
    description: '또 다른 서비스 후기를 작성해주세요',
    rewardCredits: 400,
    timeSaved: 0,
    icon: '📝',
    actionType: 'write_review_2',
    isActive: true,
  },
  {
    order: 8,
    title: 'SNS 공유하기',
    description: 'WorkFree를 SNS에 공유하고 친구를 초대하세요',
    rewardCredits: 500,
    timeSaved: 0,
    icon: '📢',
    actionType: 'social_share',
    isActive: true,
  },
  {
    order: 9,
    title: '전체 서비스 후기',
    description: 'WorkFree 전체에 대한 종합 후기를 작성해주세요',
    rewardCredits: 500,
    timeSaved: 0,
    icon: '📝',
    actionType: 'final_review',
    isActive: true,
  },
  {
    order: 10,
    title: '베타 설문 완료',
    description: '서비스 개선을 위한 설문에 참여해주세요',
    rewardCredits: 500,
    timeSaved: 0,
    icon: '🎉',
    actionType: 'survey',
    isActive: true,
  },
];

// 완주 보상
export const COMPLETION_BONUS = {
  credits: 10000,
  vipStatus: true,
  badge: 'Beta Veteran',
};

// SNS 공유 보상
export const SOCIAL_SHARE_REWARDS: Record<SocialPlatform, number> = {
  twitter: 500,
  facebook: 500,
  kakao: 500,
  blog: 500,
};

// 베타 테스터 최대 인원
export const MAX_BETA_TESTERS = 100;

