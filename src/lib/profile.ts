// 프로필 관리 시스템

import { db, auth } from './firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile as updateFirebaseProfile, updateEmail, updatePassword } from 'firebase/auth';

export interface ProfileUpdateData {
  displayName?: string;
  photoURL?: string;
  email?: string;
}

/**
 * 프로필 정보 업데이트
 */
export async function updateProfile(
  userId: string,
  data: ProfileUpdateData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // Firebase Authentication 프로필 업데이트
    if (data.displayName || data.photoURL) {
      await updateFirebaseProfile(currentUser, {
        displayName: data.displayName || currentUser.displayName,
        photoURL: data.photoURL || currentUser.photoURL,
      });
    }

    // 이메일 변경
    if (data.email && data.email !== currentUser.email) {
      await updateEmail(currentUser, data.email);
    }

    // Firestore 사용자 문서 업데이트
    const userRef = doc(db, 'users', userId);
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (data.displayName) updateData.displayName = data.displayName;
    if (data.photoURL) updateData.photoURL = data.photoURL;
    if (data.email) updateData.email = data.email;

    await updateDoc(userRef, updateData);

    return { success: true, error: null };
  } catch (error: any) {
    console.error('프로필 업데이트 실패:', error);
    
    let errorMessage = '프로필 업데이트에 실패했습니다.';
    if (error.code === 'auth/requires-recent-login') {
      errorMessage = '보안을 위해 다시 로그인해주세요.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = '이미 사용 중인 이메일입니다.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '유효하지 않은 이메일 형식입니다.';
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * 비밀번호 변경
 */
export async function changePassword(
  newPassword: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    await updatePassword(currentUser, newPassword);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('비밀번호 변경 실패:', error);
    
    let errorMessage = '비밀번호 변경에 실패했습니다.';
    if (error.code === 'auth/requires-recent-login') {
      errorMessage = '보안을 위해 다시 로그인해주세요.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * 프로필 이미지 업로드 (추후 구현)
 */
export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    // TODO: Firebase Storage에 이미지 업로드
    // const storageRef = ref(storage, `profiles/${userId}/${file.name}`);
    // const snapshot = await uploadBytes(storageRef, file);
    // const url = await getDownloadURL(snapshot.ref);
    
    return { url: null, error: '이미지 업로드 기능은 준비 중입니다.' };
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    return { url: null, error: '이미지 업로드에 실패했습니다.' };
  }
}

