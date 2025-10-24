'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FadeIn } from '@/components/animations';
import { useAuth } from '@/hooks/useAuth';
import { createPost } from '@/lib/community/posts';
import type { PostCategory } from '@/types/community';
import { CATEGORY_LABELS } from '@/types/community';

export const dynamic = 'force-dynamic';

export default function WritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  const [category, setCategory] = useState<PostCategory>('lounge');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      alert('로그인이 필요합니다.');
      router.push('/login?redirect=/community/write');
      return;
    }

    const categoryParam = searchParams.get('category') as PostCategory;
    if (categoryParam && (categoryParam === 'lounge' || categoryParam === 'career')) {
      setCategory(categoryParam);
    }
  }, [user, isLoading, router, searchParams]);

  if (isLoading || !user) {
    return <LoadingSpinner message="로딩 중..." variant="purple" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const postId = await createPost(
        user.id,
        user.displayName || user.email || '익명',
        user.email,
        {
          title,
          content,
          category,
        }
      );

      alert('게시글이 작성되었습니다! 🎉');
      router.push(`/community/${category}/${postId}`);
    } catch (err: any) {
      console.error('게시글 작성 실패:', err);
      setError(err.message || '게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MainNavigation />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 pt-28">
        <FadeIn>
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-purple-600 hover:text-purple-700 font-semibold mb-4 inline-block"
            >
              ← 뒤로 가기
            </button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              ✏️ 글쓰기
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              여러분의 이야기를 자유롭게 공유해주세요
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
              {/* 카테고리 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategory('lounge')}
                    disabled={isSubmitting}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      category === 'lounge'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {CATEGORY_LABELS.lounge}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('career')}
                    disabled={isSubmitting}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      category === 'career'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {CATEGORY_LABELS.career}
                  </button>
                </div>
              </div>

              {/* 제목 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                  disabled={isSubmitting}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length} / 100자
                </p>
              </div>

              {/* 내용 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white resize-none"
                  rows={15}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}자
                </p>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    isSubmitting || !title.trim() || !content.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      작성 중...
                    </span>
                  ) : (
                    '✨ 작성 완료'
                  )}
                </button>
              </div>
            </div>
          </form>
        </FadeIn>

        {/* 가이드 */}
        <FadeIn delay={0.2}>
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">
              💡 글쓰기 팁
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>구체적이고 명확한 제목을 작성하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>다른 사람들에게 도움이 되는 정보를 공유하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>예의를 지키고 존중하는 태도로 작성해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>개인정보나 민감한 정보는 절대 공유하지 마세요</span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}


