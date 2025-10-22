// 크레딧 시스템 타입 정의

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'refund' | 'subscribe';
  amount: number;
  balance: number;
  reason: string;
  toolUsed?: string;
  createdAt: Date;
}

export interface UserCredits {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  monthlyUsed: number;
  lastResetDate: Date;
  subscriptionTier: SubscriptionTier;
  isBetaTester: boolean;
  betaExpiryDate?: Date;
}

export interface TimeSavings {
  userId: string;
  monthlyMinutes: number;
  totalMinutes: number;
  monthlyMoneySaved: number;
  totalMoneySaved: number;
  lastCalculated: Date;
}

export type SubscriptionTier = 
  | 'free'
  | 'starter'
  | 'pro'
  | 'team'
  | 'business'
  | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  nameKo: string;
  price: number;
  credits: number;
  features: string[];
  badge?: string;
  recommended?: boolean;
  comingSoon?: boolean;
}

export interface AutomationTool {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  description: string;
  creditCost: number;
  timeSavedMinutes: number;
  moneySavedAmount: number;
  icon: string;
  available: boolean;
}

export interface UserReview {
  id: string;
  userId: string;
  userName: string;
  toolId: string;
  rating: number;
  comment: string;
  timeSaved: number;
  creditRewarded: boolean;
  createdAt: Date;
  verified: boolean;
}

export interface BetaTester {
  userId: string;
  email: string;
  appliedAt: Date;
  approvedAt?: Date;
  status: 'pending' | 'approved' | 'expired';
  feedbackSubmitted: boolean;
  creditsGranted: number;
  referralCode?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Beta',
    nameKo: '무료 베타',
    price: 0,
    credits: 10,
    features: [
      '무료 크레딧 10개 (1달 유효)',
      '기본 자동화 도구 사용',
      '베타테스터 전용 뱃지',
      '후기 작성 시 크레딧 보상',
      '커뮤니티 지원'
    ],
    badge: '🎁 베타'
  },
  {
    id: 'starter',
    name: 'Starter',
    nameKo: '스타터',
    price: 3000,
    credits: 100,
    features: [
      '월 100 크레딧',
      '모든 기본 자동화 도구',
      '이메일 지원',
      '사용량 리포트',
      '크레딧 이월 가능'
    ],
    recommended: true
  },
  {
    id: 'pro',
    name: 'Pro',
    nameKo: '프로',
    price: 6000,
    credits: 200,
    features: [
      '월 200 크레딧',
      '고급 자동화 도구',
      '우선 지원',
      '상세 분석 리포트',
      'API 접근',
      '팀 공유 기능'
    ],
    comingSoon: true
  },
  {
    id: 'team',
    name: 'Team',
    nameKo: '팀',
    price: 12000,
    credits: 400,
    features: [
      '월 400 크레딧',
      '팀원 5명까지',
      '팀 대시보드',
      '관리자 기능',
      '전담 지원',
      '커스텀 자동화'
    ],
    comingSoon: true
  },
  {
    id: 'business',
    name: 'Business',
    nameKo: '비즈니스',
    price: 23000,
    credits: 800,
    features: [
      '월 800 크레딧',
      '팀원 20명까지',
      '엔터프라이즈 지원',
      'SLA 보장',
      '맞춤형 개발',
      '온보딩 지원'
    ],
    comingSoon: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameKo: '엔터프라이즈',
    price: 55000,
    credits: 2000,
    features: [
      '월 2,000 크레딧',
      '무제한 팀원',
      '전담 계정 매니저',
      '맞춤형 솔루션',
      '온프레미스 옵션',
      '24/7 프리미엄 지원'
    ],
    comingSoon: true
  }
];

export const AUTOMATION_TOOLS: AutomationTool[] = [
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    nameKo: 'PDF → Word 변환',
    category: '문서 변환',
    description: 'PDF 파일을 편집 가능한 Word 문서로 변환',
    creditCost: 1,
    timeSavedMinutes: 15,
    moneySavedAmount: 5000,
    icon: '📄',
    available: true
  },
  {
    id: 'outlook-auto-reply',
    name: 'Outlook Auto Reply',
    nameKo: 'Outlook 자동 회신',
    category: '이메일 자동화',
    description: '조건에 맞는 메일 자동 회신 설정',
    creditCost: 1,
    timeSavedMinutes: 30,
    moneySavedAmount: 10000,
    icon: '📧',
    available: true
  },
  {
    id: 'text-formatter',
    name: 'Text Formatter',
    nameKo: '텍스트 일괄 변환',
    category: '텍스트 처리',
    description: '대량 텍스트 포맷 변환 및 정리',
    creditCost: 1,
    timeSavedMinutes: 20,
    moneySavedAmount: 7000,
    icon: '✍️',
    available: true
  },
  {
    id: 'excel-merger',
    name: 'Excel Merger',
    nameKo: '엑셀 파일 병합',
    category: '데이터 처리',
    description: '여러 엑셀 파일을 하나로 병합',
    creditCost: 2,
    timeSavedMinutes: 45,
    moneySavedAmount: 15000,
    icon: '📊',
    available: false
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    nameKo: '이미지 일괄 압축',
    category: '이미지 처리',
    description: '여러 이미지 파일 일괄 압축',
    creditCost: 1,
    timeSavedMinutes: 10,
    moneySavedAmount: 3000,
    icon: '🖼️',
    available: false
  },
  {
    id: 'ai-portrait',
    name: 'AI Portrait Generator',
    nameKo: 'AI 화보 생성',
    category: 'AI 생성',
    description: 'AI로 프로필 화보 자동 생성',
    creditCost: 3,
    timeSavedMinutes: 60,
    moneySavedAmount: 30000,
    icon: '🎨',
    available: true
  }
];

export const CREDIT_REWARDS = {
  BETA_SIGNUP: 10,
  REVIEW_WRITE: 5,
  SNS_SHARE: 10,
  REFERRAL: 20,
  FEEDBACK_SUBMIT: 15
} as const;

export const HOURLY_RATE = 20000; // 시간당 환산 금액 (₩20,000/시간)

