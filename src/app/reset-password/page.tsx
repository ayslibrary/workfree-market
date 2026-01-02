'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/animations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let errorMessage = '비밀번호 재설정 이메일 발송에 실패했습니다.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = '등록되지 않은 이메일입니다.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '유효하지 않은 이메일 형식입니다.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.';
      }
      
      setError(errorMessage);
    } finally {
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

        {/* 비밀번호 재설정 폼 */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-[#AFA6FF]">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E1B33] mb-3 text-center">
              비밀번호 찾기
            </h1>
            <p className="text-base text-[#1E1B33]/70 mb-8 text-center">
              가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다
            </p>

            {success ? (
              <div className="text-center">
                <div className="text-6xl mb-4">✉️</div>
                <h2 className="text-xl font-bold text-[#1E1B33] mb-2">
                  이메일을 확인하세요!
                </h2>
                <p className="text-[#1E1B33]/70 mb-6">
                  <span className="font-semibold text-[#6A5CFF]">{email}</span>로
                  <br />비밀번호 재설정 링크를 보냈습니다.
                </p>
                <div className="text-sm text-[#1E1B33]/60 mb-6 space-y-2">
                  <p>이메일이 안 보이면 아래를 순서대로 확인해주세요.</p>
                  <ul className="text-left bg-[#f5f0ff] p-4 rounded-xl border border-[#AFA6FF]/40 space-y-1">
                    <li>- 스팸함 / 프로모션함 / 전체메일에서 “WorkFree” 또는 “Firebase”로 검색</li>
                    <li>- 1~5분 정도 기다린 뒤 다시 시도(너무 자주 시도하면 제한될 수 있어요)</li>
                    <li>- Google로 가입/로그인한 계정이면 비밀번호 재설정보다 <b>Google로 로그인</b>이 더 빠를 수 있어요</li>
                  </ul>
                </div>
                <Link
                  href="/login"
                  className="inline-block bg-[#6A5CFF] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                  로그인 페이지로
                </Link>
              </div>
            ) : (
              <>
                {/* 에러 메시지 */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="email"
                    label="이메일"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                  >
                    비밀번호 재설정 링크 보내기
                  </Button>
                </form>

                {/* 다른 옵션 */}
                <div className="mt-6 p-4 bg-[#f5f0ff] rounded-xl">
                  <p className="text-sm text-[#1E1B33]/70 text-center mb-3">
                    💡 비밀번호가 계속 안 오나요?
                  </p>
                  <Link
                    href="/login"
                    className="block text-center text-[#6A5CFF] font-semibold hover:underline"
                  >
                    로그인 페이지로 돌아가기 →
                  </Link>
                </div>
              </>
            )}

            {/* 로그인 링크 */}
            {!success && (
              <div className="mt-6 text-center">
                <p className="text-[#1E1B33]/70">
                  비밀번호가 기억나셨나요?{' '}
                  <Link
                    href="/login"
                    className="text-[#6A5CFF] font-semibold hover:underline"
                  >
                    로그인
                  </Link>
                </p>
              </div>
            )}
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

