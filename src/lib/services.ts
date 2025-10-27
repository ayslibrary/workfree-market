// WorkFree 자동화 서비스 데이터
export interface AutomationService {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'hr' | 'finance' | 'product' | 'general';
  categoryName: string;
  icon: string;
  cost: number; // 크레딧 비용
  timeSaved: number; // 절약 시간 (분)
  features: string[];
  painPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  popularity: number; // 인기도 (1-5)
  tags: string[];
}

export const AUTOMATION_SERVICES: AutomationService[] = [
  // 📊 마케팅 / 영업
  {
    id: 'daily-performance-report',
    name: '일일 성과 데이터 통합 리포트',
    description: '4개 이상의 광고 채널 성과(CSV)를 하나의 Excel 또는 Google Sheet로 취합 및 차트 업데이트',
    category: 'marketing',
    categoryName: '마케팅/영업',
    icon: '📊',
    cost: 3,
    timeSaved: 40,
    features: ['다중 채널 데이터 통합', '자동 차트 생성', '실시간 업데이트'],
    painPoints: ['수동 데이터 취합', '차트 업데이트 반복', '채널별 성과 비교 어려움'],
    difficulty: 'medium',
    popularity: 5,
    tags: ['데이터분석', '리포팅', '광고', '성과측정']
  },
  {
    id: 'competitor-analysis',
    name: '경쟁사 웹사이트 핵심 변경 요약',
    description: '경쟁사 URL 3개를 입력하면, 지난 주 변경 사항(Pricing/Feature)을 감지 및 요약',
    category: 'marketing',
    categoryName: '마케팅/영업',
    icon: '🔍',
    cost: 2,
    timeSaved: 25,
    features: ['웹사이트 모니터링', '변경사항 감지', '자동 요약'],
    painPoints: ['수동 경쟁사 모니터링', '변경사항 놓침', '요약 작업 반복'],
    difficulty: 'easy',
    popularity: 4,
    tags: ['경쟁분석', '모니터링', '웹스크래핑']
  },
  {
    id: 'nps-analysis',
    name: '고객 피드백 NPS Text 분석',
    description: '고객 설문 응답 Text 데이터를 업로드하면 긍정/부정 키워드를 Tag로 분류하고 NPS Score에 따른 요약 보고서 생성',
    category: 'marketing',
    categoryName: '마케팅/영업',
    icon: '💬',
    cost: 3,
    timeSaved: 45,
    features: ['텍스트 분석', '감정 분석', '자동 태깅', 'NPS 계산'],
    painPoints: ['수동 텍스트 분석', '키워드 분류 반복', 'NPS 계산 복잡'],
    difficulty: 'hard',
    popularity: 4,
    tags: ['고객피드백', '텍스트분석', 'NPS', '감정분석']
  },
  {
    id: 'sales-funnel-email',
    name: '세일즈 퍼널 맞춤형 이메일 초안',
    description: 'Lead의 Status(관심/문의/이탈)와 이름을 입력하면 단계별 맞춤 후속 이메일 초안 생성',
    category: 'marketing',
    categoryName: '마케팅/영업',
    icon: '📧',
    cost: 1,
    timeSaved: 15,
    features: ['맞춤형 이메일', '퍼널 단계별 템플릿', '자동 개인화'],
    painPoints: ['이메일 작성 반복', '퍼널별 템플릿 관리', '개인화 작업'],
    difficulty: 'easy',
    popularity: 5,
    tags: ['이메일마케팅', '세일즈', '퍼널', '개인화']
  },
  {
    id: 'seo-blog-generator',
    name: 'SEO 키워드 기반 블로그 초안 생성',
    description: '메인 키워드 1개와 서브 키워드 2개를 입력하면 SEO 구조에 맞는 블로그 포스팅(1000자) 초안 Markdown 출력',
    category: 'marketing',
    categoryName: '마케팅/영업',
    icon: '📝',
    cost: 2,
    timeSaved: 30,
    features: ['SEO 최적화', '키워드 밀도 조절', '구조화된 포스팅'],
    painPoints: ['SEO 글 작성 어려움', '키워드 최적화 복잡', '구조화된 글쓰기'],
    difficulty: 'medium',
    popularity: 5,
    tags: ['SEO', '블로그', '콘텐츠마케팅', '키워드']
  },

  // 📝 인사 / 총무
  {
    id: 'new-employee-docs',
    name: '신규 입사자 5종 문서 자동 생성',
    description: '이름, 직무, 입사일을 입력하면 근로계약서, 보안서약서 등 5가지 필수 문서를 PDF로 자동 생성 및 저장',
    category: 'hr',
    categoryName: '인사/총무',
    icon: '🧑‍💼',
    cost: 3,
    timeSaved: 40,
    features: ['5종 문서 자동 생성', 'PDF 변환', '개인정보 자동 입력'],
    painPoints: ['문서 작성 반복', '개인정보 수동 입력', 'PDF 변환 작업'],
    difficulty: 'easy',
    popularity: 5,
    tags: ['인사관리', '문서생성', 'PDF', '자동화']
  },
  {
    id: 'expense-ocr',
    name: '개인 경비 영수증 OCR/취합',
    description: '50개 이상의 영수증 이미지 파일(개인 경비)을 업로드하면 날짜, 금액, 사용처를 OCR로 추출하고 월별 경비 보고서 Excel 생성',
    category: 'hr',
    categoryName: '인사/총무',
    icon: '🧾',
    cost: 4,
    timeSaved: 50,
    features: ['OCR 텍스트 추출', '자동 분류', 'Excel 보고서 생성'],
    painPoints: ['영수증 수동 입력', 'OCR 작업 반복', '분류 작업'],
    difficulty: 'medium',
    popularity: 4,
    tags: ['경비관리', 'OCR', 'Excel', '자동화']
  },
  {
    id: 'vacation-calendar-sync',
    name: '휴가/출장 요청 Slack → Calendar 반영',
    description: 'Slack/Email로 받은 휴가/출장 요청 텍스트를 파싱하여 팀 캘린더에 자동으로 등록',
    category: 'hr',
    categoryName: '인사/총무',
    icon: '📅',
    cost: 2,
    timeSaved: 20,
    features: ['텍스트 파싱', '캘린더 자동 등록', '승인 워크플로우'],
    painPoints: ['수동 캘린더 등록', '요청 파싱 반복', '승인 프로세스 복잡'],
    difficulty: 'medium',
    popularity: 4,
    tags: ['캘린더', '휴가관리', 'Slack', '자동화']
  },
  {
    id: 'employee-compliance-check',
    name: '직원 데이터 규정 준수 검토',
    description: '직원 데이터 Sheet에서 누락되거나 규정에 위반되는 필드를 자동으로 찾아 Highlight 및 수정 요청 이메일 초안 생성',
    category: 'hr',
    categoryName: '인사/총무',
    icon: '✅',
    cost: 2,
    timeSaved: 35,
    features: ['규정 준수 검사', '자동 하이라이트', '이메일 알림'],
    painPoints: ['수동 데이터 검토', '규정 위반 놓침', '수정 요청 반복'],
    difficulty: 'hard',
    popularity: 3,
    tags: ['규정준수', '데이터검증', 'HR', '자동화']
  },
  {
    id: 'contract-renewal-alert',
    name: '계약 만료 알림 및 갱신 프로세스',
    description: '계약서 만료일(Excel)을 분석하여 D-30, D-7 알림 Email을 담당자에게 발송하고 갱신 문서 초안 준비',
    category: 'hr',
    categoryName: '인사/총무',
    icon: '⏰',
    cost: 1,
    timeSaved: 15,
    features: ['만료일 추적', '자동 알림', '갱신 문서 준비'],
    painPoints: ['만료일 놓침', '수동 알림', '갱신 프로세스 복잡'],
    difficulty: 'easy',
    popularity: 4,
    tags: ['계약관리', '알림', '자동화', '문서관리']
  },

  // 💰 재무 / 회계
  {
    id: 'tax-invoice-ocr',
    name: '세금 계산서 대량 OCR 및 분개 Code 추천',
    description: '이미지 50개 업로드 시 공급자, 금액 추출 및 자주 사용되는 분개 Code 3가지 추천하여 ERP 입력용 Excel 생성',
    category: 'finance',
    categoryName: '재무/회계',
    icon: '💰',
    cost: 4,
    timeSaved: 60,
    features: ['대량 OCR 처리', '분개 코드 추천', 'ERP 연동'],
    painPoints: ['수동 OCR 작업', '분개 코드 찾기', 'ERP 입력 반복'],
    difficulty: 'hard',
    popularity: 5,
    tags: ['회계', 'OCR', 'ERP', '세금계산서']
  },
  {
    id: 'budget-variance-analysis',
    name: '월별 예산-실적 차이 분석 리포트',
    description: '예산 Sheet와 실제 지출 Sheet를 비교하여 10% 이상의 차이가 나는 항목만 추출하고 차이 분석 Summary 생성',
    category: 'finance',
    categoryName: '재무/회계',
    icon: '📈',
    cost: 2,
    timeSaved: 30,
    features: ['예산 대비 분석', '차이점 자동 추출', '요약 리포트'],
    painPoints: ['수동 예산 분석', '차이점 찾기 어려움', '리포트 작성 반복'],
    difficulty: 'medium',
    popularity: 4,
    tags: ['예산관리', '재무분석', 'Excel', '리포팅']
  },
  {
    id: 'bank-reconciliation',
    name: '은행 계좌 잔액 조정 자동 검증',
    description: '은행 잔고 CSV와 내부 계정 잔고 CSV를 비교하여 미확인 입출금 건 10개 이하로 Filter 및 리스트업',
    category: 'finance',
    categoryName: '재무/회계',
    icon: '🏦',
    cost: 2,
    timeSaved: 20,
    features: ['자동 대조', '미확인 거래 필터링', '리스트 자동 생성'],
    painPoints: ['수동 대조 작업', '미확인 거래 찾기', '리스트 작성 반복'],
    difficulty: 'medium',
    popularity: 4,
    tags: ['회계', '대조', '은행', '자동화']
  },
  {
    id: 'receivables-deadline-alert',
    name: '매입/매출 채권 마감일 알림',
    description: '매입/매출 채권 Sheet를 분석하여 다음 주 마감일인 건을 추출하고 담당자에게 알림 Email 초안 발송',
    category: 'finance',
    categoryName: '재무/회계',
    icon: '📋',
    cost: 1,
    timeSaved: 10,
    features: ['마감일 추적', '자동 알림', '이메일 초안'],
    painPoints: ['마감일 놓침', '수동 알림', '이메일 작성 반복'],
    difficulty: 'easy',
    popularity: 3,
    tags: ['채권관리', '알림', '이메일', '자동화']
  },
  {
    id: 'excel-to-pdf-charts',
    name: 'Excel 데이터 → PDF Chart 변환',
    description: '재무 Excel 데이터 범위를 지정하면 자동으로 3가지 필수 Chart(Bar/Pie/Line)를 생성하여 PDF로 저장',
    category: 'finance',
    categoryName: '재무/회계',
    icon: '📊',
    cost: 1,
    timeSaved: 15,
    features: ['자동 차트 생성', 'PDF 변환', '3가지 차트 타입'],
    painPoints: ['차트 생성 반복', 'PDF 변환 작업', '형식 통일 어려움'],
    difficulty: 'easy',
    popularity: 4,
    tags: ['차트', 'PDF', 'Excel', '재무리포트']
  },

  // 💡 기획 / 제품
  {
    id: 'voc-analysis',
    name: '유저 피드백 VOC Sheet 정량화',
    description: 'App Store 리뷰, 설문 Text 등 200개 VOC를 업로드하면 \'버그\', \'UX 개선\', \'새 기능 요청\' 3가지로 자동 태깅 및 집계',
    category: 'product',
    categoryName: '기획/제품',
    icon: '👂',
    cost: 4,
    timeSaved: 60,
    features: ['텍스트 분석', '자동 태깅', '카테고리별 집계'],
    painPoints: ['수동 VOC 분석', '태깅 작업 반복', '집계 작업 복잡'],
    difficulty: 'hard',
    popularity: 5,
    tags: ['VOC', '텍스트분석', '제품기획', '사용자피드백']
  },
  {
    id: 'competitor-feature-analysis',
    name: '경쟁 서비스 핵심 기능 스펙 요약',
    description: '경쟁사 서비스 Deep Link 1개를 입력하면 해당 기능의 UX 흐름, 예상 기술 스택을 분석하여 Product Brief 초안 생성',
    category: 'product',
    categoryName: '기획/제품',
    icon: '🔬',
    cost: 2,
    timeSaved: 30,
    features: ['기능 분석', 'UX 흐름 파악', '기술 스택 추정'],
    painPoints: ['경쟁사 분석 반복', '기능 스펙 정리', '브리프 작성'],
    difficulty: 'medium',
    popularity: 4,
    tags: ['경쟁분석', '제품기획', 'UX', '기술스택']
  },
  {
    id: 'kpi-summary-generator',
    name: '핵심 지표 CSV → 주간 성과 Summary',
    description: 'DAU, WAU, Retention CSV를 입력하면 \'지난주 대비 증감\', \'Hypothesis와 일치 여부\'를 분석하여 Summary Text 생성',
    category: 'product',
    categoryName: '기획/제품',
    icon: '📊',
    cost: 2,
    timeSaved: 20,
    features: ['KPI 분석', '증감률 계산', '자동 요약'],
    painPoints: ['KPI 분석 반복', '증감률 계산', '요약 작성'],
    difficulty: 'medium',
    popularity: 4,
    tags: ['KPI', '데이터분석', '성과측정', '리포팅']
  },
  {
    id: 'interview-insights',
    name: '사용자 Interview Text → Insight 추출',
    description: 'Interview 녹취록 Text를 입력하면 핵심 Pain Point 3가지와 Quote를 추출하여 Notion Format으로 정리',
    category: 'product',
    categoryName: '기획/제품',
    icon: '🎤',
    cost: 2,
    timeSaved: 35,
    features: ['텍스트 분석', '인사이트 추출', 'Notion 포맷'],
    painPoints: ['녹취록 분석 반복', '인사이트 추출 어려움', '정리 작업'],
    difficulty: 'hard',
    popularity: 4,
    tags: ['인터뷰', '인사이트', 'Notion', '사용자연구']
  },
  {
    id: 'prd-template-filler',
    name: '요구사항 정의서(PRD) 표준 템플릿 채우기',
    description: '핵심 목표, 대상 고객을 입력하면 PRD의 Goals, Success Metrics, Scope Exclusions 필드를 Template에 맞게 자동 작성',
    category: 'product',
    categoryName: '기획/제품',
    icon: '📋',
    cost: 1,
    timeSaved: 15,
    features: ['PRD 템플릿', '자동 작성', '표준화'],
    painPoints: ['PRD 작성 반복', '템플릿 관리', '표준화 어려움'],
    difficulty: 'easy',
    popularity: 3,
    tags: ['PRD', '제품기획', '템플릿', '문서화']
  }
];

// 카테고리별 서비스 필터링
export function getServicesByCategory(category: string): AutomationService[] {
  return AUTOMATION_SERVICES.filter(service => service.category === category);
}

// 인기 서비스 (상위 4개)
export function getPopularServices(): AutomationService[] {
  return AUTOMATION_SERVICES
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);
}

// 서비스 검색
export function searchServices(query: string): AutomationService[] {
  const lowercaseQuery = query.toLowerCase();
  return AUTOMATION_SERVICES.filter(service => 
    service.name.toLowerCase().includes(lowercaseQuery) ||
    service.description.toLowerCase().includes(lowercaseQuery) ||
    service.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// 서비스 ID로 찾기
export function getServiceById(id: string): AutomationService | undefined {
  return AUTOMATION_SERVICES.find(service => service.id === id);
}
