import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Review } from '@/types/beta';

const REVIEWS_COLLECTION = 'beta_reviews';

// 후기 작성
export async function createReview(
  userId: string,
  serviceType: string,
  rating: number,
  content: string,
  screenshot?: string
): Promise<string> {
  if (!db) {
    // 데모 모드: 가짜 ID 반환
    console.log(`데모 모드: 후기 작성 - ${serviceType} by ${userId}`);
    return `demo-review-${Date.now()}`;
  }

  const newReview = {
    userId,
    serviceType,
    rating,
    content,
    screenshot: screenshot || null,
    createdAt: Timestamp.now(),
    isApproved: false, // 관리자 승인 대기
  };

  const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), newReview);
  return docRef.id;
}

// 사용자의 후기 가져오기
export async function getUserReviews(userId: string): Promise<Review[]> {
  if (!db) {
    // 데모 모드: 빈 배열 반환
    return [];
  }

  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Review));
}

// 특정 서비스의 후기 개수 확인
export async function getReviewCount(
  userId: string,
  serviceType: string
): Promise<number> {
  if (!db) {
    // 데모 모드: 0 반환
    return 0;
  }

  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('userId', '==', userId),
    where('serviceType', '==', serviceType)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

// 사용자가 작성한 총 후기 수
export async function getTotalReviewCount(userId: string): Promise<number> {
  if (!db) {
    // 데모 모드: 0 반환
    return 0;
  }

  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}


