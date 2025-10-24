'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn } from '@/components/animations';
import { useAuthStore } from '@/store/authStore';
import { getPosts } from '@/lib/community/posts';
import type { Post, SortOption } from '@/types/community';
import { SORT_LABELS } from '@/types/community';

export default function CareerPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  useEffect(() => {
    loadPosts();
  }, [sortBy]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getPosts('career', sortBy, 50);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    router.push('/community/write?category=career');
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <SimpleHeader />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        {/* 헤더 */}
        <FadeIn>
          <div className="mb-8">
            <Link
              href="/community"
              className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block"
            >
              ← 커뮤니티 홈
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  🚀 성장 & 커리어
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  커리어 성장과 이직 정보를 공유해요
                </p>
              </div>
              <button
                onClick={handleWriteClick}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                ✏️ 글쓰기
              </button>
            </div>
          </div>
        </FadeIn>

        {/* 정렬 옵션 */}
        <FadeIn delay={0.1}>
          <div className="flex gap-3 mb-6">
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSortBy(value as SortOption)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  sortBy === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* 게시글 목록 */}
        <FadeIn delay={0.2}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  아직 게시글이 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  첫 게시글을 작성해보세요!
                </p>
                <button
                  onClick={handleWriteClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all inline-block"
                >
                  ✏️ 글쓰기
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/career/${post.id}`}
                  >
                    <div className="p-6 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 truncate">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>👤 {post.authorName}</span>
                            <span>•</span>
                            <span>📅 {formatDate(post.createdAt)}</span>
                            <span>•</span>
                            <span>👁️ {post.views}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm">
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <span>👍</span>
                            <span className="font-semibold">{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                            <span>💬</span>
                            <span className="font-semibold">{post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}


