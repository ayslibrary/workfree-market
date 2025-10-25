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
    
    // 데모 모드 확인
    if (isDemoMode()) {
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
        return;
      }
    }
    
    // Firebase 인증 상태 확인
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        // Firebase User를 우리의 User 타입으로 변환
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '사용자',
          photoURL: firebaseUser.photoURL || undefined,
          role: 'buyer', // 기본값, 실제로는 Firestore에서 가져와야 함
          createdAt: new Date(firebaseUser.metadata.creationTime!),
          updatedAt: new Date(firebaseUser.metadata.lastSignInTime!),
        };
        setUser(user);
      } else {
        clearUser();
      }
    });
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [setUser, setLoading, clearUser]);
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}














