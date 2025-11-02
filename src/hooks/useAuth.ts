// 인증 관련 커스텀 Hook

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { onAuthStateChange, getUserFromFirestore } from '@/lib/firebase';
import { User } from '@/types/user';

export function useAuth() {
  const { user, isLoading, error, setUser, setLoading, clearUser, setError } = useAuthStore();
  
  useEffect(() => {
    setLoading(true);

    // Firebase 인증 상태 감지
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore에서 사용자 정보 가져오기
        const { data, error: firestoreError } = await getUserFromFirestore(firebaseUser.uid);
        
        if (data) {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || data.email,
            displayName: firebaseUser.displayName || data.displayName,
            photoURL: firebaseUser.photoURL || data.photoURL,
            role: data.role || 'buyer',
            credits: data.credits || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
          setUser(user);
        } else {
          // Firestore에 정보가 없는 경우 기본 정보만 사용
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '사용자',
            photoURL: firebaseUser.photoURL,
            role: 'buyer',
            credits: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUser(user);
        }
      } else {
        clearUser();
      }
      setLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, [setUser, setLoading, clearUser, setError]);
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}














