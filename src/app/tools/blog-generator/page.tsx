'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn } from '@/components/animations';
import { useAuthStore } from '@/store/authStore';

export default function BlogGeneratorPage() {
  const { user } = useAuthStore();
  const [keyword, setKeyword] = useState('');
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('');
  const [content3, setContent3] = useState('');
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [currentCredits, setCurrentCredits] = useState(10); // 데모: 현재 크레딧
  const CREDIT_COST = 3; // 블로그 생성 비용
  
  // 맞춤형 옵션
  const [blogCategory, setBlogCategory] = useState('info'); // 블로그 카테고리
  const [tone, setTone] = useState('friendly'); // 톤 앤 매너
  const [targetAudience, setTargetAudience] = useState('general'); // 타겟 독자
  const [length, setLength] = useState('medium'); // 글 길이
  const [blogStyle, setBlogStyle] = useState('basic'); // 블로그 스타일

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      setError('키워드를 입력해주세요.');
      return;
    }

    if (currentCredits < CREDIT_COST) {
      setError('크레딧이 부족합니다!');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedBlog('');

    try {
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          content1: content1.trim() || undefined,
          content2: content2.trim() || undefined,
          content3: content3.trim() || undefined,
          blogCategory,
          tone,
          targetAudience,
          length,
          blogStyle,
          userId: user?.id || 'demo-user', // 사용자 ID 전송
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '블로그 생성에 실패했습니다.');
      }

      setGeneratedBlog(data.content);
      setCurrentCredits(prev => prev - CREDIT_COST);
      
      // 데모 모드 알림
      if (data.isDemo) {
        setTimeout(() => {
          alert('💡 데모 모드로 생성되었습니다.\n\n실제 GPT-4o-mini를 사용하려면:\n1. OpenAI API 키 발급 (https://platform.openai.com/api-keys)\n2. .env.local 파일에 OPENAI_API_KEY 추가\n3. 개발 서버 재시작');
        }, 500);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || '오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedBlog], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog_${keyword.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${keyword} - WorkFree AI 블로그</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      background: #fff;
    }
    .blog-post {
      max-width: 100%;
    }
    h1 { 
      font-size: 2em; 
      margin-bottom: 0.5em; 
      color: #1a1a1a; 
      line-height: 1.3;
    }
    h2 { 
      font-size: 1.5em; 
      margin-top: 1.5em; 
      margin-bottom: 0.5em; 
      color: #2a2a2a; 
      border-bottom: 2px solid #e5e5e5; 
      padding-bottom: 0.3em; 
    }
    h3 { 
      font-size: 1.2em; 
      margin-top: 1em; 
      margin-bottom: 0.5em; 
      color: #3a3a3a; 
    }
    p { 
      margin-bottom: 1em; 
    }
    .intro {
      font-size: 1.1em;
      color: #555;
      font-style: italic;
      background: #f8f9fa;
      padding: 1em;
      border-left: 4px solid #6366f1;
      margin: 1em 0;
    }
    ul, ol { 
      margin-bottom: 1em; 
      padding-left: 2em; 
    }
    li { 
      margin-bottom: 0.5em; 
    }
    strong { 
      font-weight: 600; 
      color: #000; 
    }
    em { 
      font-style: italic; 
      color: #6366f1; 
    }
    .cta {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: white;
      padding: 1.5em;
      border-radius: 12px;
      margin-top: 2em;
      text-align: center;
    }
    .cta p {
      margin: 0.5em 0;
      color: white;
    }
    .cta strong {
      color: white;
      font-size: 1.2em;
    }
    .tag { 
      display: inline-block; 
      background: #e5e5e5; 
      padding: 4px 12px; 
      margin: 4px; 
      border-radius: 16px; 
      font-size: 0.9em; 
    }
    .tags { 
      margin-top: 2em; 
      padding-top: 1em;
      border-top: 1px solid #e5e5e5;
    }
  </style>
</head>
<body>
${generatedBlog}

<footer style="margin-top: 3em; padding-top: 2em; border-top: 1px solid #e5e5e5; text-align: center; color: #999; font-size: 0.9em;">
  <p>이 글은 WorkFree AI 블로그 생성기로 작성되었습니다.</p>
</footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog_${keyword.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    // 동적으로 jsPDF 로드
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    
    // 한글 폰트 설정 (기본 폰트는 한글 지원 안 함)
    // 제목
    doc.setFontSize(16);
    doc.text(`블로그: ${keyword}`, 20, 20);
    
    // 내용 (긴 텍스트 자동 줄바꿈)
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(generatedBlog, 170); // 170mm 너비로 줄바꿈
    doc.text(lines, 20, 35);
    
    doc.save(`blog_${keyword.replace(/\s+/g, '_')}.pdf`);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedBlog);
    alert('클립보드에 복사되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MainNavigation />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 pt-28">
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
              <Link
                href="/my/blog-history"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                📚 히스토리 보기
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ✍️ AI 블로그 자동 생성
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              키워드 + 주요 내용 3개 입력으로 완성도 높은 블로그 글을 즉시 생성하세요
            </p>
            <div className="mt-6 inline-flex items-center gap-4 bg-purple-50 dark:bg-purple-900/20 px-6 py-3 rounded-full">
              <span className="text-sm text-gray-600 dark:text-gray-400">보유 크레딧</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {currentCredits}
              </span>
              <span className="text-sm text-gray-500">| 사용: {CREDIT_COST} 크레딧</span>
            </div>
          </div>
        </FadeIn>

        {/* 입력 영역 */}
        <FadeIn delay={0.1}>
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span>📝</span>
                <span>블로그 정보 입력</span>
              </h2>

              {/* 블로그 카테고리 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📁 블로그 종류
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setBlogCategory('info')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      blogCategory === 'info'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    📰 정보성
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogCategory('review')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      blogCategory === 'review'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    ⭐ 리뷰
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogCategory('guide')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      blogCategory === 'guide'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    📖 가이드
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogCategory('story')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      blogCategory === 'story'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    ✍️ 스토리
                  </button>
                </div>
              </div>

              {/* 키워드 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  키워드 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="예: ChatGPT, 블로그 마케팅, SEO 최적화"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                  disabled={isGenerating}
                />
              </div>

              {/* 말투 (종결어미) 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🎭 말투 (종결어미)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTone('friendly')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      tone === 'friendly'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    😊 ~해요체
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('professional')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      tone === 'professional'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    💼 ~습니다체
                  </button>
                  <button
                    type="button"
                    onClick={() => setTone('casual')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      tone === 'casual'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    😎 반말
                  </button>
                </div>
              </div>

              {/* 타겟 독자 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  👥 타겟 독자
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetAudience('general')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      targetAudience === 'general'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    🌐 일반인
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetAudience('professional')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      targetAudience === 'professional'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    💼 직장인
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetAudience('student')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      targetAudience === 'student'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    🎓 학생
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetAudience('expert')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      targetAudience === 'expert'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    🔬 전문가
                  </button>
                </div>
              </div>

              {/* 글 길이 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📏 글 길이
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setLength('short')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      length === 'short'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    짧게<br /><span className="text-xs opacity-80">~1200자</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLength('medium')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      length === 'medium'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    보통<br /><span className="text-xs opacity-80">~2000자</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLength('long')}
                    disabled={isGenerating}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      length === 'long'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    길게<br /><span className="text-xs opacity-80">~3500자</span>
                  </button>
                </div>
              </div>

              {/* 블로그 스타일 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ✨ 블로그 스타일
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setBlogStyle('basic')}
                    disabled={isGenerating}
                    className={`px-4 py-4 rounded-xl font-semibold transition-all text-left ${
                      blogStyle === 'basic'
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold mb-1">📝 기본형 (전문성 중심)</div>
                    <div className="text-xs opacity-80">실무 문제 제기 → 해결 방법 → 구체적 예시</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogStyle('seo')}
                    disabled={isGenerating}
                    className={`px-4 py-4 rounded-xl font-semibold transition-all text-left ${
                      blogStyle === 'seo'
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold mb-1">🔍 SEO 최적화형 (검색 노출)</div>
                    <div className="text-xs opacity-80">키워드 최적화 + HTML 구조 + 태그 포함</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogStyle('marketing')}
                    disabled={isGenerating}
                    className={`px-4 py-4 rounded-xl font-semibold transition-all text-left ${
                      blogStyle === 'marketing'
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-bold mb-1">💬 마케팅형 (스토리텔링)</div>
                    <div className="text-xs opacity-80">감정 몰입 + 짧은 문장 + CTA 강조</div>
                  </button>
                </div>
              </div>

              {/* 주요 내용 3개 입력 */}
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  포함할 주요 내용 (선택)
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  블로그에 포함하고 싶은 구체적인 내용을 입력하면 더 완성도 높은 글이 생성됩니다.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      💡 내용 1
                    </label>
                    <textarea
                      value={content1}
                      onChange={(e) => setContent1(e.target.value)}
                      placeholder="예: RPA 도구를 활용하면 반복 작업을 자동화할 수 있습니다. 특히 엑셀 데이터 정리, 메일 발송 등에 효과적입니다."
                      className="w-full px-3 py-2 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all text-sm"
                      rows={2}
                      disabled={isGenerating}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      💡 내용 2
                    </label>
                    <textarea
                      value={content2}
                      onChange={(e) => setContent2(e.target.value)}
                      placeholder="예: AI 자동화 스튜디오를 사용하면 코딩 없이도 웹에서 바로 자동화를 실행할 수 있습니다."
                      className="w-full px-3 py-2 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all text-sm"
                      rows={2}
                      disabled={isGenerating}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      💡 내용 3
                    </label>
                    <textarea
                      value={content3}
                      onChange={(e) => setContent3(e.target.value)}
                      placeholder="예: 크레딧 기반 시스템으로 필요한 만큼만 사용하고 비용을 절감할 수 있습니다."
                      className="w-full px-3 py-2 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none transition-all text-sm"
                      rows={2}
                      disabled={isGenerating}
                    />
                  </div>
                </div>
              </div>

              {/* 생성 버튼 */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || currentCredits < CREDIT_COST}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg transition-all
                  ${isGenerating || currentCredits < CREDIT_COST
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02]'
                  }
                `}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    생성 중...
                  </span>
                ) : currentCredits < CREDIT_COST ? (
                  '크레딧 부족'
                ) : (
                  `✨ 블로그 글 생성하기 (${CREDIT_COST} 크레딧)`
                )}
              </button>

              {/* 에러 메시지 */}
              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 결과 영역 */}
        <FadeIn delay={0.2}>
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span>📄</span>
                <span>생성 결과</span>
              </h2>

              {generatedBlog ? (
                <>
                  {/* 생성된 블로그 글 (미리보기) */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      ✨ 생성된 블로그
                    </h3>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-2 border-purple-200 dark:border-purple-800">
                      <div 
                        className="blog-preview"
                        dangerouslySetInnerHTML={{ __html: generatedBlog }}
                      />
                    </div>
                  </div>

                  {/* HTML 코드 복사 섹션 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        💻 HTML 코드 (블로그에 붙여넣기)
                      </h3>
                      <button
                        onClick={handleCopyToClipboard}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                      >
                        📋 코드 복사
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 border-2 border-gray-700 max-h-60 overflow-y-auto">
                      <pre className="text-xs text-green-400 font-mono leading-relaxed">
                        {generatedBlog}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      💡 위 HTML 코드를 복사해서 티스토리, 네이버 블로그 등에 붙여넣으세요.
                    </p>
                  </div>
                  
                  <style jsx>{`
                    .blog-preview {
                      font-size: 14px;
                      line-height: 1.6;
                      color: #333;
                    }
                    .blog-preview :global(.blog-post) {
                      max-width: 100%;
                    }
                    .blog-preview :global(h1) {
                      font-size: 1.8em;
                      font-weight: bold;
                      margin-bottom: 0.5em;
                      color: #1a1a1a;
                      line-height: 1.3;
                    }
                    .blog-preview :global(h2) {
                      font-size: 1.4em;
                      font-weight: bold;
                      margin-top: 1.5em;
                      margin-bottom: 0.5em;
                      color: #2a2a2a;
                      border-bottom: 2px solid #e5e5e5;
                      padding-bottom: 0.3em;
                    }
                    .blog-preview :global(h3) {
                      font-size: 1.15em;
                      font-weight: 600;
                      margin-top: 1em;
                      margin-bottom: 0.5em;
                      color: #3a3a3a;
                    }
                    .blog-preview :global(p) {
                      margin-bottom: 1em;
                    }
                    .blog-preview :global(.intro) {
                      font-size: 1.1em;
                      color: #555;
                      font-style: italic;
                      background: #f8f9fa;
                      padding: 1em;
                      border-left: 4px solid #6366f1;
                      margin: 1em 0;
                    }
                    .blog-preview :global(ul), 
                    .blog-preview :global(ol) {
                      margin-bottom: 1em;
                      padding-left: 2em;
                    }
                    .blog-preview :global(li) {
                      margin-bottom: 0.5em;
                    }
                    .blog-preview :global(strong) {
                      font-weight: 600;
                      color: #000;
                    }
                    .blog-preview :global(em) {
                      font-style: italic;
                      color: #6366f1;
                    }
                    .blog-preview :global(.cta) {
                      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                      color: white;
                      padding: 1.5em;
                      border-radius: 12px;
                      margin-top: 2em;
                      text-align: center;
                    }
                    .blog-preview :global(.cta p) {
                      margin: 0.5em 0;
                      color: white;
                    }
                    .blog-preview :global(.cta strong) {
                      color: white;
                      font-size: 1.2em;
                    }
                    .blog-preview :global(.tag) {
                      display: inline-block;
                      background: #e5e5e5;
                      padding: 4px 12px;
                      margin: 4px;
                      border-radius: 16px;
                      font-size: 0.9em;
                    }
                    .blog-preview :global(.tags) {
                      margin-top: 2em;
                      padding-top: 1em;
                      border-top: 1px solid #e5e5e5;
                    }
                  `}</style>

                  {/* 파일 다운로드 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      💾 파일로 저장
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={handleDownloadTxt}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                      >
                        📄 TXT
                      </button>
                      <button
                        onClick={handleDownloadHtml}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                      >
                        🌐 HTML
                      </button>
                      <button
                        onClick={handleDownloadPdf}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                      >
                        📑 PDF
                      </button>
                    </div>
                  </div>

                  {/* 통계 */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">글자 수</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {generatedBlog.length}
                      </div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">사용 크레딧</div>
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {CREDIT_COST}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4">✍️</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    아직 생성된 글이 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    키워드를 입력하고<br />블로그 글 생성 버튼을 눌러보세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 주요 기능 */}
        <FadeIn delay={0.25}>
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                주요 기능
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>GPT-4o-mini 최신 모델 사용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📁 4가지 블로그 종류 (정보성/리뷰/가이드/스토리)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>3가지 블로그 스타일 (기본/SEO/마케팅)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🎭 종결어미 선택 (해요체/습니다체/반말)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>💡 주요 내용 3개 입력으로 완성도 향상</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🖼️ HTML 미리보기 기능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>TXT/HTML/PDF 다운로드</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* 하단 정보 */}
          <FadeIn delay={0.3}>
            <div className="max-w-5xl mx-auto mt-8">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-8 border-2 border-orange-200 dark:border-orange-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  시간 절약 효과
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">1회 사용 당</div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      30분 절약
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      블로그 글 직접 작성 시간
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">한 달 (20회) 사용 당</div>
                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      10시간 절약
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      월 약 20개 블로그 글 작성 기준
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
    </div>
  );
}


