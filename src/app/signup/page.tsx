'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerWithEmail, signInWithGoogle } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { FadeIn } from '@/components/animations';
import { setReferrer, grantReferralReward, initializeReferral } from '@/lib/referral';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setError, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 이미 로그인한 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/my/dashboard';
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (formData.displayName.length < 2) {
      errors.displayName = '이름은 2자 이상이어야 합니다.';
    }
    
    if (!formData.email.includes('@')) {
      errors.email = '유효한 이메일을 입력하세요.';
    }
    
    if (formData.password.length < 6) {
      errors.password = '비밀번호는 6자 이상이어야 합니다.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    if (!formData.agreeTerms) {
      errors.agreeTerms = '이용약관에 동의해주세요.';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const { user, error, message } = await registerWithEmail(
        formData.email,
        formData.password,
        formData.displayName
      );
      
      if (error) {
        setLocalError(error);
        setError(error);
        setIsLoading(false);
      } else if (user) {
        toast.success(message || '회원가입 완료!');
        const redirect = searchParams.get('redirect') || '/my/dashboard';
        router.push(redirect);
      }
    } catch (err) {
      setLocalError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
        // 로그인 성공 - 대시보드로 이동
        const redirect = searchParams.get('redirect') || '/my/dashboard';
        router.push(redirect);
      }
    } catch (err) {
      setLocalError('Google 회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 필드 변경 시 해당 에러 제거
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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

        {/* 회원가입 폼 */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-[#AFA6FF]">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E1B33] mb-3 text-center">
            회원가입
          </h1>
          <p className="text-base md:text-lg text-[#1E1B33]/70 mb-8 text-center">
            AI 실무 자동화 스튜디오에 오신 것을 환영합니다
          </p>

          {/* 에러 메시지 */}
          {localError && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{localError}</p>
            </div>
          )}

          {/* Google 회원가입 */}
          <Button
            variant="google"
            onClick={handleGoogleSignup}
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
            Google로 시작하기
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

          {/* 이메일 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="이름"
              placeholder="홍길동"
              value={formData.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              error={fieldErrors.displayName}
              required
              disabled={isLoading}
            />

            <Input
              type="email"
              label="이메일"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={fieldErrors.email}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="비밀번호"
              placeholder="최소 6자 이상"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={fieldErrors.password}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호 재입력"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={fieldErrors.confirmPassword}
              required
              disabled={isLoading}
            />

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#6A5CFF] focus:ring-[#6A5CFF]"
                />
                <span className="text-sm text-[#1E1B33]/70">
                  <Link href="/terms" className="text-[#6A5CFF] hover:underline">
                    이용약관
                  </Link>
                  {' 및 '}
                  <Link href="/privacy" className="text-[#6A5CFF] hover:underline">
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </span>
              </label>
              {fieldErrors.agreeTerms && (
                <p className="mt-2 text-sm text-red-600">
                  {fieldErrors.agreeTerms}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              회원가입
            </Button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-[#1E1B33]/70">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/login"
                className="text-[#6A5CFF] font-semibold hover:underline"
              >
                로그인
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





