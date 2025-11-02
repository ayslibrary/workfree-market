// 역할별 권한 관리 시스템

import { UserRole } from '@/types/user';

export type Permission = 
  | 'use_tools'           // 도구 사용
  | 'manage_profile'      // 프로필 관리
  | 'purchase_credits'    // 크레딧 구매
  | 'sell_kits'          // 키트 판매
  | 'manage_kits'        // 키트 관리
  | 'view_analytics'     // 분석 보기
  | 'access_admin'       // 관리자 페이지 접근
  | 'manage_users'       // 사용자 관리
  | 'manage_content'     // 콘텐츠 관리
  | 'view_all_data';     // 모든 데이터 보기

/**
 * 역할별 권한 매핑
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  buyer: [
    'use_tools',
    'manage_profile',
    'purchase_credits',
  ],
  seller: [
    'use_tools',
    'manage_profile',
    'purchase_credits',
    'sell_kits',
    'manage_kits',
    'view_analytics',
  ],
  admin: [
    'use_tools',
    'manage_profile',
    'purchase_credits',
    'sell_kits',
    'manage_kits',
    'view_analytics',
    'access_admin',
    'manage_users',
    'manage_content',
    'view_all_data',
  ],
};

/**
 * 사용자가 특정 권한을 가지고 있는지 확인
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * 사용자가 여러 권한 중 하나라도 가지고 있는지 확인
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * 사용자가 모든 권한을 가지고 있는지 확인
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * 역할별 대시보드 라우트
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'buyer':
    default:
      return '/my/dashboard';
  }
}

/**
 * 서비스별 필요 권한
 */
export const SERVICE_PERMISSIONS: Record<string, Permission> = {
  'blog-generator': 'use_tools',
  'qr-generator': 'use_tools',
  'image-finder': 'use_tools',
  'report-generator': 'use_tools',
  'kit-upload': 'sell_kits',
  'kit-management': 'manage_kits',
  'admin-panel': 'access_admin',
};

/**
 * 서비스 접근 가능 여부 확인
 */
export function canAccessService(role: UserRole, serviceName: string): boolean {
  const requiredPermission = SERVICE_PERMISSIONS[serviceName];
  if (!requiredPermission) return true; // 권한이 정의되지 않은 서비스는 접근 가능
  return hasPermission(role, requiredPermission);
}

