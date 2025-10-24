import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  Post,
  CreatePostDTO,
  UpdatePostDTO,
  PostCategory,
  SortOption,
} from '@/types/community';

const POSTS_COLLECTION = 'community_posts';

// 게시글 생성
export async function createPost(
  userId: string,
  userName: string,
  userEmail: string | undefined,
  postData: CreatePostDTO
): Promise<string> {
  const now = Timestamp.now();
  
  const newPost = {
    title: postData.title,
    content: postData.content,
    category: postData.category,
    subcategory: postData.subcategory || null,
    authorId: userId,
    authorName: userName,
    authorEmail: userEmail || null,
    likes: 0,
    likedBy: [],
    commentCount: 0,
    views: 0,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  };

  const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
  return docRef.id;
}

// 게시글 목록 조회
export async function getPosts(
  category?: PostCategory,
  sortBy: SortOption = 'latest',
  limitCount: number = 20
): Promise<Post[]> {
  let q = query(collection(db, POSTS_COLLECTION));

  // 카테고리 필터
  if (category) {
    q = query(q, where('category', '==', category));
  }

  // 삭제되지 않은 게시글만
  q = query(q, where('isDeleted', '==', false));

  // 정렬
  switch (sortBy) {
    case 'latest':
      q = query(q, orderBy('createdAt', 'desc'));
      break;
    case 'popular':
      q = query(q, orderBy('likes', 'desc'), orderBy('createdAt', 'desc'));
      break;
    case 'mostCommented':
      q = query(q, orderBy('commentCount', 'desc'), orderBy('createdAt', 'desc'));
      break;
  }

  // 개수 제한
  q = query(q, limit(limitCount));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Post));
}

// 게시글 상세 조회
export async function getPost(postId: string): Promise<Post | null> {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || docSnap.data().isDeleted) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Post;
}

// 게시글 수정
export async function updatePost(
  postId: string,
  userId: string,
  updateData: UpdatePostDTO
): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  const post = docSnap.data();
  if (post.authorId !== userId) {
    throw new Error('게시글 수정 권한이 없습니다.');
  }

  await updateDoc(docRef, {
    ...updateData,
    updatedAt: Timestamp.now(),
  });
}

// 게시글 삭제 (소프트 삭제)
export async function deletePost(postId: string, userId: string): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  const post = docSnap.data();
  if (post.authorId !== userId) {
    throw new Error('게시글 삭제 권한이 없습니다.');
  }

  await updateDoc(docRef, {
    isDeleted: true,
    updatedAt: Timestamp.now(),
  });
}

// 조회수 증가
export async function incrementViews(postId: string): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(docRef, {
    views: increment(1),
  });
}

// 게시글 좋아요 토글
export async function togglePostLike(
  postId: string,
  userId: string
): Promise<boolean> {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('게시글을 찾을 수 없습니다.');
  }

  const post = docSnap.data();
  const likedBy = post.likedBy || [];
  const isLiked = likedBy.includes(userId);

  if (isLiked) {
    // 좋아요 취소
    await updateDoc(docRef, {
      likes: increment(-1),
      likedBy: likedBy.filter((id: string) => id !== userId),
    });
    return false;
  } else {
    // 좋아요 추가
    await updateDoc(docRef, {
      likes: increment(1),
      likedBy: [...likedBy, userId],
    });
    return true;
  }
}

// 댓글 수 증가/감소
export async function updateCommentCount(
  postId: string,
  delta: number
): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(docRef, {
    commentCount: increment(delta),
  });
}


