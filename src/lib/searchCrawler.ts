import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

export interface SearchCrawlerSetting {
  id?: string;
  userId: string;
  keyword: string;
  email: string;
  engines: string[];
  maxResults: number;
  schedule: 'daily' | 'weekly' | 'once';
  time: string;
  active: boolean;
  createdAt?: any;
  lastRun?: any;
}

/**
 * 검색 설정 저장
 */
export async function saveSearchSetting(userId: string, setting: Omit<SearchCrawlerSetting, 'id' | 'userId' | 'createdAt' | 'lastRun'>) {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = await addDoc(collection(db, 'searchCrawlerSettings'), {
    userId,
    ...setting,
    createdAt: serverTimestamp(),
    lastRun: null
  });

  return docRef.id;
}

/**
 * 사용자의 검색 설정 목록 가져오기
 */
export async function getUserSearchSettings(userId: string): Promise<SearchCrawlerSetting[]> {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, 'searchCrawlerSettings'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SearchCrawlerSetting));
}

/**
 * 검색 설정 업데이트
 */
export async function updateSearchSetting(settingId: string, updates: Partial<SearchCrawlerSetting>) {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, 'searchCrawlerSettings', settingId);
  await updateDoc(docRef, updates);
}

/**
 * 검색 설정 삭제
 */
export async function deleteSearchSetting(settingId: string) {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, 'searchCrawlerSettings', settingId);
  await deleteDoc(docRef);
}

/**
 * 검색 설정 활성화/비활성화
 */
export async function toggleSearchSetting(settingId: string, active: boolean) {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, 'searchCrawlerSettings', settingId);
  await updateDoc(docRef, { active });
}

/**
 * 마지막 실행 시간 업데이트
 */
export async function updateLastRun(settingId: string) {
  if (!db) throw new Error('Firebase not initialized');

  const docRef = doc(db, 'searchCrawlerSettings', settingId);
  await updateDoc(docRef, { 
    lastRun: serverTimestamp() 
  });
}

/**
 * 활성화된 모든 검색 설정 가져오기 (Cron용)
 */
export async function getActiveSearchSettings(): Promise<SearchCrawlerSetting[]> {
  if (!db) throw new Error('Firebase not initialized');

  const q = query(
    collection(db, 'searchCrawlerSettings'),
    where('active', '==', true)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SearchCrawlerSetting));
}

