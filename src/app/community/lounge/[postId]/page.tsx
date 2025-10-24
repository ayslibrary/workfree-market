'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import SimpleHeader from '@/components/SimpleHeader';
import { FadeIn } from '@/components/animations';
import { useAuthStore } from '@/store/authStore';
import { getPost, incrementViews, togglePostLike } from '@/lib/community/posts';
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
  toggleCommentLike,
} from '@/lib/community/comments';
import type { Post, Comment } from '@/types/community';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    loadPostAndComments();
  }, [postId]);

  const loadPostAndComments = async () => {
    try {
      setIsLoading(true);
      const [fetchedPost, fetchedComments] = await Promise.all([
        getPost(postId),
        getCommentsByPostId(postId),
      ]);

      if (!fetchedPost) {
        alert('게시글을 찾을 수 없습니다.');
        router.push('/community/lounge');
        return;
      }

      setPost(fetchedPost);
      setComments(fetchedComments);

      // 조회수 증가
      await incrementViews(postId);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      router.push('/community/lounge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikePost = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!post) return;

    try {
      const isLiked = await togglePostLike(postId, user.id);
      setPost({
        ...post,
        likes: post.likes + (isLiked ? 1 : -1),
        likedBy: isLiked
          ? [...(post.likedBy || []), user.id]
          : (post.likedBy || []).filter((id) => id !== user.id),
      });
    } catch (error) {
      console.error('좋아요 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmittingComment(true);
      await createComment(user.id, user.displayName || user.email || '익명', user.email, {
        postId,
        content: commentContent,
      });

      setCommentContent('');
      await loadPostAndComments();
    } catch (error: any) {
      console.error('댓글 작성 실패:', error);
      alert(error.message || '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId, user.id);
      await loadPostAndComments();
    } catch (error: any) {
      console.error('댓글 삭제 실패:', error);
      alert(error.message || '댓글 삭제에 실패했습니다.');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const isLiked = await toggleCommentLike(commentId, user.id);
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.likes + (isLiked ? 1 : -1),
              likedBy: isLiked
                ? [...(comment.likedBy || []), user.id]
                : (comment.likedBy || []).filter((id) => id !== user.id),
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('좋아요 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
        <SimpleHeader />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const isLikedByUser = user && post.likedBy?.includes(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <SimpleHeader />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* 네비게이션 */}
        <FadeIn>
          <Link
            href="/community/lounge"
            className="text-purple-600 hover:text-purple-700 font-semibold mb-6 inline-block"
          >
            ← 목록으로
          </Link>
        </FadeIn>

        {/* 게시글 */}
        <FadeIn delay={0.1}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 mb-6">
            {/* 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span>👤 {post.authorName}</span>
              <span>•</span>
              <span>📅 {formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>👁️ {post.views}</span>
            </div>

            {/* 내용 */}
            <div className="py-6 prose prose-lg max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {post.content}
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLikePost}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isLikedByUser
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>👍</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <span>💬</span>
                <span>{post.commentCount}</span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* 댓글 섹션 */}
        <FadeIn delay={0.2}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              💬 댓글 {comments.length}개
            </h2>

            {/* 댓글 작성 */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white resize-none"
                  rows={3}
                  disabled={isSubmittingComment}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentContent.trim()}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      isSubmittingComment || !commentContent.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isSubmittingComment ? '작성 중...' : '댓글 작성'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  댓글을 작성하려면 로그인이 필요합니다
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700"
                >
                  로그인하기
                </Link>
              </div>
            )}

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  아직 댓글이 없습니다. 첫 댓글을 작성해보세요! 💬
                </div>
              ) : (
                comments.map((comment) => {
                  const isLikedByUser = user && comment.likedBy?.includes(user.id);
                  const isAuthor = user && comment.authorId === user.id;

                  return (
                    <div
                      key={comment.id}
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {isAuthor && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                          isLikedByUser
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>👍</span>
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}


