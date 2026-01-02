import PptxGenJS from 'pptxgenjs';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

// PPT 생성
function createPPT() {
  const pptx = new PptxGenJS();
  
  // 슬라이드 1: 커버
  const slide1 = pptx.addSlide();
  slide1.background = { color: '1E3A8A' }; // 파란색 배경
  slide1.addText('WorkFree', {
    x: 1,
    y: 2,
    w: 8,
    h: 1.5,
    fontSize: 72,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
  });
  slide1.addText('직장인 AI 자동화 SaaS', {
    x: 1,
    y: 3.5,
    w: 8,
    h: 0.8,
    fontSize: 36,
    color: 'FFFFFF',
    align: 'center',
  });
  slide1.addText('"클릭 한 번으로 업무 3시간 단축"', {
    x: 1,
    y: 4.5,
    w: 8,
    h: 0.6,
    fontSize: 24,
    color: 'E0E7FF',
    align: 'center',
    italic: true,
  });
  
  // 슬라이드 2: 프로젝트 소개
  const slide2 = pptx.addSlide();
  slide2.addText('프로젝트 소개', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  slide2.addText('WorkFree는 직장인을 위한 웹 기반 AI 자동화 SaaS 플랫폼입니다.', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bullet: true,
  });
  slide2.addText('설치 없이 브라우저에서 바로 사용 가능', {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true,
  });
  slide2.addText('반복 업무를 AI로 자동화하여 하루 2-3시간 절약', {
    x: 0.5,
    y: 2.8,
    w: 9,
    h: 0.5,
    fontSize: 20,
    bullet: true,
  });
  slide2.addText('핵심 가치: "클릭 한 번으로 업무 3시간 단축"', {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: '059669',
  });
  
  // 슬라이드 3: 제공 서비스 (7개 도구)
  const slide3 = pptx.addSlide();
  slide3.addText('제공 서비스 (7개 AI 도구)', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  const tools = [
    { name: '블로그 생성기', price: '3C', time: '1시간 → 10분' },
    { name: '보고서 생성기', price: '5C', time: '2시간 → 15분' },
    { name: '이미지 검색', price: '1C', time: '30분 → 3분' },
    { name: 'QR 생성기', price: '2C', time: '1시간 → 5분' },
    { name: '이메일 템플릿', price: '1C', time: '30분 → 5분' },
    { name: '환율 알리미', price: '2C', time: '매일 10분 절약' },
    { name: 'FRI 매뉴얼봇', price: '1C', time: '20분 → 2분' },
  ];
  
  tools.forEach((tool, index) => {
    const yPos = 1.5 + (index * 0.7);
    slide3.addText(`${index + 1}. ${tool.name}`, {
      x: 0.5,
      y: yPos,
      w: 4,
      h: 0.5,
      fontSize: 18,
      bold: true,
    });
    slide3.addText(`가격: ${tool.price} | 시간 절약: ${tool.time}`, {
      x: 5,
      y: yPos,
      w: 4.5,
      h: 0.5,
      fontSize: 16,
      color: '6B7280',
    });
  });
  
  slide3.addText('효과: 월 40시간 절약 = 5일치 업무 단축', {
    x: 0.5,
    y: 6.5,
    w: 9,
    h: 0.6,
    fontSize: 20,
    bold: true,
    color: '059669',
  });
  
  // 슬라이드 4: 비즈니스 모델
  const slide4 = pptx.addSlide();
  slide4.addText('비즈니스 모델', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  slide4.addText('크레딧 시스템', {
    x: 0.5,
    y: 1.5,
    w: 4,
    h: 0.6,
    fontSize: 28,
    bold: true,
  });
  slide4.addText('• 1 크레딧 = 1,000원\n• 사용한 만큼만 결제\n• 소멸 없음 (영구 보관)\n• 패키지: 스타터(10C) ~ 프리미엄(130C)', {
    x: 0.5,
    y: 2.2,
    w: 4,
    h: 2,
    fontSize: 18,
  });
  
  slide4.addText('월간 구독 (출시 예정)', {
    x: 5.5,
    y: 1.5,
    w: 4,
    h: 0.6,
    fontSize: 28,
    bold: true,
  });
  slide4.addText('• 프리미엄: 29,900원/월 (40C/월)\n• 팀: 99,000원/월 (10명, 200C 공유)\n• 엔터프라이즈: 맞춤 견적', {
    x: 5.5,
    y: 2.2,
    w: 4,
    h: 2,
    fontSize: 18,
  });
  
  // 슬라이드 5: 타겟 고객
  const slide5 = pptx.addSlide();
  slide5.addText('타겟 고객', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  slide5.addText('주 타겟', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
  });
  slide5.addText('마케팅·기획·영업 직장인 (25-40세)', {
    x: 0.5,
    y: 2.1,
    w: 9,
    h: 0.5,
    fontSize: 20,
  });
  
  slide5.addText('페인 포인트', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
  });
  slide5.addText('• 반복 업무에 2-3시간 소모\n• 기존 도구는 복잡하고 비쌈\n• 여러 도구 구독 시 월 5-10만원 지출', {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 1.5,
    fontSize: 18,
  });
  
  slide5.addText('해결책', {
    x: 0.5,
    y: 5.2,
    w: 9,
    h: 0.5,
    fontSize: 24,
    bold: true,
  });
  slide5.addText('웹에서 즉시 사용 | 한글 완벽 지원 | 건당 결제', {
    x: 0.5,
    y: 5.8,
    w: 9,
    h: 0.6,
    fontSize: 20,
    color: '059669',
    bold: true,
  });
  
  // 슬라이드 6: 기술 스택
  const slide6 = pptx.addSlide();
  slide6.addText('기술 스택', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  const techStack = [
    { category: 'Frontend', tech: 'Next.js 15, React 19, TypeScript, Tailwind CSS 4' },
    { category: 'Backend', tech: 'Supabase (PostgreSQL), Firebase (Storage)' },
    { category: 'AI', tech: 'OpenAI GPT-4 API' },
    { category: '결제', tech: 'Toss Payments' },
    { category: '인프라', tech: 'Vercel (호스팅), AWS S3 (예정)' },
  ];
  
  techStack.forEach((item, index) => {
    const yPos = 1.5 + (index * 0.9);
    slide6.addText(item.category, {
      x: 0.5,
      y: yPos,
      w: 2.5,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: '1E3A8A',
    });
    slide6.addText(item.tech, {
      x: 3.2,
      y: yPos,
      w: 6.3,
      h: 0.5,
      fontSize: 18,
    });
  });
  
  // 슬라이드 7: 현재 상태
  const slide7 = pptx.addSlide();
  slide7.addText('현재 상태', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  slide7.addText('완료된 기능 ✅', {
    x: 0.5,
    y: 1.5,
    w: 4.5,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '059669',
  });
  slide7.addText('• 7개 AI 도구 구현 완료\n• 크레딧 시스템 구축\n• 결제 시스템 통합\n• 사용자 인증\n• 커뮤니티 게시판\n• 피드백 시스템\n• Analytics 대시보드', {
    x: 0.5,
    y: 2.2,
    w: 4.5,
    h: 3.5,
    fontSize: 16,
  });
  
  slide7.addText('진행 중 🔄', {
    x: 5.5,
    y: 1.5,
    w: 4,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: 'F59E0B',
  });
  slide7.addText('• 베타 테스터 100명 모집\n• 사용자 피드백 수집\n• 게이미피케이션 고도화\n• 성능 최적화', {
    x: 5.5,
    y: 2.2,
    w: 4,
    h: 2.5,
    fontSize: 16,
  });
  
  // 슬라이드 8: 차별화 포인트
  const slide8 = pptx.addSlide();
  slide8.addText('차별화 포인트', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  const differentiators = [
    '한국형 로컬라이제이션 - 한국 직장인 업무 문화 맞춤',
    '올인원 플랫폼 - 7개 도구를 하나의 크레딧으로 사용',
    '건당 결제 - 월 구독 부담 없이 사용한 만큼만 결제',
    '노코드 - 설치 없이 웹 브라우저에서 5분 안에 시작',
    '게이미피케이션 - 레벨업, 미션, 시간 은행',
  ];
  
  differentiators.forEach((item, index) => {
    const yPos = 1.5 + (index * 0.9);
    slide8.addText(`${index + 1}. ${item}`, {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.7,
      fontSize: 18,
      bullet: true,
    });
  });
  
  // 슬라이드 9: 시장 및 목표
  const slide9 = pptx.addSlide();
  slide9.addText('시장 및 목표', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  slide9.addText('시장 규모', {
    x: 0.5,
    y: 1.5,
    w: 4.5,
    h: 0.5,
    fontSize: 24,
    bold: true,
  });
  slide9.addText('SAM: 2,000억 원\n(60만 명 타겟)', {
    x: 0.5,
    y: 2.1,
    w: 4.5,
    h: 1,
    fontSize: 20,
  });
  
  slide9.addText('목표', {
    x: 5.5,
    y: 1.5,
    w: 4,
    h: 0.5,
    fontSize: 24,
    bold: true,
  });
  slide9.addText('1차년도: 5,000명, 5,000만원\n3차년도: 40,000명, 50억원', {
    x: 5.5,
    y: 2.1,
    w: 4,
    h: 1,
    fontSize: 20,
  });
  
  // 슬라이드 10: 향후 계획
  const slide10 = pptx.addSlide();
  slide10.addText('향후 계획', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  slide10.addText('Phase 2 (1-3개월)', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.5,
    fontSize: 22,
    bold: true,
  });
  slide10.addText('월간 구독 모델, 팀 협업, 모바일 최적화, 추가 AI 도구 5개', {
    x: 0.5,
    y: 2.1,
    w: 9,
    h: 0.5,
    fontSize: 18,
  });
  
  slide10.addText('Phase 3 (4-6개월)', {
    x: 0.5,
    y: 3,
    w: 9,
    h: 0.5,
    fontSize: 22,
    bold: true,
  });
  slide10.addText('B2B 기업용 플랜, API 제공, 템플릿 마켓플레이스', {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.5,
    fontSize: 18,
  });
  
  slide10.addText('Phase 4 (7-12개월)', {
    x: 0.5,
    y: 4.5,
    w: 9,
    h: 0.5,
    fontSize: 22,
    bold: true,
  });
  slide10.addText('자체 Fine-tuned AI 모델, 브라우저 확장, 시리즈A 투자 유치', {
    x: 0.5,
    y: 5.1,
    w: 9,
    h: 0.5,
    fontSize: 18,
  });
  
  // 슬라이드 11: 핵심 메시지
  const slide11 = pptx.addSlide();
  slide11.background = { color: '1E3A8A' };
  slide11.addText('"일 안 하고도 일하는 사람들의 비밀도구"', {
    x: 1,
    y: 2.5,
    w: 8,
    h: 1.5,
    fontSize: 48,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
  });
  slide11.addText('WorkFree는 직장인들이 반복 업무에서 해방되어\n더 가치 있는 일에 집중할 수 있도록 돕는 AI 자동화 플랫폼입니다.', {
    x: 1,
    y: 4.5,
    w: 8,
    h: 1,
    fontSize: 24,
    color: 'E0E7FF',
    align: 'center',
  });
  
  // 슬라이드 12: 현재 상태 & 다음 단계
  const slide12 = pptx.addSlide();
  slide12.addText('현재 상태 & 다음 단계', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    bold: true,
    color: '1E3A8A',
  });
  
  slide12.addText('현재 상태', {
    x: 0.5,
    y: 1.5,
    w: 4.5,
    h: 0.5,
    fontSize: 24,
    bold: true,
  });
  slide12.addText('✅ MVP 완성\n✅ 베타 테스터 모집 중', {
    x: 0.5,
    y: 2.1,
    w: 4.5,
    h: 1.5,
    fontSize: 20,
  });
  
  slide12.addText('다음 단계', {
    x: 5.5,
    y: 1.5,
    w: 4,
    h: 0.5,
    fontSize: 24,
    bold: true,
  });
  slide12.addText('1️⃣ 베타 100명 확보\n2️⃣ 정식 런칭\n3️⃣ 시리즈A 투자 유치', {
    x: 5.5,
    y: 2.1,
    w: 4,
    h: 1.5,
    fontSize: 20,
  });
  
  // 바탕화면 경로
  let desktopPath = '';
  try {
    desktopPath = execSync(
      'powershell -Command "[Environment]::GetFolderPath(\'Desktop\')"',
      { encoding: 'utf-8' }
    ).trim();
  } catch (error) {
    const { homedir } = require('os');
    desktopPath = path.join(homedir(), 'Desktop');
  }
  
  if (!fs.existsSync(desktopPath)) {
    fs.mkdirSync(desktopPath, { recursive: true });
  }
  
  const today = new Date().toISOString().split('T')[0];
  const fileName = `WorkFree_프로젝트_개요_${today}.pptx`;
  
  // 1. 바탕화면에 저장
  const desktopFilePath = path.join(desktopPath, fileName);
  pptx.writeFile({ fileName: desktopFilePath });
  
  // 2. 프로젝트 루트에도 저장
  const projectFilePath = path.join(process.cwd(), fileName);
  pptx.writeFile({ fileName: projectFilePath });
  
  console.log(`\n✅ PPT 파일 생성 완료!`);
  console.log(`📁 바탕화면: ${desktopFilePath}`);
  console.log(`📁 프로젝트 폴더: ${projectFilePath}`);
  console.log(`\n💡 총 12개 슬라이드가 포함되어 있습니다.`);
  
  // 파일 탐색기로 열기
  try {
    execSync(`explorer.exe "${desktopPath}"`);
  } catch (error) {
    // 무시
  }
  
  return { desktop: desktopFilePath, project: projectFilePath };
}

// 실행
try {
  createPPT();
} catch (error) {
  console.error('❌ 오류 발생:', error);
  process.exit(1);
}



