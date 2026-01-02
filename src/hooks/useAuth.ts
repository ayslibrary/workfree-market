// 인증 관련 커스텀 Hook (Firebase 인증)

'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { onAuthStateChange, getUserFromFirestore } from '@/lib/firebase';
import type { User } from '@/types/user';

export function useAuth() {
  const { user, isLoading, error, setUser, setLoading, clearUser, setError } = useAuthStore();
  const initialized = useRef(false);
  
  useEffect(() => {
    // 이미 초기화되었으면 skip
    if (initialized.current) return;
    initialized.current = true;
    
    setLoading(true);

    // Firebase 인증 상태 변경 감지
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore에서 추가 사용자 정보 가져오기
        const { data: userData } = await getUserFromFirestore(firebaseUser.uid);
        
        const user: User = {
          id: firebaseUser.uid,
          // 일부 케이스(프로바이더/설정)에선 firebaseUser.email이 비어 있을 수 있어 Firestore 값을 보정으로 사용
          email: firebaseUser.email || userData?.email || '',
          displayName: firebaseUser.displayName || userData?.displayName || '사용자',
          photoURL: firebaseUser.photoURL || userData?.photoURL,
          role: userData?.role || 'buyer',
          credits: userData?.credits || 0,
          createdAt: userData?.createdAt?.toDate() || new Date(),
          updatedAt: userData?.updatedAt?.toDate() || new Date(),
        };
        
        setUser(user);
      } else {
        clearUser();
      }
      setLoading(false);
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [setUser, setLoading, clearUser, setError]);
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}
