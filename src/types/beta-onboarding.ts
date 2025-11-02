// 1일 온보딩 + 1주 자유모드 베타 프로그램

import { Timestamp } from 'firebase/firestore';

// ========================================
// 온보딩 미션 (Day 1 필수)
// ========================================

export type OnboardingStage = 'stage1' | 'stage2';

export interface OnboardingMission {
  id: string;
  stage: OnboardingStage;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number; // 예상 소요 시간
  creditReward: number; // 크레딧 보상
  icon: string;
  isRequired: boolean;
}

export interface OnboardingProgress {
  userId: string;
  currentStage: OnboardingStage | 'completed';
  completedMissions: string[];
  totalCreditsEarned: number;
  totalTimeSaved: number; // 분 단위
  startedAt: Timestamp;
  completedAt?: Timestamp;
  feedbackSubmitted: boolean;
}

// ========================================
// 선택 미션 (Day 2-7)
// ========================================

export type OptionalMissionType = 
  | 'three_uses'      // 3회 이상 사용
  | 'referral'        // 친구 초대
  | 'review'          // 리뷰 작성
  | 'week_checkin'    // 1주차 체크인 (삭제됨)
  | 'final_feedback'; // 최종 피드백 (Day 7)

export interface OptionalMission {
  id: OptionalMissionType;
  title: string;
  description: string;
  creditReward: number;
  icon: string;
  day: string; // "Day 2-7" 등
}

export interface OptionalMissionProgress {
  userId: string;
  completedMissions: OptionalMissionType[];
  threeUsesCount: number; // 사용 횟수 추적
  referredUsers: string[]; // 초대한 사용자 ID
  reviewSubmitted: boolean;
  finalFeedbackSubmitted: boolean;
  completedAt?: { [key in OptionalMissionType]?: Timestamp };
}

// ========================================
// Stage별 설문/피드백
// ========================================

export interface Stage1Feedback {
  userId: string;
  missionId: string;
  easyRating: 'easy' | 'normal' | 'hard'; // 쉬웠나요?
  willUseAgain: boolean; // 또 쓸 의향?
  submittedAt: Timestamp;
}

export interface Stage2Feedback {
  userId: string;
  timeSavedReported: number; // 사용자가 입력한 평소 소요 시간
  timeSavedActual: number; // 실제 측정된 시간
  timeSavingsPerceived: boolean; // 시간 절약 체감?
  qualityRating: number; // 결과물 품질 (1-5)
  willingToPay: number; // 지불 의향 가격 (1000, 3000, 5000, 10000, 0)
  targetAudience: string[]; // 유용할 것 같은 대상
  painPoint: string; // 가장 불편했던 점
  npsScore: number; // 0-10
  submittedAt: Timestamp;
}

export interface FinalFeedback {
  userId: string;
  usageCount: number; // 1주간 사용 횟수
  top3Tools: string[]; // 가장 유용했던 도구 TOP 3
  purchaseIntention: 'buy_now' | 'consider' | 'check_price' | 'free_only';
  maxMonthlyPayment?: number; // 월 최대 지불 가능 금액
  npsScore: number; // 최종 NPS
  comment?: string; // 한 줄 평가
  submittedAt: Timestamp;
}

// ========================================
// 도구 사용 로그
// ========================================

export interface ToolUsageLog {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  creditUsed: number;
  timeSavedMinutes: number;
  usedAt: Timestamp;
  betaWeek: number; // 베타 시작 후 몇 주차
}

// ========================================
// 베타 테스터 전체 진행 상황
// ========================================

export interface BetaTesterProgress {
  userId: string;
  email: string;
  name: string;
  betaNumber: number; // 1-100
  joinedAt: Timestamp;
  
  // Day 1 온보딩
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Timestamp;
  
  // 선택 미션
  optionalMissionsCompleted: OptionalMissionType[];
  
  // 크레딧 & 시간
  totalCreditsEarned: number;
  totalCreditsSpent: number;
  currentBalance: number;
  totalTimeSavedMinutes: number;
  
  // 도구 사용
  toolUsageCount: number;
  favoriteTools: string[];
  
  // 피드백 제출 여부
  stage1FeedbackSubmitted: boolean;
  stage2FeedbackSubmitted: boolean;
  finalFeedbackSubmitted: boolean;
  
  // 상태
  isActive: boolean;
  lastActiveAt: Timestamp;
  completedDay7: boolean;
}

// ========================================
// 기본 미션 데이터
// ========================================

export const ONBOARDING_MISSIONS: OnboardingMission[] = [
  {
    id: 'stage1',
    stage: 'stage1',
    order: 1,
    title: '첫 3분 체험',
    description: '가장 쉬운 도구 하나만 써보기 (QR 생성 또는 이미지 검색)',
    estimatedMinutes: 5,
    creditReward: 10,
    icon: '⚡',
    isRequired: true,
  },
  {
    id: 'stage2',
    stage: 'stage2',
    order: 2,
    title: '실전 투입',
    description: '실제 업무 시나리오 1개 완수 (보고서/블로그/QR 중 선택)',
    estimatedMinutes: 20,
    creditReward: 20,
    icon: '🚀',
    isRequired: true,
  },
];

export const OPTIONAL_MISSIONS: OptionalMission[] = [
  {
    id: 'three_uses',
    title: '3회 이상 사용',
    description: '베타 기간 동안 도구를 3회 이상 사용하세요',
    creditReward: 10,
    icon: '🎯',
    day: 'Day 2-7',
  },
  {
    id: 'referral',
    title: '친구 초대',
    description: '친구 1명을 WorkFree에 초대하세요 (친구도 크레딧 10개)',
    creditReward: 20,
    icon: '👥',
    day: 'Day 2-7',
  },
  {
    id: 'review',
    title: '리뷰 작성',
    description: '50자 이상 간단한 사용 후기를 남겨주세요',
    creditReward: 20,
    icon: '📝',
    day: 'Day 2-7',
  },
  {
    id: 'final_feedback',
    title: '최종 피드백',
    description: '1주일 체험 후 최종 피드백 제출 (3분)',
    creditReward: 10,
    icon: '🎊',
    day: 'Day 7',
  },
];

// ========================================
// 크레딧 보상 상수
// ========================================

export const CREDIT_REWARDS = {
  // Day 1 필수
  STAGE_1: 10,
  STAGE_2: 20,
  DAY_1_TOTAL: 30,
  
  // Day 2-7 선택
  THREE_USES: 10,
  REFERRAL: 20,
  REFERRAL_FRIEND: 10, // 초대받은 친구
  REVIEW: 20,
  FINAL_FEEDBACK: 10,
  
  // 최대
  MAX_TOTAL: 90,
} as const;

// ========================================
// 도구별 크레딧 비용
// ========================================

export const TOOL_CREDIT_COSTS = {
  'qr-generator': 2,
  'image-search': 1,
  'blog-generator': 3,
  'report-generator': 5,
  'email-automation': 2,
} as const;

// ========================================
// 베타 프로그램 설정
// ========================================

export const BETA_CONFIG = {
  // 각 유저의 프로그램 기간
  USER_PROGRAM_DAYS: 7, // 가입 후 7일간 진행
  
  // 전체 베타 테스트 기간
  TOTAL_BETA_WEEKS: 4, // 1달 = 4주
  RECRUITMENT_WEEKS: 3, // 신규 모집 기간 (1-3주차)
  COMPLETION_WEEK: 4, // 4주차는 기존 유저 완료 기간
  
  // 인원
  MAX_PARTICIPANTS: 100, // 목표 인원 (선착순)
  
  // 날짜 (실제 시작일로 변경 필요)
  BETA_START_DATE: new Date('2025-11-03'), // 베타 테스트 시작일
  RECRUITMENT_END_DATE: new Date('2025-11-23'), // 신규 모집 마감일 (3주 후)
  BETA_END_DATE: new Date('2025-11-30'), // 베타 테스트 종료일 (4주 후)
} as const;

// ========================================
// 베타 상태 계산 헬퍼
// ========================================

export interface BetaStatus {
  isOpen: boolean; // 신규 모집 중인가?
  isBetaPeriod: boolean; // 베타 기간 중인가?
  daysUntilRecruitmentEnd: number; // 모집 마감까지 남은 일수
  currentParticipants: number; // 현재 참가자 수
  spotsRemaining: number; // 남은 자리
  weekNumber: number; // 현재 몇 주차인가 (1-4)
}

export function getBetaStatus(currentParticipants: number = 0): BetaStatus {
  const now = new Date();
  const startDate = BETA_CONFIG.BETA_START_DATE;
  const recruitmentEndDate = BETA_CONFIG.RECRUITMENT_END_DATE;
  const betaEndDate = BETA_CONFIG.BETA_END_DATE;
  
  const isOpen = now >= startDate && now <= recruitmentEndDate && currentParticipants < BETA_CONFIG.MAX_PARTICIPANTS;
  const isBetaPeriod = now >= startDate && now <= betaEndDate;
  
  const daysUntilRecruitmentEnd = Math.ceil((recruitmentEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const spotsRemaining = Math.max(0, BETA_CONFIG.MAX_PARTICIPANTS - currentParticipants);
  
  const weekNumber = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)) || 1;
  
  return {
    isOpen,
    isBetaPeriod,
    daysUntilRecruitmentEnd: Math.max(0, daysUntilRecruitmentEnd),
    currentParticipants,
    spotsRemaining,
    weekNumber: Math.min(weekNumber, 4),
  };
}

// ========================================
// 크레딧 표시 헬퍼 (타입 안전)
// ========================================

export interface CreditDisplay {
  amount: number;
  formatted: string; // "크레딧 10개"
  withValue: string; // "크레딧 10개 (1만원 상당)"
  valueOnly: string; // "1만원 상당"
}

export function formatCredits(amount: number): CreditDisplay {
  const valueInKRW = amount * 1000;
  const valueFormatted = valueInKRW >= 10000
    ? `${valueInKRW / 10000}만원`
    : `${valueInKRW.toLocaleString()}원`;
  
  return {
    amount,
    formatted: `크레딧 ${amount}개`,
    withValue: `크레딧 ${amount}개 (${valueFormatted} 상당)`,
    valueOnly: `${valueFormatted} 상당`,
  };
}

// ========================================
// 예상 사용 가능 도구 계산
// ========================================

export interface UsageEstimate {
  toolName: string;
  count: number;
  icon: string;
}

export function estimateUsage(credits: number): UsageEstimate[] {
  return [
    {
      toolName: '블로그 작성',
      count: Math.floor(credits / TOOL_CREDIT_COSTS['blog-generator']),
      icon: '✍️',
    },
    {
      toolName: '이미지 검색',
      count: Math.floor(credits / TOOL_CREDIT_COSTS['image-search']),
      icon: '🔍',
    },
    {
      toolName: 'QR 코드 생성',
      count: Math.floor(credits / TOOL_CREDIT_COSTS['qr-generator']),
      icon: '📱',
    },
    {
      toolName: '보고서 작성',
      count: Math.floor(credits / TOOL_CREDIT_COSTS['report-generator']),
      icon: '📊',
    },
  ];
}

