'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn } from '@/components/animations';
import { updateProfile, changePassword } from '@/lib/profile';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { success: updateSuccess, error: updateError } = await updateProfile(user.id, {
        displayName,
        email,
      });

      if (updateError) {
        setError(updateError);
      } else {
        setSuccess('프로필이 업데이트되었습니다!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const { success: changeSuccess, error: changeError } = await changePassword(newPassword);

      if (changeError) {
        setError(changeError);
      } else {
        setSuccess('비밀번호가 변경되었습니다!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-[#f5f0ff] py-12 px-4" style={{ paddingTop: '100px' }}>
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#1E1B33] mb-2">프로필 설정</h1>
              <p className="text-[#1E1B33]/70">내 정보를 수정하고 관리하세요</p>
            </div>
          </FadeIn>

          {/* 알림 메시지 */}
          {error && (
            <FadeIn delay={0.1}>
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-medium">
                ⚠️ {error}
              </div>
            </FadeIn>
          )}

          {success && (
            <FadeIn delay={0.1}>
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 font-medium">
                ✅ {success}
              </div>
            </FadeIn>
          )}

          {/* 프로필 정보 */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border-2 border-[#AFA6FF]/20">
              <h2 className="text-2xl font-bold text-[#1E1B33] mb-6">기본 정보</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-[#1E1B33] font-bold mb-2">프로필 사진</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#AFA6FF]/20 flex items-center justify-center text-3xl font-bold text-[#6A5CFF]">
                      {user.displayName?.[0] || 'U'}
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#AFA6FF]/20 text-[#6A5CFF] rounded-lg font-medium hover:bg-[#AFA6FF]/30 transition-all"
                    >
                      이미지 변경 (준비중)
                    </button>
                  </div>
                </div>

                <Input
                  label="이름"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  disabled={isLoading}
                />

                <Input
                  label="이메일"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  disabled={isLoading}
                />

                <div>
                  <label className="block text-[#1E1B33] font-bold mb-2">역할</label>
                  <div className="px-4 py-3 bg-[#AFA6FF]/10 rounded-xl">
                    <span className="text-[#6A5CFF] font-bold">
                      {user.role === 'admin' ? '👑 관리자' : user.role === 'seller' ? '💼 판매자' : '🛒 구매자'}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full"
                >
                  프로필 업데이트
                </Button>
              </form>
            </div>
          </FadeIn>

          {/* 비밀번호 변경 */}
          <FadeIn delay={0.3}>
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#AFA6FF]/20">
              <h2 className="text-2xl font-bold text-[#1E1B33] mb-6">비밀번호 변경</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <Input
                  label="새 비밀번호"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="최소 6자 이상"
                  disabled={isLoading}
                />

                <Input
                  label="비밀번호 확인"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 재입력"
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full"
                >
                  비밀번호 변경
                </Button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

