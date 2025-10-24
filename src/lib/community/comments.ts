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
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Comment, CreateCommentDTO } from '@/types/community';
import { updateCommentCount } from './posts';

const COMMENTS_COLLECTION = 'community_comments';

// 댓글 생성
export async function createComment(
  userId: string,
  userName: string,
  userEmail: string | undefined,
  commentData: CreateCommentDTO
): Promise<string> {
  const now = Timestamp.now();

  const newComment = {
    postId: commentData.postId,
    content: commentData.content,
    authorId: userId,
    authorName: userName,
    authorEmail: userEmail || null,
    likes: 0,
    likedBy: [],
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  };

  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), newComment);

  // 게시글의 댓글 수 증가
  await updateCommentCount(commentData.postId, 1);

  return docRef.id;
}

// 게시글의 댓글 목록 조회
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('postId', '==', postId),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Comment));
}

// 댓글 수정
export async function updateComment(
  commentId: string,
  userId: string,
  content: string
): Promise<void> {
  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('댓글을 찾을 수 없습니다.');
  }

  const comment = docSnap.data();
  if (comment.authorId !== userId) {
    throw new Error('댓글 수정 권한이 없습니다.');
  }

  await updateDoc(docRef, {
    content,
    updatedAt: Timestamp.now(),
  });
}

// 댓글 삭제 (소프트 삭제)
export async function deleteComment(
  commentId: string,
  userId: string
): Promise<void> {
  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('댓글을 찾을 수 없습니다.');
  }

  const comment = docSnap.data();
  if (comment.authorId !== userId) {
    throw new Error('댓글 삭제 권한이 없습니다.');
  }

  await updateDoc(docRef, {
    isDeleted: true,
    updatedAt: Timestamp.now(),
  });

  // 게시글의 댓글 수 감소
  await updateCommentCount(comment.postId, -1);
}

// 댓글 좋아요 토글
export async function toggleCommentLike(
  commentId: string,
  userId: string
): Promise<boolean> {
  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('댓글을 찾을 수 없습니다.');
  }

  const comment = docSnap.data();
  const likedBy = comment.likedBy || [];
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

