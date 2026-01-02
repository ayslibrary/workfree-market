// 인증 관련 커스텀 Hook (Supabase 완전 통합)

'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { onAuthStateChange, getCurrentUser } from '@/lib/supabaseAuth';
import type { User } from '@/types/user';

export function useAuth() {
  const { user, isLoading, error, setUser, setLoading, clearUser, setError } = useAuthStore();
  const initialized = useRef(false);
  
  useEffect(() => {
    // 이미 초기화되었으면 skip
    if (initialized.current) return;
    initialized.current = true;
    
    setLoading(true);

    // 1. 먼저 현재 세션 확인 (즉시)
    const checkInitialSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          clearUser();
        }
      } catch (error) {
        console.error('Initial session check failed:', error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    checkInitialSession();

    // 2. 인증 상태 변경 감지 (로그인/로그아웃 시)
    const { data: { subscription } } = onAuthStateChange(async (supabaseUser) => {
      if (supabaseUser) {
        setUser(supabaseUser);
      } else {
        clearUser();
      }
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, clearUser, setError]);
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
