// 연봉 실수령 계산기 - 국세청 간이세액표 기반

// ============================================
// 타입 정의
// ============================================

export interface SalaryInput {
  annualSalary: number; // 만원 단위
  region?: string;
  yearsOfService?: number;
  includeSeverance?: boolean; // 퇴직금 포함 여부
}

export interface TakeHomePayResult {
  monthlyTakeHome: number; // 월 실수령액
  monthlyGross: number; // 월 총급여
  taxRate: number; // 총 공제율 (%)
  annualTax: number; // 연간 총 공제액
  severancePay?: number; // 예상 퇴직금
  breakdown: {
    pension: number; // 국민연금
    healthInsurance: number; // 건강보험
    longTermCare: number; // 장기요양보험
    employment: number; // 고용보험
    incomeTax: number; // 소득세
    localIncomeTax: number; // 지방소득세
  };
}

export interface InvestmentSimulation {
  principal: number; // 원금 (퇴직금)
  years: number; // 투자 기간
  returnRate: number; // 연 수익률 (%)
  futureValue: number; // 미래 가치
  totalReturn: number; // 총 수익
}

export interface CompanyInput {
  currentCompany: string;
  currentSalary: number;
  currentIndustry: string;
  targetCompany: string;
  targetSalary: number;
  targetIndustry: string;
  region: string;
}

export interface CompanyComparison {
  current: TakeHomePayResult;
  target: TakeHomePayResult;
  monthlyDifference: number;
  annualDifference: number;
  benefits: {
    current: {
      annualLeave: number;
      welfarePoints: number;
    };
    target: {
      annualLeave: number;
      welfarePoints: number;
    };
  };
  cultureFitScore: number;
  timeSavedPerYear: number; // 시간 절약 (시간 단위)
  recommendedCompanies: Array<{
    name: string;
    industry: string;
    avgSalary: string;
    matchScore: number;
  }>;
}

// ============================================
// 실수령액 계산 (국세청 기준)
// ============================================

export function calculateTakeHomePay(input: SalaryInput): TakeHomePayResult {
  const annualSalaryWon = input.annualSalary * 10000; // 만원 → 원
  const monthlySalary = Math.floor(annualSalaryWon / 12);

  // 1. 국민연금 (4.5%, 상한 553만원)
  const pensionBase = Math.min(monthlySalary, 5530000);
  const pension = Math.floor(pensionBase * 0.045);

  // 2. 건강보험 (3.545%)
  const healthInsurance = Math.floor(monthlySalary * 0.03545);

  // 3. 장기요양보험 (건강보험의 12.81%)
  const longTermCare = Math.floor(healthInsurance * 0.1281);

  // 4. 고용보험 (0.9%)
  const employment = Math.floor(monthlySalary * 0.009);

  // 5. 소득세 (간이세액표 기반 - 간소화)
  let incomeTax = 0;
  if (monthlySalary <= 2000000) {
    incomeTax = Math.floor(monthlySalary * 0.03);
  } else if (monthlySalary <= 4000000) {
    incomeTax = Math.floor(monthlySalary * 0.08);
  } else if (monthlySalary <= 8000000) {
    incomeTax = Math.floor(monthlySalary * 0.12);
  } else {
    incomeTax = Math.floor(monthlySalary * 0.15);
  }

  // 6. 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  // 총 공제액
  const totalDeduction = pension + healthInsurance + longTermCare + employment + incomeTax + localIncomeTax;
  
  // 실수령액
  const monthlyTakeHome = monthlySalary - totalDeduction;
  
  // 공제율
  const taxRate = Number(((totalDeduction / monthlySalary) * 100).toFixed(1));

  return {
    monthlyTakeHome: Math.floor(monthlyTakeHome),
    monthlyGross: monthlySalary,
    taxRate,
    annualTax: totalDeduction * 12,
    breakdown: {
      pension,
      healthInsurance,
      longTermCare,
      employment,
      incomeTax,
      localIncomeTax,
    },
  };
}

// ============================================
// 기업 비교 분석
// ============================================

export function compareCompanies(input: CompanyInput): CompanyComparison {
  // 현재 vs 목표 실수령액 계산
  const currentResult = calculateTakeHomePay({
    annualSalary: input.currentSalary,
    region: input.region,
  });

  const targetResult = calculateTakeHomePay({
    annualSalary: input.targetSalary,
    region: input.region,
  });

  const monthlyDifference = targetResult.monthlyTakeHome - currentResult.monthlyTakeHome;
  const annualDifference = monthlyDifference * 12;

  // 업종별 복지·연차 데이터 (평균값)
  const industryBenefits: Record<string, { leave: number; welfare: number }> = {
    제조업: { leave: 15, welfare: 500000 },
    IT서비스: { leave: 18, welfare: 1200000 },
    금융: { leave: 17, welfare: 1500000 },
    유통: { leave: 15, welfare: 800000 },
    건설: { leave: 15, welfare: 600000 },
    의료: { leave: 16, welfare: 1000000 },
    기타: { leave: 15, welfare: 500000 },
  };

  const currentBenefits = industryBenefits[input.currentIndustry] || industryBenefits['기타'];
  const targetBenefits = industryBenefits[input.targetIndustry] || industryBenefits['기타'];

  // 기업 문화 매칭률 (시뮬레이션)
  const cultureFitScore = Math.floor(Math.random() * 15) + 80; // 80~95%

  // 시간 절약 (업종별 자동화 수준 차이)
  const automationLevel: Record<string, number> = {
    제조업: 50,
    IT서비스: 150,
    금융: 100,
    유통: 80,
    건설: 40,
    의료: 60,
    기타: 50,
  };
  
  const timeSavedPerYear = (automationLevel[input.targetIndustry] || 50) - (automationLevel[input.currentIndustry] || 50);

  // AI 추천 기업 (하드코딩 - v2에서 RAG 연동)
  const recommendedCompanies = [
    {
      name: '네이버파이낸셜',
      industry: '핀테크',
      avgSalary: '연봉 6,500만원',
      matchScore: 92,
    },
    {
      name: '카카오페이',
      industry: '핀테크',
      avgSalary: '연봉 6,200만원',
      matchScore: 88,
    },
    {
      name: '삼성SDS',
      industry: 'IT서비스',
      avgSalary: '연봉 5,800만원',
      matchScore: 85,
    },
  ];

  return {
    current: currentResult,
    target: targetResult,
    monthlyDifference,
    annualDifference,
    benefits: {
      current: {
        annualLeave: currentBenefits.leave,
        welfarePoints: currentBenefits.welfare,
      },
      target: {
        annualLeave: targetBenefits.leave,
        welfarePoints: targetBenefits.welfare,
      },
    },
    cultureFitScore,
    timeSavedPerYear: Math.abs(timeSavedPerYear),
    recommendedCompanies,
  };
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 숫자를 한국 통화 형식으로 변환
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

/**
 * 연봉을 만원 단위로 표시
 */
export function formatSalary(amount: number): string {
  return (amount / 10000).toLocaleString('ko-KR') + '만원';
}


