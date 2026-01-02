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

// ============================================
// 확장 프로필 (개인정보) - Supabase
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ExtendedProfile {
  phone?: string;
  company?: string;
  job_title?: string;
  industry?: string;
  team_size?: string;
  how_found_us?: string;
  interests?: string[];
  marketing_consent?: boolean;
  privacy_consent?: boolean;
}

/**
 * 확장 프로필 조회
 */
export async function getExtendedProfile(userId: string): Promise<ExtendedProfile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('phone, company, job_title, industry, team_size, how_found_us, interests, marketing_consent, privacy_consent')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('확장 프로필 조회 실패:', error);
    return null;
  }
}

/**
 * 확장 프로필 업데이트
 */
export async function updateExtendedProfile(
  userId: string,
  data: ExtendedProfile
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        phone: data.phone,
        company: data.company,
        job_title: data.job_title,
        industry: data.industry,
        team_size: data.team_size,
        how_found_us: data.how_found_us,
        interests: data.interests,
        marketing_consent: data.marketing_consent,
        privacy_consent: data.privacy_consent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    console.error('확장 프로필 업데이트 실패:', error);
    return { success: false, error: error.message || '프로필 업데이트에 실패했습니다.' };
  }
}

