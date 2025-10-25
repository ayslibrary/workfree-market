'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginWithEmail, signInWithGoogle } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { FadeIn } from '@/components/animations';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setError, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // 이미 로그인한 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/my/dashboard';
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    setIsLoading(true);

    try {
      const { user, error } = await loginWithEmail(email, password);
      
      if (error) {
        setLocalError(error);
        setError(error);
        setIsLoading(false);
      } else if (user) {
        const redirect = searchParams.get('redirect') || '/my/dashboard';
        router.push(redirect);
      }
    } catch (err) {
      setLocalError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setLocalError('');
    setIsLoading(true);

    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        setLocalError(error);
        setError(error);
        setIsLoading(false);
      } else if (user) {
        const redirect = searchParams.get('redirect') || '/my/dashboard';
        router.push(redirect);
      }
    } catch (err) {
      setLocalError('Google 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <FadeIn delay={0.1}>
          <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
            <img 
              src="/workfree-logo.png?v=3" 
              alt="WorkFree Logo" 
              className="w-12 h-12 transition-transform group-hover:scale-110"
            />
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-[#1E1B33]">
                  WorkFree Market
                </div>
                <span className="bg-[#FF9A7A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Beta
                </span>
              </div>
              <div className="text-xs text-[#1E1B33]/70 font-bold">
                AI 실무 자동화 스튜디오
              </div>
            </div>
          </Link>
        </FadeIn>

        {/* 로그인 폼 */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#AFA6FF]">
          <h1 className="text-3xl font-bold text-[#1E1B33] mb-2 text-center">
            로그인
          </h1>
          <p className="text-[#1E1B33]/70 mb-8 text-center">
            자동화 키트 거래소에 오신 것을 환영합니다
          </p>

          {/* 에러 메시지 */}
          {localError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{localError}</p>
            </div>
          )}

          {/* Google 로그인 */}
          <Button
            variant="google"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#AFA6FF]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#1E1B33]/70">
                또는
              </span>
            </div>
          </div>

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              label="이메일"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="비밀번호"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#6A5CFF] focus:ring-[#6A5CFF]"
                />
                <span className="text-[#1E1B33]/70">로그인 유지</span>
              </label>
              <Link
                href="/reset-password"
                className="text-[#6A5CFF] hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              로그인
            </Button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-[#1E1B33]/70">
              계정이 없으신가요?{' '}
              <Link
                href="/signup"
                className="text-[#6A5CFF] font-semibold hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
          </div>
        </FadeIn>

        {/* 하단 링크 */}
        <FadeIn delay={0.3}>
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[#1E1B33]/70 hover:text-[#6A5CFF] transition-colors font-medium"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}













