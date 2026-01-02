// OAuth 콜백 처리 (Google 로그인 등)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  
  // 에러 처리
  if (error) {
    console.error('OAuth Error:', error, error_description);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    );
  }

  if (code) {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // 서버 컴포넌트에서 호출되면 무시
            }
          },
        },
      }
    );
    
    try {
      // 코드를 세션으로 교환
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
        );
      }
      
      if (data.user) {
        // 로그인 성공 로그 기록
        const { logLogin, updateUserLoginInfo } = await import('@/lib/analytics/eventLogger');
        
        await logLogin({
          userId: data.user.id,
          email: data.user.email || 'unknown',
          loginType: 'google',
          success: true,
        });
        
        // 사용자 로그인 정보 업데이트
        await updateUserLoginInfo(data.user.id);
        
        // users 테이블에 사용자 정보 저장/업데이트 (처음 로그인 시)
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single();
        
        if (!existingUser) {
          // 새 사용자 - users 테이블에 추가
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            display_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            photo_url: data.user.user_metadata?.avatar_url,
            role: 'buyer',
            credits: 10, // 가입 보너스
            level: 1,
            xp: 0,
          });
        }
        
        console.log('✅ OAuth 로그인 성공:', data.user.email);
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
    }
  }

  // 로그인 성공 후 대시보드로 리다이렉트
  return NextResponse.redirect(new URL('/my/dashboard', requestUrl.origin));
}
