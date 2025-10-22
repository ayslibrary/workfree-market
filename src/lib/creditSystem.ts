import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  UserCredits, 
  CreditTransaction, 
  TimeSavings,
  CREDIT_REWARDS
} from '@/types/credit';

// 크레딧 잔액 조회
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  if (!db) return null;
  
  try {
    const docRef = doc(db, 'user_credits', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserCredits;
    }
    
    return null;
  } catch (error) {
    console.error('크레딧 조회 오류:', error);
    return null;
  }
}

// 베타 테스터 크레딧 초기화
export async function initializeBetaTesterCredits(userId: string): Promise<boolean> {
  if (!db) return false;
  
  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1개월 후
    
    const userCredits: UserCredits = {
      userId,
      balance: CREDIT_REWARDS.BETA_SIGNUP,
      totalEarned: CREDIT_REWARDS.BETA_SIGNUP,
      totalSpent: 0,
      monthlyUsed: 0,
      lastResetDate: new Date(),
      subscriptionTier: 'free',
      isBetaTester: true,
      betaExpiryDate: expiryDate
    };
    
    await setDoc(doc(db, 'user_credits', userId), userCredits);
    
    // 거래 내역 기록
    await addCreditTransaction(userId, {
      type: 'earn',
      amount: CREDIT_REWARDS.BETA_SIGNUP,
      reason: '베타 테스터 가입 보상',
      balance: CREDIT_REWARDS.BETA_SIGNUP
    });
    
    return true;
  } catch (error) {
    console.error('베타 크레딧 초기화 오류:', error);
    return false;
  }
}

// 크레딧 사용 (자동화 도구 실행)
export async function spendCredits(
  userId: string, 
  amount: number, 
  toolId: string,
  toolName: string
): Promise<{ success: boolean; newBalance: number }> {
  if (!db) return { success: false, newBalance: 0 };
  
  try {
    const userCreditsRef = doc(db, 'user_credits', userId);
    const userCreditsSnap = await getDoc(userCreditsRef);
    
    if (!userCreditsSnap.exists()) {
      return { success: false, newBalance: 0 };
    }
    
    const currentCredits = userCreditsSnap.data() as UserCredits;
    
    // 잔액 부족 체크
    if (currentCredits.balance < amount) {
      return { success: false, newBalance: currentCredits.balance };
    }
    
    const newBalance = currentCredits.balance - amount;
    
    // 크레딧 차감
    await updateDoc(userCreditsRef, {
      balance: newBalance,
      totalSpent: increment(amount),
      monthlyUsed: increment(amount)
    });
    
    // 거래 내역 기록
    await addCreditTransaction(userId, {
      type: 'spend',
      amount: -amount,
      reason: `${toolName} 사용`,
      toolUsed: toolId,
      balance: newBalance
    });
    
    return { success: true, newBalance };
  } catch (error) {
    console.error('크레딧 사용 오류:', error);
    return { success: false, newBalance: 0 };
  }
}

// 크레딧 적립 (후기 작성, SNS 공유 등)
export async function earnCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance: number }> {
  if (!db) return { success: false, newBalance: 0 };
  
  try {
    const userCreditsRef = doc(db, 'user_credits', userId);
    const userCreditsSnap = await getDoc(userCreditsRef);
    
    if (!userCreditsSnap.exists()) {
      return { success: false, newBalance: 0 };
    }
    
    const currentCredits = userCreditsSnap.data() as UserCredits;
    const newBalance = currentCredits.balance + amount;
    
    // 크레딧 적립
    await updateDoc(userCreditsRef, {
      balance: newBalance,
      totalEarned: increment(amount)
    });
    
    // 거래 내역 기록
    await addCreditTransaction(userId, {
      type: 'earn',
      amount,
      reason,
      balance: newBalance
    });
    
    return { success: true, newBalance };
  } catch (error) {
    console.error('크레딧 적립 오류:', error);
    return { success: false, newBalance: 0 };
  }
}

// 크레딧 거래 내역 추가
async function addCreditTransaction(
  userId: string,
  transaction: Omit<CreditTransaction, 'id' | 'userId' | 'createdAt'>
): Promise<void> {
  if (!db) return;
  
  try {
    await addDoc(collection(db, 'credit_transactions'), {
      ...transaction,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('거래 내역 추가 오류:', error);
  }
}

// 크레딧 거래 내역 조회
export async function getCreditTransactions(
  userId: string,
  limitCount: number = 10
): Promise<CreditTransaction[]> {
  if (!db) return [];
  
  try {
    const q = query(
      collection(db, 'credit_transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const transactions: CreditTransaction[] = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as CreditTransaction);
    });
    
    return transactions;
  } catch (error) {
    console.error('거래 내역 조회 오류:', error);
    return [];
  }
}

// 시간 절약 데이터 업데이트
export async function updateTimeSavings(
  userId: string,
  minutesSaved: number,
  moneySaved: number
): Promise<void> {
  if (!db) return;
  
  try {
    const timeSavingsRef = doc(db, 'time_savings', userId);
    const timeSavingsSnap = await getDoc(timeSavingsRef);
    
    if (timeSavingsSnap.exists()) {
      // 기존 데이터 업데이트
      await updateDoc(timeSavingsRef, {
        monthlyMinutes: increment(minutesSaved),
        totalMinutes: increment(minutesSaved),
        monthlyMoneySaved: increment(moneySaved),
        totalMoneySaved: increment(moneySaved),
        lastCalculated: serverTimestamp()
      });
    } else {
      // 새 데이터 생성
      const timeSavings: TimeSavings = {
        userId,
        monthlyMinutes: minutesSaved,
        totalMinutes: minutesSaved,
        monthlyMoneySaved: moneySaved,
        totalMoneySaved: moneySaved,
        lastCalculated: new Date()
      };
      
      await setDoc(timeSavingsRef, timeSavings);
    }
  } catch (error) {
    console.error('시간 절약 데이터 업데이트 오류:', error);
  }
}

// 시간 절약 데이터 조회
export async function getTimeSavings(userId: string): Promise<TimeSavings | null> {
  if (!db) return null;
  
  try {
    const docRef = doc(db, 'time_savings', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        lastCalculated: docSnap.data().lastCalculated?.toDate() || new Date()
      } as TimeSavings;
    }
    
    return null;
  } catch (error) {
    console.error('시간 절약 데이터 조회 오류:', error);
    return null;
  }
}

// 월별 데이터 리셋 (매월 1일 실행)
export async function resetMonthlyStats(userId: string): Promise<void> {
  if (!db) return;
  
  try {
    // 크레딧 월 사용량 리셋
    await updateDoc(doc(db, 'user_credits', userId), {
      monthlyUsed: 0,
      lastResetDate: serverTimestamp()
    });
    
    // 시간 절약 월 데이터 리셋
    await updateDoc(doc(db, 'time_savings', userId), {
      monthlyMinutes: 0,
      monthlyMoneySaved: 0
    });
  } catch (error) {
    console.error('월별 데이터 리셋 오류:', error);
  }
}

