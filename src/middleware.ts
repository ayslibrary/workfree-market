// 미들웨어: 로그인 필수 + 보호된 경로 처리
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 없이 접근 가능한 공개 경로
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/pricing',
  '/reset-password',
  '/auth/callback',
  '/api',
];

// 로그인 필수 경로 (이 경로들은 로그인이 필요함)
const protectedPaths = [
  '/my',
  '/tools',
  '/kits',
  '/community',
  '/admin',
  '/checkout',
  '/feedback',
  '/request',
  '/frimanualbot',
];

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

  // Supabase 클라이언트 생성
  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 경로 체크
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 로그인된 사용자가 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/my/dashboard', req.url));
  }

  // 보호된 경로에 비로그인 사용자 접근 시 로그인 페이지로 리다이렉트
  if (!user && isProtectedPath) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
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
