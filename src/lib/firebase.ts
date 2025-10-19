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

// Firebase 설정 (환경 변수에서 가져오기)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 환경 변수 확인
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

// Firebase 앱 초기화 (중복 방지)
const app = isConfigured && getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0] || null;

// Auth 인스턴스
export const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);

// Firestore 인스턴스
export const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);

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

export default app;

