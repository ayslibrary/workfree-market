'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn } from '@/components/animations';
import { useAuthStore } from '@/store/authStore';
import { createReview, getTotalReviewCount } from '@/lib/beta/reviews';
import { completeMissionByAction } from '@/lib/beta/missions';

// 동적 렌더링 강제 (useSearchParams 사용)
export const dynamic = 'force-dynamic';

const SERVICE_OPTIONS = [
  { value: 'blog', label: '✍️ AI 블로그 생성기' },
  { value: 'portrait', label: '🎨 AI 초상화 메이커' },
  { value: 'automation', label: '🔧 자동화 도구' },
  { value: 'community', label: '💬 커뮤니티' },
  { value: 'overall', label: '🌟 전체 서비스' },
];

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const reviewType = searchParams.get('type'); // 'final'이면 전체 후기
  const [serviceType, setServiceType] = useState(
    reviewType === 'final' ? 'overall' : 'blog'
  );
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    loadReviewCount();
  }, [user, router]);

  const loadReviewCount = async () => {
    if (!user) return;
    try {
      const count = await getTotalReviewCount(user.id);
      setReviewCount(count);
    } catch (error) {
      console.error('후기 수 로딩 실패:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (content.length < 50) {
      alert('후기는 최소 50자 이상 작성해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      // 후기 저장
      await createReview(user.id, serviceType, rating, content);

      // 미션 완료 처리
      if (reviewCount === 0) {
        // 첫 번째 후기
        await completeMissionByAction(user.id, 'write_review');
      } else if (reviewCount === 1) {
        // 두 번째 후기
        await completeMissionByAction(user.id, 'write_review_2');
      } else if (serviceType === 'overall') {
        // 전체 서비스 후기
        await completeMissionByAction(user.id, 'final_review');
      }

      alert('후기가 작성되었습니다! 크레딧이 지급되었습니다. 🎉');
      router.push('/beta/dashboard');
    } catch (error: any) {
      console.error('후기 작성 실패:', error);
      alert(error.message || '후기 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  const isFinalReview = reviewType === 'final';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <MainNavigation />

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 pt-32">
        {/* 헤더 */}
        <FadeIn>
          <div className="mb-8">
            <Link
              href="/beta/dashboard"
              className="text-purple-600 hover:text-purple-700 font-semibold mb-4 inline-block"
            >
              ← 대시보드로
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📝 후기 작성
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              솔직한 후기를 작성하고 크레딧을 받아가세요!
            </p>
          </div>
        </FadeIn>

        {/* 보상 안내 */}
        <FadeIn delay={0.1}>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 mb-8 border-2 border-purple-300 dark:border-purple-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">
              🎁 후기 작성 보상
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  첫 번째 후기: <strong>+300 크레딧</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  두 번째 후기: <strong>+400 크레딧</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  전체 서비스 후기: <strong>+500 크레딧</strong>
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 후기 작성 폼 */}
        <FadeIn delay={0.2}>
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border-2 border-purple-200 dark:border-purple-800">
              {/* 서비스 선택 */}
              {!isFinalReview && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    서비스 선택 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                    disabled={isSubmitting}
                  >
                    {SERVICE_OPTIONS.filter((opt) => opt.value !== 'overall').map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {isFinalReview && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-300 font-semibold">
                    🌟 WorkFree 전체 서비스에 대한 종합 후기를 작성해주세요
                  </p>
                </div>
              )}

              {/* 별점 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  별점 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      disabled={isSubmitting}
                      className={`text-4xl transition-all hover:scale-110 ${
                        star <= rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-4 text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {rating}.0
                  </span>
                </div>
              </div>

              {/* 후기 내용 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  후기 내용 <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-2">(최소 50자)</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    isFinalReview
                      ? 'WorkFree를 사용하면서 좋았던 점, 개선되었으면 하는 점 등을 자유롭게 작성해주세요.'
                      : '서비스를 사용하면서 느낀 점, 좋았던 점, 개선되었으면 하는 점 등을 자유롭게 작성해주세요.'
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white resize-none"
                  rows={10}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {content.length} / 50자 이상
                </p>
              </div>

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
                  disabled={isSubmitting || content.length < 50}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    isSubmitting || content.length < 50
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      작성 중...
                    </span>
                  ) : (
                    '✨ 후기 작성 완료'
                  )}
                </button>
              </div>
            </div>
          </form>
        </FadeIn>

        {/* 가이드 */}
        <FadeIn delay={0.3}>
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">
              💡 좋은 후기 작성 팁
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>구체적으로</strong> 어떤 부분이 좋았는지 작성해주세요
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>시간 절약 효과</strong>나 실제 사용 경험을 공유해주세요
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>개선 제안</strong>도 환영합니다 (서비스 발전에 큰 도움이
                  됩니다)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>
                  <strong>솔직한 의견</strong>이 가장 중요합니다
                </span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}


