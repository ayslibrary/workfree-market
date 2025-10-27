// 인증 관련 커스텀 Hook

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { onAuthStateChange, isDemoMode, getDemoUser } from '@/lib/firebase';
import { User } from '@/types/user';

export function useAuth() {
  const { user, isLoading, error, setUser, setLoading, clearUser } = useAuthStore();
  
  useEffect(() => {
    setLoading(true);

    // 데모 모드 강제 활성화 (Firebase 완전 우회)
    const demoUser = getDemoUser();
    if (demoUser) {
      const user: User = {
        id: demoUser.uid,
        email: demoUser.email,
        displayName: demoUser.displayName,
        photoURL: demoUser.photoURL,
        role: 'buyer',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(user);
      setLoading(false);
      return;
    }
    
    // Firebase 호출 완전 우회 (데모 모드)
    setLoading(false);
  }, [setUser, setLoading, clearUser]);
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}














