"use client";

import { useState } from "react";
import Link from "next/link";
import MainNavigation from "@/components/MainNavigation";
import { FadeIn } from "@/components/animations";
import { useAuth } from "@/hooks/useAuth";

// 이메일 템플릿 타입 정의
interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  variables: string[];
  description: string;
}

// 템플릿 카테고리
const CATEGORIES = [
  {
    id: 'business',
    name: '비즈니스',
    icon: '📊',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100'
  },
  {
    id: 'hr',
    name: '인사/총무',
    icon: '💼',
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100'
  },
  {
    id: 'sales',
    name: '영업/마케팅',
    icon: '💰',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100'
  },
  {
    id: 'education',
    name: '교육/훈련',
    icon: '🎓',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-50 to-orange-100'
  },
  {
    id: 'personal',
    name: '개인/일상',
    icon: '👤',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'from-pink-50 to-pink-100'
  }
];

// 템플릿 라이브러리
const EMAIL_TEMPLATES: EmailTemplate[] = [
  // 비즈니스 카테고리
  {
    id: 'meeting-request',
    name: '회의 요청',
    category: 'business',
    subject: '[{회사명}] {제목} 회의 요청',
    content: `안녕하세요 {수신자명}님,

{회사명} {발신자명}입니다.

{제목}에 대해 논의하고자 회의를 요청드립니다.

📅 일시: {날짜} {시간}
📍 장소: {장소}
⏰ 소요시간: {소요시간}

회의 안건:
• {안건1}
• {안건2}
• {안건3}

참석 가능하신지 확인 부탁드립니다.

감사합니다.

{발신자명}
{직책}
{회사명}
{연락처}`,
    variables: ['수신자명', '회사명', '발신자명', '제목', '날짜', '시간', '장소', '소요시간', '안건1', '안건2', '안건3', '직책', '연락처'],
    description: '공식적인 회의 요청 이메일 템플릿'
  },
  {
    id: 'project-update',
    name: '프로젝트 업데이트',
    category: 'business',
    subject: '[{프로젝트명}] 진행 상황 보고',
    content: `안녕하세요 {수신자명}님,

{프로젝트명} 프로젝트의 진행 상황을 보고드립니다.

📈 현재 진행률: {진행률}%
📅 완료 예정일: {완료예정일}

✅ 완료된 작업:
• {완료작업1}
• {완료작업2}

🔄 진행 중인 작업:
• {진행작업1}
• {진행작업2}

⚠️ 이슈사항:
• {이슈1}
• {이슈2}

다음 주 계획:
• {다음계획1}
• {다음계획2}

문의사항이 있으시면 언제든 연락주세요.

{발신자명}
{직책}
{회사명}`,
    variables: ['수신자명', '프로젝트명', '진행률', '완료예정일', '완료작업1', '완료작업2', '진행작업1', '진행작업2', '이슈1', '이슈2', '다음계획1', '다음계획2', '발신자명', '직책', '회사명'],
    description: '프로젝트 진행 상황을 체계적으로 보고하는 템플릿'
  },

  // 인사/총무 카테고리
  {
    id: 'welcome-new-employee',
    name: '신입사원 환영',
    category: 'hr',
    subject: '환영합니다! {신입사원명}님의 첫 출근 안내',
    content: `안녕하세요 {신입사원명}님,

{회사명}에 입사하신 것을 진심으로 환영합니다!

📅 첫 출근일: {첫출근일}
🕘 출근 시간: {출근시간}
📍 출근 장소: {출근장소}

📋 첫 출근 시 준비물:
• 신분증
• 계약서
• {기타준비물1}
• {기타준비물2}

👥 담당자 정보:
• 담당자: {담당자명}
• 연락처: {담당자연락처}
• 이메일: {담당자이메일}

🏢 회사 소개:
{회사소개}

첫 출근이 기대되시길 바랍니다. 궁금한 점이 있으시면 언제든 연락주세요.

{담당자명}
{직책}
{회사명}`,
    variables: ['신입사원명', '회사명', '첫출근일', '출근시간', '출근장소', '기타준비물1', '기타준비물2', '담당자명', '담당자연락처', '담당자이메일', '회사소개', '직책'],
    description: '신입사원을 따뜻하게 환영하는 이메일 템플릿'
  },

  // 영업/마케팅 카테고리
  {
    id: 'client-follow-up',
    name: '고객 후속 연락',
    category: 'sales',
    subject: '[{회사명}] {제품명} 관련 후속 안내',
    content: `안녕하세요 {고객명}님,

{회사명} {발신자명}입니다.

지난 {날짜}에 {제품명}에 대해 상담해주셔서 감사합니다.

📋 상담 내용 요약:
• {상담내용1}
• {상담내용2}

💡 제안사항:
• {제안1}
• {제안2}

📄 첨부 자료:
• {첨부자료1}
• {첨부자료2}

다음 단계:
• {다음단계1}
• {다음단계2}

궁금한 점이 있으시면 언제든 연락주세요.

{발신자명}
{직책}
{회사명}
{연락처}`,
    variables: ['고객명', '회사명', '발신자명', '날짜', '제품명', '상담내용1', '상담내용2', '제안1', '제안2', '첨부자료1', '첨부자료2', '다음단계1', '다음단계2', '직책', '연락처'],
    description: '고객 상담 후 후속 조치를 위한 이메일 템플릿'
  },

  // 교육/훈련 카테고리
  {
    id: 'course-announcement',
    name: '강의 안내',
    category: 'education',
    subject: '[{과정명}] 수강 안내 및 준비사항',
    content: `안녕하세요 {수강생명}님,

{과정명} 수강을 신청해주셔서 감사합니다.

📚 과정 정보:
• 과정명: {과정명}
• 강사: {강사명}
• 일정: {시작일} ~ {종료일}
• 시간: {수업시간}
• 장소: {장소}

📋 준비사항:
• {준비물1}
• {준비물2}
• {준비물3}

📖 교재 및 자료:
• {교재1}
• {교재2}

💻 온라인 접속 정보:
• 플랫폼: {플랫폼}
• 링크: {링크}
• ID: {아이디}
• 비밀번호: {비밀번호}

문의사항이 있으시면 연락주세요.

{강사명}
{직책}
{기관명}`,
    variables: ['수강생명', '과정명', '강사명', '시작일', '종료일', '수업시간', '장소', '준비물1', '준비물2', '준비물3', '교재1', '교재2', '플랫폼', '링크', '아이디', '비밀번호', '직책', '기관명'],
    description: '교육 과정 수강생에게 안내하는 이메일 템플릿'
  }
];

export default function EmailTemplatePage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('business');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  
  // AI 생성 관련 상태
  const [aiMode, setAiMode] = useState<boolean>(false);
  const [aiContext, setAiContext] = useState<string>('');
  const [aiRecipientInfo, setAiRecipientInfo] = useState({
    name: '',
    company: '',
    relationship: ''
  });
  const [aiTone, setAiTone] = useState<'formal' | 'casual' | 'friendly'>('formal');
  const [aiLanguage, setAiLanguage] = useState<'ko' | 'en' | 'ja'>('ko');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  // 선택된 카테고리의 템플릿들 필터링
  const filteredTemplates = EMAIL_TEMPLATES.filter(template => template.category === selectedCategory);

  // 변수 치환 함수
  const replaceVariables = (text: string, vars: Record<string, string>) => {
    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      return vars[key] || `{${key}}`;
    });
  };

  // AI 이메일 생성 함수
  const handleAiGenerate = async () => {
    if (!aiContext.trim()) {
      setAiError('상황 설명을 입력해주세요.');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const response = await fetch('/api/email-template/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          context: aiContext,
          recipientInfo: aiRecipientInfo,
          tone: aiTone,
          language: aiLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI 생성 실패');
      }

      const data = await response.json();
      
      // AI 생성 결과를 템플릿으로 변환
      const aiTemplate: EmailTemplate = {
        id: 'ai-generated',
        name: 'AI 생성 이메일',
        category: selectedCategory,
        subject: data.email.subject,
        content: data.email.content,
        variables: data.email.variables,
        description: 'AI가 생성한 맞춤형 이메일'
      };

      setSelectedTemplate(aiTemplate);
      setPreviewMode('edit');
      
      // 변수 초기화
      const initialVars: Record<string, string> = {};
      data.email.variables.forEach((variable: string) => {
        initialVars[variable] = '';
      });
      setVariables(initialVars);

    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI 생성 중 오류가 발생했습니다');
    } finally {
      setAiLoading(false);
    }
  };

  // 템플릿 선택 핸들러
  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setPreviewMode('edit');
    
    // 변수 초기화
    const initialVars: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVars[variable] = '';
    });
    setVariables(initialVars);
  };

  // 변수 값 변경 핸들러
  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  // 미리보기 생성
  const generatePreview = () => {
    if (!selectedTemplate) return { subject: '', content: '' };
    
    return {
      subject: replaceVariables(selectedTemplate.subject, variables),
      content: replaceVariables(selectedTemplate.content, variables)
    };
  };

  // 다운로드 핸들러
  const handleDownload = (format: 'html' | 'txt') => {
    if (!selectedTemplate) return;
    
    const preview = generatePreview();
    const content = format === 'html' 
      ? `<html><body><h2>${preview.subject}</h2><pre>${preview.content.replace(/\n/g, '<br>')}</pre></body></html>`
      : `${preview.subject}\n\n${preview.content}`;
    
    const blob = new Blob([content], { type: format === 'html' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.name}-${new Date().getTime()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      <MainNavigation />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 pt-24 md:pt-20">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link
                href="/tools"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                ← 도구 목록으로
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              📧 WorkFree 이메일 템플릿 생성기
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              상황에 맞는 완벽한 이메일을 빠르게 생성하세요
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              변수 치환, 실시간 미리보기, 다운로드까지 한 번에
            </p>
          </div>
        </FadeIn>

        {/* 로그인 안내 */}
        {!isAuthenticated && (
          <FadeIn delay={0.1}>
            <div className="max-w-6xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    로그인이 필요합니다
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    이메일 템플릿 생성을 위해 WorkFree 계정으로 로그인해주세요
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/login"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      로그인하기
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-white border-2 border-purple-300 text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all"
                    >
                      회원가입
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* 메인 컨텐츠 */}
        {isAuthenticated && (
          <>
            {/* 카테고리 선택 */}
            <FadeIn delay={0.1}>
              <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-800">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    📂 카테고리 선택
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-4 rounded-xl text-center transition-all ${
                          selectedCategory === category.id
                            ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div className="font-semibold">{category.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* AI 생성 모드 토글 */}
            <FadeIn delay={0.15}>
              <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      🤖 AI 이메일 생성
                    </h2>
                    <button
                      onClick={() => setAiMode(!aiMode)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        aiMode
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {aiMode ? 'AI 모드 ON' : 'AI 모드 OFF'}
                    </button>
                  </div>
                  
                  {aiMode && (
                    <div className="space-y-6">
                      {/* 상황 설명 */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          📝 상황 설명 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={aiContext}
                          onChange={(e) => setAiContext(e.target.value)}
                          placeholder="예: 신규 고객에게 제품 소개 이메일을 보내고 싶습니다. 우리 회사의 AI 솔루션을 홍보하고 싶어요."
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white h-24 resize-none"
                        />
                      </div>

                      {/* 수신자 정보 */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            수신자 이름
                          </label>
                          <input
                            type="text"
                            value={aiRecipientInfo.name}
                            onChange={(e) => setAiRecipientInfo(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="홍길동"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            회사명
                          </label>
                          <input
                            type="text"
                            value={aiRecipientInfo.company}
                            onChange={(e) => setAiRecipientInfo(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="ABC 회사"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            관계
                          </label>
                          <input
                            type="text"
                            value={aiRecipientInfo.relationship}
                            onChange={(e) => setAiRecipientInfo(prev => ({ ...prev, relationship: e.target.value }))}
                            placeholder="고객, 동료, 상사"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* 톤앤매너 및 언어 */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            톤앤매너
                          </label>
                          <select
                            value={aiTone}
                            onChange={(e) => setAiTone(e.target.value as 'formal' | 'casual' | 'friendly')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          >
                            <option value="formal">공식적</option>
                            <option value="casual">편안한</option>
                            <option value="friendly">친근한</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            언어
                          </label>
                          <select
                            value={aiLanguage}
                            onChange={(e) => setAiLanguage(e.target.value as 'ko' | 'en' | 'ja')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          >
                            <option value="ko">한국어</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                          </select>
                        </div>
                      </div>

                      {/* AI 생성 버튼 */}
                      <div className="text-center">
                        <button
                          onClick={handleAiGenerate}
                          disabled={!aiContext.trim() || aiLoading}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                            !aiContext.trim() || aiLoading
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                          }`}
                        >
                          {aiLoading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              AI 생성 중...
                            </span>
                          ) : (
                            '🤖 AI로 이메일 생성하기'
                          )}
                        </button>
                      </div>

                      {/* 에러 메시지 */}
                      {aiError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
                          ⚠️ {aiError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* 템플릿 선택 (AI 모드가 아닐 때만 표시) */}
            {!aiMode && (
              <FadeIn delay={0.2}>
                <div className="max-w-6xl mx-auto mb-8">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                      📝 템플릿 선택
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`p-6 rounded-xl text-left transition-all ${
                            selectedTemplate?.id === template.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                          <p className="text-sm opacity-80">{template.description}</p>
                          <div className="mt-2 text-xs opacity-60">
                            변수 {template.variables.length}개
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            )}

            {/* 템플릿 에디터 */}
            {selectedTemplate && (
              <FadeIn delay={0.3}>
                <div className="max-w-6xl mx-auto mb-8">
                  <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        ✏️ 템플릿 편집: {selectedTemplate.name}
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewMode('edit')}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            previewMode === 'edit'
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          편집
                        </button>
                        <button
                          onClick={() => setPreviewMode('preview')}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            previewMode === 'preview'
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          미리보기
                        </button>
                      </div>
                    </div>

                    {previewMode === 'edit' ? (
                      <div className="space-y-6">
                        {/* 변수 입력 폼 */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            📝 변수 입력
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {selectedTemplate.variables.map((variable) => (
                              <div key={variable}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {variable}
                                </label>
                                <input
                                  type="text"
                                  value={variables[variable] || ''}
                                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                                  placeholder={`{${variable}}`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* 미리보기 */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            📧 이메일 미리보기
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                제목:
                              </label>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {generatePreview().subject}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                내용:
                              </label>
                              <div className="whitespace-pre-wrap text-gray-900 dark:text-white bg-white dark:bg-gray-900 p-4 rounded border">
                                {generatePreview().content}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 다운로드 버튼 */}
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={() => handleDownload('html')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all"
                          >
                            📄 HTML 다운로드
                          </button>
                          <button
                            onClick={() => handleDownload('txt')}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all"
                          >
                            📝 TXT 다운로드
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            )}
          </>
        )}

        {/* 주요 기능 안내 */}
        <FadeIn delay={0.4}>
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                주요 기능
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📂 5개 카테고리, 20+ 전문 템플릿</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🔧 변수 치환 시스템으로 개인화</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>👀 실시간 미리보기로 결과 확인</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📥 HTML/TXT 형식으로 다운로드</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>⚡ 클릭 몇 번으로 완성된 이메일</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
