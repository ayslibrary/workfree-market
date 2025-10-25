'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { getPosts } from '@/lib/community/posts';
import type { Post } from '@/types/community';
import { CATEGORY_LABELS } from '@/types/community';

export default function CommunityPage() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentPosts();
  }, []);

  const loadRecentPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await getPosts(undefined, 'latest', 6);
      setRecentPosts(posts);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MainNavigation />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 pt-32">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              💬 WorkFree 커뮤니티
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              직장인들이 모여, 일과 성장을 나누는 곳
            </p>
          </div>
        </FadeIn>

        {/* 카테고리 카드 */}
        <StaggerContainer>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* 직장인 라운지 */}
            <StaggerItem>
              <Link href="/community/lounge">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-xl cursor-pointer group">
                  <div className="text-4xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    직장인 라운지
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    직장 생활의 소소한 이야기를 자유롭게 나눠요
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📝 자유게시판</span>
                    <span>•</span>
                    <span>☕ 퇴근 인증</span>
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {/* 성장 & 커리어 */}
            <StaggerItem>
              <Link href="/community/career">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-xl cursor-pointer group">
                  <div className="text-4xl mb-4">🚀</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    성장 & 커리어
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    커리어 성장과 이직 정보를 공유해요
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>💼 이직 후기</span>
                    <span>•</span>
                    <span>📚 공부법</span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* 최근 게시글 */}
        <FadeIn delay={0.2}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🔥 최근 게시글
              </h2>
              <Link
                href="/community/lounge"
                className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold"
              >
                전체보기 →
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                아직 게시글이 없습니다. 첫 게시글을 작성해보세요! ✍️
              </div>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.category}/${post.id}`}
                  >
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-semibold">
                              {CATEGORY_LABELS[post.category]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs text-gray-500">
                          <span>👍 {post.likes}</span>
                          <span>💬 {post.commentCount}</span>
                          <span>👁️ {post.views}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span>👤 {post.authorName}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* 커뮤니티 가이드 */}
        <FadeIn delay={0.3}>
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📖 커뮤니티 이용 가이드
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>서로 존중하며 예의를 지켜주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>실질적인 도움이 되는 정보를 공유해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>스팸, 광고성 게시물은 삭제될 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>개인정보는 절대 공유하지 마세요</span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}


