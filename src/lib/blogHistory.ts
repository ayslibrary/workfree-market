import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { BlogHistory } from '@/types/blog';

// 블로그 히스토리 저장
export async function saveBlogHistory(data: Omit<BlogHistory, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'blogHistory'), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving blog history:', error);
    throw error;
  }
}

// 사용자의 블로그 히스토리 조회
export async function getUserBlogHistory(userId: string): Promise<BlogHistory[]> {
  try {
    const q = query(
      collection(db, 'blogHistory'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const histories: BlogHistory[] = [];
    
    querySnapshot.forEach((doc) => {
      histories.push({
        id: doc.id,
        ...doc.data(),
      } as BlogHistory);
    });
    
    return histories;
  } catch (error) {
    console.error('Error fetching blog history:', error);
    return [];
  }
}

// 특정 블로그 히스토리 조회
export async function getBlogHistoryById(id: string): Promise<BlogHistory | null> {
  try {
    const docRef = doc(db, 'blogHistory', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as BlogHistory;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog history:', error);
    return null;
  }
}

