'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { useAuth } from '@/hooks/useAuth';
import { getUserBlogHistory } from '@/lib/blogHistory';
import { BlogHistory } from '@/types/blog';

export default function BlogHistoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [histories, setHistories] = useState<BlogHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<BlogHistory | null>(null);

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/my/blog-history');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function loadHistory() {
      if (user?.id) {
        const data = await getUserBlogHistory(user.id);
        setHistories(data);
      } else {
        // 데모 데이터
        setHistories([
          {
            id: 'demo-1',
            userId: 'demo-user',
            keyword: 'AI 마케팅',
            content: '# AI 마케팅 - 완벽 가이드\n\n안녕하세요! 😊\n\n...',
            tone: 'friendly',
            targetAudience: 'professional',
            length: 'medium',
            tokensUsed: 850,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      setLoading(false);
    }

    loadHistory();
  }, [user]);

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      friendly: '😊 친근한',
      professional: '💼 전문적',
      casual: '🎉 캐주얼',
      academic: '🎓 학술적',
    };
    return labels[tone] || tone;
  };

  const getAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      general: '🌐 일반인',
      professional: '💼 직장인',
      student: '🎓 학생',
      expert: '🔬 전문가',
    };
    return labels[audience] || audience;
  };

  const getLengthLabel = (length: string) => {
    const labels: Record<string, string> = {
      short: '짧게',
      medium: '보통',
      long: '길게',
    };
    return labels[length] || length;
  };

  const getStyleLabel = (style?: string) => {
    const labels: Record<string, string> = {
      basic: '📝 기본형',
      seo: '🔍 SEO',
      marketing: '💬 마케팅',
    };
    return labels[style || 'basic'] || labels.basic;
  };

  const handleDownloadTxt = (history: BlogHistory) => {
    const blob = new Blob([history.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog_${history.keyword.replace(/\s+/g, '_')}_${new Date(history.createdAt).getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = (history: BlogHistory) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${history.keyword} - WorkFree AI 블로그</title>
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
${history.content}

<footer style="margin-top: 3em; padding-top: 2em; border-top: 1px solid #e5e5e5; text-align: center; color: #999; font-size: 0.9em;">
  <p>이 글은 WorkFree AI 블로그 생성기로 작성되었습니다.</p>
  <p>생성일: ${new Date(history.createdAt).toLocaleString('ko-KR')}</p>
</footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog_${history.keyword.replace(/\s+/g, '_')}_${new Date(history.createdAt).getTime()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || loading || !user) {
    return <LoadingSpinner message="로딩 중..." variant="purple" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 pt-28">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <Link
              href="/tools/blog-generator"
              className="inline-block text-purple-600 hover:text-purple-700 font-semibold mb-4"
            >
              ← 블로그 생성기로
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              📚 블로그 생성 히스토리
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              생성한 모든 블로그 글을 확인하고 다시 다운로드하세요
            </p>
          </div>
        </FadeIn>

        {/* 통계 */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {histories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">총 생성 글 수</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-4xl mb-2">💎</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {histories.reduce((sum, h) => sum + h.tokensUsed, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">총 사용 토큰</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {histories.length * 30}분
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">절약한 시간</div>
            </div>
          </div>
        </FadeIn>

        {/* 히스토리 목록 */}
        {histories.length === 0 ? (
          <FadeIn delay={0.2}>
            <div className="bg-gray-50 dark:bg-gray-900/20 rounded-3xl p-16 text-center border-2 border-gray-200 dark:border-gray-800">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                아직 생성한 블로그가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                첫 번째 블로그를 생성해보세요!
              </p>
              <Link
                href="/tools/blog-generator"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                블로그 생성하기
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {histories.map((history) => (
              <StaggerItem key={history.id}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:scale-105 transition-all">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                    <h3 className="text-xl font-bold text-white mb-2 truncate">
                      {history.keyword}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-white/20 px-2 py-1 rounded">
                        {getStyleLabel(history.blogStyle)}
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded">
                        {getToneLabel(history.tone)}
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded">
                        {getAudienceLabel(history.targetAudience)}
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded">
                        {getLengthLabel(history.length)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {new Date(history.createdAt).toLocaleString('ko-KR')}
                    </div>

                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {history.content.substring(0, 150)}...
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span>💎 {history.tokensUsed} 토큰</span>
                      <span>📏 {history.content.length} 자</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedHistory(history)}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all text-sm"
                      >
                        보기
                      </button>
                      <button
                        onClick={() => handleDownloadTxt(history)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                      >
                        💾
                      </button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* 상세 보기 모달 */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedHistory.keyword}</h2>
                <div className="flex gap-2 text-sm text-white/90">
                  <span>{getStyleLabel(selectedHistory.blogStyle)}</span>
                  <span>•</span>
                  <span>{getToneLabel(selectedHistory.tone)}</span>
                  <span>•</span>
                  <span>{getAudienceLabel(selectedHistory.targetAudience)}</span>
                  <span>•</span>
                  <span>{new Date(selectedHistory.createdAt).toLocaleString('ko-KR')}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedHistory(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 블로그 미리보기 */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                ✨ 생성된 블로그
              </h3>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 max-h-96 overflow-y-auto">
                <div 
                  className="blog-preview"
                  dangerouslySetInnerHTML={{ __html: selectedHistory.content }}
                />
              </div>
            </div>

            {/* HTML 코드 */}
            <div className="p-6 overflow-y-auto max-h-60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  💻 HTML 코드
                </h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedHistory.content);
                    alert('HTML 코드가 클립보드에 복사되었습니다!');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                >
                  📋 코드 복사
                </button>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border-2 border-gray-700 max-h-60 overflow-y-auto">
                <pre className="text-xs text-green-400 font-mono leading-relaxed">
                  {selectedHistory.content}
                </pre>
              </div>
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

            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                💾 파일로 저장
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleDownloadTxt(selectedHistory)}
                  className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105"
                >
                  📄 TXT
                </button>
                <button
                  onClick={() => handleDownloadHtml(selectedHistory)}
                  className="bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all hover:scale-105"
                >
                  🌐 HTML
                </button>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="bg-gray-600 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-all hover:scale-105"
                >
                  ✕ 닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

