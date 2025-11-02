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
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDtRQXr_vORnHcY_teMD_qNzkwbzTOz2h0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "workfree-market.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "workfree-market",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "workfree-market.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "946819262789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:946819262789:web:57015dd0b89cdef6e7762c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JVB1D0EXGL"
};

const isConfigured = true;
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Auth 인스턴스
export const auth = getAuth(app);

// Firestore 인스턴스
export const db = getFirestore(app);

// 데모 사용자 생성 (아래에서 함수로 재정의됨)

// Storage 인스턴스
export const storage = getStorage(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Google 로그인
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Firestore에 사용자 정보 저장
    await saveUserToFirestore(result.user);
    
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : '로그인에 실패했습니다.' };
  }
}

// Firestore에 사용자 정보 저장
async function saveUserToFirestore(user: FirebaseUser) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    // 이미 존재하는 사용자는 업데이트만
    if (userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } else {
      // 새 사용자는 전체 정보 생성
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'buyer',
        credits: 10, // 초기 크레딧 10개 제공
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Firestore 사용자 저장 실패:', error);
  }
}

// 이메일/비밀번호로 회원가입
export async function registerWithEmail(
  email: string, 
  password: string, 
  displayName: string
) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // 프로필 업데이트
    await updateProfile(result.user, {
      displayName: displayName
    });
    
    // Firestore에 사용자 정보 저장
    await saveUserToFirestore(result.user);
    
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
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Firestore에 사용자 정보 업데이트 (로그인 시간 등)
    await saveUserToFirestore(result.user);
    
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
      } else if (firebaseError.code === 'auth/invalid-credential') {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      }
    }
    
    return { user: null, error: errorMessage };
  }
}

// 로그아웃
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : '로그아웃에 실패했습니다.' };
  }
}

// 인증 상태 변경 감지
export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firestore에서 사용자 정보 가져오기
export async function getUserFromFirestore(uid: string) {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { data: userDoc.data(), error: null };
    } else {
      return { data: null, error: '사용자 정보를 찾을 수 없습니다.' };
    }
  } catch (error) {
    return { data: null, error: '사용자 정보 조회에 실패했습니다.' };
  }
}

// ==================== 데모 모드 제거됨 ====================
// 실제 Firebase 인증을 사용합니다

export default app;

