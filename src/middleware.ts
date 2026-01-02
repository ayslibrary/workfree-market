// 미들웨어: MVP 기간 중 숨김 경로 리다이렉트/정적 파일 패스스루
// NOTE: 현재 앱의 실제 로그인/상태관리는 Firebase(`src/lib/firebase.ts`, `src/hooks/useAuth.ts`) 기반인데,
// 이 파일은 Supabase 세션 쿠키 기준으로 보호 경로를 강제하고 있어 로그인 후에도 /login으로 튕기는 문제가 발생할 수 있음.
// 따라서 인증 강제는 클라이언트 가드(useAuth/RoleGuard/AdminGuard)로 맡기고,
// 미들웨어는 숨김 경로 처리와 정적 리소스 패스스루만 담당한다.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// MVP 기간 중 숨김 처리된 경로 (리다이렉트)
const hiddenPaths = [
  '/gamification-demo',
  '/beta',
  '/automation/microsoft',
  '/automation/crawling',
  '/automation/prompts',
  '/automation/steps',
  '/automation/visualization',
];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // API 경로는 통과
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 정적 파일 및 이미지 통과
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // 파일 확장자가 있는 경우
  ) {
    return NextResponse.next();
  }

  // 숨김 경로 처리 - MVP 기간 중 리다이렉트
  for (const hiddenPath of hiddenPaths) {
    if (pathname.startsWith(hiddenPath)) {
      return NextResponse.redirect(new URL('/my/dashboard', req.url));
    }
  }

  // 인증 강제는 클라이언트(페이지/가드)에서 수행
  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
