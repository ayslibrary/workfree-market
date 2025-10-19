'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { registerWithEmail, signInWithGoogle } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

export default function SignupPage() {
  const router = useRouter();
  const { setError, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller',
    agreeTerms: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

    const { user, error } = await registerWithEmail(
      formData.email,
      formData.password,
      formData.displayName
    );
    
    if (error) {
      setLocalError(error);
      setError(error);
      setIsLoading(false);
    } else if (user) {
      // TODO: Firestore에 추가 사용자 정보 저장 (role 등)
      router.push('/');
    }
  };

  const handleGoogleSignup = async () => {
    clearError();
    setLocalError('');
    setIsLoading(true);

    const { user, error } = await signInWithGoogle();
    
    if (error) {
      setLocalError(error);
      setError(error);
      setIsLoading(false);
    } else if (user) {
      router.push('/');
    }
  };

  const handleChange = (field: string, value: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">W</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            WorkFree Market
          </div>
        </Link>

        {/* 회원가입 폼 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            회원가입
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            자동화 키트를 구매하거나 판매하세요
          </p>

          {/* 에러 메시지 */}
          {localError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{localError}</p>
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
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                또는
              </span>
            </div>
          </div>

          {/* 회원 유형 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              가입 유형
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('role', 'buyer')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === 'buyer'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <div className="text-2xl mb-2">🛒</div>
                <div className="font-semibold text-gray-900 dark:text-white">구매자</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  키트 구매
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('role', 'seller')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.role === 'seller'
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <div className="text-2xl mb-2">💼</div>
                <div className="font-semibold text-gray-900 dark:text-white">판매자</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  키트 판매
                </div>
              </button>
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
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
                    이용약관
                  </Link>
                  {' 및 '}
                  <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </span>
              </label>
              {fieldErrors.agreeTerms && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
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
            <p className="text-gray-600 dark:text-gray-400">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/login"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}





