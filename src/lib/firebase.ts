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
  sendEmailVerification,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 환경변수 검증
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

// 환경변수 없으면 fallback 사용 (베타 기간 동안)
if (missingEnvVars.length > 0) {
  console.warn('⚠️ Firebase 환경변수 미설정 - fallback 값 사용 중');
}

// Firebase 설정 (환경변수 우선, 없으면 fallback 사용)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDtRQXr_vORnHcY_teMD_qNzkwbzTOz2h0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "workfree-market.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "workfree-market",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "workfree-market.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "946819262789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:946819262789:web:57015dd0b89cdef6e7762c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JVB1D0EXGL",
};

const isConfigured = missingEnvVars.length === 0;
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
    
    // Supabase에 로그인 로그 저장
    try {
      const { logLogin } = await import('@/lib/analytics/eventLogger');
      await logLogin({
        userId: result.user.uid,
        email: result.user.email || '',
        loginType: 'google',
        success: true,
      });
    } catch (logError) {
      console.error('로그인 로그 저장 실패:', logError);
    }
    
    return { user: result.user, error: null };
  } catch (error) {
    // 실패 로그
    try {
      const { logLogin } = await import('@/lib/analytics/eventLogger');
      await logLogin({
        email: 'google_login_attempt',
        loginType: 'google',
        success: false,
        errorMessage: error instanceof Error ? error.message : '알 수 없는 오류',
      });
    } catch {}
    
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
    
    // 이메일 인증 발송
    try {
      await sendEmailVerification(result.user);
      console.log('✅ 이메일 인증 링크가 발송되었습니다.');
    } catch (emailError) {
      console.error('⚠️ 이메일 인증 발송 실패:', emailError);
    }
    
    // Firestore에 사용자 정보 저장
    await saveUserToFirestore(result.user);
    
    // Supabase에 회원가입 로그 저장
    try {
      const { logLogin } = await import('@/lib/analytics/eventLogger');
      await logLogin({
        userId: result.user.uid,
        email: email,
        loginType: 'email',
        success: true,
      });
    } catch (logError) {
      console.error('회원가입 로그 저장 실패:', logError);
    }
    
    return { 
      user: result.user, 
      error: null,
      message: '회원가입이 완료되었습니다. 이메일을 확인해 인증을 완료해주세요.'
    };
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
    
    // 실패 로그
    try {
      const { logLogin } = await import('@/lib/analytics/eventLogger');
      await logLogin({
        email: email,
        loginType: 'email',
        success: false,
        errorMessage: errorMessage,
      });
    } catch {}
    
    return { user: null, error: errorMessage };
  }
}

// 이메일 인증 재발송
export async function resendVerificationEmail() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: '로그인된 사용자가 없습니다.' };
    }
    
    if (user.emailVerified) {
      return { success: false, error: '이미 이메일 인증이 완료되었습니다.' };
    }
    
    await sendEmailVerification(user);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: '이메일 인증 발송에 실패했습니다.' };
  }
}

// 이메일/비밀번호로 로그인
export async function loginWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Firestore에 사용자 정보 업데이트 (로그인 시간 등)
    await saveUserToFirestore(result.user);
    
    // Supabase에 로그인 로그 저장
    try {
      const { logLogin } = await import('@/lib/analytics/eventLogger');
      await logLogin({
        userId: result.user.uid,
        email: email,
        loginType: 'email',
        success: true,
      });
    } catch (logError) {
      console.error('로그인 로그 저장 실패:', logError);
    }
    
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
    
    // 실패 로그
    try {
      const { logLogin } = await import('@/lib/analytics/eventLogger');
      await logLogin({
        email: email,
        loginType: 'email',
        success: false,
        errorMessage: errorMessage,
      });
    } catch {}
    
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

// 계정 삭제
export async function deleteAccount() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: '로그인된 사용자가 없습니다.' };
    }
    
    // Firestore에서 사용자 데이터 삭제
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { deletedAt: serverTimestamp() }, { merge: true });
    } catch (firestoreError) {
      console.error('Firestore 데이터 삭제 실패:', firestoreError);
    }
    
    // Firebase Auth에서 사용자 삭제
    await deleteUser(user);
    
    return { success: true, error: null };
  } catch (error) {
    let errorMessage = '계정 삭제에 실패했습니다.';
    
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === 'auth/requires-recent-login') {
        errorMessage = '보안을 위해 다시 로그인한 후 계정을 삭제해주세요.';
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

// ==================== 데모 모드 제거됨 ====================
// 실제 Firebase 인증을 사용합니다

export default app;

