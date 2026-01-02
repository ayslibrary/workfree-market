// Supabase Authentication (Firebase 완전 대체)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// 타입 정의
// ============================================

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  credits: number;
  level?: number;
  xp?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 회원가입
// ============================================

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  try {
    // 1. Supabase Auth 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('사용자 생성 실패');

    // 2. users 테이블에 추가 정보 저장
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        display_name: displayName,
        role: 'buyer',
        credits: 10,
        level: 1,
        xp: 0,
      });

    if (dbError) {
      console.error('Users 테이블 저장 실패:', dbError);
      // Auth는 생성되었으니 계속 진행
    }

    return {
      user: authData.user,
      error: null,
      message: '회원가입이 완료되었습니다! 이메일을 확인해주세요.',
    };
  } catch (error: any) {
    let errorMessage = '회원가입에 실패했습니다.';

    if (error.message?.includes('already registered')) {
      errorMessage = '이미 가입된 이메일입니다.';
    } else if (error.message?.includes('Password')) {
      errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    return { user: null, error: errorMessage };
  }
}

// ============================================
// 로그인
// ============================================

export async function signInWithEmail(email: string, password: string) {
  // 로그인 로그 import (동적)
  const { logLogin, updateUserLoginInfo } = await import('@/lib/analytics/eventLogger');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 실패 로그 기록
      await logLogin({
        email,
        loginType: 'email',
        success: false,
        errorMessage: error.message,
      });
      throw error;
    }

    // 성공 로그 기록
    await logLogin({
      userId: data.user?.id,
      email,
      loginType: 'email',
      success: true,
    });

    // 사용자 로그인 정보 업데이트
    if (data.user?.id) {
      await updateUserLoginInfo(data.user.id);
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    let errorMessage = '로그인에 실패했습니다.';

    if (error.message?.includes('Invalid')) {
      errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
    }

    return { user: null, error: errorMessage };
  }
}

// ============================================
// Google 로그인
// ============================================

export async function signInWithGoogle() {
  try {
    // 브라우저 환경 체크
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : '/auth/callback';
      
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) throw error;

    // Google OAuth는 리다이렉트 후 콜백에서 로그를 기록함
    return { error: null };
  } catch (error: any) {
    // 실패 로그 기록 (동적 import)
    const { logLogin } = await import('@/lib/analytics/eventLogger');
    await logLogin({
      email: 'google_oauth_attempt',
      loginType: 'google',
      success: false,
      errorMessage: error.message,
    });
    
    return { error: error.message || 'Google 로그인에 실패했습니다.' };
  }
}

// ============================================
// 로그아웃
// ============================================

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message || '로그아웃에 실패했습니다.' };
  }
}

// ============================================
// 사용자 정보 조회
// ============================================

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      photoURL: data.photo_url,
      role: data.role as UserRole,
      credits: data.credits,
      level: data.level,
      xp: data.xp,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    return null;
  }
}

// ============================================
// 현재 세션 가져오기
// ============================================

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) return null;

    return await getUserProfile(session.user.id);
  } catch (error) {
    console.error('현재 사용자 조회 실패:', error);
    return null;
  }
}

// ============================================
// 인증 상태 변경 감지
// ============================================

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const userProfile = await getUserProfile(session.user.id);
      callback(userProfile);
    } else {
      callback(null);
    }
  });
}

// ============================================
// 크레딧 업데이트
// ============================================

export async function updateCredits(userId: string, amount: number) {
  try {
    const { data, error } = await supabase.rpc('increment_credits', {
      user_id: userId,
      amount: amount,
    });

    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    // RPC 함수가 없으면 직접 업데이트
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      const newCredits = (userData?.credits || 0) + amount;

      await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', userId);

      return { success: true, error: null };
    } catch (updateError: any) {
      return { success: false, error: updateError.message };
    }
  }
}

// ============================================
// 계정 삭제
// ============================================

export async function deleteAccount(): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // users 테이블에서 사용자 데이터 삭제
    await supabase.from('users').delete().eq('id', user.id);
    
    // Supabase Auth에서 사용자 삭제 (admin API 필요 - 클라이언트에서는 로그아웃만)
    await supabase.auth.signOut();
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error('계정 삭제 실패:', error);
    return { success: false, error: error.message || '계정 삭제에 실패했습니다.' };
  }
}

