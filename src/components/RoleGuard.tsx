'use client';

import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import { hasPermission, Permission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  redirectTo = '/login',
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && redirectTo) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6A5CFF] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || null;
  }

  // 역할 체크
  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#f5f0ff] px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1E1B33] mb-4">⛔ 접근 권한 없음</h1>
            <p className="text-[#1E1B33]/70 mb-6">관리자만 접근할 수 있는 페이지입니다.</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-[#6A5CFF] text-white rounded-xl font-bold hover:bg-[#5B4DEE] transition-all"
            >
              ← 돌아가기
            </button>
          </div>
        </div>
      );
    }
    return fallback || null;
  }

  // 권한 체크
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f0ff] px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1E1B33] mb-4">🔒 권한 부족</h1>
          <p className="text-[#1E1B33]/70 mb-6">이 기능을 사용할 권한이 없습니다.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#6A5CFF] text-white rounded-xl font-bold hover:bg-[#5B4DEE] transition-all"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

