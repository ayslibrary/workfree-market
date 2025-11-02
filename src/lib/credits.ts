// 크레딧 관리 시스템

import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

export interface CreditTransaction {
  id?: string;
  userId: string;
  amount: number; // 양수: 충전, 음수: 사용
  type: 'purchase' | 'usage' | 'refund' | 'reward' | 'admin';
  description: string;
  relatedService?: string; // 어떤 서비스에서 사용했는지
  createdAt: Date;
}

/**
 * 사용자의 현재 크레딧 조회
 */
export async function getUserCredits(userId: string): Promise<{ credits: number; error: string | null }> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const credits = userDoc.data().credits || 0;
      return { credits, error: null };
    } else {
      return { credits: 0, error: '사용자를 찾을 수 없습니다.' };
    }
  } catch (error) {
    console.error('크레딧 조회 실패:', error);
    return { credits: 0, error: '크레딧 조회에 실패했습니다.' };
  }
}

/**
 * 크레딧 충전
 */
export async function addCredits(
  userId: string, 
  amount: number, 
  type: 'purchase' | 'reward' | 'admin' = 'purchase',
  description: string
): Promise<{ success: boolean; newBalance: number; error: string | null }> {
  try {
    const userRef = doc(db, 'users', userId);
    
    // 크레딧 추가
    await updateDoc(userRef, {
      credits: increment(amount),
      updatedAt: serverTimestamp(),
    });
    
    // 트랜잭션 기록
    await addDoc(collection(db, 'creditTransactions'), {
      userId,
      amount,
      type,
      description,
      createdAt: serverTimestamp(),
    });
    
    // 새 잔액 조회
    const { credits } = await getUserCredits(userId);
    
    return { success: true, newBalance: credits, error: null };
  } catch (error) {
    console.error('크레딧 충전 실패:', error);
    return { success: false, newBalance: 0, error: '크레딧 충전에 실패했습니다.' };
  }
}

/**
 * 크레딧 차감 (사용)
 */
export async function deductCredits(
  userId: string, 
  amount: number, 
  service: string,
  description: string
): Promise<{ success: boolean; newBalance: number; error: string | null }> {
  try {
    // 현재 크레딧 확인
    const { credits: currentCredits } = await getUserCredits(userId);
    
    if (currentCredits < amount) {
      return { 
        success: false, 
        newBalance: currentCredits, 
        error: '크레딧이 부족합니다.' 
      };
    }
    
    const userRef = doc(db, 'users', userId);
    
    // 크레딧 차감
    await updateDoc(userRef, {
      credits: increment(-amount),
      updatedAt: serverTimestamp(),
    });
    
    // 트랜잭션 기록
    await addDoc(collection(db, 'creditTransactions'), {
      userId,
      amount: -amount,
      type: 'usage',
      description,
      relatedService: service,
      createdAt: serverTimestamp(),
    });
    
    // 새 잔액 조회
    const { credits } = await getUserCredits(userId);
    
    return { success: true, newBalance: credits, error: null };
  } catch (error) {
    console.error('크레딧 차감 실패:', error);
    return { success: false, newBalance: 0, error: '크레딧 차감에 실패했습니다.' };
  }
}

/**
 * 크레딧 환불
 */
export async function refundCredits(
  userId: string, 
  amount: number, 
  description: string
): Promise<{ success: boolean; newBalance: number; error: string | null }> {
  return addCredits(userId, amount, 'refund', description);
}

/**
 * 크레딧 사용 내역 조회
 */
export async function getCreditHistory(
  userId: string, 
  limitCount: number = 20
): Promise<{ transactions: CreditTransaction[]; error: string | null }> {
  try {
    const transactionsRef = collection(db, 'creditTransactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const transactions: CreditTransaction[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        description: data.description,
        relatedService: data.relatedService,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    
    return { transactions, error: null };
  } catch (error) {
    console.error('크레딧 내역 조회 실패:', error);
    return { transactions: [], error: '크레딧 내역 조회에 실패했습니다.' };
  }
}

/**
 * 서비스별 크레딧 비용 정의
 */
export const SERVICE_COSTS = {
  'blog-generator': 3,
  'qr-generator': 1,
  'image-finder': 2,
  'report-generator': 5,
  'email-template': 2,
} as const;

/**
 * 크레딧 충전 패키지
 */
export const CREDIT_PACKAGES = [
  { credits: 10, price: 5000, bonus: 0, label: '스타터' },
  { credits: 30, price: 12000, bonus: 5, label: '베이직' },
  { credits: 100, price: 35000, bonus: 20, label: '프로' },
  { credits: 300, price: 90000, bonus: 80, label: '비즈니스' },
];

