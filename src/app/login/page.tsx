// 클라이언트 컴포넌트, App router 에서 기본은 서버 컴포넌트
// UI 상태/이벤트가 있으려면 use client 필요

'use client';

// useState/useEffect : 입력값(email, passoword), 로딩 상태, 에러메세지 상태관리
// useRouter : 로그인 상태에서 페이지 이동
// useSearchParams : URL 쿼리스트링 읽기
// Link : Next.js 의 클라이언트 네비게이션 링크
// loginWithEmail : Firebase 이메일 로그인 함수
// useAuthStore : 전역상태 store(user, error 관리)

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginWithEmail } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { FadeIn } from '@/components/animations';

// 해당 페이지를 항상 동적으로 렌더링하도록 강제
// 로그인 페이지는 사용자 상태, redirect 에 따라 결과 달라질 수 있음

// 앱 전체에서 에러를 표시해야 할 수 있으니까 전역 및 로컬 에러를 동시에 관리

//전역 store(authStore)

// user : 현재 로그인한 사용자 객체(있으면 로그인 상태)
// setUser : 아직까지 실제로 코드에서 사용하지는 않음(활용예정)

// 로컬 state

// email, password : 입력값
// isLoading : 로그인 요청 중 버튼/입력 비활성화
// localError : 해당 페이지에서 보여줄 에러 메세지

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, setError, clearError } = useAuthStore();
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
    } catch {
      setLocalError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff] flex items-center justify-center px-6 pt-16 md:pt-16 pb-12">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <FadeIn delay={0.1}>
          <Link href="/" className="flex items-center justify-center gap-4 mb-10 group">
            <img 
              src="/workfree-logo.png?v=3" 
              alt="WorkFree Logo" 
              className="w-16 h-16 md:w-20 md:h-20 transition-transform group-hover:scale-110"
            />
            <div>
              <div className="flex items-center gap-2">
                <div className="text-3xl md:text-4xl font-bold text-[#1E1B33]">
                  WorkFree Market
                </div>
                <span className="bg-[#FF9A7A] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  Beta
                </span>
              </div>
              <div className="text-sm md:text-base text-[#1E1B33]/70 font-bold">
                AI 실무 자동화 스튜디오
              </div>
            </div>
          </Link>
        </FadeIn>

        {/* 로그인 폼 */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-[#AFA6FF]">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E1B33] mb-3 text-center">
            로그인
          </h1>
          <p className="text-base md:text-lg text-[#1E1B33]/70 mb-8 text-center">
            자동화 키트 거래소에 오신 것을 환영합니다
          </p>

          {/* 에러 메시지 */}
          {localError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{localError}</p>
            </div>
          )}

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













