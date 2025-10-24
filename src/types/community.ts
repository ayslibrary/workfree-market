import { Timestamp } from 'firebase/firestore';

// 카테고리 타입
export type PostCategory = 'lounge' | 'career';

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  lounge: '💬 직장인 라운지',
  career: '🚀 성장 & 커리어',
};

export const CATEGORY_DESCRIPTIONS: Record<PostCategory, string> = {
  lounge: '직장 생활의 소소한 이야기를 자유롭게 나눠요',
  career: '커리어 성장과 이직 정보를 공유해요',
};

// 게시글 타입
export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  subcategory?: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  likes: number;
  likedBy?: string[]; // 좋아요한 사용자 ID 목록
  commentCount: number;
  views: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}

// 댓글 타입
export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  likes: number;
  likedBy?: string[]; // 좋아요한 사용자 ID 목록
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}

// 좋아요 타입
export interface Like {
  id: string;
  userId: string;
  targetType: 'post' | 'comment';
  targetId: string;
  createdAt: Timestamp;
}

// 게시글 생성 DTO
export interface CreatePostDTO {
  title: string;
  content: string;
  category: PostCategory;
  subcategory?: string;
}

// 게시글 수정 DTO
export interface UpdatePostDTO {
  title?: string;
  content?: string;
}

// 댓글 생성 DTO
export interface CreateCommentDTO {
  postId: string;
  content: string;
}

// 정렬 옵션
export type SortOption = 'latest' | 'popular' | 'mostCommented';

export const SORT_LABELS: Record<SortOption, string> = {
  latest: '최신순',
  popular: '인기순',
  mostCommented: '댓글많은순',
};

// 게시글 통계
export interface PostStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalViews: number;
}

// 커뮤니티 활동 통계
export interface CommunityStats {
  lounge: PostStats;
  career: PostStats;
  total: PostStats;
}


