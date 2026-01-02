'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/admin';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // 로그인 안 됨
        router.push('/login?redirect=/admin');
      } else if (!isAdmin(user.email)) {
        // 관리자가 아님
        router.push('/my/dashboard');
      }
    }
  }, [user, isLoading, router]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 안 됨 또는 관리자 아님
  if (!user || !isAdmin(user.email)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <p className="text-gray-600 text-xl font-bold">접근 권한이 없습니다</p>
          <p className="text-gray-500 mt-2">관리자만 접근할 수 있습니다</p>
        </div>
      </div>
    );
  }

  // 관리자 확인됨
  return <>{children}</>;
}

