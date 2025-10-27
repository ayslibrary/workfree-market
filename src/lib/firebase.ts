// Firebase 설정 및 초기화

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 설정 완전 비활성화 (데모 모드)
const firebaseConfig = null;
const isConfigured = false;
const app = null;

// Auth 인스턴스
export const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);

// Firestore 인스턴스
export const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);

// 데모 사용자 생성 (아래에서 함수로 재정의됨)

// Storage 인스턴스
export const storage = app ? getStorage(app) : (null as unknown as ReturnType<typeof getStorage>);

// Google Provider
export const googleProvider = auth ? new GoogleAuthProvider() : (null as unknown as GoogleAuthProvider);
if (googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

// Google 로그인
export async function signInWithGoogle() {
  if (!auth) {
    return { user: null, error: 'Firebase가 설정되지 않았습니다. .env.local 파일을 설정해주세요.' };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// 이메일/비밀번호로 회원가입
export async function registerWithEmail(
  email: string, 
  password: string, 
  displayName: string
) {
  if (!auth) {
    return { user: null, error: 'Firebase가 설정되지 않았습니다. .env.local 파일을 설정해주세요.' };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // 프로필 업데이트
    await updateProfile(result.user, {
      displayName: displayName
    });
    
    return { user: result.user, error: null };
  } catch (error) {
    let errorMessage = '회원가입에 실패했습니다.';
    
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = '이미 사용 중인 이메일입니다.';
      } else if (firebaseError.code === 'auth/weak-password') {
        errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = '유효하지 않은 이메일 형식입니다.';
      }
    }
    
    return { user: null, error: errorMessage };
  }
}

// 이메일/비밀번호로 로그인
export async function loginWithEmail(email: string, password: string) {
  if (!auth) {
    return { user: null, error: 'Firebase가 설정되지 않았습니다. .env.local 파일을 설정해주세요.' };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    let errorMessage = '로그인에 실패했습니다.';
    
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === 'auth/user-not-found') {
        errorMessage = '등록되지 않은 이메일입니다.';
      } else if (firebaseError.code === 'auth/wrong-password') {
        errorMessage = '잘못된 비밀번호입니다.';
      } else if (firebaseError.code === 'auth/invalid-email') {
        errorMessage = '유효하지 않은 이메일 형식입니다.';
      }
    }
    
    return { user: null, error: errorMessage };
  }
}

// 로그아웃
export async function signOut() {
  // 데모 모드 확인
  if (isDemoMode()) {
    return signOutDemo();
  }
  
  if (!auth) {
    return { error: 'Firebase가 설정되지 않았습니다.' };
  }
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// 인증 상태 변경 감지
export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    callback(null);
    return () => {}; // noop unsubscribe
  }
  return onAuthStateChanged(auth, callback);
}

// ==================== 데모 모드 ====================
// Firebase 미설정 시 임시로 사용할 데모 로그인

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

// 데모 사용자 정보
const DEMO_USERS = {
  demo: {
    uid: 'demo-user-001',
    email: 'demo@workfree.com',
    displayName: '데모 사용자',
    photoURL: undefined,
  },
  admin: {
    uid: 'demo-admin-001',
    email: 'admin@workfree.com',
    displayName: '관리자',
    photoURL: undefined,
  }
};

// 데모 로그인
export async function loginWithDemo(userType: 'demo' | 'admin' = 'demo') {
  try {
    const demoUser = DEMO_USERS[userType];
    
    // localStorage에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      localStorage.setItem('demo_mode', 'true');
    }
    
    return { 
      user: demoUser as any, // FirebaseUser 타입으로 캐스팅
      error: null 
    };
  } catch (error) {
    return { 
      user: null, 
      error: '데모 로그인에 실패했습니다.' 
    };
  }
}

// 데모 로그아웃
export async function signOutDemo() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_mode');
  }
  return { error: null };
}

// 데모 모드 확인 (개발용으로 항상 true)
export function isDemoMode(): boolean {
  return true; // 개발용으로 항상 데모 모드 활성화
}

// 데모 사용자 가져오기
export function getDemoUser(): DemoUser | null {
  // 개발용으로 고정된 데모 사용자 반환
  return {
    uid: 'demo-user-123',
    email: 'demo@workfree.com',
    displayName: '데모 사용자',
    photoURL: null,
  };
}

export default app;

